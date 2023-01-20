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
  InternalError
} from "../core/ApiError";
import Jwt from "../core/Jwt";
const request = require("request")
const { initializePayment, verifyPayment } = require("../utils/payments")(
  request
);
import {
  CreatedResponse,
} from "../core/ApiResponse";

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

    initializePayment(form, (error, body)=>{
      if(error){
        console.log(error)
        throw new InternalError()
      }
      let response = JSON.parse(body)
      return new CreatedResponse("Success", response.data.authorization_url).send(res);
    })
  }

  public static async verifyPayment(req){

    const ref = req.query.reference;
    if(req.query.reference == null ){
      throw new BadRequestError("Refrence can not be empty")
    }
    console.log(req.query.reference)
    var newDonor;
    // res.send(ref)
    verifyPayment(ref, async (error, body) => {
      if (error) {
        //handle errors appropriately
        console.log(error);
        console.log("coul error");
        throw new InternalError()
      }


    let response = JSON.parse(body);
    return
  }
    )

}
}

export default PaymentService;