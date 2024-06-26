const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");
import WalletService from "../services/wallet.services";
const { sendSms } = require("../utils/utils");
import { generateString } from "../helpers/constants";
const sharp = require("sharp");
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
import UserService from "./user.services";

const adb = ndb.promise();

class DriverService {
  public static async addUser(body) {
    const { gender, nationality, phone, firstName, lastName } = body;
    //payload to the database
    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      gender: gender.trim(),
      phone: phone.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      slug: slug,
    };

    // check if the phone number is used by a user
    const user = await UserService.getUserByPhone(phone);
    if (user) {
      throw new ConflictError("Phone number already in use");
    }

    // check if user exists
    const result = await this.getUserByPhone(phone);
    if (result) {
      if (result.status == 0) {
        const sql = `DELETE FROM otps WHERE phone = '${phone}'`;
        await adb.query(sql);

        const sql1 = `DELETE FROM drivers WHERE phone = '${phone}'`;
        await adb.query(sql1);
        return;
      }
      if (result.status == 1) {
        throw new BadRequestError("Incomplete registration, enter an email");
      }
      if (result.status == 2) {
        throw new BadRequestError("Incomplete registration, enter a password");
      }
      if (result.status == 3) {
        throw new BadRequestError("Incomplete registration, complete your KYC");
      }
      if (result.status == 4) {
        throw new BadRequestError(
          "Incomplete registration, KYC not yet approved"
        );
      } else {
        throw new ConflictError("Phone number already in use");
      }
    }

    await WalletService.createWallet(slug);

    const sql = `INSERT INTO drivers SET ?`;
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
      await adb.query(`UPDATE drivers SET status = 2 WHERE phone = '${phone}'`);
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
    await adb.query(`UPDATE drivers SET status = 2 WHERE phone = '${phone}'`);
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
      await adb.query(`UPDATE drivers SET status = 1 WHERE phone = '${phone}'`);
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
    await adb.query(`UPDATE drivers SET status = 1 WHERE phone = '${phone}'`);
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
      `UPDATE drivers SET password = '${hashedPassword}' WHERE phone = '${phone}'`
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
    const sql = `SELECT * FROM drivers WHERE email = '${email}'`;
    const result = await adb.query(sql);
    return result[0][0];
  }

  public static async getUserByPhone(phone) {
    const sql = `SELECT * FROM drivers WHERE phone = '${phone}'`;
    const result = await adb.query(sql);
    return result[0][0];
  }

  public static async login(body) {
    const deviceInfo = body.deviceInfo;
    const sql = `SELECT * FROM drivers WHERE email = '${body.login}' OR phone = '${body.login}'`;
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
    if (result[0][0].status == 3) {
      throw new BadRequestError(
        "Incomplete registration, please complete your KYC"
      );
    }
    if (result.status == 4) {
      throw new BadRequestError(
        "Incomplete registration, KYC not yet approved"
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
      phone: result[0][0].phone,
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
      country: result[0][0].nationality,
    };
  }

  public static async confirm(token: string, user) {
    const { email } = Jwt.verify(token);
    const sql = `UPDATE drivers SET confirmed = true WHERE email = '${email}'`;
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
    const sql = `UPDATE drivers SET password = '${hashedPassword}' WHERE email = '${email}'`;
    await adb.query(sql);
    return;
  }

  public static async getDrivers(query, user) {
    const skip: number = parseInt(query.offset as string) * 20 || 0;
    const search = query.search
      ? `WHERE firstName = ${query.search} OR lastName = ${query.search}`
      : " ";

    const sql = `SELECT * FROM drivers ${search} ORDER BY id DESC LIMIT 20 OFFSET ${skip}`;
    const result = adb.query(sql);
    return result[0];
  }

  public static async setPassword(body) {
    const user = adb.query(
      `SELECT * FROM drivers WHERE email = '${body.login}' OR phone = '${body.login}'`
    );

    // if (user.status != 2) {
    //   throw new ForbiddenError();
    // }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    const sql = `UPDATE drivers SET password = '${hashedPassword}', status = 3 WHERE phone = '${body.login}'  OR email = '${body.login}'`;
    await adb.query(sql);
    return;
  }

  public static async setEmail(body) {
    const user = await this.getUserByPhone(body.phone);

    // if (user.status != 1) {
    //   throw new ForbiddenError();
    // }
    const driver = await UserService.getUserByEmail(body.email)
    if (driver) {
      throw new ConflictError("Email already in use");
    }

    const result = await this.getUserByEmail(body.email);
    if (result) {
      throw new ConflictError("Email already in use");
    }

    const sql = `UPDATE drivers SET email = '${body.email}' WHERE phone = '${body.phone}'`;
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

    const sql = `UPDATE drivers SET photo = '${image}' WHERE phone = '${req.body.phone}'`;
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

    const sql = `UPDATE drivers SET ? WHERE slug= '${user.id}'`;
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
    const sql = `UPDATE drivers SET password = '${hashedPassword}' WHERE slug = '${user.id}'`;
    await adb.query(sql);
    return;
  }

  public static async deleteDriver(req, user) {
    const sql = `DELETE FROM users WHERE slug = '${user.id}'`;
    await adb.query(sql);
    return;
  }

  public static async createWithdrawalRequest(req, user) {
    // check if an unapprove withdrawal request exists if it doest delete it and add new
    await adb.query(
      `DELETE FROM withdrawal_requests WHERE user_id = '${user.id}' AND approved = 0`
    );

    // check driver's current balance
    const balance = await WalletService.getBalance(user.id);
    if (balance.balance < req.body.amount) {
      throw new BadRequestError("Insufficient Balance");
    }

    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      user_id: user.id,
      amount: req.body.amount,
      slug: slug,
    };

    const sql = `INSERT INTO withdrawal_requests SET ?`;
    const response = await adb.query(sql, payload);
  }

  public static async deleteWithdrawalRequest(req, user) {
    const sql = `DELETE FROM withdrawal_requests WHERE slug = '${req.params.id}' AND user_id = '${user.id}' AND approved = 0`;
    await adb.query(sql);
    return;
  }

  public static async getWithdrawalRequest(req, user) {
    const sql = `SELECT * FROM withdrawal_requests WHERE user_id = '${user.id}'`;
    const result = await adb.query(sql);
    return result[0];
  }

  public static async editPaymentDetails(req, user) {
    const payload = {
      bank_name: req.body.bankName,
      account_name: req.body.accountName,
      account_number: req.body.accountNumber,
      routing_number: req.body.routingNumber,
    };

    const sql = `UPDATE payment_details SET ? WHERE driver_phone = '${user.phone}'`;
    await adb.query(sql, payload);
  }

  public static async setRating(req, user) {
    
    const userInfo = await adb.query(`SELECT * FROM drivers WHERE slug = '${user.id}'`)

    console.log(req.body)
    console.log(userInfo[0][0])
    const top = userInfo[0][0].rating+req.body.rating
    const div = userInfo[0][0].number_of_ratings+1
    console.log(top, div)
    const newRating = top/div
    console.log(newRating)

    const sql = `UPDATE drivers 
    SET number_of_ratings = number_of_ratings + 1, rating = ${newRating}
    WHERE slug = '${user.id}'`;
    await adb.query(sql);
  }
}

export default DriverService;
