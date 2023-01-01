const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");
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
import DriverService from "./driver.services";

const adb = ndb.promise();

class ComplaintService {
  public static async newComplaint(req, user) {

    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      slug: slug,
      anchor: user.id,
      counter: req.body.counter,
      trip_id: req.body.tripId,
      title: req.body.title,
      item_missing: req.body.itemMissing,
      value_of_item: req.body.valueOfItem,
      level_of_certainty: req.body.levelOfCertainty,
      body: req.body.body,
    };

    const sql = `INSERT INTO complaints SET ?`;
    await adb.query(sql, payload);


    for (let i = 0; i < req.files.length; i++) {
      const sql = `INSERT INTO complaint_images SET complaint_id = '${slug}', image_url = '${req.files[i].path}'`;
      await adb.query(sql);
    }

    return;
  }


  public static async getAll(req) {

    const skip: number = parseInt(req.query.offset as string) * 20 || 0;
    const sql = `SELECT * FROM complaints ORDER BY id DESC LIMIT 20 OFFSET ${skip}`;
    const result = await adb.query(sql);

    return result[0]
  }


  public static async getTrip(req) {

    const sql = `SELECT * FROM complaints WHERE trip_id = '${req.params.tripId}'`;
    const result = await adb.query(sql);

    const images = await adb.query(`SELECT image_url FROM complaint_images WHERE complaint_id = '${result[0][0].slug}'`);


    return {
      details: result[0],
      images: images[0]
    }
  }


  public static async close(req) {


    const sql = `UPDATE complaints SET status = 0 WHERE slug = '${req.params.id}'`;
    await adb.query(sql);

    return 
  }
}

export default ComplaintService;
