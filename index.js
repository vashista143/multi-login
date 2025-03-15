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

// Debugging: Check if environment variables are loaded
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("MONGO_URI2:", process.env.MONGO_URI2);

// Validate if MongoDB URI exists before connecting
if (!process.env.MONGO_URI || !process.env.MONGO_URI2) {
    console.error("❌ Missing MongoDB URIs in .env file!");
    process.exit(1);
}

// Connect to MongoDB
const connection1 = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection2 = mongoose.createConnection(process.env.MONGO_URI2, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Handle MongoDB connection events
connection1.on("connected", () => console.log("✅ MongoDB Connected to Primary Database"));
connection2.on("connected", () => console.log("✅ MongoDB Connected to Secondary Database"));

connection1.on("error", (err) => console.error("❌ Error connecting to Primary Database:", err));
connection2.on("error", (err) => console.error("❌ Error connecting to Secondary Database:", err));

// Initialize Models
export const User = UserModel(connection1);
export const Admin = AdminModel(connection2);

// Start server
const PORT = process.env.PORT || 7977;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
