import sendEmail from "../utils/mailer";
const bcrypt = require("bcrypt");
const { sendSms } = require("../utils/utils");
const ndb = require("../config/connect");

const adb = ndb.promise();

const sendOtpVerificationEmail = async (email, phone) => {
  try {
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const message = `Here's your OTP ${otp} this otp expires in one hour`;
    const saltRounds = 10;

    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    const payload = {
      phone: phone,
      otp: hashedOTP,
      created_at: Date.now(),
      expires_at: Date.now() + 3600000,
    };
    const sql = `INSERT INTO otps SET ?`;
    await adb.query(sql, payload);
    await sendEmail({
      email: email,
      subject: "Email Verification",
      message: message,
    });
  } catch (error) {
    console.log(error);
  }
};

const sendOtpVerificationSms = async (phone) => {
  try {
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const message = `Here's your OTP ${otp}. OTP valid for 15 minutes`;
    const saltRounds = 10;

    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    const payload = {
      phone: phone,
      otp: hashedOTP,
      created_at: Date.now(),
      expires_at: Date.now() + 900000,
    };
    const sql = `INSERT INTO otps SET ?`;
    await adb.query(sql, payload);

    sendSms(message);
  } catch (error) {
    console.log(error);
  }
};

const sendOtpForgotSms = async (email, firstName, phone) => {
  try {
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const message = `Dear ${firstName}, your password reset authentication code is ${otp}. OTP valid for 15 minutes`;
    const saltRounds = 10;

    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    const payload = {
      phone: phone,
      otp: hashedOTP,
      created_at: Date.now(),
      expires_at: Date.now() + 900000,
    };
    const sql = `INSERT INTO otps SET ?`;
    await adb.query(sql, payload);

    console.log(otp)
    sendSms(message);
    await sendEmail({
      email: email,
      subject: "Email Verification",
      message: message,
    });
  } catch (error) {
    console.log(error);
  }
};

export { sendOtpVerificationEmail, sendOtpVerificationSms, sendOtpForgotSms };
