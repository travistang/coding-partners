import { Habit, HabitWithCompletion } from "../types";

export interface HabitRepository {
    getAll(): Promise<HabitWithCompletion[]>;
    create(habit: Habit): Promise<Habit>;
    delete(id: string): Promise<boolean>;
    toggleCompleteForToday(id: string): Promise<{ date: string; habit: Habit; completed: boolean } | null>;
}
