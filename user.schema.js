import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  name: { type: String, require: true },
  password: { type: String, require: true },
});

export const collection = new mongoose.model("user", loginSchema);
