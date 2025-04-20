import { HabitWithCompletion } from "../types";

export type HabitInsights = {
    streak: number;
    lastCompletedAt: string | null;
}

export type HabitWithInsights = HabitWithCompletion & HabitInsights;