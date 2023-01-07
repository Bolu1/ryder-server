import express from "express"
const controller = require("../../controllers/quiz.controller")
const isAdmin = require('../../middleware/isAdmin')
const isAuth = require('../../middleware/isAuth')

const router = express()


// protected routes
router.post('/new', isAuth, controller.new)
router.get('/questions/:category', controller.getQuestions)
router.get('/question/:id', controller.getQuestion)
router.delete('/question/:id', isAuth, controller.deleteQuestion)


module.exports = router