import express from 'express';

import { format } from 'date-fns';
import { Habit } from "./types";

// In-memory storage
const habits: Habit[] = [];

// in memory record for habit completions. Key represents days of habits completed on the day in the format of 'dd/MM/yyyy' and values represents list of habit IDs completed on that day
const habitCompletions: Record<string, string[]> = {};

const router = express.Router();

router.get('/', (req, res) => {
    res.json(habits);
});

router.get('/:id', (req, res) => {
    const habit = habits.find(h => h.id === req.params.id);
    if (!habit) {
        res.status(404).json({ message: 'Habit not found' });
    }
    res.json(habit);
});

router.post('/', (req, res) => {
    const habit: Habit = {
        id: crypto.randomUUID(),
        ...req.body
    };
    habits.push(habit);
    res.status(201).json(habit);
});

router.put('/:id', (req, res) => {
    const index = habits.findIndex(h => h.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ message: 'Habit not found' });
    }

    habits[index] = { ...habits[index], ...req.body };
    res.json(habits[index]);
});

router.delete('/:id', (req, res) => {
    const index = habits.findIndex(h => h.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ message: 'Habit not found' });
        return;
    }

    habits.splice(index, 1);
    res.status(204).send();
});

router.post('/:id/toggle', (req, res) => {

    const index = habits.findIndex(h => h.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ message: 'Habit not found' });
        return;
    }

    const today = format(Date.now(), 'dd/MM/yyyy');
    if (!habitCompletions[today]) {
        habitCompletions[today] = [];
    }

    if (habitCompletions[today].includes(req.params.id)) {
        habitCompletions[today] = habitCompletions[today].filter(id => id !== req.params.id);
    } else {
        habitCompletions[today].push(req.params.id);
    }
    res.json({
        date: today,
        habit: habits[index],
        completed: habitCompletions[today].includes(req.params.id)
    });
});

export default router;