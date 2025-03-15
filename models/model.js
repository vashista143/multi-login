import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    section: Number,
    email: String,
    percentage: Number
});

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    timetable:String,
    subject: String
});

export const UserModel = (connection) => {
    return connection.model("User", UserSchema, "users"); 
};

export const AdminModel = (connection) => {
    return connection.model("Admin", AdminSchema, "admin"); 
};
