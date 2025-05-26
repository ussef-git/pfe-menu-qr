const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Votre code de vérification",
        text: `Votre code OTP est : ${otp}. Il expire dans 5 minutes.`
    });
};

module.exports = sendOTPEmail;