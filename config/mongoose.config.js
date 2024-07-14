import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

export const ConnectMongoose = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${username}:${password}@authenticationsystem.mcl1ql7.mongodb.net/?retryWrites=true&w=majority&appName=authenticationSystem`
    );
    console.log("MongoDB using mongoose is connected");
  } catch (err) {
    console.log(err);
  }
};
