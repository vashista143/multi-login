import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/login.route.js";
import { UserModel, AdminModel } from "./models/model.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

// Connect to the primary database (MONGO_URI)
const connection1 = mongoose.createConnection(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

connection1.on("connected", () => {
  console.log("MongoDB Connected to Primary Database");
});

connection1.on("error", (err) => {
  console.error("Error connecting to Primary Database:", err);
});

// Connect to the secondary database (MONGO_URI2)
const connection2 = mongoose.createConnection(process.env.MONGO_URI2, { useNewUrlParser: true, useUnifiedTopology: true });

connection2.on("connected", async () => {
  console.log("MongoDB Connected to Secondary Database");

  try {
    const Admin = AdminModel(connection2); // Using the correct connection for AdminModel
    let users = await Admin.find(); // Fetching Admin users
    console.log("Fetched Admin Users:", users);
  } catch (err) {
    console.error("Error fetching Admin users:", err);
  }
});

connection2.on("error", (err) => {
  console.error("Error connecting to Secondary Database:", err);
});

// Create user model based on connection1
export const User = UserModel(connection1); // Using the correct connection for UserModel
export const Admin = AdminModel(connection2);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
