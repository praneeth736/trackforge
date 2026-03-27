// routes/taskRoutes.js

const express = require("express");
const router = express.Router();

const {
  getTasks,
  createTask,
} = require("../controllers/taskController");

// GET all tasks
router.get("/", getTasks);

// POST new task
router.post("/", createTask);

module.exports = router;