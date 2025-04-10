import express from 'express';
import Task from '../models/taskModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a Task
router.post('/', protect, async (req, res) => {
  const { title, description, priority, status, dueDate, order } = req.body;

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    priority,
    status,
    dueDate,
    order,
  });

  res.status(201).json(task);
});

// Get all Tasks for a User
router.get('/', protect, async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
});

// Update Task
router.put('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.status = req.body.status || task.status;
  task.dueDate = req.body.dueDate || task.dueDate;
  task.order = req.body.order || task.order;

  const updatedTask = await task.save();
  res.json(updatedTask);
});

// Delete Task
router.delete('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await task.deleteOne();
  res.json({ message: 'Task removed' });
});

export default router;
