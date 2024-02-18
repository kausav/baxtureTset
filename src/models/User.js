import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    age: { type: Number, required: true },
    hobbies: { type: Array },
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

export default User;
