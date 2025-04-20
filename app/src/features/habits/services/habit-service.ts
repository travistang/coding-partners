import axios from 'axios';
import { Habit, HabitWithInsights } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/habits';


export const HabitService = {
    async getAll(): Promise<HabitWithInsights[]> {
        const response = await axios.get<HabitWithInsights[]>(BASE_URL);
        return response.data;
    },

    async create(habit: Omit<Habit, 'id'>): Promise<Habit> {
        const response = await axios.post<Habit>(BASE_URL, habit);
        return response.data;
    },

    async update(id: string, habit: Partial<Omit<Habit, 'id'>>): Promise<Habit> {
        const response = await axios.patch<Habit>(`${BASE_URL}/${id}`, habit);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await axios.delete(`${BASE_URL}/${id}`);
    },

    async toggleComplete(id: string): Promise<Habit> {
        const response = await axios.patch<Habit>(`${BASE_URL}/${id}/toggle`);
        return response.data;
    }
};