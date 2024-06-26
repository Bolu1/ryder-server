import express, { Request, Response } from "express";
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
  async (req: Request, res: Response) => {
    // validator
    const { isValid, messages } = validateParameters(
      [
        "firstName",
        "lastName",
        "phone",
        "gender"
      ],
      req.body
    );

    if (!isValid) {
      throw new BadRequestError();
    }

    await DriverService.addUser(req.body);
    return new CreatedResponse("Account created", []).send(res);
  }
);

exports.verifyAuthSmsOTP = asyncHandler(
  async (req: Request, res: Response) => {
    
    const result = await DriverService.verifyAuthSmsOTP(req.body);
    return new SuccessResponse("OTP has been verified", []).send(res);
  }
);

exports.verifyAuthResetOTP = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await DriverService.verifyAuthResetOTP(req.body);
    return new SuccessResponse("Password has been changed", result).send(res);
  }
);

exports.verifyEmailOTP = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await DriverService.verifyEmailOTP(req.body);
    return new SuccessResponse("OTP has been verified", []).send(res);
  }
);

exports.resendEmailOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await DriverService.resendEmailOTP(req.body);
    return new SuccessResponse("OTP has been sent", []).send(res);
  }
);

exports.resendSmsOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await DriverService.resendSmsOTP(req.body);
    return new SuccessResponse("OTP has been sent", []).send(res);
  }
);

exports.setPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await DriverService.setPassword(req.body);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.setEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await DriverService.setEmail(req.body);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.login = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await DriverService.login(req.body);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.confirmation = asyncHandler(async (req: Request, res: Response) => {
  const result = await DriverService.confirm(req.body.token, res.locals.user);
  return new SuccessResponse("Success", result).send(res);
});

exports.forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await DriverService.forgotPassword(req, res.locals.user);
  return new SuccessResponse("Success", []).send(res);
});

exports.confirmPassword = asyncHandler(async (req: Request, res: Response) => {
  await DriverService.confirmPassword(req.body, res.locals.user);
  return new SuccessResponse("Success", []).send(res);
});

exports.getUsers = asyncHandler(async (req: Request, res: Response) => {
  await DriverService.getDrivers(req.query, res.locals.user);
  return new SuccessResponse("Success", []).send(res);
});

exports.updateProfile = asyncHandler(async (req: Request, res: Response) => {
//   await DriverService.updateProfile(req.query, res.locals.user);
//   return new SuccessResponse("Success", []).send(res);
const file = req
console.log(req)
});

exports.sendSmsOTP = asyncHandler(async (req: Request, res: Response) => {
    await DriverService.sendSmsOTP(req.body);
    return new SuccessResponse("Success", []).send(res);
  });
  

exports.setImage = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await DriverService.setImage(req);
    return new SuccessResponse("Image has been set", []).send(res);
  }
);

exports.getNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await DriverService.getNotifications(req.query, res.locals.user);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.updateDetails = asyncHandler(
  async (req: Request, res: Response) => {
    await DriverService.updateDetails(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.updatePassword = asyncHandler(
  async (req: Request, res: Response) => {
    await DriverService.updatePassword(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.deleteDriver = asyncHandler(
  async (req: Request, res: Response) => {
    await DriverService.deleteDriver(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.createWithdrawalRequest = asyncHandler(
  async (req: Request, res: Response) => {
    await DriverService.createWithdrawalRequest(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.deleteWithdrawalRequest = asyncHandler(
  async (req: Request, res: Response) => {
    await DriverService.deleteWithdrawalRequest(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.getWithdrawalRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await DriverService.getWithdrawalRequest(req, res.locals.user);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.editPaymentDetails = asyncHandler(
  async (req: Request, res: Response) => {
    await DriverService.editPaymentDetails(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.setRating = asyncHandler(
  async (req: Request, res: Response) => {
    await DriverService.setRating(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);
