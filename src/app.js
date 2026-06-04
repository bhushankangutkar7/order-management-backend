import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { configDotenv } from "dotenv";
import authRoutes from "./routes/AuthRoutes.js";
import menuRoutes from "./routes/MenuRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";
import authMiddleware from "./middleware/AuthMiddleware.js";

const app = express();
configDotenv({
    path: "./.env"
});

const PORT = process.env.PORT;
connectDB();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/menu", authMiddleware, menuRoutes);
app.use("/api/v1/orders", authMiddleware, orderRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment is: ${process.env.NODE_ENV}`);
});
