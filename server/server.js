const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const { createServer } = require("http");
const { Server } = require("socket.io");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
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

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
connectDB().then(() => {
  httpServer.listen(process.env.PORT || 5000, () => {
    console.log(`http://localhost:${process.env.PORT || 5000}`);
  });
});
