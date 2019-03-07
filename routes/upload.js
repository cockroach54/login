const express = require('express');
const router = express.Router();

const multer = require("multer");
const path = require('path');

let storage = multer.diskStorage({
  destination: function(req, file, callback){
    callback(null, 'uploads/');
  },
  filename: function(req, file, callback){
    let extension = path.extname(file.originalname);
    let basename = path.basename(file.originalname, extension);
    callback(null, basename+"-"+Date.now()+extension);
  }
})
let upload = multer({
  storage: storage
});

router.get('/show', function(req, res, next){
  res.render('board');
});

router.post('/create', upload.single("imgFile"), function(req, res, next){
  let file = req.file;

  let result = {
    originalName: file.originalname,
    size: file.size
  };

  res.json(result);
});

module.exports = router;