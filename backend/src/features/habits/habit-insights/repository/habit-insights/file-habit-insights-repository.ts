import { promises as fs } from "fs";
import path from "path";
import { loadFile } from "../../../helpers/load-file";
import { writeFile } from "../../../helpers/write-file";
import { HabitInsights } from "../../types";
import { HabitInsightsRepository } from "./habit-insights.interface";

export class FileHabitInsightsRepository implements HabitInsightsRepository {
    private readonly fileName = 'insights.json';
    private readonly filePath = path.join(__dirname, "../../../../../data", this.fileName);

    async load(): Promise<Record<string, HabitInsights>> {
        return loadFile(this.filePath, {});
    }

    async save(insights: Record<string, HabitInsights>): Promise<void> {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        await writeFile(this.filePath, insights);
    }
}