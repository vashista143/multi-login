import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/login.route.js";
import { UserModel, AdminModel } from "./models/model.js";
dotenv.config();
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use("/",router);
const connection1 = mongoose.createConnection(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", async () => {
  console.log("mongoDB Connected to Primary Database");})
  try {
    const User = UserModel(connection2);
    let users = await User.find();
    console.log("Fetched Admin Users:", users);
  } catch (err) {
    console.error("Error fetching Admin users:", err);
  }
  connection1.on("error", (err) => {
  console.error("Error connecting to Primary Database:", err);
});
const connection2 = mongoose.createConnection(process.env.MONGO_URI2, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", async () => {
  console.log("MongoDB Connected to secondary Database")
  try {
    const Admin = AdminModel(connection2);
    let users = await Admin.find();
    console.log("Fetched Admin Users:", users);
  } catch (err) {
    console.error("Error fetching Admin users:", err);
  }
});
connection2.on("error", (err) => {
  console.error("Error connecting to Secondary Database:", err);
});
export const User = UserModel(connection1);
export const Admin = AdminModel(connection2);
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));