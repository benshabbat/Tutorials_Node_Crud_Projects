import * as taskModel from '../models/taskModel.js';

export async function getTasks(req, res) {
  try {
    const tasks = await taskModel.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
}

export async function getTaskById(req, res) {
  try {
    const task = await taskModel.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
}

export async function filterTasks(req, res) {
  try {
    const { completed, priority } = req.query;
    
    if (completed) {
      const tasks = await taskModel.getTasksByCompleted(completed);
      return res.json(tasks);
    }
    
    if (priority) {
      const tasks = await taskModel.getTasksByPriority(priority);
      return res.json(tasks);
    }
    
    res.status(400).json({ message: 'Please provide completed or priority parameter' });
  } catch (error) {
    res.status(500).json({ message: 'Error filtering tasks' });
  }
}

export async function createTask(req, res) {
  try {
    const newTask = await taskModel.createTask(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
}

export async function updateTask(req, res) {
  try {
    const updatedTask = await taskModel.updateTask(req.params.id, req.body);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
}

export async function toggleTask(req, res) {
  try {
    const updatedTask = await taskModel.toggleTaskCompleted(req.params.id);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling task' });
  }
}

export async function deleteTask(req, res) {
  try {
    const deleted = await taskModel.deleteTask(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
}
