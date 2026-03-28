require("dotenv").config();
const express = require("express");
const connectDB=require("./config/db");
const authRoutes=require("./routes/authRoutes");

const app = express();
const PORT = 5000;

connectDB();

app.use(express.json());

// import routes
const taskRoutes = require("./routes/taskRoutes");
app.use("/auth",authRoutes);
// use routes
app.use("/tasks", taskRoutes);

app.use((err,req,res,next)=>{
  console.error("Error:",err.message);
  res.status(400).json({message:"Invalid JSON format"});
});

// test route
app.get("/", (req, res) => {
  res.send("TrackForge Backend Running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});