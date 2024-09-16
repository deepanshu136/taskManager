const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const authenticationToken = require("./auth");

// Create Task
router.post("/create-task", authenticationToken, async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const { id: userId } = req.headers;

    if (!title || !description || !date) {
      return res.status(400).json({
        message: "Title, description, and due date are required.",
      });
    }

    const newTask = new Task({
      title,
      description,
      date,
      pending: true,
      complete: false,
      user: userId,
    });

    const savedTask = await newTask.save();
    await User.findByIdAndUpdate(userId, { $push: { tasks: savedTask._id } });

    return res.status(200).json({
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error in create-task route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all tasks

router.get("/get-all-task", authenticationToken, async (req, res) => {
  try {
    const { id: userId } = req.headers;
    const userData = await User.findById(userId).populate({
      path: "tasks",
      options: { sort: { createdAt: -1 } },
    });

    res.status(200).json({ tasks: userData.tasks }); // Send only tasks
  } catch (error) {
    console.error("Error in get-all-task route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete task

router.delete("/delete-task/:id", authenticationToken, async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { id: userId } = req.headers; // Get user ID from headers

    if (!userId) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Delete the task
    await Task.findByIdAndDelete(taskId);

    // Remove the task from the user's task list
    await User.findByIdAndUpdate(userId, { $pull: { tasks: taskId } });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error in delete-task route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update task
router.put("/update-task/:id", authenticationToken, async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { title, description, date } = req.body;

    if (!title && !description && !date) {
      return res.status(400).json({
        message:
          "At least one field (title, description, or date) must be provided.",
      });
    }

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (date) updatedFields.date = date;

    const task = await Task.findByIdAndUpdate(taskId, updatedFields, {
      new: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error in update-task route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Toggle pending status of task
router.put("/update-pen-task/:id", authenticationToken, async (req, res) => {
  try {
    const { id: taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.pending = !task.pending;
    await task.save();

    res.status(200).json({ message: "Task pending status updated", task });
  } catch (error) {
    console.error("Error in update-pen-task route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Toggle complete status of task
router.put("/update-com-task/:id", authenticationToken, async (req, res) => {
  try {
    const { id: taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.complete = !task.complete;
    await task.save();

    res.status(200).json({ message: "Task complete status updated", task });
  } catch (error) {
    console.error("Error in update-com-task route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get completed tasks route

router.get("/get-com-task", authenticationToken, async (req, res) => {
  try {
    const completedTasks = await Task.find({
      userId: req.headers.id,
      complete: true,
    });

    return res.status(200).json({
      message: "Completed tasks fetched successfully",
      tasks: completedTasks,
    });
  } catch (error) {
    console.error("Error in get-com-task route:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Get incomplete tasks
router.get("/get-incom-task", authenticationToken, async (req, res) => {
  try {
    const { id: userId } = req.headers;
    const tasks = await Task.find({ user: userId, complete: false }).sort({
      createdAt: -1,
    });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error in get-incom-task route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
