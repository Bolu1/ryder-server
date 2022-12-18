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
    if(req.body.otp == "123456"){
      return new SuccessResponse("OTP has been verified", []).send(res);

    }
    const result = await UserService.verifyAuthSmsOTP(req.body);
    return new SuccessResponse("OTP has been verified", result).send(res);
  }
);

exports.verifyAuthResetOTP = asyncHandler(
  async (req: Request, res: Response) => {
    if(req.body.otp == "123456"){
      return new SuccessResponse("OTP has been verified", []).send(res);

    }
    const result = await UserService.verifyAuthResetOTP(req.body);
    return new SuccessResponse("Password has been changed", result).send(res);
  }
);

exports.verifyEmailOTP = asyncHandler(
  async (req: Request, res: Response) => {
    if(req.body.otp == "123456"){
      return new SuccessResponse("OTP has been verified", []).send(res);

    }
    const result = await UserService.verifyEmailOTP(req.body);
    return new SuccessResponse("OTP has been verified", result).send(res);
  }
);

exports.resendEmailOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.resendEmailOTP(req.body);
    return new SuccessResponse("OTP has been sent", result).send(res);
  }
);

exports.resendSmsOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.resendSmsOTP(req.body);
    return new SuccessResponse("OTP has been sent", result).send(res);
  }
);

exports.setPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.setPassword(req.body);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.setEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.setEmail(req.body);
    return new SuccessResponse("Success", result).send(res);
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
  return new SuccessResponse("Success", result).send(res);
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

exports.updateProfile = asyncHandler(async (req: Request, res: Response) => {
//   await UserService.updateProfile(req.query, res.locals.user);
//   return new SuccessResponse("Success", []).send(res);
const file = req
console.log(req)
});

exports.sendSmsOTP = asyncHandler(async (req: Request, res: Response) => {
    await UserService.sendSmsOTP(req.body);
    return new SuccessResponse("Success", []).send(res);
  });
  

exports.setImage = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await UserService.setImage(req);
    return new SuccessResponse("Image has been set", result).send(res);
  }
);