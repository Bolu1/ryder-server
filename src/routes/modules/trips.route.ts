import express from "express"
const controller = require("../../controllers/trip.controller")
const isAuth = require('../../middleware/isAuth')

const router = express()

router.get('/new', isAuth, controller.newTrip)


module.exports = router