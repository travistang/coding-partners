import { promises as fs } from 'fs';
import path from 'path';
import { Habit, HabitWithCompletion } from "../types";
import { InMemoryHabitRepository } from './in-memory-habit-repository';

export class FileHabitRepository extends InMemoryHabitRepository {
    private readonly dataPath: string;

    constructor() {
        super();
        this.dataPath = path.join(__dirname, '../../../data');
        this.initialize();
    }

    private async initialize() {
        try {
            await fs.mkdir(this.dataPath, { recursive: true });
            await this.loadData();
        } catch (error) {
            console.error('Failed to initialize repository:', error);
        }
    }

    private async loadData() {
        try {
            const [habitsData, completionsData] = await Promise.all([
                fs.readFile(path.join(this.dataPath, 'habits.json'), 'utf-8'),
                fs.readFile(path.join(this.dataPath, 'completions.json'), 'utf-8')
            ]);
            this.habits = JSON.parse(habitsData);
            this.habitCompletions = JSON.parse(completionsData);
        } catch (error) {
            // Initialize with empty data if files don't exist
            this.habits = [];
            this.habitCompletions = {};
        }
    }

    private async saveData() {
        await Promise.all([
            fs.writeFile(
                path.join(this.dataPath, 'habits.json'),
                JSON.stringify(this.habits, null, 2)
            ),
            fs.writeFile(
                path.join(this.dataPath, 'completions.json'),
                JSON.stringify(this.habitCompletions, null, 2)
            )
        ]);
    }

    async getAll(): Promise<HabitWithCompletion[]> {
        const result = await super.getAll();
        await this.saveData();
        return result;
    }

    async create(habit: Omit<Habit, "id">): Promise<Habit> {
        const newHabit = await super.create(habit);
        await this.saveData();
        return newHabit;
    }

    async delete(id: string): Promise<boolean> {
        const result = await super.delete(id);
        await this.saveData();
        return result;
    }

    async toggleCompleteForToday(id: string): Promise<{ date: string; habit: Habit; completed: boolean } | null> {
        const result = await super.toggleCompleteForToday(id);
        await this.saveData();
        return result;
    }
}
