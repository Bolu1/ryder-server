import express from 'express'
const user = require('./modules/user.route')
const driver = require('./modules/driver.route')
const kyc = require('./modules/kyc.route')
const admin = require('./modules/admin.route')
const trip = require('./modules/trip.route')
const complaint = require('./modules/complaint.route')
const payment = require('./modules/payment.route')

const routes = express()

routes.use('/user', user)
routes.use('/driver', driver)
routes.use('/kyc', kyc)
routes.use('/trip', trip)
routes.use('/complaint', complaint)
routes.use('/admin', admin)
routes.use('/payment', payment)


module.exports = routes