import Order from "../models/OrderModel.js";
import { updateOrderStatusManually } from "../utils/OrderStatusSimulator.js";
import { emitOrderStatusUpdate } from "../utils/socketEmitter.js";

const fetchAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

const createOrder = async (req, res) => {
  try {
    const orderData = {...req.body, customer: req.user._id};
    const order = new Order(orderData);
    await order.save();
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const app = req.app;
    const updatedOrder = await updateOrderStatusManually(app, orderId, status);

    res.json({
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to update order status" });
  }
};

export { fetchAllOrders, createOrder, updateOrderStatus };