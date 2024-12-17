import React, {useState, useEffect} from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  List,
  ListItem,
} from "@mui/material";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [status, setStatus] = useState(""); // Status message
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    // Handle "Searching for user..."
    socket.on("searching", (data) => {
      setStatus(data.message);
    });

    // Handle pairing
    socket.on("paired", (data) => {
      setStatus(data.message);
      setMessages([]); // Clear previous chat history
    });

    // Handle partner leaving
    socket.on("partner left", (data) => {
      setStatus(data.message);
      setTyping("");
    });

    // Handle incoming chat messages
    socket.on("chat message", (data) => {
      setMessages((prev) => [...prev, {from: data.from, text: data.message}]);
    });

    // Typing indicator
    socket.on("typing", (data) => {
      setTyping(`${data.from} is typing...`);
      setTimeout(() => setTyping(""), 2000);
    });

    return () => {
      socket.off("searching");
      socket.off("paired");
      socket.off("partner left");
      socket.off("chat message");
      socket.off("typing");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessages((prev) => [...prev, {from: "Me", text: message}]);
      setMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{marginTop: 5}}>
        <Typography variant="h4" gutterBottom align="center">
          One-to-One Chat
        </Typography>

        {/* Status Message */}
        <Typography variant="h6" align="center" gutterBottom>
          {status}
        </Typography>

        {/* Typing Indicator */}
        {typing && (
          <Typography align="center" sx={{color: "gray"}}>
            {typing}
          </Typography>
        )}

        {/* Chat Messages */}
        <List sx={{maxHeight: 400, overflowY: "scroll", marginBottom: 2}}>
          {messages.length === 0 ? (
            <Typography align="center" sx={{color: "gray"}}>
              No messages yet. Start the conversation!
            </Typography>
          ) : (
            messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent: msg.from === "Me" ? "flex-end" : "flex-start",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: msg.from === "Me" ? "#1976d2" : "#e0e0e0",
                    color: msg.from === "Me" ? "white" : "black",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    maxWidth: "60%",
                  }}
                >
                  <Typography variant="body2">
                    {msg.from}: {msg.text}
                  </Typography>
                </Box>
              </ListItem>
            ))
          )}
        </List>

        {/* Message Input */}
        <Box display="flex" justifyContent="space-between">
          <TextField
            label="Type a message"
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            sx={{marginLeft: 2}}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
