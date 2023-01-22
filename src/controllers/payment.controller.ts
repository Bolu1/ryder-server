import express, { Request, Response } from "express";
import asyncHandler from "../middleware/async";
import PaymentService from "../services/payment.services";
const { validateParameters } = require("../utils/validateParameters");
import {
  BadRequestDataResponse,
  CreatedResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { BadRequestError } from "../core/ApiError";

exports.initPaystack = asyncHandler(
  async (req: Request, res: Response) => {

    await PaymentService.initPaystack(req.body, res, res.locals.user);
  }
);

exports.verifyPaystack = asyncHandler(
  async (req: Request, res: Response) => {

    await PaymentService.verifyPayment(req, res);

  }
)
