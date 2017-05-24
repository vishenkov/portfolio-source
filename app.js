var express = require('express');
var path = require('path');
var fs = require('fs');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const jsonfile = require('jsonfile');
const MongoStore = require('connect-mongo')(session);
var config = require('./config');

var index = require('./routes/index');
var blog = require('./routes/blog');
var about = require('./routes/about');
var works = require('./routes/works');

var app = express();
var server = http.createServer(app);

var uploadDir = path.join(__dirname, 'upload');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose
  .connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
    user: config.db.user,
    pass: config.db.password
  })
  .catch(e => {
    console.error(e);
    throw e;
  });

require('./models/db');
//подключаем модели(сущности, описывающие коллекции базы данных)
require('./models/blog');
require('./models/works');
require('./models/skills');
require('./models/user');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  key: 'keys',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null
  },
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use('/', index);
app.use('/blog', blog);
app.use('/works', works);
app.use('/about', about);
app.use('/admin', require('./routes/admin'));

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

server.listen(3000, '0.0.0.0');
server.on('listening', function () {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});

module.exports = app;
