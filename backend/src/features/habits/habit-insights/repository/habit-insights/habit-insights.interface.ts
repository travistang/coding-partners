import { HabitInsights } from "../../types";

export interface HabitInsightsRepository {
    load(): Promise<Record<string, HabitInsights>>;
    save(insights: Record<string, HabitInsights>): Promise<void>;
}