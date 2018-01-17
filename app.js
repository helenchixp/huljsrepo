var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes = {
  index : require('./routes/index'),
  upload : require('./routes/upload'),
  login : require('./routes/login'),
  list : require('./routes/list'),
  sendlog: require('./routes/sendlog'),
  recvlog: require('./routes/recvlog'),
  opllog: require('./routes/opllog'),
  about : require('./routes/about'),
  utlsend : require('./routes/utlsend'),
  adduser : require('./routes/adduser'),
  logout : require('./routes/logout'),
  // Test Page
  users : require('./routes/users')
};

//connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/hulagent', { useMongoClient : true} );
var db = mongoose.connection;

//handle mongo error

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(){
  // check the db is valid
  console.log('MongoDB is connected!');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger({ format : 'dev', immediate: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "agent-chiperkey",
  resave: false,
  saveUninitialized: true,
  rolling : true,
  name : 'agent-cookie',
  store : new MongoStore( {
    //db: 'hulagent',
    //clear_interval: 60*60
    mongooseConnection: db
  }),
  cookie: { maxAge: null }
}));

// output logger to log.txt
if(app.get('env')=='production') {
  var fs = require('fs');
  var stream = fs.createWriteStream(__dirname + '/trace.log', { flags: 'a' });
  app.use(logger({ stream: stream }));
}
else {
  console.log('  ---- Deploy mode is off [export NODE_ENV=production] will be on ');
}


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', routes.index);
app.use('/upload', routes.upload);
app.use('/login', routes.login);
app.use('/list',routes.list);
app.use('/about',routes.about);
app.use('/sendlog',routes.sendlog);
app.use('/recvlog',routes.recvlog);
app.use('/opllog',routes.opllog);
app.use('/utlsend', routes.utlsend);
app.use('/adduser', routes.adduser);
app.use('/logout', routes.logout);

//Test Page
app.use('/users',routes.users);

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
