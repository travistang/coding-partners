import { format } from 'date-fns';
import { Habit, HabitWithCompletion } from "../types";
import { HabitRepository } from "./habit-repository.interface";

export class InMemoryHabitRepository implements HabitRepository {
    // In-memory storage
    private habits: Habit[] = [];
    private habitCompletions: Record<string, string[]> = {};

    getAll(): HabitWithCompletion[] {
        const today = format(Date.now(), 'dd/MM/yyyy');
        return this.habits.map(habit => ({
            ...habit,
            completed: this.habitCompletions[today]?.includes(habit.id) || false
        }));
    }

    create(habit: Omit<Habit, "id">): Habit {
        const newHabit: Habit = {
            id: crypto.randomUUID(),
            ...habit
        };
        this.habits.push(newHabit);
        return newHabit;
    }

    delete(id: string): boolean {
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

    toggleCompleteForToday(id: string): { date: string; habit: Habit; completed: boolean } | null {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return null;

        const today = format(Date.now(), 'dd/MM/yyyy');
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
}