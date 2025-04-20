export type Habit = {
    id: string;
    name: string;
    description?: string;
}

export type CreateHabit = Omit<Habit, "id">;

export type HabitWithCompletion = Habit & {
    completed: boolean;
}

export type HabitInsights = {
    streak: number;
    lastCompletedAt: string | null;
}

export type HabitWithInsights = HabitWithCompletion & HabitInsights;