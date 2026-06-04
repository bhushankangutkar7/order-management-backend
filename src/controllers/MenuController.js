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
    console.error(error);
    res.status(500).json({ 
      status: 500, 
      success: false, 
      message: "Failed to fetch menu items" 
    });
  }
};

export { getAllMenuItems };