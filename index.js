var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require("dotenv");
var indexRouter = require('./routes/app');
var usersRouter = require('./routes/users');
const mongoose = require("mongoose");
var app = express();
const cors = require("cors");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
dotenv.config();

let dbUrl = `${process.env.DB_URL}`;
const dbConnect = async () => {
  try {
    await mongoose.connect(
      dbUrl,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
      }
    ).then(()=>{
      app.listen(process.env.PORT || 4050,()=>{
          console.log(`Server is running on ${process.env.PORT}`)
      })
  }).catch((error)=>{
      console.log(error)
  });

    console.log("DB Connected");
  } catch (e) {
    console.log(e.message, "error in connecting db");
  }
};
dbConnect();

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
