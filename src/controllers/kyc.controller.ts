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
  return new SuccessResponse("Success", result).send(res);
});

exports.uploadDocument = asyncHandler(async (req: Request, res: Response) => {
  const result = await KycService.uploadDocument(req);
  return new CreatedResponse("Success", result).send(res);
});

exports.drivingHistory = asyncHandler(async (req: Request, res: Response) => {
  await KycService.drivingHistory(req.body);
  return new CreatedResponse("Success", []).send(res);
});

// admin controllers

exports.getCarDetails = asyncHandler(async (req: Request, res: Response) => {
  const result = await KycService.getCarDetails(req);
  return new SuccessResponse("Success", result).send(res);
});

exports.getPersonalInformation = asyncHandler(async (req: Request, res: Response) => {
  const result = await KycService.getPersonalInformation(req);
  return new SuccessResponse("Success", result).send(res);
});

exports.getPaymentDetails = asyncHandler(async (req: Request, res: Response) => {
  const result = await KycService.getPaymentDetails(req);
  return new SuccessResponse("Success", result).send(res);
});

exports.getUploadedDocument = asyncHandler(async (req: Request, res: Response) => {
  const result = await KycService.getUploadedDocument(req);
  return new SuccessResponse("Success", result).send(res);
});

exports.getDrivingHistory = asyncHandler(async (req: Request, res: Response) => {
  const result = await KycService.getDrivingHistory(req);
  return new SuccessResponse("Success", result).send(res);
});

// admin action controllers

exports.editPersonalInformation = asyncHandler(async (req: Request, res: Response) => {
  await KycService.editPersonalInformation(req);
  return new SuccessResponse("Success", []).send(res);
});

exports.editCarDetails = asyncHandler(async (req: Request, res: Response) => {
  await KycService.editCarDetails(req);
  return new SuccessResponse("Success", []).send(res);
});


exports.photoAction = asyncHandler(async (req: Request, res: Response) => {
  await KycService.photoAction(req);
  return new SuccessResponse("Success", []).send(res);
});

exports.paymentDetailsAction = asyncHandler(async (req: Request, res: Response) => {
  await KycService.paymentDetailsAction(req);
  return new SuccessResponse("Success", []).send(res);
});

exports.uploadedDocumentsAction = asyncHandler(async (req: Request, res: Response) => {
  await KycService.uploadedDocumentsAction(req);
  return new SuccessResponse("Success", []).send(res);
});

exports.drivingHistoryAction = asyncHandler(async (req: Request, res: Response) => {
  await KycService.drivingHistoryAction(req);
  return new SuccessResponse("Success", []).send(res);
});

exports.approveUser = asyncHandler(async (req: Request, res: Response) => {
  await KycService.approveUser(req);
  return new SuccessResponse("Success", []).send(res);
});