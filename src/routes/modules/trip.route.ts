import express from "express"
const controller = require("../../controllers/trip.controller")
const isAuth = require('../../middleware/isAuth')

const router = express()

router.post('/new', isAuth, controller.newTrip)
router.patch('/driverAccept/:id', isAuth, controller.driverAccept)
router.patch('/cancel/:id', isAuth, controller.cancelTrip)
router.get('/history', isAuth, controller.getTripHistory)
router.get('/history/trip/:id', isAuth, controller.getOneTripHistory)
router.patch('/end/:id', isAuth, controller.endTrip)


module.exports = router