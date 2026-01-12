import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  Name: { type: String },
  userName: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  address: { type: String },
  town: { type: String },
  Region: { type: String },
  country: { type: String },
  postalCode: { type: String },
  taxNumber: { type: String },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "Admin",
  },
  profileImage: {
    url: { type: String, default: "" },
    public_id: { type: String, default: "" },
    alt: { type: String, default: "Profile picture" },
  },

  NotificationEmail: { type: Boolean, default: false },
  UpdatedEmail: { type: Boolean, default: false },
  PendingOrderEmail: { type: Boolean, default: false },
  OOSEmail: { type: Boolean, default: false },
  AccountOpen: { type: Boolean, default: true },
});

const User = model("User", UserSchema);
export default User;
