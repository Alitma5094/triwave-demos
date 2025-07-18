const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = './tasks.json';

// Helper to read tasks
function readTasks() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Helper to write tasks
function writeTasks(tasks) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// Get all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
    const tasks = readTasks();
    const newTask = { id: Date.now(), ...req.body };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let tasks = readTasks();
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return res.status(404).json({ message: 'Task not found' });

    tasks[index] = { ...tasks[index], ...req.body };
    writeTasks(tasks);
    res.json(tasks[index]);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let tasks = readTasks();
    const newTasks = tasks.filter(task => task.id !== id);
    if (newTasks.length === tasks.length)
        return res.status(404).json({ message: 'Task not found' });

    writeTasks(newTasks);
    res.json({ message: 'Task deleted' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
