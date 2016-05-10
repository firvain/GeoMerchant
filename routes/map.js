'use strict';
var express = require('express');
var passport = require('passport');
var router = express.Router();
var flash = require('connect-flash');
var logger = require('../utils/logger');
var config = require('../config/config');
var lang;

/* GET map page. */
router.get('/', function (req, res, next) {
  var data = {};
  lang = 'el'; // we need this for flash
  data = require('./i8n/el.js');
  data.env = config.auth0;
  res.render('map', data);
});
router.get('/en', function (req, res, next) {
  var data = {};
  lang = 'en'; // we need this for flash
  data = require('./i8n/en.js');
  data.env = config.auth0;
  res.render('map', data);
});
// router.get('/login', function (req, res) {
//   res.render('login', {
//     env: config.auth0
//   });
// });
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
router.get('/callback', passport.authenticate('auth0', {
  failureRedirect: '/'
}), function (req, res) {
  var id = req.user._json.user_metadata.gid;
  req.flash('id', id);
  req.flash('lang', lang);
  res.redirect(req.session.returnTo || '/admin');
});
module.exports = router;
