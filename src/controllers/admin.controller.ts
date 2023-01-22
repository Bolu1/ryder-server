import express, { Request, Response } from "express";
import asyncHandler from "../middleware/async";
import AdminService from "../services/admin.services"
const { validateParameters } = require("../utils/validateParameters");
import {
  BadRequestDataResponse,
  CreatedResponse,
  SuccessResponse,
} from "../core/ApiResponse";
const {ROLE} = require('../utils/constants')
import { BadRequestError } from "../core/ApiError";

exports.newAdmin = asyncHandler(
  async (req: Request, res: Response) => {

    if(ROLE[req.body.type] == undefined){

        throw new BadRequestError("Incorrect parameters")
    }

    await AdminService.newAdmin(req.body, res.locals.user);
    return new CreatedResponse("Success", []).send(res);
  }
);

exports.login = asyncHandler(
    async (req: Request, res: Response) => {
  
      const result = await AdminService.login(req.body);
      return new SuccessResponse("Success", result).send(res);
    }
  );


exports.suspend = asyncHandler(
  async (req: Request, res: Response) => {

   await AdminService.suspend(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.delete = asyncHandler(
  async (req: Request, res: Response) => {

   await AdminService.delete(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.updateDetails = asyncHandler(
  async (req: Request, res: Response) => {
    await AdminService.updateDetails(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.updatePassword = asyncHandler(
  async (req: Request, res: Response) => {
    await AdminService.updatePassword(req, res.locals.user);
    return new SuccessResponse("Success", []).send(res);
  }
);

exports.getWithdrawalRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await AdminService.getWithdrawalRequest(req);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.editWithdrawalRequest = asyncHandler(
  async (req: Request, res: Response) => {
    await AdminService.editWithdrawalRequest(req);
    return new SuccessResponse("Success", []).send(res);
  }
);