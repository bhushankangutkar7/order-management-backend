import express from "express";
import { getAllMenuItems } from "../controllers/MenuController.js";

const menuRoutes = express.Router();

menuRoutes.get("", getAllMenuItems);

export default menuRoutes;
