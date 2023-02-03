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
import RideTypeService from "../services/rideType.services";
import WalletService from "../services/wallet.services";
const axios = require("axios");

const adb = ndb.promise();

class TripsService {
  public static async newTrip(req, user) {
    //payload to the database

    const { data } = await axios.get(
      `
      https://maps.googleapis.com/maps/api/directions/json?origin=${req.body.startLatitude},${req.body.startLongitude}&destination=${req.body.endLatitude},${req.body.endLongitude}&key=AIzaSyAoDFdAd4A4kr7KF7JqBuH09EFd9DllZ58`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );

    const rideType = await RideTypeService.getRidetypeBySlug(req.body.rideType);

    if (!rideType) {
      throw new BadRequestError("Ride type does not exist");
    }

    const distance = data.routes[0].legs[0].distance.value;
    const duration = data.routes[0].legs[0].distance.value;
    const fare = distance * rideType.cost_per_kilometer;

    // check if fare is greater than amount in wallet
    const balance = await WalletService.getBalance(
      user.id
    );
    if(balance < fare){
      throw new BadRequestError("Insufficent balance");
    }

    const slug = generateString(4, true, false);

    const payload = {
      user_id: user.id,
      start_longitude: req.body.startLongitude,
      end_longitude: req.body.endLongitude,
      start_latitude: req.body.startLatitude,
      end_latitude: req.body.endLatitude,
      start_location: req.body.startLocation,
      end_location: req.body.endLocation,
      duration: duration,
      distance: distance,
      fare: fare,
      ride_type: req.body.rideType,
      payment_type: req.body.paymentType,
      slug: slug,
    };

    const sql = `INSERT INTO trips SET ?`;
    await adb.query(sql, payload);
    return slug;
  }

  public static async driverAccept(req, user) {
    // check if trip has been accepted
    const trip = await this.getTripBySlug(req.params.id);

    if (!trip) {
      throw new BadRequestError("Trip does not exist");
    }

    if (trip.driver_id) {
      throw new BadRequestError("Trip is already in progress");
    }

    //payload to the database
    const slug = generateString(4, true, false);

    var timestamp = Date.now();
    console.log(timestamp);

    // Converting it back to human-readable date and time
    var d = new Date(timestamp);

    const payload = {
      driver_id: user.id,
      drivers_longitude: req.body.driversLongitude,
      drivers_latitude: req.body.driversLatitude,
      duration: req.body.duration,
      start_time: d,
      status: "Active",
    };

    const sql = `UPDATE trips SET ? WHERE slug='${req.params.id}'`;
    await adb.query(sql, payload);
    return slug;
  }

  public static async cancelTrip(req, user) {
    //payload to the database

    const payload = {
      status: "Canceled",
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
    return;
  }

  public static async getTripBySlug(id) {
    const result = await adb.query(`SELECT * FROM trips WHERE slug = '${id}'`);
    return result[0][0];
  }

  public static async getTripHistory(req, user) {
    const sql = `
    SELECT * FROM trips WHERE driver_id = '${user.id}' OR user_id = '${user.id}' ORDER BY id DESC LIMIT 30 
    `;
    const result = await adb.query(sql);
    return result[0];
  }

  public static async getOneTripHistory(req, user) {
    const sql = `
    SELECT t.*, driver.first_name, driver.last_name, driver.photo, driver.slug, driver.phone
      FROM trips t
      INNER JOIN drivers driver ON t.driver_id = driver.slug 
      WHERE t.slug = '${req.params.id}'
    `;
    const tripAndDriver = await adb.query(sql);

    const sql1 = `SELECT * FROM car_details WHERE driver_phone = '${tripAndDriver[0][0].phone}'`;
    const carDetails = await adb.query(sql1);
    const carImages = await adb.query(
      `SELECT image_url FROM car_images WHERE driver_phone = '${tripAndDriver[0][0].phone}'`
    );

    return {
      trip: tripAndDriver[0][0],
      carDetails: carDetails[0][0],
      carImages: carImages[0],
    };
  }

  public static async endTrip(req, user) {
    //payload to the database

    var timestamp = Date.now();
    console.log(timestamp);

    // Converting it back to human-readable date and time
    var d = new Date(timestamp);

    const payload = {
      status: "Completed",
      end_time: d
    };
    
    const trip = await this.getTripBySlug(req.params.id)

    var charge = trip.fare

    var date = new Date(d);
    var end_seconds = date.getTime() / 1000;
    
    var date1 = new Date(trip.start_time);
    var start_seconds = date1.getTime() / 1000;

    const totalSeconds = end_seconds - start_seconds;
    if(totalSeconds> trip.duration){

      const difference = totalSeconds - trip.duration
      const rideType = await RideTypeService.getRidetypeBySlug(trip.rideType)
      const waitTime = rideType.wait_time / 60
      const addOn = difference * waitTime
      console.log(addOn, "aww")
      charge = charge + addOn
    }

    console.log(charge)

    if(trip.paymentType == "CASH"){
      const sql = `UPDATE trips SET ? WHERE slug='${req.params.id}' AND driver_id='${user.id}'`;
      await adb.query(sql, payload);
      return charge
    }

    const balance = await WalletService.getBalance(
      user.id
    );

    const newBalance = balance.balance - charge
    console.log(balance, charge)
    console.log(newBalance)
    await WalletService.UpdateBalance(
      newBalance,
      user.id
    );

    const sql = `UPDATE trips SET ? WHERE slug='${req.params.id}' AND driver_id='${user.id}'`;
    await adb.query(sql, payload);

    return charge;
  }
}

export default TripsService;
