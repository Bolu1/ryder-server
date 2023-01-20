import express from "express"
const controller = require("../../controllers/complaint.controller")
const isAuth = require('../../middleware/isAuth')
const isAdmin = require('../../middleware/isAdmin')
const multer = require('multer')
import path from 'path'

const router = express()


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
      // checkFileType(file, cb)
    }
  })
  
  const checkFileType = (file, cb) =>{
  
    const filetypes = /jpeg|jpg|png|pdf/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
  
    if(mimetype && extname){
      return cb(null, true)
    }else{
      cb('Error: Images Only')
    }
  }

router.post('/new', isAuth, upload.array('files'), controller.newComplaint)
router.get('/getAll', isAdmin, controller.getAll)
router.get('/getTrip/:tripId', isAuth, controller.getTrip)
router.patch('/close/:id', isAuth, controller.close)


module.exports = router