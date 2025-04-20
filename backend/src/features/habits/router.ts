import express from 'express';
import { HabitInsightsManager } from './habit-insights/logic/habit-insights';
import { FileHabitInsightsRepository } from './habit-insights/repository/habit-insights/file-habit-insights-repository';
import { InMemoryHabitInsightsRepository } from './habit-insights/repository/habit-insights/in-memory-habit-insights-repository';
import { HabitInsightsService } from './habit-insights/service/habit-insights.service';
import { FileHabitRepository } from './repository/file-habit-repository';
import { InMemoryHabitRepository } from './repository/in-memory-habit-repository';

const createHabitService = async () => {
    const insightsManager = new HabitInsightsManager();
    const habitRepository = process.env.USE_FILE_REPOSITORY ? await FileHabitRepository.create() : new InMemoryHabitRepository();

    const habitInsightsRepository = process.env.USE_FILE_REPOSITORY ? new FileHabitInsightsRepository() : new InMemoryHabitInsightsRepository();

    const habitService = new HabitInsightsService(habitRepository, habitInsightsRepository, insightsManager);

    await habitService.initialize();
    return habitService;
}
export const createHabitsRouter = async () => {
    const habitService = await createHabitService();

    const router = express.Router();

    router.get('/', async (req, res) => {
        const habits = await habitService.getAll();
        res.json(habits);
    });

    router.post('/', async (req, res) => {
        const habit = await habitService.create(req.body);
        res.status(201).json(habit);
    });

    router.delete('/:id', async (req, res) => {
        const deleted = await habitService.delete(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: 'Habit not found' });
            return;
        }
        res.status(204).send();
    });

    router.patch('/:id/toggle', async (req, res) => {
        const result = await habitService.toggleCompleteForToday(req.params.id);
        if (!result) {
            res.status(404).json({ message: 'Habit not found' });
            return;
        }
        res.json(result);
    });

    return router;
}

export default createHabitsRouter;