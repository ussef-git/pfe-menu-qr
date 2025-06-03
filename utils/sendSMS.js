const twilio = require("twilio");

const sendOTPSMS = async (telephone, otp) => {
    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
        body: `Votre code OTP : ${otp}. Il expire dans 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: telephone
    });
};

module.exports = sendOTPSMS;