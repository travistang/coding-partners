import { dateFromString } from "../../helpers/date-from-string";
import { HabitRepository } from "../../repository/habit-repository.interface";
import { Habit } from "../../types";
import { HabitInsightsManager } from "../logic/habit-insights";
import { HabitInsightsRepository } from "../repository/habit-insights/habit-insights.interface";
import { HabitWithInsights } from "../types";

export class HabitInsightsService {

    constructor(
        private habitRepo: HabitRepository,
        private insightsRepo: HabitInsightsRepository,
        private insightsManager: HabitInsightsManager,
    ) { }

    async initialize() {
        const loadedInsights = await this.insightsRepo.load();
        this.insightsManager.setInsights(loadedInsights);
    }

    async getAll(): Promise<HabitWithInsights[]> {
        const habits = await this.habitRepo.getAll();
        return this.insightsManager.injectInsights(habits);
    }

    async create(habit: Omit<Habit, "id">) {
        const created = await this.habitRepo.create(habit);
        this.insightsManager.setDefaultInsights(created.id);
        await this.saveInsights();

        return created;
    }

    async delete(id: string) {
        return this.habitRepo.delete(id);
    }

    async toggleCompleteForToday(id: string) {
        const result = await this.habitRepo.toggleCompleteForToday(id);
        if (result) {
            await this.insightsManager.updateInsights(id, result.completed, () => this.getLastCompletedAt(id));
            await this.saveInsights();
        }
        return result;
    }

    private async saveInsights() {
        const insights = this.insightsManager.getAllInsights();
        await this.insightsRepo.save(insights);

    }
    private async getLastCompletedAt(id: string): Promise<string | null> {
        const completions = await this.habitRepo.getHabitCompletions();
        const completedDates = Object.entries(completions)
            .filter(([, ids]) => ids.includes(id))
            .map(([date]) => ({
                date,
                timestamp: dateFromString(date).getTime()
            }))
            .sort((a, b) => b.timestamp - a.timestamp);
        return completedDates[0] ? completedDates[0].date : null;
    }
}