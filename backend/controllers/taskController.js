const Task = require("../models/taskModel");

// GET all tasks
const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

// CREATE task
const createTask = async (req, res) => {
  try{
  const { title, priority } = req.body;

  if(!title){
    console.log("Validation failed: title missing");
    return res.status(400).json({message:"Title is required"});
  }
  const task = await Task.create({
    title,
    priority:priority || "low",
  });
  console.log("Task created:",task);
  res.status(201).json(task);
}catch(error){
  console.log("Error creating task:",error.message);
  res.status(500).json({message: error.message });
 }
};

// UPDATE task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};