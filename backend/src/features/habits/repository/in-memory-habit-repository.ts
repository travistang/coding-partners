import { stringifyDate } from '../helpers/stringify-date';
import { Habit, HabitWithCompletion } from "../types";
import { HabitRepository } from "./habit-repository.interface";

export class InMemoryHabitRepository implements HabitRepository {
    // In-memory storage
    protected habits: Habit[] = [];
    protected habitCompletions: Record<string, string[]> = {};

    async getAll(): Promise<HabitWithCompletion[]> {
        const today = stringifyDate(Date.now());
        return this.habits.map(habit => ({
            ...habit,
            completed: this.habitCompletions[today]?.includes(habit.id) || false
        }));
    }

    async create(habit: Omit<Habit, "id">): Promise<Habit> {
        const newHabit: Habit = {
            id: crypto.randomUUID(),
            ...habit
        };
        this.habits.push(newHabit);
        return newHabit;
    }

    async delete(id: string): Promise<boolean> {
        const initialLength = this.habits.length;
        this.habits = this.habits.filter(habit => habit.id !== id);

        // Clean up completions
        Object.keys(this.habitCompletions).forEach(date => {
            this.habitCompletions[date] = this.habitCompletions[date].filter(
                habitId => habitId !== id
            );
        });

        return this.habits.length !== initialLength;
    }

    async toggleCompleteForToday(id: string): Promise<{ date: string; habit: Habit; completed: boolean } | null> {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return null;

        const today = stringifyDate(Date.now());
        if (!this.habitCompletions[today]) {
            this.habitCompletions[today] = [];
        }

        if (this.habitCompletions[today].includes(id)) {
            this.habitCompletions[today] = this.habitCompletions[today].filter(
                habitId => habitId !== id
            );
        } else {
            this.habitCompletions[today].push(id);
        }

        return {
            date: today,
            habit,
            completed: this.habitCompletions[today].includes(id)
        };
    }

    async getHabitCompletions(): Promise<Record<string, string[]>> {
        return this.habitCompletions;
    }
}