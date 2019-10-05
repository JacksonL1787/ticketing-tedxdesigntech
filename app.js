var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')

const port = 3000

var indexRouter = require('./routes/index');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secretkey',
  resave: true,
  saveUninitialized: false,
  cooke: {
    httpOnly: false,
    maxAge: null
  }
}))

app.use('/', indexRouter);

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

mongoose.connect('mongodb://localhost/ticketing', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, client) => {
  if(err) {
    console.log(err)
    process.exit(1)
  }
  app.set("db", client)
  const server = app.listen(port, () => console.log('Server started listening on port '+ port + "!"));
  //const io = require('socket.io').listen(server);
});

module.exports = app;
