import { promises as fs } from 'fs';
import path from 'path';
import { loadFile } from '../helpers/load-file';
import { writeFile } from '../helpers/write-file';
import { Habit, HabitWithCompletion } from "../types";
import { InMemoryHabitRepository } from './in-memory-habit-repository';

type PersistentDataType = 'habit' | 'habit-completions';
export class FileHabitRepository extends InMemoryHabitRepository {
    private readonly dataPath = path.join(__dirname, '../../../data');
    private readonly fileNames: Record<PersistentDataType, string> = {
        habit: 'habits.json',
        "habit-completions": 'completions.json'
    }

    private constructor() {
        super();
    }

    static async create(): Promise<FileHabitRepository> {
        const instance = new FileHabitRepository();
        await instance.initialize();
        return instance;
    }

    async initialize() {
        try {
            await fs.mkdir(this.dataPath, { recursive: true });
            await this.loadData();
        } catch (error) {
            console.error('Failed to initialize repository:', error);
        }
    }

    private async loadData() {
        this.habits = await this.readFile(this.fileNames['habit'], []);
        this.habitCompletions = await this.readFile(this.fileNames['habit-completions'], {});
    }

    private writeFile(fileName: string, data: any) {
        writeFile(
            path.join(this.dataPath, fileName),
            data
        );
    }

    private async readFile(fileName: string, defaultContent: any) {
        return loadFile(path.join(this.dataPath, fileName), defaultContent);
    }
    private async saveData() {
        await Promise.all([
            this.writeFile(this.fileNames['habit'], this.habits),
            this.writeFile(this.fileNames['habit-completions'], this.habitCompletions)
        ]);
    }

    async getAll(): Promise<HabitWithCompletion[]> {
        const result = await super.getAll();
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
