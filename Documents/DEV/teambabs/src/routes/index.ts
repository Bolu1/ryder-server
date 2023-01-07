import express from 'express'
const user = require('./modules/admin.route')
const post = require('./modules/post.route')
const quiz = require('./modules/quiz.route')

const routes = express()

routes.use('/admin', user)
routes.use('/post', post)
routes.use('/quiz', quiz)


module.exports = routes