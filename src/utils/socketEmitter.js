// Helper to emit order status updates through websocket
export const emitOrderStatusUpdate = (app, orderId, status, order) => {
  const io = app.get("io");
  if (io) {
    io.to(`order:${orderId}`).emit("order-status-update", {
      orderId,
      status,
      order,
      timestamp: new Date()
    });
  }
};
