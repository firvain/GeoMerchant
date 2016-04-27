// BASE SETUP
// ==============================================
var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/map/login');
var pg = require('pg');


var router;

var listings = require('./controllers/listing');
var uses = require('./controllers/uses');
var listed = require('./controllers/listed-property');
var property = require('./controllers/property');


pg.defaults.poolSize = 25;


// ROUTES
// ==============================================
// create routes
// get an instance of router
router = express.Router();
router.use('/', uses);
router.use('/', listed);
router.use('/',  property);
router.use('/',  listings);

module.exports = router;
