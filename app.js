//Basic requires
var express = require("express");
var path = require("path");
// var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var flash = require("connect-flash");
//Dust require
var cons = require("consolidate");
//CORS
var cors = require("cors");
//login related vars
var session = require("express-session");
var dotenv = require("dotenv");
var passport = require("passport");
var Auth0Strategy = require("passport-auth0");
//load .env vars
dotenv.load();
//route requires
var index = require("./routes/index");
var admin = require("./routes/admin");
var map = require("./routes/map");
var database = require("./routes/database");
// This will configure Passport to use Auth0
var strategy = new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || "http://127.0.0.1:3000/callback"
}, function(accessToken, refreshToken, extraParams, profile, done) {
  // accessToken is the token to call Auth0 API (not needed in the most cases)
  // extraParams.id_token has the JSON Web Token
  // profile has all the information from the user
  return done(null, profile);
});
passport.use(strategy);
// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
///================ Initialize app ================//
var app = express();
// view engine setup
app.engine("dust", cons.dust);
app.set("view engine", "dust");
app.set("views", path.join(__dirname, "views"));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(flash());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//static files by express
app.use(express.static(path.join(__dirname, "public")));
//Passport setup and init//
app.use(session({secret: "shhhhhhhhh", resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
///================ Routes ================//
app.use("/", index);
app.use("/map", map);
app.use("/admin", admin);
app.use("/db", database);
///================ Routes ================//
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});
module.exports = app;
