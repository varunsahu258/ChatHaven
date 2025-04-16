import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

// When user initiates a call
socket.on("call-user", ({ to, offer, caller }) => {
  const targetSocketId = userSocketMap[to];
  if (targetSocketId) {
    io.to(targetSocketId).emit("incoming-call", { from: caller._id, offer, caller });
  }
});

// When the callee accepts the call
socket.on("accept-call", ({ to, answer }) => {
  const targetSocketId = userSocketMap[to];
  if (targetSocketId) {
    io.to(targetSocketId).emit("call-accepted", { answer });
  }
});

// Exchange ICE candidates
socket.on("ice-candidate", ({ to, candidate }) => {
  const targetSocketId = userSocketMap[to];
  if (targetSocketId) {
    io.to(targetSocketId).emit("ice-candidate", { candidate });
  }
});

// End call
socket.on("end-call", ({ to }) => {
  const targetSocketId = userSocketMap[to];
  if (targetSocketId) {
    io.to(targetSocketId).emit("call-ended");
  }
});

});

export { io, app, server };
