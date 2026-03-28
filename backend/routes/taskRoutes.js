// routes/taskRoutes.js

const express = require("express");
const router = express.Router();

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// GET all tasks
router.get("/", getTasks);

// POST new task
router.post("/", createTask);
// UPDATE the task
router.put("/:id",updateTask);
//DELETE the task
router.delete("/:id",deleteTask);
module.exports = router;