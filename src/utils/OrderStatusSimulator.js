import Order from "../models/OrderModel.js";
import { emitOrderStatusUpdate } from "./socketEmitter.js";

// Status progression flow
const statusProgression = [
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

// Get next status in progression
const getNextStatus = (currentStatus) => {
  const currentIndex = statusProgression.indexOf(currentStatus);
  if (currentIndex >= 0 && currentIndex < statusProgression.length - 1) {
    return statusProgression[currentIndex + 1];
  }
  return currentStatus; // Already at final status
};

// Simulate order status updates
export const startOrderStatusSimulator = (app, intervalMs = 5000) => {
  setInterval(async () => {
    try {
      // Find orders that are not yet delivered
      const pendingOrders = await Order.find({
        status: { $ne: "Delivered" },
      });

      for (const order of pendingOrders) {
        // 70% chance to update status (simulate random timing)
        if (Math.random() < 0.7) {
          const newStatus = getNextStatus(order.status);

          if (newStatus !== order.status) {
            // Update order in database
            order.status = newStatus;
            await order.save();

            // Emit update to all connected clients listening to this order
            emitOrderStatusUpdate(app, order._id.toString(), newStatus, order);
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }, intervalMs);
};

// Manually trigger status update for specific order
export const updateOrderStatusManually = async (app, orderId, newStatus) => {
  try {
    const validStatuses = [
      "Order Received",
      "Preparing",
      "Out for Delivery",
      "Delivered",
    ];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!order) {
      throw new Error("Order not found");
    }

    // Emit update to all connected clients
    emitOrderStatusUpdate(app, orderId, newStatus, order);

    return order;
  } catch (error) {
    throw error;
  }
};
