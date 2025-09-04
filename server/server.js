const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
const app = express();

const { createServer } = require("http");
const { Server } = require("socket.io");
app.use(
  cors({
    origin: ["http://localhost:5173", "https://chat-app-rho-beige.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: 15 * 1024 * 1024 }));
app.use(express.urlencoded({ extended: true, limit: 15 * 1024 * 1024 }));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://chat-app-rho-beige.vercel.app"],
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

const connectDB = require("./lib/db");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");

app.use("/", authRoute);
app.use("/user", userRoute);
//app.use("/home");

io.on("connection", (socket) => {
  console.log("A user Connected", socket.id);

  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`User joined ${roomId} room`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
connectDB().then(() => {
  httpServer.listen(process.env.PORT || 5000, () => {
    console.log(`http://localhost:${process.env.PORT || 5000}`);
  });
});
