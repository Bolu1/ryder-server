import express, { Request, Response } from "express";
import asyncHandler from "../middleware/async";
import TripsService from "../services/rideType.services";
const { validateParameters } = require("../utils/validateParameters");
import {
  BadRequestDataResponse,
  CreatedResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { BadRequestError } from "../core/ApiError";

exports.addRideType = asyncHandler(
  async (req: Request, res: Response) => {

    await TripsService.addRideType(req);
    return new CreatedResponse("Success", []).send(res);
  }
);

exports.getRideTypes = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await TripsService.getRideTypes(req.body);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.getRideType = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await TripsService.getRideType(req);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.editRideType = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await TripsService.editRideType(req);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.deleteRideType = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await TripsService.deleteRideType(req);
    return new SuccessResponse("Success", result).send(res);
  }
);