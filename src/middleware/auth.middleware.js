import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // direct token

    if (!token) {
      return res.status(401).json({
        msg: "Unauthorized: Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "madhur");

    const user = await userModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        msg: "Unauthorized: User not found",
      });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Unauthorized: Invalid token",
      error: error.message,
    });
  }
};

export const teacherOnly = (req, res, next) => {
  if (req.user?.role !== "teacher") {
    return res.status(403).json({
      success: false,
      error: "Forbidden, teacher access required"
    });
  }
  next();
};

export const studentOnly = (req, res, next) => {
  if (req.user?.role !== "student") {
    return res.status(403).json({
      success: false,
      error: "Forbidden, student access required"
    });
  }
  next();
};

