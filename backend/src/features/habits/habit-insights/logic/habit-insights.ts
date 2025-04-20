import { subDays } from "date-fns/subDays";
import { stringifyDate } from "../../helpers/stringify-date";
import { HabitWithCompletion } from "../../types";
import { DEFAULT_INSIGHTS } from "../constants";
import { HabitInsights } from "../types";


export class HabitInsightsManager {
    private insights: Record<string, HabitInsights> = {};

    getAllInsights() {
        return this.insights;
    }

    getInsights(id: string): HabitInsights {
        return this.insights[id];
    }

    injectInsights(habits: HabitWithCompletion[]) {
        return habits.map((habit) => ({
            ...habit,
            ...this.getInsights(habit.id) ?? DEFAULT_INSIGHTS
        }));
    }

    setInsights(insights: Record<string, HabitInsights>) {
        this.insights = insights;
    }



    async updateInsights(id: string, completedToday: boolean, fetchLastCompletedDate: (id: string) => Promise<string | null>): Promise<void> {
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
                this.insights[id].lastCompletedAt = updatedStreak > 0 ? yesterday : await fetchLastCompletedDate(id);
            }
        }
    }

    setDefaultInsights(id: string): void {
        this.insights[id] = { ...DEFAULT_INSIGHTS };
    }
}