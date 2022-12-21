const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");
const { sendSms } = require("../utils/utils");
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
import Jwt from "../core/Jwt";

const adb = ndb.promise();

class UserService {
  public static async addUser(body) {
    const { gender, nationality, phone, firstName, lastName } = body;
    //payload to the database
    const slug = generateString(4, true, false);
    // const hashedPassword = await bcrypt.hash(password, 12);
    //payload to the database
    const payload = {
      gender: gender.trim(),
      nationality: nationality.trim(),
      phone: phone.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      slug: slug,
    };

    // check if user exists
    const result = await this.getUserByPhone(phone);
    if (result) {
      if (result.status == 0) {
        const sql = `DELETE FROM otps WHERE phone = '${phone}'`;
        await adb.query(sql);

        const sql1 = `DELETE FROM users WHERE phone = '${phone}'`;
        await adb.query(sql1);
        return
      }
      if (result.status == 1) {
        throw new BadRequestError("Incomplete registration, enter email");
      }
      if (result.status == 2) {
        throw new BadRequestError("Incomplete registration, enter password");
      } else {
        throw new ConflictError("Phone number already in use");
      }
    }
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
    await adb.query(`UPDATE users SET status = 3 WHERE phone = '${phone}'`);
    const sql1 = `DELETE FROM otps WHERE phone = '${phone}'`;
    await adb.query(sql1);
    return;
  }

  public static async verifyAuthSmsOTP(body) {
    const { phone, otp } = body;
    if (!phone || !otp) {
      throw new BadRequestError("Empty otp details are not allowed");
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

  public static async verifyAuthResetOTP(body) {
    const { phone, otp, password } = body;
    if (!phone || !otp) {
      throw new BadRequestError("Empty otp details are not allowed");
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
    const deviceInfo = body.deviceInfo
    const sql = `SELECT * FROM users WHERE email = '${body.login}' OR phone = '${body.login}'`;
    const result = await adb.query(sql);
    console.log(result[0][0])
    if(result[0][0].length < 1){
      throw new BadRequestError("Invalid login details");
    }
    if (result[0][0].password == null) {
      throw new BadRequestError("Please complete your registration");
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

    await adb.query(`DELETE FROM devices WHERE user_id = '${result[0][0].slug}'`);
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
      photo: "https://ryder-server.onrender.com/"+result[0][0].photo,
      country: result[0][0].nationality
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
    const user = await this.getUserByPhone(body.phone);

    // if (user.status != 2) {
    //   throw new ForbiddenError();
    // }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    const sql = `UPDATE users SET password = '${hashedPassword}', status = 3 WHERE phone = '${body.phone}'`;
    await adb.query(sql);
    return;
  }

  public static async setEmail(body) {
    const user = await this.getUserByPhone(body.phone);

    // if (user.status != 1) {
    //   throw new ForbiddenError();
    // }

    const sql = `UPDATE users SET email = '${body.email}' WHERE phone = '${body.phone}'`;
    await adb.query(sql);
    // sendOtpVerificationEmail(body.email, body.phone);
    return;
  }

  public static async sendSmsOTP(body) {
    sendSms("This is your OTP 23236");
  }

  public static async setImage(req) {
    const result = await this.getUserByPhone(req.body.phone);
    var image;
    if(!result){
      throw new BadRequestError("Image change not successful")
    }
    console.log(result)
    console.log(req.file)
   
    // if (result.status != 3) {
    //   throw new ForbiddenError();
    // }
    if (!req.file) {
      image = `static/${result.photo}`;
    } else {
      image = `static/${req.file.originalname}`;
      if (image != result.photo && result.photo) {
        fs.unlinkSync(`.${result.photo}`);
      }
    }

    const sql = `UPDATE users SET photo = '${image}' WHERE phone = '${req.body.phone}'`;
    await adb.query(sql);
    return;
  }
}

export default UserService;
