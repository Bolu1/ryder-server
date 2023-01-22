import express, { Request, Response } from "express";
import asyncHandler from "../middleware/async";
import WalletService from "../services/wallet.services";
const { validateParameters } = require("../utils/validateParameters");
import {
  BadRequestDataResponse,
  CreatedResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { BadRequestError } from "../core/ApiError";

exports.getBalance = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await WalletService.getBalance(res.locals.user.id);
    return new CreatedResponse("Success", result).send(res);
  }
);
