import { format } from 'date-fns';
import { promises as fs } from 'fs';
import path from 'path';
import { Habit, HabitWithCompletion } from "../types";
import { HabitRepository } from "./habit-repository.interface";

export class FileHabitRepository implements HabitRepository {
    private readonly dataPath: string;
    private habits: Habit[] = [];
    private habitCompletions: Record<string, string[]> = {};

    constructor() {
        this.dataPath = path.join(__dirname, '../../../data');
        this.initialize();
    }

    private async initialize() {
        try {
            await fs.mkdir(this.dataPath, { recursive: true });
            await this.loadData();
        } catch (error) {
            console.error('Failed to initialize repository:', error);
            // Initialize with empty data if files don't exist
            this.habits = [];
            this.habitCompletions = {};
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
        await this.loadData();
        const today = format(Date.now(), 'dd/MM/yyyy');
        return this.habits.map(habit => ({
            ...habit,
            completed: this.habitCompletions[today]?.includes(habit.id) || false
        }));
    }

    async create(habit: Omit<Habit, "id">): Promise<Habit> {
        await this.loadData();
        const newHabit: Habit = {
            id: crypto.randomUUID(),
            ...habit
        };
        this.habits.push(newHabit);
        await this.saveData();
        return newHabit;
    }

    async delete(id: string): Promise<boolean> {
        await this.loadData();
        const initialLength = this.habits.length;
        this.habits = this.habits.filter(habit => habit.id !== id);

        // Clean up completions
        Object.keys(this.habitCompletions).forEach(date => {
            this.habitCompletions[date] = this.habitCompletions[date].filter(
                habitId => habitId !== id
            );
        });

        await this.saveData();
        return this.habits.length !== initialLength;
    }

    async toggleCompleteForToday(id: string): Promise<{ date: string; habit: Habit; completed: boolean } | null> {
        await this.loadData();
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return null;

        const today = format(Date.now(), 'dd/MM/yyyy');
        if (!this.habitCompletions[today]) {
            this.habitCompletions[today] = [];
        }

        if (this.habitCompletions[today].includes(id)) {
            this.habitCompletions[today] = this.habitCompletions[today].filter(
                habitId => habitId !== id
            );
        } else {
            this.habitCompletions[today].push(id);
        }

        await this.saveData();
        return {
            date: today,
            habit,
            completed: this.habitCompletions[today].includes(id)
        };
    }
}