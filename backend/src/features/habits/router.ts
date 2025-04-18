import express from 'express';
import { InMemoryHabitRepository } from './repository/in-memory-habit-repository';

const router = express.Router();
const habitRepository = new InMemoryHabitRepository();

router.get('/', (req, res) => {
    const habits = habitRepository.getAll();
    res.json(habits);
});

router.get('/:id', (req, res) => {
    const habits = habitRepository.getAll();
    const habit = habits.find(h => h.id === req.params.id);
    if (!habit) {
        res.status(404).json({ message: 'Habit not found' });
        return;
    }
    res.json(habit);
});

router.post('/', (req, res) => {
    const habit = habitRepository.create(req.body);
    res.status(201).json(habit);
});

router.delete('/:id', (req, res) => {
    const deleted = habitRepository.delete(req.params.id);
    if (!deleted) {
        res.status(404).json({ message: 'Habit not found' });
        return;
    }
    res.status(204).send();
});

router.patch('/:id/toggle', (req, res) => {
    const result = habitRepository.toggleCompleteForToday(req.params.id);
    if (!result) {
        res.status(404).json({ message: 'Habit not found' });
        return;
    }
    res.json(result);
});

export default router;