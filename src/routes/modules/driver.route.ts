import express from "express"
const controller = require("../../controllers/driver.controller")
const isAdmin = require('../../middleware/isAdmin')
const isAuth = require('../../middleware/isAuth')

const router = express()

// non-protected route
router.post("/signup", controller.addUser)
router.post("/login", controller.login)
router.post("/otp", controller.sendOtp)
router.post('/forgotPassword', controller.forgotPassword)
router.post('/confirmPassword', controller.confirmPassword)

// protected routes
router.get('/drivers', isAdmin, controller.getDrivers)
router.post('/update', controller.updateProfile)
router.patch('/uploadCarDetails', controller.uploadCarDetails)


module.exports = router