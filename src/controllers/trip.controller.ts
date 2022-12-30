import express, { Request, Response } from "express";
import asyncHandler from "../middleware/async";
import TripsService from "../services/trips.services";
const { validateParameters } = require("../utils/validateParameters");
import {
  BadRequestDataResponse,
  CreatedResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { BadRequestError } from "../core/ApiError";

exports.newTrip = asyncHandler(
  async (req: Request, res: Response) => {
    // validator
    const { isValid, messages } = validateParameters(
      [
        "startLocation",
        "startCoordinate",
        "endCoordinate",
        "endLocation",
      ],
      req.body
    );

    if (isValid) {
      throw new BadRequestError();
    }

    await TripsService.newTrip(req.body);
    return new CreatedResponse("Success", []).send(res);
  }
);
