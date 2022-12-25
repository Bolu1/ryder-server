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
import DriverService from "../services/driver.services";


const adb = ndb.promise();

class KycService {
  
  public static async addCarDetails(req) {

    await adb.query(`DELETE FROM car_details WHERE phone = '${req.body.phone}'`)
    await adb.query(`DELETE FROM car_images WHERE driver_phone = '${req.body.phone}'`)


    const result = await DriverService.getUserByPhone(req.body.phone)
    if(result.kyc < 1){
      throw new ForbiddenError("Complete pervious step first")
    }

    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      phone: req.body.phone,
      manufacturer: req.body.manufacturer,
      model: req.body.model,
      year: req.body.year,
      colour: req.body.colour,
      driver_license: req.body.driver_license,
      slug: slug,
    };

    const sql = `INSERT INTO car_details SET ?`;
    await adb.query(sql, payload);

    console.log(req.files);
    for (let i = 0; i < req.files.length; i++) {
      const sql = `INSERT INTO car_images SET car_id = '${slug}', image_url = '${req.files[i].path}', driver_phone = '${req.body.phone}'`;
      await adb.query(sql);
    }

    // update user kyc 
    await adb.query(`UPDATE drivers SET kyc = 2 WHERE phone = '${req.body.phone}'`);

    return;
  }

  public static async addPersonalInformation(req) {

    //payload to the database
    const payload = {
      nationality: req.body.nationality,
      city: req.body.city,
      dob: req.body.dob,
      address: req.body.address,
      kyc: 1

    };

    const sql = `UPDATE drivers SET ? WHERE phone = '${req.body.phone}'`;
    await adb.query(sql, payload);

    return;
  }

  public static async setImage(req) {
    const result = await DriverService.getUserByPhone(req.body.phone);
    var image;
    if(!result){
      throw new BadRequestError("Image change not successful")
    }
   
    // if (result.status != 3) {
    //   throw new ForbiddenError();
    // }
    image = `static/${req.file.filename}`;
    if(result.photo != null){
      fs.unlinkSync(`./${result.photo}`);
    }

    const sql = `UPDATE drivers SET photo = '${image}' WHERE phone = '${req.body.phone}'`;
    await adb.query(sql);
    return;
  }

  public static async addPaymentDetails(req) {

    await adb.query(`DELETE FROM payment_details WHERE phone = '${req.body.phone}'`)

    const result = await DriverService.getUserByPhone(req.body.phone)
    // if(result.kyc < 5){
    //   throw new ForbiddenError("Complete pervious step first")
    // }

    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      bank_name: req.body.bankName,
      account_name: req.body.accountName,
      account_number: req.body.accountNumber,
      routing_number: req.body.routingNumber,
      phone: req.body.phone,
      slug: slug,
    };

    const sql = `INSERT INTO payment_details SET ?`;
    await adb.query(sql, payload);

    // update user kyc 
    await adb.query(`UPDATE drivers SET kyc = 6, status = 4 WHERE phone = '${req.body.phone}'`);

    return;
  }

  public static async getKycStatus(phone){

    const result = await DriverService.getUserByPhone(phone)
    return result.kyc
  }
  
}

export default KycService;
