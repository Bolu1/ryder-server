const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
import Jwt from "../core/Jwt";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    let decoded = Jwt.verify(token);

    res.locals.user = {
      name: decoded.name,
      organizationId: decoded.organizationId ? decoded.organizationId : decoded.id,
      email: decoded.email,
      id: decoded.id,
      type: decoded.type
    };


    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: err });
  }
};

module.exports = auth;