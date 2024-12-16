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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("chat message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{marginTop: 5}}>
        <Typography variant="h4" gutterBottom align="center">
          Socket.IO Chat
        </Typography>

        {/* Chat messages section */}
        <List sx={{maxHeight: 400, overflowY: "scroll", marginBottom: 2}}>
          {messages.map((data, index) => (
            <ListItem key={index}>
              <Typography>
                <strong>{data.user}:</strong> {data.message}
              </Typography>
            </ListItem>
          ))}
        </List>

        {/* Message input section */}
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
