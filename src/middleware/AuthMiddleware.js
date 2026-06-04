import { verifyJwtToken } from '../utils/Jwt.js';

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({status: 401, success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = await verifyJwtToken(token);
    if (!decoded) {
      return res.status(401).json({status: 401, success: false, message: "Invalid token or expired." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({status: 403, success: false, message: "Invalid or expired token." });
  }
};



export default authMiddleware;

