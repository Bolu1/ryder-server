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
  public static async addRideType(req) {
    //payload to the 
    const slug = generateString(4, true, false);
    
    const payload = {
      slug: slug,
      image: req.file.path,
      name: req.body.name,
      number_of_seat: req.body.numberOfSeat,
      description: req.body.description,
      wait_time: req.body.waitTime,
      cost_per_kilometer: req.body.costPerKilometer
    };

    const sql = `INSERT INTO ride_type SET ?`;
    await adb.query(sql, payload);
    return
  }

  public static async getRideTypes(body) {

    const sql = `SELECT * FROM ride_type`;
    const result = await adb.query(sql);
    return result[0]
  }

  public static async getRideType(req) {

    const sql = `SELECT * FROM ride_type WHERE slug = '${req.params.id}'`;
    const result = await adb.query(sql);
    return result[0][0]
  }

  public static async editRideType(req) {
    //fetch ryder by slug
    const result = await this.getRidetypeBySlug(req.params.id)
    
    const payload = {
      name: req.body.name? req.body.name: result.name,
      number_of_seat: req.body.numberOfSeat? req.body.numberOfSeat: result.number_of_seat,
      description: req.body.description ? req.body.description: result.description,
      wait_time: req.body.waitTime? req.body.waitTime: result.wait_time,
      cost_per_kilometer: req.body.costPerKilometer? req.body.costPerKilometer: result.cost_per_kilometer
    };

    const sql = `UPDATE ride_type SET ? WHERE slug='${req.params.id}'`;
    await adb.query(sql, payload);
    return
  }

  public static async getRidetypeBySlug(slug){
    const result = await adb.query(`SELECT * FROM ride_type WHERE slug = '${slug}'`)
    return result[0][0]
  }

  public static async deleteRideType(slug){
     await adb.query(`DELETE FROM ride_type WHERE slug = '${slug}'`)
    return
  }

}

export default TripsService;