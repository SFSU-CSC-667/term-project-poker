const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('./db/initDB.js');
const app = express();
app.io = require('socket.io')();
app.db = require('./db/initDB.js');
const routes = require('./routes/index')(app.io, app.db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') === 'production') {
  app.use((request, response, next) => {
    if (request.headers['x-forwarded-proto'] !== 'https') {
      response.redirect('https://' + request.headers.host + request.url);
    }
    else {
      next();
    }
  });
}

app.use('/', routes);

// catch 404 and forward to error handler
app.use((request, response, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((error, request, response, next) => {
    response.status(err.status || 500);
    response.render('error', {
      message: error.message,
      error: error
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((error, request, response, next) => {
  response.status(error.status || 500);
  response.render('error', {
    message: error.message,
    error: {}
  });
});



module.exports = app;
