import express from "express"
const controller = require("../../controllers/admin.controller")
const isAuth = require('../../middleware/isAuth')

const router = express()

// non-protected route
router.post("/signin", controller.login)
// protected routes
router.post("/signup", isAuth, controller.addAdmin)
router.get('/admins', isAuth, controller.getAdmins)
router.delete('/admin/:slug', isAuth, controller.deleteAdmin)


module.exports = router