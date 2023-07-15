const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routers/userRouter");
const tasksRouter = require("./routers/tasksRouter");
const checkCookieValid = require("./middleware/checkCookieValid");

const app = express();
app.use(express.json());
app.use(cookieParser());
let corsOption = {
	origin: "*",
	credentials: true,
};
app.use(cors(corsOption));

app.use("/api/user", userRouter);
app.use("/api/task", checkCookieValid, tasksRouter);

app.get("/api/", (req, res) => {
	res.send("Hello World");
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
