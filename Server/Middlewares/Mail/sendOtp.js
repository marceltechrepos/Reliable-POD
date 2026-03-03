import transporter from "./Email.Config.js";

const sendOtp = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP Verification",
            text: `Your OTP is: ${otp}`,
        })
    } catch (error) {
        console.error("Error sending OTP:", error);
    }
}

export default sendOtp