var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*
var index = require('./routes/index');
var users = require('./routes/users');
var upload = require('./routes/upload');
*/

var routes = {
  index : require('./routes/index'),
  upload : require('./routes/upload'),
  login : require('./routes/login'),
  list : require('./routes/list'),
  sendlog: require('./routes/sendlog'),
  about : require('./routes/about'),
  utlsend : require('./routes/utlsend')
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', routes.index);
app.use('/upload', routes.upload);
app.use('/login', routes.login);
app.use('/list',routes.list);
app.use('/about',routes.about);
app.use('/sendlog',routes.sendlog);
app.use('/utlsend', routes.utlsend);

/*
app.post('/upload', function(req,res) {
  res.send('POST Upload');
});
*/

/*
app.use('/', index);
app.use('/users', users);
app.use('/upload', upload);
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
