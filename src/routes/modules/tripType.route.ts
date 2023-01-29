import express from "express"
const controller = require("../../controllers/tripType.controller")
const isAuth = require('../../middleware/isAuth')

const router = express()

router.get('/new', controller.addTripType)


module.exports = router