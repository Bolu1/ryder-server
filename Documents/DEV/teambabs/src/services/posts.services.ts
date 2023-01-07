const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");
import randomString from "../utils/randomString";
const multer = require("multer");
import sendEmail from "../utils/mailer";
import logger from "../utils/logger";
import activityLogger from "../helpers/logger";
import { generateString } from "../helpers/constants";
const fs = require("fs");
const ndb = require("../config/connect");
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../core/ApiError";
import Jwt from "../core/Jwt";

const adb = ndb.promise();

class PostService {
  public static async new(req) {
    console.log(req.file)
    const { title, content, category, image } = req.body;
    //payload to the database
    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      title: title,
      body: content,
      category: category,
      image: `/uploads/${req.file.originalname}`,
      slug: slug,
    };

    const sql = `INSERT INTO posts SET ?`;
    await adb.query(sql, payload);
    return;
  }

  public static async sendOtp(req) {}

  public static async getPosts(req) {

    const inject =
    req.query.search ? `AND title REGEXP '${req.query.search}' ` : " ";
    const skip: number = parseInt(req.query.offset as string) * 10 || 0;
    const sql = `
    SELECT * FROM posts ${inject} 
    ORDER BY id DESC LIMIT 10 OFFSET ${skip}
    `;
    const result = await adb.query(sql);
    return result[0];
  }

  public static async getPost(id) {

    const sql = `
    SELECT * FROM posts WHERE slug = '${id}'
    `;
    const result = await adb.query(sql);
    return result[0][0];
  }


  public static async getPostByCategory(name) {

    const sql = `
    SELECT * FROM posts WHERE category = '${name}'
    `;
    const result = await adb.query(sql);
    return result[0];
  }

  public static async deletePost(id) {


    const sql = `
    DELETE FROM posts WHERE slug = '${id}'
    `;
    const result = await adb.query(sql);
    return "User deleted";
  }


}

export default PostService;
