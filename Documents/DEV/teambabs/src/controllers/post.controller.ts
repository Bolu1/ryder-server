import express, { Request, Response } from "express";
import { createUserInput } from "../schema/user.schema";
import asyncHandler from "../middleware/async";
import PostService from "../services/posts.services";
const { validateParameters } = require("../utils/validateParameters");
import {
  BadRequestDataResponse,
  CreatedResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { BadRequestError } from "../core/ApiError";

exports.new = asyncHandler(
  async (req: Request, res: Response) => {
    // validator
    const { isValid, messages } = validateParameters(
      [
        "title",
        "content",
        "category",
      ],
      req.body
    );

    if (!isValid) {
      throw new BadRequestError();
    }

    await PostService.new(req);
    return new CreatedResponse("Success", []).send(res);
  }
);

exports.getPosts = asyncHandler(
  async (req: Request<{}, {}, createUserInput["body"]>, res: Response) => {
    const result = await PostService.getPosts(req);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.getPost = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await PostService.getPost(req.params.id);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.getPostByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await PostService.getPostByCategory(req.params.name);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.deletePost = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await PostService.deletePost(req.params.id);
    return new SuccessResponse("Success", result).send(res);
  }
);
