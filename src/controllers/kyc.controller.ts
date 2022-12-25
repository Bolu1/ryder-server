import express, { Request, Response } from "express";
import asyncHandler from "../middleware/async";
import KycService from "../services/kyc.services";
const { validateParameters } = require("../utils/validateParameters");
import {
  BadRequestDataResponse,
  CreatedResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { BadRequestError } from "../core/ApiError";


exports.addCarDetails = asyncHandler(async (req: Request, res: Response) => {
  await KycService.addCarDetails(req);
  return new CreatedResponse("Success", []).send(res);
});


exports.addPersonalInformation = asyncHandler(async (req: Request, res: Response) => {
  await KycService.addPersonalInformation(req);
  return new SuccessResponse("Success", []).send(res);
});

exports.setImage = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await KycService.setImage(req);
    return new SuccessResponse("Image has been set", []).send(res);
  }
);

exports.addPaymentDetails = asyncHandler(async (req: Request, res: Response) => {
  await KycService.addPaymentDetails(req);
  return new CreatedResponse("Success", []).send(res);
});

exports.getKycStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await KycService.getKycStatus(req.params.phone);
  return new CreatedResponse("Success", result).send(res);
});