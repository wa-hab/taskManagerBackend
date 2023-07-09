const tasksRouter = require("express").Router();
const prisma = require("../db/client");

// get all tasks
tasksRouter.get("/", async (req, res) => {
	const { id } = req.user;

	try {
		const tasks = await prisma.task.findMany({
			where: {
				userId: id,
			},
		});

		if (!tasks) {
			return res.status(200).json({
				success: true,
				message: "No tasks found 😥",
				data: null,
			});
		} else {
			return res.status(200).json({
				success: true,
				message: "Tasks found 🎉",
				data: {
					tasks,
				},
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch tasks 😥",
			data: null,
		});
	}
});

tasksRouter.post("/complete", async (req, res) => {
	const { taskId } = req.body;

	try {
		const task = await prisma.task.update({
			where: {
				id: taskId,
			},
			data: {
				done: true,
			},
		});

		return res.status(200).json({
			success: true,
			message: "Task updated successfully! 🎉",
			data: {
				task,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Failed to update task 😥",
			data: null,
		});
	}
});

// create new task
tasksRouter.post("/create", async (req, res) => {
	const { id } = req.user;
	const { content } = req.body;
	try {
		const task = await prisma.task.create({
			data: {
				content,
				user: {
					connect: {
						id: id,
					},
				},
			},
		});

		return res.status(200).json({
			success: true,
			message: "Task created successfully! 🎉",
			data: {
				task,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Failed to create tasks 😥",
			data: null,
		});
	}
});
// delete existing task

tasksRouter.delete("/delete", async (req, res) => {
	const { id } = req.user;

	const { taskId } = req.body;

	try {
		await prisma.task.delete({
			where: {
				id: taskId,
			},
		});

		return res.status(200).json({
			success: true,
			message: "Task deleted successfully! 🎉",
			data: null,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Failed to delete task 😥",
			data: null,
		});
	}
});

module.exports = tasksRouter;
