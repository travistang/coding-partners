import express from 'express';
import { FileHabitRepository } from './repository/file-habit-repository';
import { InMemoryHabitRepository } from './repository/in-memory-habit-repository';

const router = express.Router();
const habitRepository = process.env.USE_FILE_REPOSITORY
    ? new FileHabitRepository()
    : new InMemoryHabitRepository();

router.get('/', async (req, res) => {
    const habits = await habitRepository.getAll();
    res.json(habits);
});

router.post('/', async (req, res) => {
    const habit = await habitRepository.create(req.body);
    res.status(201).json(habit);
});

router.delete('/:id', async (req, res) => {
    const deleted = await habitRepository.delete(req.params.id);
    if (!deleted) {
        res.status(404).json({ message: 'Habit not found' });
        return;
    }
    res.status(204).send();
});

router.patch('/:id/toggle', async (req, res) => {
    const result = await habitRepository.toggleCompleteForToday(req.params.id);
    if (!result) {
        res.status(404).json({ message: 'Habit not found' });
        return;
    }
    res.json(result);
});

export default router;