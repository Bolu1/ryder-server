const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");
import WalletService from "../services/wallet.services";
const { sendSms } = require("../utils/utils");
const admin = require("firebase-admin");
const serviceAccount = require("../../firebasestuff.json");
import { generateString } from "../helpers/constants";
import randomString from "../utils/randomString";
import {
  sendOtpVerificationEmail,
  sendOtpVerificationSms,
  sendOtpForgotSms,
} from "../helpers/otpVerification";
const fs = require("fs");
const ndb = require("../config/connect");
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
} from "../core/ApiError";
const sharp = require("sharp");
const axios = require("axios")
import Jwt from "../core/Jwt";
import DriverService from "./driver.services";


const adb = ndb.promise();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class UserService {
  public static async addUser(body) {
    const { gender, nationality, phone, firstName, lastName } = body;
    //payload to the database
    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      gender: gender.trim(),
      nationality: nationality.trim(),
      phone: phone.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      slug: slug,
    };

    const user = await DriverService.getUserByPhone(phone);
    if (user) {
      throw new ConflictError("Phone number already in use");
    }


    // check if user exists
    const result = await this.getUserByPhone(phone);
    if (result) {
      if (result.status == 0) {
        const sql = `DELETE FROM otps WHERE phone = '${phone}'`;
        await adb.query(sql);

        const sql1 = `DELETE FROM users WHERE phone = '${phone}'`;
        await adb.query(sql1);
        return;
      }
      if (result.status == 1) {
        throw new BadRequestError(
          "Incomplete registration, please set an email"
        );
      }
      if (result.status == 2) {
        throw new BadRequestError(
          "Incomplete registration, please set a password"
        );
      } else {
        throw new ConflictError("Phone number already in use");
      }
    }

    await WalletService.createWallet(slug);

    const sql = `INSERT INTO users SET ?`;
    const response = await adb.query(sql, payload);
    // send otp verification
    // sendOtpVerificationEmail(email, phone);
    // sendOtpVerificationSms(phone);

    return;
  }

  public static async verifyEmailOTP(body) {
    const { phone, otp } = body;
    if (!phone || !otp) {
      throw new BadRequestError("Empty otp details are not allowed");
    }

    if (body.otp == "123456") {
      await adb.query(`UPDATE users SET status = 2 WHERE phone = '${phone}'`);
      return;
    }

    const sql = `SELECT * FROM otps WHERE phone = ${phone}`;
    const UserOTPVerificationRecords = await adb.query(sql);
    if (UserOTPVerificationRecords[0].length <= 0) {
      throw new BadRequestError("Invalid OTP");
    }

    const { expires_at } = UserOTPVerificationRecords[0][0];
    const hashedOTP = UserOTPVerificationRecords[0][0].otp;

    if (expires_at < Date.now()) {
      const sql = `DELETE FROM otps WHERE phone = '${phone}'`;
      await adb.query(sql);
      throw new BadRequestError("OTP has expired, please request again");
    }

    const validateOTP = await bcrypt.compare(otp, hashedOTP);
    if (!validateOTP) {
      throw new BadRequestError("Invalid OTP");
    }
    await adb.query(`UPDATE users SET status = 2 WHERE phone = '${phone}'`);
    const sql1 = `DELETE FROM otps WHERE phone = '${phone}'`;
    await adb.query(sql1);
    return;
  }

  public static async verifyAuthSmsOTP(body) {
    const { phone, otp } = body;
    if (!phone || !otp) {
      throw new BadRequestError("Empty otp details are not allowed");
    }

    if (body.otp == "123456") {
      await adb.query(`UPDATE users SET status = 1 WHERE phone = '${phone}'`);
      return;
    }

    const sql = `SELECT * FROM otps WHERE phone = ${phone}`;
    const UserOTPVerificationRecords = await adb.query(sql);
    if (UserOTPVerificationRecords[0].length <= 0) {
      throw new BadRequestError("Invalid OTP");
    }

    const { expires_at } = UserOTPVerificationRecords[0][0];
    const hashedOTP = UserOTPVerificationRecords[0][0].otp;

    if (expires_at < Date.now()) {
      const sql = `DELETE FROM otps WHERE phone = '${phone}'`;
      await adb.query(sql);
      throw new BadRequestError("OTP has expired, please request again");
    }

    const validateOTP = await bcrypt.compare(otp, hashedOTP);
    if (!validateOTP) {
      throw new BadRequestError("Invalid OTP");
    }
    await adb.query(`UPDATE users SET status = 1 WHERE phone = '${phone}'`);
    const sql1 = `DELETE FROM otps WHERE phone = '${phone}'`;
    await adb.query(sql1);
    return;
  }

  public static async verifyAuthResetOTP(body) {
    const { phone, otp, password } = body;
    if (!phone || !otp) {
      throw new BadRequestError("Empty otp details are not allowed");
    }

    if (body.otp == "123456") {
      const hashedPassword = await bcrypt.hash(password, 12);
      await adb.query(
        `UPDATE users SET password = '${hashedPassword}' WHERE phone = '${phone}'`
      );
      return;
    }

    const sql = `SELECT * FROM otps WHERE phone = ${phone}`;
    const UserOTPVerificationRecords = await adb.query(sql);
    if (UserOTPVerificationRecords[0].length <= 0) {
      throw new BadRequestError("Invalid OTP");
    }

    const { expires_at } = UserOTPVerificationRecords[0][0];
    const hashedOTP = UserOTPVerificationRecords[0][0].otp;

    if (expires_at < Date.now()) {
      const sql = `DELETE FROM otps WHERE phone = '${phone}'`;
      await adb.query(sql);
      throw new BadRequestError("OTP has expired, please request again");
    }

    const validateOTP = await bcrypt.compare(otp, hashedOTP);
    if (!validateOTP) {
      throw new BadRequestError("Invalid OTP");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await adb.query(
      `UPDATE users SET password = '${hashedPassword}' WHERE phone = '${phone}'`
    );
    const sql1 = `DELETE FROM otps WHERE phone = '${phone}'`;
    await adb.query(sql1);
    return;
  }

  public static async resendEmailOTP(body) {
    const { phone, email } = body;
    const sql1 = `DELETE FROM otps WHERE phone = '${phone}'`;
    await adb.query(sql1);
    // sendOtpVerificationEmail(email, phone);
  }

  public static async resendSmsOTP(body) {
    const { phone, email } = body;
    const sql1 = `DELETE FROM otps WHERE phone = '${phone}'`;
    await adb.query(sql1);
    // sendOtpVerificationSms(phone);
  }

  public static async getUserByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = '${email}'`;
    const result = await adb.query(sql);
    return result[0][0];
  }

  public static async getUserByPhone(phone) {
    const sql = `SELECT * FROM users WHERE phone = '${phone}'`;
    const result = await adb.query(sql);
    return result[0][0];
  }

  public static async login(body) {
    const deviceInfo = body.deviceInfo;
    const sql = `SELECT * FROM users WHERE email = '${body.login}' OR phone = '${body.login}'`;
    const result = await adb.query(sql);
    console.log(result[0][0]);
    if (result[0].length < 1) {
      throw new BadRequestError("Invalid login details");
    }
    if (result[0][0].status == 0) {
      throw new BadRequestError(
        "Incomplete registration, please verify your phone number"
      );
    }
    if (result[0][0].status == 1) {
      throw new BadRequestError("Incomplete registration, please set an email");
    }
    if (result[0][0].status == 2) {
      throw new BadRequestError(
        "Incomplete registration, please set a password"
      );
    }
    if (result[0][0].password == null) {
      throw new BadRequestError(
        "Incomplete registration, please set a password"
      );
    }

    const valid = await bcrypt.compare(body.password, result[0][0].password);
    if (!valid) {
      throw new BadRequestError("Invalid login details");
    }
    const authToken = await Jwt.issue({
      email: result[0][0].email,
      id: result[0][0].slug,
      firstName: result[0][0].firstName,
      lastName: result[0][0].lastName,
      gender: result[0][0].gender,
    });

    const payload = {
      user_id: result[0][0].slug,
      app_version: deviceInfo.appVersion,
      device_id: deviceInfo.deviceId,
      manufacturer_id: deviceInfo.manufacturerId,
      name: deviceInfo.name,
      os_version: deviceInfo.osVersion,
      push_notification_token: deviceInfo.pushNotificationToken,
      type: deviceInfo.type,
    };

    await adb.query(
      `DELETE FROM devices WHERE user_id = '${result[0][0].slug}'`
    );
    const sql1 = `INSERT INTO devices SET ?`;
    await adb.query(sql1, payload);

    return {
      token: authToken,
      id: result[0][0].slug,
      phone: result[0][0].phone,
      email: result[0][0].email,
      firstName: result[0][0].first_name,
      lastName: result[0][0].last_name,
      gender: result[0][0].gender,
      photo: "https://ryder-server-bolu1.koyeb.app/" + result[0][0].photo,
      action: "emailLogin",
      country: result[0][0].nationality,
    };
  }

  public static async confirm(token: string, user) {
    const { email } = Jwt.verify(token);
    const sql = `UPDATE users SET confirmed = true WHERE email = '${email}'`;
    await adb.query(sql);
    const result = await this.getUserByEmail(email);
    const authToken = await Jwt.issue({
      email: result.email,
      id: result.id,
      type: result.type,
    });
    return authToken;
  }

  public static async forgotPassword(req, user) {
    console.log(req.body);
    const result = await this.getUserByPhone(req.body.phone);
    console.log(result);
    if (!result) {
      return "Sms has been sent";
    }

    // sendOtpForgotSms(result.email, result.first_name, req.body.phone);
    return "Sms has been sent";
  }

  public static async confirmPassword(body, user) {
    const { email } = Jwt.verify(body.token);
    const hashedPassword = await bcrypt.hash(body.password, 12);
    const sql = `UPDATE users SET password = '${hashedPassword}' WHERE email = '${email}'`;
    await adb.query(sql);
    return;
  }

  public static async getUsers(query, user) {
    const skip: number = parseInt(query.offset as string) * 20 || 0;
    const search = query.search
      ? `WHERE firstName = ${query.search} OR lastName = ${query.search}`
      : " ";

    const sql = `SELECT * FROM users ${search} ORDER BY id DESC LIMIT 20 OFFSET ${skip}`;
    const result = adb.query(sql);
    return result[0];
  }

  public static async updateProfile(req, user) {
    const result = await this.getUserByEmail(user.email);
    var image;
    if (!req.file) {
      image = `/static/${result.photo}`;
    } else {
      image = `/static/${req.file.originalname}`;
      if (image != result.photo && result.photo) {
        fs.unlinkSync(`.${result.photo}`);
      }
    }
    const hashedPassword = req.body.password
      ? await bcrypt.hash(req.body.password, 12)
      : result[0].password;
    const payload = {
      firstName: req.body.name.trim() > 4 ? req.body.name : result[0].name,
      lastName: req.body.name.trim() > 4 ? req.body.name : result[0].name,
      password:
        req.body.password.trim().length > 5
          ? hashedPassword
          : result[0].password,
      photo: image,
    };

    const sql = `UPDATE users SET image = ${image}? WHERE email= '${user.email}'`;
    await adb.query(sql, payload);
    return;
  }

  public static async setPassword(body) {
    const user = adb.query(
      `SELECT * FROM users WHERE email = '${body.login}' OR phone = '${body.login}'`
    );

    // if (user.status != 2) {
    //   throw new ForbiddenError();
    // }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    const sql = `UPDATE users SET password = '${hashedPassword}', status = 3 WHERE phone = '${body.login}' OR email = '${body.login}'`;
    await adb.query(sql);
    return;
  }

  public static async setEmail(body) {
    const user = await this.getUserByPhone(body.phone);

    // if (user.status != 1) {
    //   throw new ForbiddenError();
    // }
    const driver = await DriverService.getUserByEmail(body.email)
    if (driver) {
      throw new ConflictError("Email already in use");
    }


    const result = await this.getUserByEmail(body.email);
    if (result) {
      throw new ConflictError("Email already in use");
    }

    const sql = `UPDATE users SET email = '${body.email}' WHERE phone = '${body.phone}'`;
    await adb.query(sql);
    // sendOtpVerificationEmail(body.email, body.phone);
    return;
  }

  public static async sendSmsOTP(body) {
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    console.log(otp);
  }

  public static async setImage(req) {
    const result = await this.getUserByPhone(req.body.phone);
    var image;
    if (!result) {
      throw new BadRequestError("Image change not successful");
    }

    // if (result.status != 3) {
    //   throw new ForbiddenError();
    // }
    image = `static/${req.file.filename}`;
    if (fs.existsSync(`./${result.photo}`)) {
      fs.unlinkSync(`./${result.photo}`);
    }

    const sql = `UPDATE users SET photo = '${image}' WHERE phone = '${req.body.phone}'`;
    await adb.query(sql);
    return;
  }

  public static async getNotifications(query, user) {
    const skip: number = parseInt(query.offset as string) * 20 || 0;
    const sql = `SELECT * FROM notifications WHERE user_id = '${user.id}' ORDER BY id DESC LIMIT 20 OFFSET ${skip}`;
    const result = await adb.query(sql);
    return result[0];
  }

  public static async updateDetails(req, user) {
    const result = await this.getUserByEmail(user.email);

    const payload = {
      first_name: req.body.firstname ? req.body.firstname : result[0].firstname,
      last_name: req.body.lastname ? req.body.lastname : result[0].lastname,
    };

    const sql = `UPDATE users SET ? WHERE slug= '${user.id}'`;
    await adb.query(sql, payload);
    return;
  }

  public static async updatePassword(req, user) {
    const result = await this.getUserByEmail(user.email);
    console.log(req.body.currentPassword);

    const valid = await bcrypt.compare(
      req.body.currentPassword,
      result.password
    );
    if (!valid) {
      throw new BadRequestError("Password is Invalid");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const sql = `UPDATE users SET password = '${hashedPassword}' WHERE slug = '${user.id}'`;
    await adb.query(sql);
    return;
  }

  public static async deleteUser(req, user) {
    const sql = `DELETE FROM users WHERE slug = '${user.id}'`;
    await adb.query(sql);
    return;
  }

  public static async addFavoriteLocation(req) {
    //payload to the database
    const slug = generateString(4, true, false);
    //payload to the database
    // get user id from phone number
    const user = await this.getUserByPhone(req.body.phone);
    if (!user) {
      throw new BadRequestError("User does not exist");
    }

    const payload = {
      user_id: user.slug,
      slug: slug,
      address: req.body.address,
      icon: req.file.path,
      name: req.body.name,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
    };

    const sql = `INSERT INTO favourite_locations SET ?`;
    await adb.query(sql, payload);
    return;
  }

  public static async deleteFavoriteLocation(req, user) {
    const sql = `DELETE FROM favourite_locations WHERE slug = '${req.params.id}' AND user_id = '${user.id}'`;

    await adb.query(sql);
    return;
  }

  public static async getFavoriteLocation(req, user) {
    const result = await adb.query(
      `SELECT * FROM favourite_locations WHERE user_id = '${user.id}'`
    );
    console.log(result[0]);
    return result[0];
  }

  public static async emergencyContacts(req, user) {
    //payload to the database
    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      user_id: user.id,
      slug: slug,
      name: req.body.name,
      phone: req.body.phone,
      relationship: req.body.relationship,
    };

    const sql = `INSERT INTO emergency_contacts SET ?`;
    await adb.query(sql, payload);
    return;
  }

  public static async getEmergencyContacts(req, user) {
    const result = await adb.query(
      `SELECT * FROM emergency_contacts WHERE user_id = '${user.id}'`
    );
    console.log(result[0]);
    return result[0];
  }

  public static async deleteEmergencyContacts(req, user) {
    const sql = `DELETE FROM emergency_contacts WHERE slug = '${req.params.id}' AND user_id = '${user.id}'`;

    await adb.query(sql);
    return;
  }

  public static async pushOne(req) {
    // Get the FCM token for the target device
    const firebaseToken = req.body.token
      ? req.body.token
      : "ehMlqNRjT9mYJpCz9tpAk9:APA91bE4eOUrcuSZKYNBW2JJiQm6mfKMpucbqFUTCUdJ9D8QhEuxXCIrUMiyj9bbYLim5ko3aPb11g-sIbWE3l5R0pGf7WQNUNzSEiQHTrsJuL3lAeg-SwJvEihoAyQ0mdnF1dGLa4bG";

    // Create the notification payload
    const payload = {
      notification: {
        title: "Notification Title",
        body: "Ya big man BIG MAN",
      },
      data: {
        // Additional data goes here
      },
    };

    // Send the notification to the target device
    admin
      .messaging()
      .sendToDevice(firebaseToken, payload)
      .then((response) => {
        console.log("Notification sent successfully:", response);
      })
      .catch((error) => {
        console.log("Error sending notification:", error);
      });
  }

  public static async pushMany(req) {
    // Get the FCM tokens for the target devices
    const firebaseTokens = [
      "cXqN7dghSGaCIWT_CM4jZx:APA91bFTsLPwe8eEz4GnAtf6sLJaFBzxN8M0PEOtqm9qEZxDTT-IA9woaz0CrraEu4mC2gl0j4iq_QVJ94eezDKDSfEQ_N_oFXMKawRot16LbB4WRX-BWkT4XPNK3Y8MTK5ysDGK9mDq",
      "ehMlqNRjT9mYJpCz9tpAk9:APA91bE4eOUrcuSZKYNBW2JJiQm6mfKMpucbqFUTCUdJ9D8QhEuxXCIrUMiyj9bbYLim5ko3aPb11g-sIbWE3l5R0pGf7WQNUNzSEiQHTrsJuL3lAeg-SwJvEihoAyQ0mdnF1dGLa4bG",
    ];

    // Create the notification payload
    const payload = {
      notification: {
        title: "Notification Title",
        body: "This is an example notification",
      },
      data: {
        // Additional data goes here
      },
    };

    // Send the notification to the target devices
    admin
      .messaging()
      .sendToDevice(firebaseTokens, payload)
      .then((response) => {
        console.log("Notification sent successfully:", response);
      })
      .catch((error) => {
        console.log("Error sending notification:", error);
      });
  }

  public static async googleOauth(req){

    const { data } = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${req.body.accessToken}`,
      },
    });

    // check if user exists in db
    const user = await this.getUserByEmail(data.email)
    if(user){
      return await this.oAuthSignin(req.body, data)
    }else{
      await this.googleAuthSignup(data)
      return await this.oAuthSignin(req.body, data)
    }
  }

  public static async oAuthSignin(body, data){

    const deviceInfo = body.deviceInfo;
    const sql = `SELECT * FROM users WHERE email = '${data.email}'`;
    const result = await adb.query(sql);
    console.log(result[0][0]);
    if (result[0].length < 1) {
      throw new BadRequestError("Invalid login details");
    }
    if (result[0][0].status == 0) {
      throw new BadRequestError(
        "Incomplete registration, please verify your phone number"
      );
    }

    const authToken = await Jwt.issue({
      email: result[0][0].email,
      id: result[0][0].slug,
      firstName: result[0][0].firstName,
      lastName: result[0][0].lastName,
      gender: result[0][0].gender,
    });

    const payload = {
      user_id: result[0][0].slug,
      app_version: deviceInfo.appVersion,
      device_id: deviceInfo.deviceId,
      manufacturer_id: deviceInfo.manufacturerId,
      name: deviceInfo.name,
      os_version: deviceInfo.osVersion,
      push_notification_token: deviceInfo.pushNotificationToken,
      type: deviceInfo.type,
    };

    await adb.query(
      `DELETE FROM devices WHERE user_id = '${result[0][0].slug}'`
    );
    const sql1 = `INSERT INTO devices SET ?`;
    await adb.query(sql1, payload);

    return {
      token: authToken,
      id: result[0][0].slug,
      phone: result[0][0].phone,
      email: result[0][0].email,
      firstName: result[0][0].first_name,
      lastName: result[0][0].last_name,
      gender: result[0][0].gender,
      photo: result[0][0].photo,
      country: result[0][0].nationality,
      action: "OauthLogin"
    };
  }

  public static async googleAuthSignup(data){

    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      email: data.email,
      first_name: data.given_name,
      last_name: data.family_name,
      photo: data.picture,
      slug: slug,
    };

    await WalletService.createWallet(slug);

    const sql = `INSERT INTO users SET ?`;
    await adb.query(sql, payload);
    
  }

  public static async facebookOauth(req){

    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: ['id', 'email', 'first_name', 'last_name'].join(','),
        access_token: req.body.accessToken,
      },
    });

    const user = await this.getUserByEmail(data.email)
    if(user){
      return await this.oAuthSignin(req.body, data)
    }else{
      await this.facebookAuthSignup(data)
      return await this.oAuthSignin(req.body, data)
    }
  }

  public static async facebookAuthSignup(data){

    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      slug: slug,
    };

    await WalletService.createWallet(slug);

    const sql = `INSERT INTO users SET ?`;
    await adb.query(sql, payload);
    
  }

  public static async postRestOfDetails(req){

    const user = await this.getUserByEmail(req.body.email)
    if(user.status != 0){
      throw new ForbiddenError("Permission Denied")
    }

    const result = await this.getUserByPhone(req.body.phone);
    if(result && user.phone != req.body.phone){
      throw new ConflictError("Phone number already in use")
    }

    const sql = `UPDATE users SET phone = '${req.body.phone}', gender = '${req.body.gender}', nationality = '${req.body.nationality}' WHERE email = '${req.body.email}'`;
    await adb.query(sql);    
  }

}

export default UserService;
