import express from 'express'
const user = require('./modules/user.route')
const driver = require('./modules/driver.route')

const routes = express()

routes.use('/user', user)
routes.use('/driver', driver)


module.exports = routes