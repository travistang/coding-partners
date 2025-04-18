export type Habit = {
    id: string;
    name: string;
    description?: string;
};

export type HabitWithCompletion = Habit & {
    completed: boolean;
}