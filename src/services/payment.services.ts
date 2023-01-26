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
import { CreatedResponse } from "../core/ApiResponse";
const Flutterwave = require("flutterwave-node-v3");
const axios = require('axios')

const adb = ndb.promise();

class PaymentService {


  public static async verifyPaystack(req, res) {

      const ref = req.query.reference;
      if (req.query.reference == null) {
        res.status(500).json({
          status: false,
          message: "Reference can not be empty",
        });
      }
      var newDonor;
      // res.send(ref)
      try{
      const { data } = await axios.get(
        "https://api.paystack.co/transaction/verify/" +
          encodeURIComponent(ref),
        {
          headers: {
            Authorization:
            process.env.PSK_SECRET_KEY,
            'Content-Type': 'application/json',
            'Cache-Control': "no-cache"
          },
        },
      );
      console.log(data)

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
          user_email: data.data.customer.email,
          payment_channel: "paystack",
          reference: req.query.reference,
          slug: slug,
        };
        // create a receipt
        const sql = `INSERT INTO receipts SET ?`;
        await adb.query(sql, payload);

        // get user id by user phone
        const user = await adb.query(`SELECT * FROM users WHERE email = '${data.data.customer.email}'`)


        // get account balance the update
        const balance = await WalletService.getBalance(
          user[0][0].slug
        );
        const newBalance = balance.balance + data.data.amount / 100;

        await WalletService.UpdateBalance(
          newBalance,
          user[0][0].slug
        );
        return res.status(200).json({
          status: true,
          message: "Success",
          data: [],
        });

    }catch(error){
        console.log(error);
          console.log("coul error");
          return res.status(400).json({
            status: false,
            message: "Transaction wasn't procesed",
          });
    }

  }

  public static async verifyFlutterWave(req, res) {
    const flw = new Flutterwave(
      process.env.FLW_PUBLIC_KEY,
      process.env.FLW_SECRET_KEY
    );
    const response = await flw.Transaction.verify({ id: req.query.reference })

        if(!response.data){
          return res.status(400).json({
            status: false,
            message: "Transaction wasn't processed",
          });
        }
        if (response.data.status === "successful") {

      // check if reference has been processed
        const receipt = await adb.query(
          `SELECT * FROM receipts WHERE payment_channel = 'flutterwave' AND reference = '${req.query.reference}'`
        );
        if (receipt[0][0]) {
          return res.status(409).json({
            status: false,
            message: "transaction has already been processed",
          });
        }
        const slug = generateString(4, true, false);

        const payload = {
          user_email: response.data.customer.email,
          payment_channel: "flutterwave",
          reference: req.query.reference,
          slug: slug,
        };
        // create a receipt
        const sql = `INSERT INTO receipts SET ?`;
        await adb.query(sql, payload);

        // get user id by user phone
        const user = await adb.query(`SELECT * FROM users WHERE email = '${response.data.customer.email}'`)


        // get account balance the update
        const balance = await WalletService.getBalance(
          user[0][0].slug
        );
        const newBalance = balance.balance + response.data.amount_settled

        await WalletService.UpdateBalance(
          newBalance,
          user[0][0].slug
        );
        return res.status(200).json({
          status: true,
          message: "Success",
          data: [],
        });


        } else {
          return res.status(400).json({
            status: false,
            message: "Transaction wasn't processed",
          });
        }
  }
}

export default PaymentService;
