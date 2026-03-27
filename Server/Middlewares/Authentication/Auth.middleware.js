import jwt from "jsonwebtoken";
import User from "../../Models/User.Model.js";

// export const isLogin = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_TOKEN);

//     if (token) {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;
//       req.session.userId = decoded.id;  // ✅ Add this
//       return next();
//     }

//     if (req.session && req.session.userId) {
//       req.user = { id: req.session.userId };
//       return next();
//     }

//     const user = await User.findById(decoded.id).select("-password");
//     if (!user) {
//       return res.status(401).json({ message: "User no longer exists" });
//     }

//     req.user = user; // FULL USER
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

export const isLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify token
    let decoded;
    try {
      // ✅ Use correct JWT_SECRET
      decoded = jwt.verify(token, process.env.JWT_TOKEN);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: "Token expired"
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    // 3️⃣ Get user from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists"
      });
    }

    // 4️⃣ Set user in request and session
    req.user = user;
    req.user.id = user._id;  // For convenience
    req.session.userId = user._id;  // For session fallback

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
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
