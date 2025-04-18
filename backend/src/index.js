import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from 'socket.io';

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["https://chathaven-gold.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: ["https://chathaven-gold.vercel.app"],  
    methods: ["GET", "POST"],
    credentials: true 
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});
server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
