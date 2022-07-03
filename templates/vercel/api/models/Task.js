const mongoose = require("mongoose");

// schéma of a task
const taskSchema = mongoose.Schema({
        text: { type: String, required: true },
        day: { type: String },
        reminder: { type: Boolean, required: true },
});

module.exports = mongoose.model("Task", taskSchema);
