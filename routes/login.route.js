import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import { sendEmail } from "../email/email.js";
import { User,Admin} from "../index.js";
dotenv.config();
import { UserModel, AdminModel } from "../models/model.js";
const app=express()
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
const router = express.Router();
mongoose.connect(process.env.MONGO_URI2)

router.post("/register", async (req, res) => {
    try {
        const { username, email, password, confirmPassword, isAdmin } = req.body;
        console.log(req.body);

        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match");
        }
        if (isAdmin === "on") {
            const admin = await Admin.create({ username, email, password });
            console.log('Admin Registered:',username);
            return res.redirect("/");
        } else {
            await User.create({ username, email, password }); 
            console.log('User Registered:', username);
            return res.redirect("/");
        }

        
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/", (req, res) => {
    console.log("Login route hit!");
    res.render("home.ejs", { error: null });  
});
router.post("/", async (req, res) => {
    console.log("Received request body:", req.body);

    if (!req.body.user || !req.body.pass) {
        return res.render("home.ejs", { error: "Username and password are required" });
    }
    try {
        const getuser = await User.findOne({ username: req.body.user });
        const getadmin = await Admin.findOne({ username: req.body.user });

        console.log("Searched User:", getuser);
        console.log("Searched Admin:", getadmin);

        if (!getuser && !getadmin) {
            return res.render("home.ejs", { error: "User not found" });
        }
        if (getuser && getuser.password === req.body.pass) {
            return res.render("userdash.ejs", { username: getuser.username, getuser });
        }
        if (getadmin && getadmin.password === req.body.pass) {
            return res.render("admindash.ejs", { username: getadmin.username, getadmin });
        }

        return res.render("home.ejs", { error: "Incorrect password" });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).render("home.ejs", { error: "Internal server error" });
    }
});

router.get("/reset",(req,res)=>{
    res.render("resetform.ejs")
})
router.post("/reset", async (req, res) => {
    console.log(req.body.mailid);
    const email = req.body.mailid;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }
    try {
        const user = await User.findOne({ email: email });
        const admin = await Admin.findOne({ email: email });

        if (!user && !admin) {
            return res.status(404).json({ success: false, message: "Email not found" });
        }
        
        const resetLink = `https://multi-login-vashista.onrender.com/reset-password/${email}`;
        await sendEmail(email, "Reset Password", `Click on the link to reset your password: ${resetLink}`);
        return res.status(200).json({ success: true, message: "Reset password link sent successfully" });

    } catch (error) {
        console.error("Error during password reset:", error);
        return res.status(500).json({ success: false, message: "Failed to send reset email" });
    }
});
router.get("/reset-password/:id",(req,res)=>{
    let mail=req.params.id
    res.render("passwordchange.ejs",{mail})
})
router.post("/reset-password/:id", async (req, res) => {
    const { entpass, conpass } = req.body;  
    const email = req.params.id;  

    if (!entpass || !conpass) {
        return res.status(400).send("Both password fields are required");
    }

    if (entpass !== conpass) {
        return res.status(400).send("Passwords do not match");
    }

    try {
        const user = await User.findOne({ email: email });
        const admin = await Admin.findOne({ email: email });
        if (!user && !admin) {
            return res.status(404).send("Email not found");
        }
        if (user) {
            await User.updateOne({ email: email }, { password: entpass });
        } else if (admin) {
            await Admin.updateOne({ email: email }, { password: entpass });
        }
        res.redirect("/")
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).send("Failed to update password");
    }
});
router.get("/register", async (req,res)=>{
    res.render("register.ejs")
})

export default router;