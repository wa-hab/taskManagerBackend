const jwt = require("jsonwebtoken");
const prisma = require("../db/client");
const dotenv = require("dotenv");
dotenv.config();

const checkCookieValid = async (req, res, next) => {
	const token  = req.cookies.token;

	if (!token) {
		return res.status(401).json({ success: false, message: "Not authorized" });
	}

	try {
		//verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res
				.status(401)
				.json({ success: false, message: "Not authorized" });
		}

		//check if the user still exists in the database
		const user = await prisma.user.findUnique({
			where: {
				id: decoded.userId,
			},
		});

		req.user = {
			id: user.id,
			username: user.username,
			createdAt: user.createdAt,
		};

		next();
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ success: false, message: "An error occured, please try later" });
	}
};

module.exports = checkCookieValid;
