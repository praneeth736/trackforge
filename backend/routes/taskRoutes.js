// routes/taskRoutes.js

const express = require("express");
const router = express.Router();

const protect=require("../middleware/authMiddleware");

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// GET all tasks
router.get("/", protect,getTasks);

// POST new task
router.post("/", protect,createTask);
// UPDATE the task
router.put("/:id",protect,updateTask);
//DELETE the task
router.delete("/:id",protect,deleteTask);
module.exports = router;