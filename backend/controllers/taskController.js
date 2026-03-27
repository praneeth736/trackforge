const Task = require("../models/taskModel");

// GET all tasks
const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

// CREATE task
const createTask = async (req, res) => {
  const { title, priority } = req.body;

  const task = await Task.create({
    title,
    priority,
  });

  res.json(task);
};

module.exports = {
  getTasks,
  createTask,
};