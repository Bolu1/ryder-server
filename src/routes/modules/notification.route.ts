import express from "express"
const controller = require("../../controllers/kyc.controller")
const isAdmin = require('../../middleware/isAdmin')
const isAuth = require('../../middleware/isAuth')
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

  const filetypes = /jpeg|jpg|png|pdf/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if(mimetype && extname){
    return cb(null, true)
  }else{
    cb('Error: Images Only')
  }
}



const router = express()
router.post('/addCarDetails', upload.array('images'), controller.addCarDetails)




module.exports = router