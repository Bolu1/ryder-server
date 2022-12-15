import express from "express"
import jwt from "jsonwebtoken"
const router = express.Router();


function permit(roles){
    return(req,res,next)=>{
        const isAuthorized = roles.includes(res.locals.user.type);
        if (!isAuthorized) {
            return res.status(403).send("Unauthorized Access");
          }
      
          next();
    }
}

module.exports = {
    permit
}