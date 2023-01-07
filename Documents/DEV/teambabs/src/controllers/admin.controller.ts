import express, { Request, Response } from "express";
import { createUserInput } from "../schema/user.schema";
import asyncHandler from "../middleware/async";
import AdminService from "../services/admin.services";
const { validateParameters } = require("../utils/validateParameters");
import {
  BadRequestDataResponse,
  CreatedResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { BadRequestError } from "../core/ApiError";

exports.addAdmin = asyncHandler(
  async (req: Request<{}, {}, createUserInput["body"]>, res: Response) => {
    // validator
    const { isValid, messages } = validateParameters(
      [
        "name",
        "password",
        "email",
      ],
      req.body
    );

    if (!isValid) {
      throw new BadRequestError();
    }

    await AdminService.addUser(req.body);
    return new CreatedResponse("Success", []).send(res);
  }
);


exports.login = asyncHandler(
  async (req: Request<{}, {}, createUserInput["body"]>, res: Response) => {
    const result = await AdminService.login(req.body);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.getAdmins = asyncHandler(async (req: Request, res: Response) => {
  const result = await AdminService.getAdmins(req.query, res.locals.user);
  return new SuccessResponse("Success", result).send(res);
});

exports.deleteAdmin = asyncHandler(async (req: Request, res: Response) => {
  await AdminService.deleteAdmin(req.params, res.locals.user);
  return new SuccessResponse("Success", []).send(res);
});
