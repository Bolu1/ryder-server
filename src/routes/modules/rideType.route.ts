import express from "express"
const controller = require("../../controllers/rideType.controller")
const isAuth = require('../../middleware/isAuth')
const isAdmin = require('../../middleware/isAdmin')

const multer = require('multer')
import path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, callback) =>{
    callback(null, "./static/")
  },
  filename: (req, file, callback) =>{
    callback(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb)
  }
})

const checkFileType = (file, cb) =>{

  const filetypes = /jpeg|jpg|png|svg/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if(mimetype && extname){
    return cb(null, true)
  }else{
    cb('Error: Images Only')
  }
}


const router = express()

router.post('/new', isAdmin, upload.single("image"), controller.addRideType)
router.get('/rideTypes', isAuth, controller.getRideTypes)
router.get('/rideType/:id', isAuth, controller.getRideType)
router.patch('/rideType/:id', isAdmin, controller.editRideType)
router.delete('/rideType/:id', isAdmin, controller.deleteRideType)


module.exports = router