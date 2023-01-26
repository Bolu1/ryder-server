import express from "express"
const controller = require("../../controllers/payment.controller")
const isAuth = require('../../middleware/isAuth')

const router = express()

router.get('/verifyPaystack', controller.verifyPaystack)
router.get('/verifyFlutterWave', controller.verifyFlutterWave)


module.exports = router