import express, { Request, Response } from "express";
import { createUserInput } from "../schema/user.schema";
import asyncHandler from "../middleware/async";
import DriverService from "../services/driver.services";
const { validateParameters } = require("../utils/validateParameters");
import {
  BadRequestDataResponse,
  CreatedResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { BadRequestError } from "../core/ApiError";

exports.addUser = asyncHandler(
  async (req: Request<{}, {}, createUserInput["body"]>, res: Response) => {
    // validator
    const { isValid, messages } = validateParameters(
      [
        "firstName",
        "lastName",
        "email",
        "phone",
        "password",
        "photo",
        "gender",
      ],
      req.body
    );

    if (isValid) {
      throw new BadRequestError();
    }

    await DriverService.addUser(req.body);
    return new CreatedResponse("Success", []).send(res);
  }
);

exports.sendOtp = asyncHandler(
  async (req: Request<{}, {}, createUserInput["body"]>, res: Response) => {}
);

exports.login = asyncHandler(
  async (req: Request<{}, {}, createUserInput["body"]>, res: Response) => {
    const result = await DriverService.login(req.body);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.confirmation = asyncHandler(async (req: Request, res: Response) => {
  const result = await DriverService.confirm(req.body.token, res.locals.user);
  return new SuccessResponse("Success", result).send(res);
});

exports.forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await DriverService.forgotPassword(req.body, res.locals.user);
  return new SuccessResponse("Success", []).send(res);
});

exports.confirmPassword = asyncHandler(async (req: Request, res: Response) => {
  await DriverService.confirmPassword(req.body, res.locals.user);
  return new SuccessResponse("Success", []).send(res);
});

exports.getDrivers = asyncHandler(async (req: Request, res: Response) => {
  await DriverService.getDrivers(req.query, res.locals.user);
  return new SuccessResponse("Success", []).send(res);
});

exports.updateProfile = asyncHandler(async (req: Request, res: Response) => {
//   await DriverService.updateProfile(req.query, res.locals.user);
//   return new SuccessResponse("Success", []).send(res);
const file = req
console.log(req)
});

exports.uploadCarDetails = asyncHandler(async (req: Request, res: Response) => {
  const { isValid, messages } = validateParameters(
    [
      "manufacturer",
      "model",
      "year",
      "color",
      "plate",
      "photo",
    ],
    req.body
  );

  if (isValid) {
    throw new BadRequestError();
  }
  await DriverService.uploadCarDetails(req.body, res.locals.user);
  return new SuccessResponse("Success", []).send(res);
});