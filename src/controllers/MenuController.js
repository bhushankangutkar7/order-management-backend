import Menu from "../models/MenuModel.js";

const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json({
      status: 200, 
      success: true, 
      message: "Menu items fetched successfully", 
      data: menuItems
    });
  } catch (error) {
    res.status(error.status || 500).json({ 
      status: error.status || 500, 
      success: false, 
      message: error.message || "Internal Server Error, please try again"
    });
  }
};

export { getAllMenuItems };