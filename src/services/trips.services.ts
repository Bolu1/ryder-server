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
  public static async newTrip(body) {
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

    const sql = `INSERT INTO drivers SET ?`;
    await adb.query(sql, payload);
    return
  }

}

export default TripsService;
