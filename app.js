var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var multer = require('multer'); 


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
app.use(logger({ format : 'short', immediate: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// output logger to log.txt
if(app.get('env')=='production') {
  var fs = require('fs');
  var stream = fs.createWriteStream(__dirname + '/trace.log', { flags: 'a' });
  app.use(logger({ stream: stream }));
}
else {
  console.log('  ---- Deploy mode is off [export NODE_ENV=production] will be on ');
}



//app.use(multer({ dest: './uploads/'}));

/*
    rename: function(fieldname, filename) {
      return  filename+Date.now();
    },
    onFileUploadStart: function(file) {
      console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function(file) {
      console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
}));
*/


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', routes.index);
app.use('/upload', routes.upload);
app.use('/login', routes.login);
app.use('/list',routes.list);
app.use('/about',routes.about);
app.use('/sendlog',routes.sendlog);
app.use('/utlsend', routes.utlsend);

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