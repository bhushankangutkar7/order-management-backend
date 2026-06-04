import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { configDotenv } from "dotenv";
import authRoutes from "./routes/AuthRoutes.js";
import menuRoutes from "./routes/MenuRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";
import authMiddleware from "./middleware/AuthMiddleware.js";
import { startOrderStatusSimulator } from "./utils/OrderStatusSimulator.js";

const app = express();
configDotenv({
    path: "./.env"
});

const PORT = process.env.PORT;
connectDB();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/menu", authMiddleware, menuRoutes);
app.use("/api/v1/orders", authMiddleware, orderRoutes);

// WebSocket for order status tracking
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join order room for real-time status updates
    socket.on("join-order", (orderId) => {
        socket.join(`order:${orderId}`);
        console.log(`User ${socket.id} joined order: ${orderId}`);
    });

    // Leave order room
    socket.on("leave-order", (orderId) => {
        socket.leave(`order:${orderId}`);
        console.log(`User ${socket.id} left order: ${orderId}`);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Make io accessible to routes
app.set("io", io);

// Start order status simulator
startOrderStatusSimulator(app, 5000); // Update status every 5 seconds

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment is: ${process.env.NODE_ENV}`);
});
