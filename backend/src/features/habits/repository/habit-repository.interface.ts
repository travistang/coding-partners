import { Habit, HabitWithCompletion } from "../types";

export interface HabitRepository {
    getAll(): HabitWithCompletion[];
    create(habit: Habit): Habit;
    delete(id: string): boolean;
    toggleCompleteForToday(id: string): { date: string; habit: Habit; completed: boolean } | null;
}
