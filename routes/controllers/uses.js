'use strict';
/* eslint no-shadow: ["error", { "hoist": "never" }] */
var config = require('../../config/config');
var express = require('express');
var logger = require('../../utils/logger');
var pg = require('pg');
var router = express.Router();

router.route('/uses/:propertygid')
.get(function getUses(req, res) {
  var propertyGid = req.params.propertygid;
  pg.connect(config.connection, function connectToPG(err, client, done) {
    if (err) {
      res.status(503).json({
        msg: 'Service Unavailable'
      });
      logger.error('Could not connect to postgres');
      return err;
    }
    client.query('select property_services_analysis(' + propertyGid + ');',
    function queryDB(queryErr, queryRes) {
      var length;
      done();
      if (queryErr) {
        res.sendStatus(500);
        logger.error(queryErr);
        return queryErr;
      }
      length = Object.keys(queryRes.rows[0].property_services_analysis.features).length;
      if (length === 1) {
        res.status(404).json({
          msg: 'Sorry, we cannot find any uses!',
          propertyId: propertyGid
        });
        return false;
      }
      res.status(200).json(queryRes.rows[0]);
      return true;
    });
    return true;
  });
});

module.exports = router;
