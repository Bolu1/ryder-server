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
  public static async addTripType(body) {
    //payload to the database
    const payload = {
      
    };

    const sql = `INSERT INTO tripType SET ?`;
    await adb.query(sql, payload);
    return
  }

}

export default TripsService;