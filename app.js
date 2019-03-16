var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var methodOverride = require('method-override'); // for put, delete method - 쿼리에 이렇게 추가 하는듯 ?_method=PUT
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');

var app = express();
let model = require('./models/index.js');
model.sequelize
  // .authenticate()/\
  .sync()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('!!! Unable to connect to the database:', err);
    return;
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// set CORS
app.use(cors());

app.use(methodOverride('_method')); // POST --> PUT, DELETE 등 restful method override
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'uploads'))); // 가상경로 설정, static 파일이 있는 uploads 폴더를 내부적으로 /upload라는 가상 경로로 접근가능
// key                 : 세션의 키 값
// secret             :  세션의 비밀 키, 쿠키값의 변조를 막기 위해서 이 값을 통해 세션을 암호화 하여 저장
// resave             : 세션을 항상 저장할 지 여부 (false를 권장)
// saveUninitialized : 세션이 저장되기전에 uninitialize 상태로 만들어 저장
// cookie             : 쿠기 설정
app.use(session({
  key: 'sid',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 3
  }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
