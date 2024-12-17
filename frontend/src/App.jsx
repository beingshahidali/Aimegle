import React, {useState, useEffect} from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  List,
  ListItem,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import {motion} from "framer-motion";
import io from "socket.io-client";

import ModalContainer from "./components/Modal/ModalContainer";

const socket = io("http://localhost:4000");

const darkOrange = "#F28C28";
const matteBlack = "#212121";
const white = "#FFFFFF";

function App() {
  const [status, setStatus] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [connectionStatusMessage, setConnectionStatusMessage] = useState("");

  useEffect(() => {
    socket.on("searching", (data) => {
      setStatus(data.message);
      setIsConnected(false);
    });

    socket.on("paired", (data) => {
      setStatus(data.message);
      setIsConnected(true);
      setMessages([]);
      setConnectionStatusMessage("You are now connected!");
      setToastOpen(true);
    });

    socket.on("partner left", (data) => {
      setStatus(data.message);
      setTyping("");
      setIsConnected(false);
      setConnectionStatusMessage("Oops ! Your partner left the chat...");
      setToastOpen(true);
    });

    socket.on("chat message", (data) => {
      setMessages((prev) => [...prev, {from: data.from, text: data.message}]);
    });

    socket.on("typing", (data) => {
      setTyping(`${data.from} is typing...`);
      setTimeout(() => setTyping(""), 1000);
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
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        minWidth: "100vw",
        backgroundColor: matteBlack,
        color: white,
      }}
    >
      <Box
        sx={{
          px: 0,
          backgroundColor: "teal",
          padding: "16px",
          textAlign: "center",
          boxShadow: "0px 2px 10px rgba(117, 53, 53, 0.6)",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "2rem",
              sm: "2.5rem",
              md: "3rem",
              lg: "3.5rem",
              color: "black",
            },
            display: "inline-block",
            ml: "10px",
            paddingRight: "0.25rem",
            paddingLeft: "0.25rem",
            borderLeft: "4px solid rgba(220, 196, 163, 0.77)",
            borderRadius: 0,
            backgroundImage:
              "linear-gradient(90deg, rgba(227, 211, 196, 0.95), rgba(255, 117, 71, 0));",
            lineHeight: 1,
          }}
        >
          Chimegle
        </Typography>
        <Typography variant="subtitle1" color="white" sx={{fontSize: "14px"}}>
          Chat with strangers, connect instantly.
        </Typography>
      </Box>
      <ModalContainer isConnected={isConnected} />
      {isConnected && (
        <Box sx={{flex: 1, overflowY: "auto"}}>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{color: "white"}}
          >
            {status}
          </Typography>
          {typing && (
            <Typography align="center" sx={{color: "gray"}}>
              {typing}
            </Typography>
          )}
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
                    justifyContent:
                      msg.from === "Me" ? "flex-end" : "flex-start",
                    display: "flex",
                  }}
                >
                  <Paper
                    sx={{
                      bgcolor: msg.from === "Me" ? "primary.main" : "grey.200",
                      color: msg.from === "Me" ? "white" : "text.primary",
                      borderRadius: "35px 10px 35px 10px",
                      padding: "10px 20px",
                      textAlign: "center",
                      maxWidth: "70%",
                      fontFamily: "Roboto, Arial, sans-serif",
                      minWidth: "30px",
                    }}
                  >
                    <Typography variant="body1">{msg.text}</Typography>
                  </Paper>
                </ListItem>
              ))
            )}
          </List>
          <Box
            sx={{
              mb: 1,
              position: "absolute",
              bottom: 0,
              width: "90%",
              padding: "8px",
              backgroundColor: matteBlack,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            <TextField
              label="Type a message"
              variant="outlined"
              fullWidth
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
                marginRight: "8px",
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={sendMessage}
              sx={{
                backgroundColor: darkOrange,
                "&:hover": {backgroundColor: "#f57c00"},
                width: "80px",
              }}
            >
              Send
            </Button>
          </Box>
        </Box>
      )}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{vertical: "top", horizontal: "center"}}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={isConnected ? "success" : "error"}
        >
          {connectionStatusMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
