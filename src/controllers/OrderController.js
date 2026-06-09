import Order from "../models/OrderModel.js";
import Menu from "../models/MenuModel.js";
import { updateOrderStatusManually } from "../utils/OrderStatusSimulator.js";
import { emitOrderStatusUpdate } from "../utils/socketEmitter.js";

const fetchAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: "Fetched all orders",
      data: orders
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      success: false,
      message: error.message || "Internal Server Error, please try again"
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const orderData = {...req.body, customer: req.user._id};

    const availableMenuItems = await Menu.find({available: true});
    const orderItems = req.body.items;

    //Check if correct Data: 
    let isValid = true;
    const availableMenuItemsMap = {};

    availableMenuItems.forEach((item)=>{
      availableMenuItemsMap[item._id.toString()] = item;
    });
    
    orderItems.forEach(item => {
      const orderItemID = item.menuItem.toString();
      const availableItem = availableMenuItemsMap[orderItemID];
      if(
        availableItem === null || 
        availableItem === undefined ||
        availableItem.price !== item.price
      ) {
        isValid = false;
      }
    });
    
    if(!isValid) {
      const err = new Error("Bad Request. Please try again");
      err.status = 400;
      throw err
    };
    
    const totalAmount = orderItems.reduce((total, item) => {
      const Id = item.menuItem.toString();
      const availableItem = availableMenuItemsMap[Id]
      return total + (item.quantity * availableItem.price);
    },0);

    const order = new Order({...orderData, totalAmount});
    await order.save();
    
    return res.status(201).json({
      status: 201,
      success: true,
      message: "Order created Successfully",
      data: order
    });  

  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      success: false,
      message: error.message || "Internal Server Error, please try again"
    });
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

    res.status(200).json({
      status: 200,
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      success: false,
      message: error.message || "Internal Server Error, please try again"
    });
  }
};

export { fetchAllOrders, createOrder, updateOrderStatus };