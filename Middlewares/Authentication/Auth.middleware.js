import jwt from "jsonwebtoken";
import User from "../../Models/User.Model.js";

export const isLogin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }
    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token. Please log in again.",
        });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed due to a server error.",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    console.log("user", user);
    if (!user) {
      return res.status(403).json({ message: "Unauthorized: User not found" });
    }
    if (user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized: User is not an Admin" });
    }
    req.user = user;

    // Optional: attach decoded info to request (e.g., user ID or role)
    // req.user = decoded;

    next(); // Proceed to next middleware or route
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

};
