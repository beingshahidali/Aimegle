<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aimegle Project README</title>
</head>
<body>
    <pre>
# Aimegle Project

Aimegle is a web application that allows users to chat with strangers in real-time. The app connects users using WebSockets (via Socket.IO) and provides a simple, anonymous chat interface. Users can join the app, wait for a random connection, and once paired, they can exchange messages in real-time.

## Technologies Used

- **Backend**: 
  - **Express.js** for server-side functionality
  - **Socket.IO** for real-time communication
- **Frontend**: 
  - **React** for building the user interface
  - **Material UI** for UI components and styling
- **Additional Tools**:
  - **Node.js** as the runtime environment

## Features

- **Real-time messaging**: Users can send and receive messages instantly through Socket.IO.
- **Random user pairing**: Once connected, users are paired randomly with a stranger.
- **Typing indicator**: The app shows when the other user is typing.
- **Anonymous**: Users do not need to register, and their identity is hidden during chats.
- **Disconnect notifications**: If one user disconnects, the other is notified and the chat is ended.

## Installation

1. Clone the repository:

git clone https://github.com/yourusername/aimegle.git


2. Install the dependencies:

Navigate to the backend and frontend directories, and install the required packages.

For the backend:
cd backend 
npm install


For the frontend:
cd frontend 
npm install

3. Start the backend server:
   cd backend
   npm start

5. Start the frontend React app:
   cd frontend
   npm start

The app will be available at [http://localhost:3000](http://localhost:3000).

## How to Use

- Upon entering the website, users are placed in a waiting queue until they are matched with another user.
- Once matched, users can chat with each other via the message box.
- Users can also see a "typing" indicator when the other user is typing a message.


