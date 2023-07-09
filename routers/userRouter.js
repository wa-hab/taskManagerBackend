const userRouter = require("express").Router();
const prisma = require("../db/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

userRouter.post("/login", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({
				success: false,
				message: "Please provide username and password",
			});
	}

	// check if the username exists, if it doesn't, return error
	try {
		const user = await prisma.user.findUnique({
			where: {
				username,
			},
		});

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid credentials" });
		}

		// check if the password is correct, if it isn't, return error
		const passwordValid = await bcrypt.compare(password, user.passwordHash);

		if (!passwordValid) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid credentials" });
		}

		// create a JWT token
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		res
			.setHeader(
				"Set-Cookie",
				`token=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`
			)
			.status(200)
			.json({
				success: true,
				message: "Logged in",
				user: {
					id: user.id,
					username: user.username,
					createdAt: user.createdAt,
				},
			});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: "Something went wrong, please try again",
		});
	}
});

userRouter.post("/signup", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({
				success: false,
				message: "Please provide username and password",
			});
	}

	// check if the username is taken, if it is, return error
	const exists = await prisma.user.findUnique({
		where: {
			username,
		},
	});

	if (exists) {
		return res
			.status(400)
			.json({ success: false, message: "Username already exists" });
	}

	try {
		await prisma.user.create({
			data: {
				username,
				passwordHash: await bcrypt.hash(password, 10),
			},
		});

		res.status(200).json({ success: true, message: "User created" });
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: "Error creating user" });
	}
});

module.exports = userRouter;
