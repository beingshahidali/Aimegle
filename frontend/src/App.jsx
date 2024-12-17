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
    });

    // Handle incoming chat messages
    socket.on("chat message", (data) => {
      setMessages((prev) => [...prev, `${data.from}: ${data.message}`]);
    });

    return () => {
      socket.off("searching");
      socket.off("paired");
      socket.off("partner left");
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessages((prev) => [...prev, `Me: ${message}`]);
      setMessage("");
    }
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

        {/* Chat Messages */}
        <List sx={{maxHeight: 400, overflowY: "scroll", marginBottom: 2}}>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <Typography>{msg}</Typography>
            </ListItem>
          ))}
        </List>

        {/* Message Input */}
        <Box display="flex" justifyContent="space-between">
          <TextField
            label="Type a message"
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
