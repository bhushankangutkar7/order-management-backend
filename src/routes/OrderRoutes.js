import express from "express";
import { createOrder, fetchAllOrders, updateOrderStatus } from "../controllers/OrderController.js";

const orderRoutes = express.Router();

orderRoutes.post("", createOrder);
orderRoutes.get("", fetchAllOrders);
orderRoutes.put("/:orderId/status", updateOrderStatus);

export default orderRoutes;
