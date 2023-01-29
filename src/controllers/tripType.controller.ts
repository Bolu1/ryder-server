import express, { Request, Response } from "express";
import asyncHandler from "../middleware/async";
import TripsService from "../services/tripType.services";
const { validateParameters } = require("../utils/validateParameters");
import {
  BadRequestDataResponse,
  CreatedResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { BadRequestError } from "../core/ApiError";

exports.addTripType = asyncHandler(
  async (req: Request, res: Response) => {

    await TripsService.addTripType(req.body);
    return new CreatedResponse("Success", []).send(res);
  }
);
