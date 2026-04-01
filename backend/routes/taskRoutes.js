// routes/taskRoutes.js

const express = require("express");
const router = express.Router();
const adminOnly=require("../middleware/adminMiddleware");

const protect=require("../middleware/authMiddleware");

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/taskController");


router.get("/stats",protect,getTaskStats);
// GET all tasks
router.get("/", protect,getTasks);

// POST new task
router.post("/", protect,createTask);
// UPDATE the task
router.put("/:id",protect,updateTask);
//DELETE the task
router.delete("/:id",protect,deleteTask);
module.exports = router;