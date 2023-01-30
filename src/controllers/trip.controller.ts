import express, { Request, Response } from "express";
import asyncHandler from "../middleware/async";
import TripsService from "../services/trip.services";
const { validateParameters } = require("../utils/validateParameters");
import {
  BadRequestDataResponse,
  CreatedResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { BadRequestError } from "../core/ApiError";

exports.newTrip = asyncHandler(
  async (req: Request, res: Response) => {

    const slug = await TripsService.newTrip(req, res.locals.user);
    return new CreatedResponse("Success", slug).send(res);
  }
);

exports.driverAccept = asyncHandler(
  async (req: Request, res: Response) => {

    await TripsService.driverAccept(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.cancelTrip = asyncHandler(
  async (req: Request, res: Response) => {

    await TripsService.cancelTrip(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.getTripHistory = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await TripsService.getTripHistory(req, res.locals.user);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.getOneTripHistory = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await TripsService.getOneTripHistory(req, res.locals.user);
    return new SuccessResponse("Success", result).send(res);
  }
);