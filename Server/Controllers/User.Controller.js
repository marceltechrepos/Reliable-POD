import User from "../Models/User.Model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cloudinary from "../Utils/Cloudinary.Config.js";
import fs from "fs";

export const CreateUser = async (req, res) => {
  try {
    const { email, password, UpdatedEmail = false } = req.body;

    // Validation
    const validation = [
      { condition: !email, message: "Email is required." },
      {
        condition: email && !/^\S+@\S+\.\S+$/.test(email),
        message: "Please provide a valid email address.",
      },
      { condition: !password, message: "Password is required." },
      {
        condition: typeof UpdatedEmail !== "boolean",
        message: "UpdatedEmail must be a boolean value.",
      },
    ];

    for (const v of validation) {
      if (v.condition)
        return res.status(400).json({ success: false, message: v.message });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({
        success: false,
        message: "User already exists with this email.",
      });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ email, password: hashedPassword, UpdatedEmail });
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "Signup successful.", user });
  } catch (error) {
    console.error("CreateUser Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating user.",
      error,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_TOKEN,
      { expiresIn: "7d" }
    );

    return res
      .status(200)
      .json({ success: true, message: "Login successful.", user, token });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login.",
      error,
    });
  }
};

export const addUserInformation = async (req, res) => {
  try {
    const {
      Name,
      userName,
      phone,
      company,
      address,
      town,
      Region,
      country,
      postalCode,
      taxNumber,
      NotificationEmail,
      PendingOrderEmail,
      OOSEmail,
      UpdatedEmail,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    // Update user fields if provided
    user.Name = Name ?? user.Name;
    user.userName = userName ?? user.userName;
    user.phone = phone ?? user.phone;
    user.company = company ?? user.company;
    user.address = address ?? user.address;
    user.town = town ?? user.town;
    user.Region = Region ?? user.Region;
    user.country = country ?? user.country;
    user.postalCode = postalCode ?? user.postalCode;
    user.taxNumber = taxNumber ?? user.taxNumber;
    user.NotificationEmail = NotificationEmail ?? user.NotificationEmail;
    user.PendingOrderEmail = PendingOrderEmail ?? user.PendingOrderEmail;
    user.OOSEmail = OOSEmail ?? user.OOSEmail;
    user.UpdatedEmail = UpdatedEmail ?? user.UpdatedEmail;

    // Handle image upload if provided
    if (req.file) {
      try {
        // Upload image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "user-profiles",
          resource_type: "image",
        });


        // Remove file from local storage
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        // Delete old profile image from Cloudinary if exists
        if (user.profileImage) {
          try {
            await cloudinary.uploader.destroy(user.profileImage.public_id);
          } catch (cloudinaryError) {
            console.error("Error deleting old profile image:", cloudinaryError);
          }
        }

        // Update user's profile image
        user.profileImage = {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          alt: `${user.Name || user.userName}'s profile picture`,
        };
      } catch (uploadError) {
        console.error("Profile image upload error:", uploadError);
        // Continue without image if upload fails
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User information updated successfully.",
      user: user
    });
  } catch (error) {
    console.error("addUserInformation Error:", error);

    // Clean up uploaded file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error while updating user information.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully.",
      user,
    });
  } catch (error) {
    console.error("getUserDetail Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching user details.",
      error,
    });
  }
};

export const VerifyToken = async (req, res) => {
  try {
    // isLogin middleware already verified token and attached req.user
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Token is valid.",
      user: req.user
    });

  } catch (error) {
    console.error("VerifyToken Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while verifying token.",
      error,
    });
  }
};