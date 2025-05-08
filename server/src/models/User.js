import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  Roll: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
});

const UserData = mongoose.model("UserData", UserSchema);

export default UserData;
