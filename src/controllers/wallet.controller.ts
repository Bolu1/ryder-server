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

    await WalletService.getBalance(res.locals.user);
    return new CreatedResponse("Success", []).send(res);
  }
);
