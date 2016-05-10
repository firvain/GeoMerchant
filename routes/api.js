'use strict';
var express = require('express');
var router = express.Router();
// var logger = require('../utils/logger');
var language = require('./controllers/language');
router.use('/', language);
module.exports = router;
