import express from "express"
const controller = require("../../controllers/payment.controller")
const isAuth = require('../../middleware/isAuth')

const router = express()

router.get('/initPaystack', isAuth, controller.initPaystack)
router.get('/verifyPaystack', isAuth, controller.verifyPaystack)


module.exports = router