const Task = require("../models/taskModel");

// GET all tasks
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const status = req.query.status;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    // 🔥 QUERY OBJECT
    const query = { user: userId };

    if (status) {
      query.status = status;
    }

    // 🔥 PAGINATION LOGIC
    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    res.json({
      total,
      page,
      limit,
      tasks,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
    user:req.user.id,
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

    const task = await Task.findOne({
      _id: id,
      user: req.user.id,   
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = req.body.status || task.status;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task=await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      task.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Task.countDocuments({ user: userId });
    const completed = await Task.countDocuments({
      user: userId,
      status: "completed",
    });
    const pending = await Task.countDocuments({
      user: userId,
      status: "pending",
    });

    res.json({
      total,
      completed,
      pending,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};