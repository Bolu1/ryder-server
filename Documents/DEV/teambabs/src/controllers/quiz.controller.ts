import express, { Request, Response } from "express";
import { createUserInput } from "../schema/user.schema";
import asyncHandler from "../middleware/async";
import QuizService from "../services/quiz.services";
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
        "question",
        "answer",
        "subject",
      ],
      req.body
    );

    if (!isValid) {
      throw new BadRequestError();
    }

    await QuizService.new(req);
    return new CreatedResponse("Success", []).send(res);
  }
);

exports.getQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await QuizService.getQuestions(req);
    return new SuccessResponse("Success", result).send(res);
  }
);

exports.getQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await QuizService.getQuestion(req.params.id);
    return new SuccessResponse("Success", result).send(res);
  }
);


exports.deleteQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    await QuizService.deleteQuestion(req.params.id);
    return new SuccessResponse("Success", []).send(res);
  }
);
