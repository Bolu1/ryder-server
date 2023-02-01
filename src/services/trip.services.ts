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
import KycService from "../services/kyc.services";
const haversine = require('haversine-distance')


const adb = ndb.promise();

class TripsService {
  public static async newTrip(req, user) {
    //payload to the database
    const slug = generateString(4, true, false);
    const a = { latitude: req.body.startLatitude, longitude: req.body.startLongitude }
    const b = { latitude: req.body.endLatitude, longitude: req.body.endLongitude }
    
    const meter = haversine(a, b) 
    console.log(meter * 0.001) 


    // const payload = {
    //   user_id: user.id,
    //   start_longitude: req.body.startLongitude,
    //   end_longitude: req.body.endLongitude,
    //   start_latitude: req.body.startLatitude,
    //   end_latitude: req.body.endLatitude,
    //   start_location: req.body.startLocation,
    //   end_location: req.body.endLocation,
    //   duration: req.body.duration,
    //   fare: req.body.fare,
    //   slug: slug,
    // };

    // const sql = `INSERT INTO trips SET ?`;
    // await adb.query(sql, payload);
    // return slug
  }

  public static async driverAccept(req, user) {
    // check if trip has been accepted
    const trip = await this.getTripBySlug(req.params.id)

    if(!trip){
      throw new BadRequestError("Trip does not exist")
    }

    if(trip.driver_id){
      throw new BadRequestError("Trip is already in progress")
    }

    //payload to the database
    const slug = generateString(4, true, false);

    const payload = {
      driver_id: user.id,
      drivers_longitude: req.body.driversLongitude,
      drivers_latitude: req.body.driversLatitude,
      duration: req.body.duration,
      status: "Active"
    };

    const sql = `UPDATE trips SET ? WHERE slug='${req.params.id}'`;
    await adb.query(sql, payload);
    return slug
  }

  public static async cancelTrip(req, user) {
    //payload to the database

    const payload = {
      status: "Canceled"
    };

    const sql = `UPDATE trips SET ? WHERE slug='${req.params.id}'`;
    await adb.query(sql, payload);

    // create new reason
    const slug = generateString(4, true, false);

    const payload1 = {
      user_id: user.id,
      trip_id: req.params.id,
      reason: req.body.reason,
      slug: slug,
    };

    const sql1 = `INSERT INTO cancel_reasons SET ?`;
    await adb.query(sql1, payload1);
    return
  }

  public static async getTripBySlug(id){

    const result = await adb.query(`SELECT * FROM trips WHERE slug = '${id}'`)
    return result[0][0]
  }

  public static async getTripHistory(req, user){
    
    const sql = `
    SELECT * FROM trips WHERE driver_id = '${user.id}' OR user_id = '${user.id}' ORDER BY id DESC LIMIT 30 
    `
    const result = await adb.query(sql)
    return result[0]
  }

  public static async getOneTripHistory(req, user){
    
    const sql = `
    SELECT t.*, driver.first_name, driver.last_name, driver.photo, driver.slug, driver.phone
      FROM trips t
      INNER JOIN drivers driver ON t.driver_id = driver.slug 
      WHERE t.slug = '${req.params.id}'
    `
    const tripAndDriver = await adb.query(sql)

    const sql1 = `SELECT * FROM car_details WHERE driver_phone = '${tripAndDriver[0][0].phone}'`;
    const carDetails = await adb.query(sql1);
    const carImages = await adb.query(
      `SELECT image_url FROM car_images WHERE driver_phone = '${tripAndDriver[0][0].phone}'`
    );

    return {
      trip: tripAndDriver[0][0],
      carDetails: carDetails[0][0],
      carImages: carImages[0]

    }
  }

}

export default TripsService;