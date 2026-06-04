import express from "express";
import { createOrder, fetchAllOrders } from "../controllers/OrderController.js";

const orderRoutes = express.Router();

orderRoutes.post("", createOrder);
orderRoutes.get("", fetchAllOrders);

export default orderRoutes;
