const express = require('express');
const router = express.Router();

let tasks = [];
let nextId = 1;

router.get('/', (req, res) => res.json(tasks));

router.post('/', (req, res) => {
  const { title, priority } = req.body;
  const task = { id: nextId++, title, priority: priority || 'medium', done: false, createdAt: new Date().toISOString() };
  tasks.push(task);
  res.status(201).json(task);
});

router.patch('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Not found' });
  Object.assign(task, req.body);
  res.json(task);
});

router.delete('/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  res.status(204).end();
});

module.exports = router;
