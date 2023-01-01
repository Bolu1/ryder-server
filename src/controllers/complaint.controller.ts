import express, { Request, Response } from "express";
import asyncHandler from "../middleware/async";
import ComplaintService from "../services/complaint.services";
const { validateParameters } = require("../utils/validateParameters");
import {
  BadRequestDataResponse,
  CreatedResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { BadRequestError } from "../core/ApiError";

exports.newComplaint = asyncHandler(
  async (req: Request, res: Response) => {

    await ComplaintService.newComplaint(req, res.locals.user);
    return new CreatedResponse("Success", []).send(res);
  }
);

exports.getAll = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await ComplaintService.getAll(req);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.getTrip = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await ComplaintService.getTrip(req);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.close = asyncHandler(
  async (req: Request, res: Response) => {

     await ComplaintService.close(req);
    return new SuccessResponse("Success", []).send(res);
  }
);
