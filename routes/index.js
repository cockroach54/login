var express = require('express');
var router = express.Router();

const models = require('../models'); // 알아서 index.js 가져옴
const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwt');

// var mysql = require('mysql');
// var client = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "",
//   database: "test"
// });
 
 
router.get('/', function(req, res, next) {
  client.query("SELECT * FROM products;", function(err, result, fields){
    if(err){
      console.log('[Error]', err);
    }
    else{
      // console.log(result);
      res.render('create', {
        results: result
      });
    }
  });
 
});

router.get('/api', function(req, res, next){
 let token = req.cookies.myjwt;
 // jwt에 저장된 해시와 현재 head, payload 이용해 새로 해싱한 값이랑 같은지 검사 
 let decoded = jwt.verify(token, secretObj.secret);
 if(decoded){
   res.send('[Claim accessed]');
 }
 else{
   res.send('[Claim denied]');
 }
});

router.get('/show', function(req, res, next) {
  // offest과 limit을 이용해 pagination구현
  models.post.findAll({offset:0, limit:5}).then(async results => {

    for(let post of results){
      let res_replies = await models.post.find({
        include: {model: models.reply, where: {postId: post.id}}
      });
      if(res_replies) post.replies = res_replies.replies;
    }
    res.render('show', {
      posts: results
    });

  })
});


router.post('/create', function(req, res, next){
  let body = req.body;

  models.post.create({
    title: body.inputTitle,
    writer: body.inputWriter
  })
  .then(result =>{
    console.log('[Add data success]');
    res.redirect("/show");
  })
  .catch(err => {
    console.log('[Add data Error]', err);
  });
});

router.get('/edit/:id' ,function(req, res, next){
  let postID = req.params.id;

  models.post.find({
    where: {id: postID}
  })
  .then(result => {
    res.render('edit', {
      post:result
    });
  })
  .catch(err => {
    console.log('[Retrive data Error]', err);
  });
});

router.put('/update/:id', function(req, res, next) {
  let  postID = req.params.id;
  let body = req.body;
 
  models.post.update({
      title: body.editTitle,
      writer: body.editWriter
  },{
      where: {id: postID}
  })
  .then( result => {
      console.log("[Update data success]");
      res.redirect("/show");
  })
  .catch( err => {
      console.log("[Update data errer]");
  });
});

router.delete('/delete/:id', function(req, res, next){
  let postID = req.params.id;

  models.post.destroy({
    where: {id: postID}
  })
  .then(result => {
    res.redirect("/show")
  })
  .catch(err => {
    console.log('[Delete data error]');
  })
});

router.post('/reply/:postID', function(req, res, next){
  let postID = req.params.postID;
  let body = req.body;

  models.reply.create({
    postId: postID,
    writer: body.replyWriter,
    content: body.replyContent
  })
  .then(result => {
    res.redirect('/show');
  })
  .catch(err =>{
    console.log('[Add reply error]');
  })
});

// router.get('/create', function(req, res, next) {
//   res.render('create');
// });
 
// router.post('/create', function(req, res, next) {
//   var body = req.body;
   
//   client.query("INSERT INTO products (name, modelnumber, series) VALUES (?, ?, ?)", [
//       body.name, body.modelnumber, body.series
//     ], function(){
//     res.redirect("/create");
//   });
// });


module.exports = router;


