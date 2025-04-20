import { HabitRepository } from "../../../repository/habit-repository.interface";
import { HabitWithInsights } from "../../types";

export interface HabitInsightsRepository extends HabitRepository {
    getAll(): Promise<HabitWithInsights[]>;
}