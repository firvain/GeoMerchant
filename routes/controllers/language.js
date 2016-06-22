'use strict';
var express = require('express');
var router = express.Router();
var el = require('../i8n/browser/el.js');
var en = require('../i8n/browser/en.js');
var adminEl = require('../i8n/browser/admin_el.js');
var adminEn = require('../i8n/browser/admin_en.js');
router.route('/language')
.get(function getProperty(req, res) {
  var context = req.query.context;
  var lang = req.query.type;
  if (context === 'map') {
    if (lang === 'el') {
      res.send(el);
    } else {
      res.send(en);
    }
  } else {
    if (lang === 'el') {
      res.send(adminEl);
    } else {
      res.send(adminEn);
    }
  }
});
module.exports = router;
