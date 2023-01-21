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

  const filetypes = /jpeg|jpg|png|pdf|svg/
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
router.post('/addPersonalInformation',  controller.addPersonalInformation)
router.post('/setImage', upload.single("image"), controller.setImage)
router.post('/addPaymentDetails',  controller.addPaymentDetails)
router.get('/getKycStatus/:phone',  controller.getKycStatus)
router.post('/uploadDocument', upload.single("file"), controller.uploadDocument)
router.post('/drivingHistory', controller.drivingHistory)

// admin routes
router.get('/getCarDetails/:phone', isAdmin, controller.getCarDetails)
router.get('/getPersonalInformation/:phone',  isAdmin, controller.getPersonalInformation)
router.get('/getPaymentDetails/:phone',  isAdmin, controller.getPaymentDetails)
router.get('/getUploadedDocument/:phone', isAdmin, controller.getUploadedDocument)
router.get('/getDrivingHistory/:phone', isAdmin, controller.getDrivingHistory)

// admin actions
router.patch('/editPersonalInformation', isAdmin, controller.editPersonalInformation)
router.patch('/editCarDetails', isAdmin, controller.editCarDetails)
router.patch('/photoAction', isAdmin, controller.photoAction)
router.patch('/paymentDetailsAction', isAdmin, controller.paymentDetailsAction)
router.patch('/uploadedDocumentsAction', isAdmin, controller.uploadedDocumentsAction)
router.patch('/drivingHistoryAction', isAdmin, controller.drivingHistoryAction)
router.patch('/approveUser', isAdmin, controller.approveUser)




module.exports = router