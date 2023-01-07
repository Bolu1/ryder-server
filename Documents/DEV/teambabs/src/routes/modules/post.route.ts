import express from "express"
const controller = require("../../controllers/post.controller")
const isAdmin = require('../../middleware/isAdmin')
import path from 'path'
const isAuth = require('../../middleware/isAuth')

const router = express()

const multer = require('multer')

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
  limits:{fileSize: 2000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb)
  }
})

const checkFileType = (file, cb) =>{

  const filetypes = /jpeg|jpg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if(mimetype && extname){
    return cb(null, true)
  }else{
    cb('Error: Images Only')
  }
}

// protected routes
router.post('/new', isAuth, upload.single("image"), controller.new)
router.get('/posts', controller.getPosts)
router.get('/post/:id', controller.getPost)
router.get('/category/:name', controller.getPostByCategory)
router.delete('/post/:id', isAuth, controller.deletePost)


module.exports = router