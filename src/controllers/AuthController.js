import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { generateJwtToken, verifyJwtToken } from '../utils/Jwt.js';
import dotenv from "dotenv";
dotenv.config();

const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
const tokenSecret = process.env.tokenSecret;

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ err: 1, msg: "Invalid email or password" });
    }
    
    const token = await generateJwtToken(
      { _id: user._id.toString(), role: user.role }
    );

    res.json({ status: 200, success: true, message: "Login Success", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, success: false, message: "Server error, try again later" });
  }
};

const Register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ status: 400, success: false, message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const newUser = new User({ firstName, lastName, userName: email, email, password: hashedPassword, role: "buyer" });
    await newUser.save();

    const token = generateJwtToken(
      { _id: newUser._id.toString(), role: newUser.role }
    );

    res.json({ status: 200, success: true, message: "User registered successfully", token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, success: false, message: "Registration failed" });
  }
};


const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ status: 401, success: false, message: "No token provided" });
    }

    // Verify the token
    const payload = await verifyJwtToken(token);

    req.user = payload;

    return res
      .status(200)
      .json({ status: 200, success: true, message: "Token is valid" });
  } catch (err) {
    return res
      .status(401)
      .json({ status: 401, success: false, message: "Invalid or expired token" });
  }
};

export { Login, Register, verifyToken };
