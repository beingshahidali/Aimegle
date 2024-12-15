const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Allow CORS for Socket.IO connections
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// Enable CORS for Express routes (if you need it for other requests)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for messages from the client
  socket.on("chat message", (msg) => {
    console.log("Message received: " + msg);
    // Broadcast the message to all clients
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});
