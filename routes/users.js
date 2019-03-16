const express = require('express');
const router = express.Router();
const models = require("../models");
const crypto = require('crypto'); // for password encryption
const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwt');


// 쿠키 사용용 코드
router.get('/', function(req, res, next) {
  if(req.cookies.user){
    res.send('환영합니다~ '+req.cookies.user);
  }
  else{
    res.send('먼저 로그인을 해주세요');
  }
});

// 세션 사용용 코드
router.get('/login', function(req, res, next){
  let session = req.session;

  res.render('user/login', {
    session: session
  });
});

router.post('/login', function(req, res, next){
  let body = req.body;

  models.user.find({
    where:{email: body.userEmail}
  })
  .then(result => {
    let dbPassword = result.dataValues.password;
    let inputPassword = body.password;
    let salt = result.dataValues.salt;
    // console.log( '[salt]', salt)

    crypto.pbkdf2(inputPassword, salt, 100000, 64, 'sha512', function (err, key) {
      let hashedPassword = key.toString('base64');
      if(dbPassword === hashedPassword){
        console.log('[login accessed]');
        // // set cookie
        // res.cookie('user', body.userEmail, {
        //   expires: new Date(Date.now()+300000), // 300초 동안 유지
        //   httpOnly: true // web sever에서만 접근 가능
        // });
        // res.redirect("/users");

        // set session
        req.session.email = body.userEmail;
        // res.redirect('/users/login');

        // set JWT
        // default: HMAC SHA256
        let token = jwt.sign({
          email: body.userEmail // 토큰 내용(payload)
        },
        secretObj.secret, // 비밀키
        {
          expiresIn: '5m' // 인증 유효시간
        });

        res.cookie("myjwt", token);
        console.log('[JWT]', token);
        // res.redirect('/users/login');
        res.json({success:true});
      }
      else{
        console.log('[login access denied]');
        // res.redirect('/users/login');
        res.json({success:false});
      }
    });

  })
  .catch(err => {
    console.log('[Error]', err);
  });

});

router.get("/logout", function(req,res,next){
  req.session.destroy();
  res.clearCookie('sid');

  res.redirect("/users/login")
})

router.get('/sign_up', function (req, res, next) {
  res.render("user/signup");
});


router.post("/sign_up", function (req, res, next) {
  let body = req.body;

  crypto.randomBytes(64, function (err, buf) {
    crypto.pbkdf2(body.password, buf.toString('base64'), 100000, 64, 'sha512', function (err, key) {
      models.user.create({
        name: body.userName,
        email: body.userEmail,
        password: key.toString('base64'),
        salt: buf.toString('base64')
      }).then(result => {
        res.json({success:true});
        // res.redirect("/users/sign_up");
      }).catch(err => {
        console.log(err)
        res.json({success:false});
      })
    });
  });

  // let inputPassword = body.password;
  // let salt = Math.round(Date.now()*Math.random())+""; // "" for string
  // let hashedPassword = crypto.createHash("sha512").update(inputPassword+salt).digest("base64");

  // models.user.create({
  //     name: body.userName,
  //     email: body.userEmail,
  //     password: hashedPassword,
  //     salt: salt
  // })
  // .then( result => {
  //     res.redirect("/users/sign_up");
  // })
  // .catch( err => {
  //     console.log(err)
  // });
})

module.exports = router;
