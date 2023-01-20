import express, { Request, Response } from "express";
import { createUserInput } from "../schema/user.schema";
import asyncHandler from "../middleware/async";
import UserService from "../services/user.services";
const { validateParameters } = require("../utils/validateParameters");
import {
  BadRequestDataResponse,
  CreatedResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { BadRequestError } from "../core/ApiError";


exports.addUser = asyncHandler(
  async (req: Request, res: Response) => {
    // validator
    const { isValid, messages } = validateParameters(
      [
        "firstName",
        "lastName",
        "phone",
        "nationality",
        "gender",
      ],
      req.body
    );

    if (!isValid) {
      throw new BadRequestError();
    }

    await UserService.addUser(req.body);
    return new CreatedResponse("Account created", []).send(res);
  }
);

exports.verifyAuthSmsOTP = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await UserService.verifyAuthSmsOTP(req.body);
    return new SuccessResponse("OTP has been verified", []).send(res);
  }
);

exports.verifyAuthResetOTP = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await UserService.verifyAuthResetOTP(req.body);
    return new SuccessResponse("Password has been changed", []).send(res);
  }
);

exports.verifyEmailOTP = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await UserService.verifyEmailOTP(req.body);
    return new SuccessResponse("OTP has been verified", []).send(res);
  }
);

exports.resendEmailOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.resendEmailOTP(req.body);
    return new SuccessResponse("OTP has been sent", []).send(res);
  }
);

exports.resendSmsOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.resendSmsOTP(req.body);
    return new SuccessResponse("OTP has been sent", []).send(res);
  }
);

exports.setPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.setPassword(req.body);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.setEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.setEmail(req.body);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.login = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.login(req.body);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.confirmation = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.confirm(req.body.token, res.locals.user);
  return new SuccessResponse("Success", []).send(res);
});

exports.forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await UserService.forgotPassword(req, res.locals.user);
  return new SuccessResponse("Success", []).send(res);
});

exports.confirmPassword = asyncHandler(async (req: Request, res: Response) => {
  await UserService.confirmPassword(req.body, res.locals.user);
  return new SuccessResponse("Success", []).send(res);
});

exports.getUsers = asyncHandler(async (req: Request, res: Response) => {
  await UserService.getUsers(req.query, res.locals.user);
  return new SuccessResponse("Success", []).send(res);
});


exports.sendSmsOTP = asyncHandler(async (req: Request, res: Response) => {
    await UserService.sendSmsOTP(req.body);
    return new SuccessResponse("Success", []).send(res);
  });
  

exports.setImage = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.setImage(req);
    return new SuccessResponse("Image has been set", []).send(res);
  }
);

exports.getNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.getNotifications(req.query, res.locals.user);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.updateDetails = asyncHandler(
  async (req: Request, res: Response) => {
    await UserService.updateDetails(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);


exports.deleteUser = asyncHandler(
  async (req: Request, res: Response) => {
    await UserService.deleteUser(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.updatePassword = asyncHandler(
  async (req: Request, res: Response) => {
    await UserService.updatePassword(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.addFavoriteLocation = asyncHandler(
  async (req: Request, res: Response) => {
    await UserService.addFavoriteLocation(req, res.locals.user);
    return new CreatedResponse("Success", []).send(res);
  }
);


exports.getFavoriteLocation = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.getFavoriteLocation(req, res.locals.user);
    return new SuccessResponse("Success", result).send(res);
  }
);


exports.deleteFavoriteLocation = asyncHandler(
  async (req: Request, res: Response) => {
    await UserService.deleteFavoriteLocation(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.emergencyContacts = asyncHandler(
  async (req: Request, res: Response) => {
    await UserService.emergencyContacts(req, res.locals.user);
    return new CreatedResponse("Success", []).send(res);
  }
);

exports.getEmergencyContacts = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.getEmergencyContacts(req, res.locals.user);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.deleteEmergencyContacts = asyncHandler(
  async (req: Request, res: Response) => {
    await UserService.deleteEmergencyContacts(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);