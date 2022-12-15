import express from "express"
const router = express.Router();
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    // const token = req.body.token;

    let decoded = jwt.verify(token, process.env.SECERET_KEY);
    if(!decoded.isAdmin){
        return res.status(403).send("Unauthorized")
    }

    res.locals.user = {
      email: decoded.email,
      id: decoded.id,
      isAdmin: true
    };
    const main = decoded.email;

    next();
  } catch (err) {
    console.log(err);
    return res.status(403).send("Unauthorized");
  }
};

module.exports = auth;