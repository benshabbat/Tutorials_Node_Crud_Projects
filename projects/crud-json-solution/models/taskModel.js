import fs from 'fs/promises';
import path from 'path';

const tasksFilePath = path.join(process.cwd(), 'data', 'tasks.json');

export async function getAllTasks() {
  try {
    const data = await fs.readFile(tasksFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function getTaskById(id) {
  const tasks = await getAllTasks();
  return tasks.find(t => t.id === parseInt(id));
}

export async function getTasksByCompleted(completed) {
  const tasks = await getAllTasks();
  const isCompleted = completed === 'true';
  return tasks.filter(t => t.completed === isCompleted);
}

export async function getTasksByPriority(priority) {
  const tasks = await getAllTasks();
  return tasks.filter(t => t.priority === priority);
}

export async function createTask(taskData) {
  const tasks = await getAllTasks();
  const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
  const newTask = {
    id: maxId + 1,
    completed: false,
    ...taskData
  };
  tasks.push(newTask);
  await saveTasks(tasks);
  return newTask;
}

export async function updateTask(id, taskData) {
  const tasks = await getAllTasks();
  const index = tasks.findIndex(t => t.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  tasks[index] = { id: parseInt(id), ...taskData };
  await saveTasks(tasks);
  return tasks[index];
}

export async function toggleTaskCompleted(id) {
  const tasks = await getAllTasks();
  const index = tasks.findIndex(t => t.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  tasks[index].completed = !tasks[index].completed;
  await saveTasks(tasks);
  return tasks[index];
}

export async function deleteTask(id) {
  const tasks = await getAllTasks();
  const filteredTasks = tasks.filter(t => t.id !== parseInt(id));
  
  if (filteredTasks.length === tasks.length) {
    return false;
  }
  
  await saveTasks(filteredTasks);
  return true;
}

async function saveTasks(tasks) {
  await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
}
