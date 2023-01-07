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

class AdminService {
  public static async addUser(body) {
    const { email, name, password, } = body;
    //payload to the database
    const slug = generateString(4, true, false);
    const hashedPassword = await bcrypt.hash(password, 12);
    //payload to the database
    const payload = {
      email: email,
      password: hashedPassword,
      name: name,
      slug: slug
    };

    // check if user exists
    const result = await this.getUserByEmail(email);
    if (result) {
      throw new ConflictError();
    }
    const sql = `INSERT INTO admins SET ?`;
    await adb.query(sql, payload);
    return ;
  }

  public static async sendOtp(phone) {}

  public static async getUserByEmail(email) {
    const sql = `SELECT * FROM admins WHERE email = '${email}'`;
    const result = await adb.query(sql);
    return result[0][0];
  }

  public static async login(body) {
    const sql = `SELECT * FROM admins WHERE email = '${body.email}'`;
    const result = await adb.query(sql);
    if (!result[0][0]) {
      throw new BadRequestError();
    }
    const valid = await bcrypt.compare(body.password, result[0][0].password);
    if (!valid) {
      throw new BadRequestError();
    }
    const authToken = await Jwt.issue({
      id: result[0][0].slug,
      name: result[0][0].name,
      email: result[0][0].email,

    });
    return {
      token: authToken,
      id: result[0][0].slug,
      name: result[0][0].name,
      email: result[0][0].email,

    };
  }


  public static async getAdmins(query, user) {
    const skip: number = parseInt(query.offset as string) * 20 || 0;
    const search = query.search
      ? `WHERE firstName = ${query.search} OR lastName = ${query.search}`
      : " ";

    const sql = `SELECT name, email, slug FROM admins ${search} ORDER BY id DESC LIMIT 20 OFFSET ${skip}`;
    const result = await adb.query(sql)
    return result[0]
  }


  public static async deleteAdmin(params, user) {

    const sql = `DELETE FROM admins WHERE slug = '${params.slug}'`;
    const result = await adb.query(sql)
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

    const sql = `UPDATE admins SET ? WHERE email= '${user.email}'`;
    await adb.query(sql, payload);
    return;
  }

}

export default AdminService;
