const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");
import randomString from "../utils/randomString";
const multer = require("multer");
import sendEmail from "../utils/mailer";
import logger from "../utils/logger";
import activityLogger from "../helpers/logger";
import { generateString } from "../helpers/constants";
const fs = require("fs");
const ndb = require("../config/connect");
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
} from "../core/ApiError";
import Jwt from "../core/Jwt";

const adb = ndb.promise();

class DriverService {
  public static async addUser(body) {
    const { email, name, phone, type, password, firstName, lastName } = body;
    //payload to the database
    const slug = generateString(4, true, false);
    const hashedPassword = await bcrypt.hash(password, 12);
    //payload to the database
    const payload = {
      email: email,
      password: hashedPassword,
      name: name,
      phone: phone,
      firstName: firstName,
      lastName: lastName,
      slug: slug,
      photo: "/static/profile/default.png",
      createdAt: Date.now()
    };

    // check if user exists
    const result = await this.getUserByEmail(email);
    if (result) {
      throw new ConflictError();
    }
    const sql = `INSERT INTO drivers SET ?`;
    await adb.query(sql, payload);
    const emailToken = await Jwt.issue({ email: email }, 1);
    const message = `https://vcb.vercel.app/verification/email/${emailToken}`;
    // await sendEmail({email:email, subject:"Email Verification", message:message})
    return emailToken;
  }

  public static async sendOtp(phone) {}

  public static async getUserByEmail(email) {
    const sql = `SELECT * FROM drivers WHERE email = '${email}'`;
    const result = await adb.query(sql);
    return result[0][0];
  }

  public static async login(body) {
    const sql = `SELECT * FROM drivers WHERE email = '${body.email}'`;
    const result = await adb.query(sql);
    if (!result[0][0]) {
      throw new BadRequestError();
    }
    const valid = await bcrypt.compare(body.password, result[0][0].password);
    if (!valid) {
      throw new BadRequestError();
    }
    const authToken = await Jwt.issue({
      email: result[0][0].email,
      id: result[0][0].id,
      firstName: result[0][0].firstName,
      lastName: result[0][0].lastName,
      gender: result[0][0].gender,
    });
    return {
      token: authToken,
      id: result[0][0].id,
      phone: result[0][0].phone,
      email: result[0][0].email,
      firstName: result[0][0].firstName,
      lastName: result[0][0].lastName,
      gender: result[0][0].gender,
      photo: result[0][0].photo,
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

  public static async forgotPassword(body, user) {
    const { email } = body;
    const sql = `SELECT * FROM drivers WHERE email = '${email}'`;
    const result = await adb.query(sql);
    const emailToken = Jwt.issue(email);
    const message = `https://vcb.vercel.app/verification/email/${emailToken}`;
    // await sendEmail({email:email, subject:"Email Verification", message:message})
    return;
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
    const result = adb.query(sql)
    return result[0]
  }

  public static async updateProfile(req, user) {
    const result = await this.getUserByEmail(user.email);
    var image;
    if (!req.file) {
      image = `/uploads/profile/${result.photo}`;
    } else {
      image = `/uploads/profile/${req.file.originalname}`;
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

    const sql = `UPDATE drivers SET ? WHERE email= '${user.email}'`;
    await adb.query(sql, payload);
    return;
  }

  public static async uploadCarDetails(req, user){

      
      //payload to the database
      const payload = {
        driverId: user.id,
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        year: req.body.year,
        color: req.body.color,
        plate: req.body.plate,
        photo: req.image,
        createdAt: Date.now()
      };
      // check if car details exists
      const result = await this.getUserCarDetails(user.id);
      if (result) {
        throw new ConflictError();
      }
      const sql = `INSERT INTO car SET ?`;
      await adb.query(sql, payload);
  }

  public static async getUserCarDetails(id){
    const sql = `SELECT * FROM car WHERE driverId = '${id}'`;
    const result = await adb.query(sql);
    return result[0][0];
  }

}

export default DriverService;
