import express from "express"
const controller = require("../../controllers/admin.controller")
const isAdmin = require('../../middleware/isAdmin')

const router = express()

router.post('/admin', isAdmin, controller.newAdmin)
router.post('/login', controller.login)
router.patch('/suspend/:id', isAdmin,  controller.suspend)
router.delete('/delete/:id', isAdmin,  controller.delete)
router.patch('/update', isAdmin, controller.updateDetails)
router.patch('/updatePassword', isAdmin, controller.updatePassword)


module.exports = router