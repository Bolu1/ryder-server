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

class QuizService {
  public static async new(req) {
    const { subject, question, option1, option2, option3, option4, answer } = req.body;
    //payload to the database
    const slug = generateString(4, true, false);
    //payload to the database
    const payload = {
      subject: subject,
      question: question,
      answer: answer,
      1: option1,
      2: option2,
      3: option3,
      4: option4,
      slug: slug
    };

    const sql = `INSERT INTO questions SET ?`;
    await adb.query(sql, payload);
    return;
  }

  public static async getQuestions(req) {

    const skip: number = parseInt(req.query.offset as string) * 10 || 0;
    const sql = `
    SELECT * FROM questions 
    WHERE subject = '${req.params.category}' 
    ORDER BY RAND() LIMIT 10 OFFSET ${skip}
    `;
    const result = await adb.query(sql);
    return result[0];
  }

  public static async getQuestion(id) {

    const sql = `
    SELECT * FROM questions WHERE slug = '${id}'
    `;
    const result = await adb.query(sql);
    return result[0][0];
  }


  public static async deleteQuestion(id) {


    const sql = `
    DELETE FROM questions WHERE slug = '${id}'
    `;
    await adb.query(sql);
    return "User deleted";
  }


}

export default QuizService;
