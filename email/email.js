import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.my_mail, 
        pass: process.env.my_pass  
    }
});
export async function sendEmail(to, subject, text) {
    try {
        const mailOptions = {
            from: process.env.my_mail,
            to: to,
            subject: subject,
            text: text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
