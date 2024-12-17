const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Queue for waiting users
let waitingQueue = [];
// Active pairs
let activePairs = {};
// User details: socket.id -> { randomName, randomId }
let userDetails = {};

// Generate a random 4-character alphanumeric string
function generateRandomId() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

// Generate a random name from alphabets
function generateRandomName() {
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let name = "";
  for (let i = 0; i < 5; i++) {
    name += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
  }
  return name;
}

// Function to pair two users
function pairUsers(user1, user2) {
  activePairs[user1] = user2;
  activePairs[user2] = user1;

  const user1Details = userDetails[user1];
  const user2Details = userDetails[user2];

  // Notify users about pairing and share names/IDs
  io.to(user1).emit("paired", {
    message: `You are now connected with ${user2Details.randomName} (${user2Details.randomId}).`,
  });
  io.to(user2).emit("paired", {
    message: `You are now connected with ${user1Details.randomName} (${user1Details.randomId}).`,
  });
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Generate random details for the connected user
  const randomId = generateRandomId();
  const randomName = generateRandomName();
  userDetails[socket.id] = {randomName, randomId};

  // Check if someone is already in the queue
  if (waitingQueue.length === 0) {
    waitingQueue.push(socket.id);
    socket.emit("searching", {message: "Searching for a user..."});
  } else {
    const pairedUser = waitingQueue.shift();
    pairUsers(socket.id, pairedUser);
  }

  // Listen for chat messages
  socket.on("chat message", (msg) => {
    const partner = activePairs[socket.id];
    if (partner) {
      io.to(partner).emit("chat message", {
        from: userDetails[socket.id].randomName,
        message: msg,
      });
    }
  });

  // Typing indicator
  socket.on("typing", () => {
    const partner = activePairs[socket.id];
    if (partner) {
      io.to(partner).emit("typing", {from: userDetails[socket.id].randomName});
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    const partner = activePairs[socket.id];

    if (partner) {
      io.to(partner).emit("partner left", {
        message: `${
          userDetails[socket.id].randomName
        } has left the chat. Searching for a new user...`,
      });
      delete activePairs[partner];
      waitingQueue.push(partner); // Put the partner back in the queue
      io.to(partner).emit("searching", {message: "Searching for a user..."});
    }

    // Clean up
    delete activePairs[socket.id];
    delete userDetails[socket.id];
    waitingQueue = waitingQueue.filter((id) => id !== socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});
