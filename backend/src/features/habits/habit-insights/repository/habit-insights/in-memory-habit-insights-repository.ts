import { HabitInsights } from "../../types";
import { HabitInsightsRepository } from "./habit-insights.interface";

export class InMemoryHabitInsightsRepository implements HabitInsightsRepository {
    private insights: Record<string, HabitInsights> = {};

    async load(): Promise<Record<string, HabitInsights>> {
        return this.insights;
    }

    async save(insights: Record<string, HabitInsights>): Promise<void> {
        this.insights = insights;
    }
}