import React, {useState, useEffect, useRef} from "react";
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
import io from "socket.io-client";

import ModalContainer from "./components/Modal/ModalContainer";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const darkOrange = "#F28C28";
const matteBlack = "#212121";
const white = "#FFFFFF";

const App = () => {
  const [status, setStatus] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [connectionStatusMessage, setConnectionStatusMessage] = useState("");
  const messageInputRef = useRef(null); // Ref for the input field
  const lastMessageRef = useRef(null); // Ref for the last message

  useEffect(() => {
    if (isConnected && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [isConnected]);

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
      setConnectionStatusMessage("Oops! Your partner left the chat...");
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

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [messages]); // Trigger scroll when messages change

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
          px: 2,
          backgroundColor: "#004d4d",
          textAlign: "center",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.4)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: {xs: "column", md: "row"},
            gap: 2,
          }}
        >
          <img
            src="https://png.pngtree.com/png-clipart/20220131/original/pngtree-entrepreneurs-plan-tasks-and-business-goals-with-partners-for-business-success-png-image_7259414.png"
            width={80}
            height={80}
            style={{borderRadius: "50%", border: "3px solid white"}}
            alt="Aimegle Logo"
          />
          <Box sx={{display: "flex", flexDirection: "column"}}>
            <Typography
              sx={{
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.2rem",
                  md: "2.8rem",
                  lg: "3.2rem",
                },
                fontWeight: 700,
                color: "white",
                textTransform: "uppercase",
                letterSpacing: 1,
                background: "linear-gradient(90deg, #f07b0e, #ff7547)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              Aimegle
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "16px",
                color: "#cfd8dc",
                fontStyle: "italic",
              }}
            >
              Chat with strangers, connect instantly.
            </Typography>
          </Box>
        </Box>
      </Box>
      <ModalContainer isConnected={isConnected} />
      {isConnected && (
        <Box sx={{flex: 1, overflowY: "auto"}}>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{color: "white", fontSize: "15px"}}
          >
            {status}
          </Typography>
          <Box
            sx={{
              height: "20px", // Fixed height to prevent movement
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "gray",
            }}
          >
            {typing && <Typography>{typing}</Typography>}
          </Box>
          <List sx={{maxHeight: 400, overflowY: "scroll", marginBottom: 1}}>
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
                    padding: "4px",
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
                  {index === messages.length - 1 && (
                    <div ref={lastMessageRef} /> // Attach the ref to the last message
                  )}
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
              inputRef={messageInputRef}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent newline in input
                  sendMessage(); // Send the message
                  e.target.focus(); // Refocus the input field
                }
              }}
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
                marginRight: "8px",
              }}
              inputProps={{style: {fontFamily: "Roboto, Arial, sans-serif"}}}
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
};
export default App;
