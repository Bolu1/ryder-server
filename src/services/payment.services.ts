const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");
import { generateString } from "../helpers/constants";
const fs = require("fs");
import WalletService from "../services/wallet.services";
const ndb = require("../config/connect");
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalError,
} from "../core/ApiError";
import Jwt from "../core/Jwt";
const request = require("request");
const { initializePayment, verifyPayment } =
  require("../utils/payments")(request);
import { CreatedResponse } from "../core/ApiResponse";

const adb = ndb.promise();

class PaymentService {
  public static async initPaystack(body, res, user) {
    const form = {
      amount: body.amount,
      email: user.email,
      metadata: {
        user_id: user.id,
      },
    };

    form.amount *= 100;

    initializePayment(form, (error, body) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          status: false,
          message: "Something went wrong",
        });
      }
      let response = JSON.parse(body);
      return new CreatedResponse(
        "Success",
        response.data.authorization_url
      ).send(res);
    });
  }

  public static async verifyPayment(req, res) {
    try{
    const ref = req.query.reference;
    if (req.query.reference == null) {
      res.status(500).json({
        status: false,
        message: "Reference can not be empty",
      });
    }
    var newDonor;
    // res.send(ref)
    verifyPayment(ref, async (error, body) => {
      if (error) {
        //handle errors appropriately
        console.log(error);
        console.log("coul error");
        return res.status(500).json({
          status: false,
          message: "Something went wrong",
        });
      }

      let response = JSON.parse(body);

      // check if reference has been processed
      const receipt = await adb.query(
        `SELECT * FROM receipts WHERE payment_channel = 'paystack' AND reference = '${req.query.reference}'`
      );
      if (receipt[0][0]) {
        return res.status(409).json({
          status: false,
          message: "transaction has already been processed",
        });
      }

      const slug = generateString(4, true, false);

      const payload = {
        user_id: response.data.metadata.user_id,
        payment_channel: "paystack",
        reference: req.query.reference,
        slug: slug,
      };
      // create a receipt
      const sql = `INSERT INTO receipts SET ?`;
      await adb.query(sql, payload);

      // get account balance the update
      const balance = await WalletService.getBalance(
        response.data.metadata.user_id
      );
      const newBalance = balance.balance + response.data.amount / 100;
      await WalletService.UpdateBalance(
        newBalance,
        response.data.metadata.user_id
      );
      return  res.status(200).json({
        status: true,
        message: "Success",
        data:[]
      });;
    });
  }catch(error){
    console.log(error)
    res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
  }
}

export default PaymentService;
