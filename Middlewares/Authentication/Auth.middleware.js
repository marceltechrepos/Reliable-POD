import jwt from "jsonwebtoken";
import User from "../../Models/User.Model.js";

export const isLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user; // FULL USER
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
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
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    const user = await User.findById(decoded.id);
    // console.log("user", user);
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
