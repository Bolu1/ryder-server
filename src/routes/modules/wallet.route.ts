import express from "express"
const controller = require("../../controllers/wallet.controller")
const isAuth = require('../../middleware/isAuth')

const router = express()

router.get('/balance', isAuth, controller.getBalance)


module.exports = router