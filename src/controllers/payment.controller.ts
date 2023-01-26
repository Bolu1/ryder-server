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

exports.verifyPaystack = asyncHandler(
  async (req: Request, res: Response) => {

    await PaymentService.verifyPaystack(req, res);

  }
)

exports.verifyFlutterWave = asyncHandler(
  async (req: Request, res: Response) => {

    await PaymentService.verifyFlutterWave(req, res);

  }
)

