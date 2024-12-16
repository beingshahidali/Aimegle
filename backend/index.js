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

// Store users with their socket id and name
let users = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Set default name for user
  let userName = `User-${socket.id}`;

  // Listen for the 'set name' event to update the user's name
  socket.on("set name", (name) => {
    userName = name;
    users[socket.id] = userName;
    console.log(`User ${socket.id} is now named: ${userName}`);
  });

  // Listen for chat messages
  socket.on("chat message", (msg) => {
    // Broadcast the message along with the user's name
    io.emit("chat message", {user: userName, message: msg});
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    delete users[socket.id]; // Remove the user from the list on disconnect
  });
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});
