const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");
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

class TripsService {
  
  public static async getBalance(id) {

    const result = await adb.query(`SELECT balance FROM wallets WHERE user_id = '${id}'`);
    return result[0][0];
  }

  public static async createWallet(userId){

    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      user_id: userId,
      slug: slug
    };

    const sql = `INSERT INTO wallets SET ?`;
    await adb.query(sql, payload);
    return
  }

  public static async UpdateBalance(newBalance, slug){

    await adb.query(`UPDATE wallets SET balance = ${newBalance} WHERE user_id = '${slug}' `)
    return
  }
}

export default TripsService;