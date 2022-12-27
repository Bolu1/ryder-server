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
    await adb.query(
      `DELETE FROM car_details WHERE driver_phone = '${req.body.phone}'`
    );
    await adb.query(
      `DELETE FROM car_images WHERE driver_phone = '${req.body.phone}'`
    );

    const result = await DriverService.getUserByPhone(req.body.phone);
    if (result.kyc < 1) {
      throw new ForbiddenError("Complete pervious step first");
    }

    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      driver_phone: req.body.phone,
      manufacturer: req.body.manufacturer,
      model: req.body.model,
      year: req.body.year,
      colour: req.body.colour,
      driver_license: req.body.driver_license,
      slug: slug,
    };

    const sql = `INSERT INTO car_details SET ?`;
    await adb.query(sql, payload);

    for (let i = 0; i < req.files.length; i++) {
      const sql = `INSERT INTO car_images SET car_id = '${slug}', image_url = '${req.files[i].path}', driver_phone = '${req.body.phone}'`;
      await adb.query(sql);
    }

    // update user kyc
    await adb.query(
      `UPDATE drivers SET kyc = 2 WHERE phone = '${req.body.phone}'`
    );

    return;
  }

  public static async addPersonalInformation(req) {
    //payload to the database
    const payload = {
      nationality: req.body.nationality,
      city: req.body.city,
      dob: req.body.dob,
      address: req.body.address,
      kyc: 1,
    };

    const sql = `UPDATE drivers SET ? WHERE phone = '${req.body.phone}'`;
    await adb.query(sql, payload);

    return;
  }

  public static async setImage(req) {
    const result = await DriverService.getUserByPhone(req.body.phone);
    var image;
    if (!result) {
      throw new BadRequestError("Image change not successful");
    }

    // if (result.status != 3) {
    //   throw new ForbiddenError();
    // }
    image = `static/${req.file.filename}`;
    if (result.photo != null) {
      fs.unlinkSync(`./${result.photo}`);
    }

    const sql = `UPDATE drivers SET photo = '${image}' WHERE phone = '${req.body.phone}'`;
    await adb.query(sql);

    await adb.query(
      `UPDATE drivers SET kyc = 6, status = 4 WHERE phone = '${req.body.phone}'`
    );
    return;
  }

  public static async addPaymentDetails(req) {
    await adb.query(
      `DELETE FROM payment_details WHERE driver_phone = '${req.body.phone}'`
    );

    const result = await DriverService.getUserByPhone(req.body.phone);
    // if(result.kyc < 4){
    //   throw new ForbiddenError("Complete pervious step first")
    // }

    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      bank_name: req.body.bankName,
      account_name: req.body.accountName,
      account_number: req.body.accountNumber,
      routing_number: req.body.routingNumber,
      driver_phone: req.body.phone,
      slug: slug,
    };

    const sql = `INSERT INTO payment_details SET ?`;
    await adb.query(sql, payload);

    // update user kyc
    await adb.query(
      `UPDATE drivers SET kyc = 5, status = 4 WHERE phone = '${req.body.phone}'`
    );

    return;
  }

  public static async getKycStatus(phone) {
    const carDetails = await adb.query(`SELECT status FROM car_details WHERE driver_phone = '${phone}'`)
    const driverDocuments = await adb.query(`SELECT status FROM driver_documents WHERE driver_phone = '${phone}'`)
    const drivingHistory = await adb.query(`SELECT status FROM driving_history WHERE driver_phone = '${phone}'`)
    const paymentDetails = await adb.query(`SELECT status FROM payment_details WHERE driver_phone = '${phone}'`)
    const userInfo = await adb.query(`SELECT info_approved, image_approved FROM drivers WHERE phone = '${phone}'`)

    const response = {
      carDetails: carDetails[0][0] ? carDetails[0][0].status : 0,
      driverDocuments : driverDocuments[0][0] ? driverDocuments[0][0].status : 0,
      drivingHistory : drivingHistory[0][0] ? drivingHistory[0][0].status : 0,
      paymentDetails : paymentDetails[0][0] ? paymentDetails[0][0].status : 0,
      personalInfo : userInfo[0][0].info_approved,
      image: userInfo[0][0].image_approved
    }

    console.log(carDetails[0][0])
    return response
   
  }

  public static async uploadDocument(req) {
    const result = await DriverService.getUserByPhone(req.body.phone);

    if (result.kyc < 2) {
      throw new ForbiddenError("Complete pervious step first");
    }

    // get and delete all images
    var sql1 = `SELECT * FROM driver_documents WHERE driver_phone = '${req.body.phone}'  AND file_type = "${req.body.type}"`

    const driver_doc = await adb.query(
      sql1
    );
    if (driver_doc[0].length > 0) {
      await adb.query(
        `DELETE FROM driver_documents WHERE driver_phone = '${req.body.phone}' AND file_type = "${req.body.type}"`
      );
      fs.unlinkSync(`./${driver_doc[0][0].file_url}`);
    }

    const slug = generateString(4, true, false);
    const payload = {
      file_url: req.file.path,
      file_type: req.body.type,
      driver_phone: req.body.phone,
      slug: slug
    };

    const sql = `INSERT INTO driver_documents SET ?`;
    await adb.query(sql, payload);

    // update user kyc
    await adb.query(
      `UPDATE drivers SET kyc = 3 WHERE phone = '${req.body.phone}'`
    );

    return "https://ryder-server.onrender.com/"+req.file.path
  }

  public static async drivingHistory(body){

    const result = await DriverService.getUserByPhone(body.phone);

    if (result.kyc < 3) {
      throw new ForbiddenError("Complete pervious step first");
    }

    await adb.query(
      `DELETE FROM driving_history WHERE driver_phone = '${body.phone}'`
    );

    const slug = generateString(4, true, false);
    const payload = {
      driving_length: body.drivingLength,
      been_in_accident: body.beenInAccident,
      been_arrested: body.beenArrested,
      driver_phone: body.phone,
      slug: slug
    };

    const sql = `INSERT INTO driving_history SET ?`;
    await adb.query(sql, payload);

    await adb.query(
      `UPDATE drivers SET kyc = 4 WHERE phone = '${body.phone}'`
    );



  }
}

export default KycService;
