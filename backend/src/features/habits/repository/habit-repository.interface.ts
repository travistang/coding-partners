import { Habit, HabitWithCompletion } from "../types";

export interface HabitRepository {
    getAll(): Promise<HabitWithCompletion[]>;
    create(habit: Omit<Habit, "id">): Promise<Habit>;
    delete(id: string): Promise<boolean>;
    toggleCompleteForToday(id: string): Promise<{ date: string; habit: Habit; completed: boolean } | null>;

    getHabitCompletions(): Promise<Record<string, string[]>>;
}
