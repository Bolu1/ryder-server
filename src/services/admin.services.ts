const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");
import { generateString } from "../helpers/constants";
const fs = require("fs");
const ndb = require("../config/connect");
const { ROLE } = require("../utils/constants");
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
} from "../core/ApiError";
import Jwt from "../core/Jwt";

const adb = ndb.promise();

class AdminService {
  public static async newAdmin(body, user) {
    const { email, firstName, lastName, type, password } = body;

    console.log(user)
    console.log(ROLE)
    if(user.role !== ROLE.SUPER){
        throw new ForbiddenError("Unauthorized")
    }

    const result = await this.getAdminByEmail(email);
    if (result) {
      if (result.status == 0) {
        throw new BadRequestError("This account has been suspended");
      } else {
        throw new ConflictError("Email already in use");
      }
    }
    

    const slug = generateString(4, true, false);
    const hashedPassword = await bcrypt.hash(password, 12);
    //payload to the database
    const payload = {
      email: email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role: type,
      slug: slug,
    };

    const sql = `INSERT INTO admin SET ?`;
    await adb.query(sql, payload);
    return;
  }

  public static async getAdminByEmail(email) {
    const sql = `SELECT * FROM admin WHERE email = '${email}'`;
    const result = await adb.query(sql);
    return result[0][0];
  }

  public static async login(body) {
    const deviceInfo = body.deviceInfo;
    const sql = `SELECT * FROM admin WHERE email = '${body.email}'`;
    const result = await adb.query(sql);

    if (result[0][0]) {
      if (result[0][0].status == 0) {
        throw new BadRequestError("This account has been suspended");
      }
    } else {
      throw new BadRequestError("Invalid login details");
    }

    const valid = await bcrypt.compare(body.password, result[0][0].password);
    if (!valid) {
      throw new BadRequestError("Invalid login details");
    }
    const authToken = await Jwt.issue({
      email: result[0][0].email,
      id: result[0][0].slug,
      firstName: result[0][0].first_name,
      lastName: result[0][0].last_name,
      role: result[0][0].role,
    });

    return {
      token: authToken,
      id: result[0][0].slug,
      email: result[0][0].email,
      firstName: result[0][0].first_name,
      lastName: result[0][0].last_name,
      role: result[0][0].role
    };
  }

  public static async suspend(req, user) {

    if(user.role !== ROLE.SUPER){
      throw new ForbiddenError("Unauthorized")
  }

  await adb.query(
    `UPDATE admin SET status = 0 WHERE slug = '${req.params.id}'`
  );

    return 
  }

  public static async delete(req, user) {

    if(user.role !== ROLE.SUPER){
      throw new ForbiddenError("Unauthorized")
  }

  await adb.query(
    `DELETE FROM admin WHERE slug = '${req.params.id}'`
  );

    return 
  }


  public static async updateDetails(req, user) {
    const result = await this.getUserByEmail(user.email);

    const payload = {
      first_name: req.body.firstname  ? req.body.firstname : result[0].firstname,
      last_name: req.body.lastname ? req.body.lastname : result[0].lastname

    };

    const sql = `UPDATE admin SET ? WHERE slug= '${user.id}'`;
    await adb.query(sql, payload);
    return;
  }

  public static async updatePassword(req, user) {
    const result = await this.getUserByEmail(user.email);
    console.log(req.body.currentPassword)

    const valid = await bcrypt.compare(req.body.currentPassword, result.password);
    if (!valid) {
      throw new BadRequestError("Password is Invalid");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const sql = `UPDATE admin SET password = '${hashedPassword}' WHERE slug = '${user.id}'`;
    await adb.query(sql);
    return;
  }

  public static async getUserByEmail(email) {
    const sql = `SELECT * FROM admin WHERE email = '${email}'`;
    const result = await adb.query(sql);
    return result[0][0];
  }

  public static async getWithdrawalRequest(req) {
    const skip: number = parseInt(req.query.offset as string) * 20 || 0;
    // check if query exists if it does fetch non approved withdrawal request
    const inject = req.query.status == 1 ? `WHERE approved = 0` : ` `
    const sql = `SELECT * FROM withdrawal_requests ${inject} ORDER BY id DESC LIMIT 20 OFFSET ${skip}`;
    const result = await adb.query(sql);
    return result[0];
  }

  public static async editWithdrawalRequest(req) {
   
    const status = req.body.status == 1 ? 1 : 2

    const sql = `UPDATE withdrawal_requests SET approved = ${status} WHERE slug = '${req.body.id}'`;
    await adb.query(sql);
    return;
  }
}

export default AdminService;
