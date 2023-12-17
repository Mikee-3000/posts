var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
const flash = require('connect-flash');
var session = require('express-session');
const LogService = require('./helpers/LogService');
const crypto = require('crypto');


// connection to the database
var DBConnection = require('./db/DBConnection');
const dbConnection = new DBConnection();

// create the database tables if they don't exist
dbConnection.getConnection().exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        isAdmin INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_text TEXT NOT NULL,
        time_posted TEXT NOT NULL,
        posted_by INTEGER NOT NULL,
        FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    level TEXT NOT NULL,
    message TEXT NOT NULL
);
`);

// create the admin user if they don't exist
const UserModel = require('./models/UserModel');
if (!UserModel.adminExists()) {
    UserModel.addUserToDB('admin', 'admin123', 1);
    LogService.log('info', 'Admin created, password is admin123');
} else {
    LogService.log('info', 'Admin already exists');
}

var app = express();
app.use(cookieParser())


// https://expressjs.com/en/resources/middleware/session.html
app.use(session({
  resave: true, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret',
  cookie: {
    secure: false, // otherwise the cookie is not sent in HTTP context, eg. on localhost
    sameSite: 'strict'
  } 
}));

app.use(flash());

// CSRF middleware
// https://expressjs.com/en/guide/writing-middleware.html
app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(64).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;
  req.session.save(err => {
    if (err) {
      LogService.log('error', 'Error saving session');
    }
  })
  next();
});

// set security headers
app.use((req, res, next) => {
  res.set('Content-Security-Policy', "default-src 'self' localhost:4000 'unsafe-inline' 'unsafe-eval'; frame-ancestors 'none';");
  res.set('X-Content-Type-Options', 'nosniff');
  next();
});

// disable the X-Powered-By header
// https://thewebdev.info/2022/03/26/how-to-get-rid-of-x-powered-by-response-header-in-node-js-express-and-javascript/?utm_content=cmp-true
app.disable('x-powered-by');

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




app.listen(4000, '0.0.0.0');

module.exports = app;
