import {get} from 'lodash'
const  jwt = require ('jsonwebtoken')
import {Request, Response, NextFunction} from 'express'


const deserializeUser = (req:Request,res:Response,next:NextFunction) =>{
    try{
    if(!req.headers.authorization){
        return
    }
    const accessToken = req.headers.authorization.split(" ")[1]

    if(!accessToken){
        return next()
    }
    const decoded = jwt.verify(accessToken, process.env.SECERET_KEY)
    if(decoded){
        res.locals.user = decoded
        return next()
    }
    next()
    }catch(error){
        console.log(error)
        next()
    }
}

module.exports = deserializeUser