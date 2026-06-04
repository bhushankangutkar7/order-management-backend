import express from "express";
import { Register, Login, verifyToken } from "../controllers/AuthController.js";

const authRoutes = express.Router();

authRoutes.post("/register", Register);
authRoutes.post("/login", Login);
authRoutes.get("/verify-token", verifyToken);

export default authRoutes;
