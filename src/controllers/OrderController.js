import Order from "../models/OrderModel.js";

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
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export { fetchAllOrders, createOrder };