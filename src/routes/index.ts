import express from 'express'
const user = require('./modules/user.route')
const driver = require('./modules/driver.route')
const kyc = require('./modules/kyc.route')
const notification = require('./modules/notification.route')

const routes = express()

routes.use('/user', user)
routes.use('/driver', driver)
routes.use('/kyc', kyc)
routes.use('/notification', notification)


module.exports = routes