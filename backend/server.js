const express = require("express");
const connectDB=require("./config/db");

const app = express();
const PORT = 5000;

connectDB();

app.use(express.json());

// import routes
const taskRoutes = require("./routes/taskRoutes");

// use routes
app.use("/tasks", taskRoutes);

// test route
app.get("/", (req, res) => {
  res.send("TrackForge Backend Running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});