import { parse } from "date-fns";
import { subDays } from 'date-fns/subDays';
import { stringifyDate } from "../../../helpers/stringify-date";
import { InMemoryHabitRepository } from "../../../repository/in-memory-habit-repository";
import { Habit } from "../../../types";
import { DEFAULT_INSIGHTS } from '../../constants';
import { HabitInsights, HabitWithInsights } from "../../types";

export class InMemoryHabitInsightsRepository extends InMemoryHabitRepository {
    private insights: Record<string, HabitInsights> = {};
    async getAll(): Promise<HabitWithInsights[]> {
        const habits = await super.getAll();

        return habits.map((habit) => ({
            ...habit,
            ...this.insights[habit.id] ?? DEFAULT_INSIGHTS
        }))
    }

    async create(habit: Omit<Habit, "id">): Promise<Habit> {
        const createdHabit = await super.create(habit);
        this.insights[createdHabit.id] = DEFAULT_INSIGHTS;
        return createdHabit;
    }

    async toggleCompleteForToday(id: string): Promise<{ date: string; habit: Habit; completed: boolean; } | null> {
        const toggleResult = await super.toggleCompleteForToday(id);

        if (!toggleResult) {
            return toggleResult;
        }

        this.updateInsights(id, toggleResult.completed);

        return toggleResult;
    }

    private async lastCompletedAt(id: string): Promise<string | null> {
        const completionDates = Object.entries(this.habitCompletions)
            .filter(([, ids]) => ids.includes(id))
            .map(([date]) => parse(date, 'dd/MM/yyyy', Date.now()).getTime())
            .sort((a, b) => (b - a))
        return completionDates[0] ? stringifyDate(completionDates[0]) : null;
    }
    private async updateInsights(id: string, completedToday: boolean) {
        if (!this.insights[id]) return;
        const { streak: currentStreak, lastCompletedAt } = this.insights[id];

        const now = Date.now();
        const today = stringifyDate(now);
        const yesterday = stringifyDate(subDays(now, 1));

        if (completedToday) {
            if (lastCompletedAt === yesterday) {
                this.insights[id].streak = currentStreak + 1;
            } else if (lastCompletedAt !== today) {
                this.insights[id].streak = 1;
            }
            this.insights[id].lastCompletedAt = today;
        } else {
            if (lastCompletedAt === today) {
                const updatedStreak = Math.max(currentStreak - 1, 0);
                this.insights[id].streak = updatedStreak;
                // if there are more than one streaks, then the last completed date must be yesterday. Otherwise it could be any day, or even none.
                this.insights[id].lastCompletedAt = updatedStreak > 0 ? yesterday : await this.lastCompletedAt(id);
            }
        }
    }
}