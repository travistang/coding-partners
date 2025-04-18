import axios from 'axios';
import { Habit, HabitWithCompletion } from '../types';

const BASE_URL = 'http://localhost:3000/api/habits';


export const HabitService = {
    async getAll(): Promise<HabitWithCompletion[]> {
        const response = await axios.get<HabitWithCompletion[]>(BASE_URL);
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