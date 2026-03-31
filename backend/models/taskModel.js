const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    default: "low",
  },
  status:{
    type:String,
    enum:["pending","completed"],
    default:"pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
});

module.exports = mongoose.model("Task", taskSchema);