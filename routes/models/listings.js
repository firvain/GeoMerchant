'use strict';
var config = require('../../config/config');
var express = require('express');
var logger = require('../../utils/logger');
var pg = require('pg');
var router = express.Router();
var rollback = require('../../utils/rollback');

router.route('/listing')
.get(function (req, res, next) {
  var gid = req.query.gid;
  var text;
  pg.connect(config.connection, (err, client, done) => {
    if (err) {
      logger.info('Could not connect to postgres');
    } else {
      text = 'SELECT id,to_char(date_end,\'DD-MM-YYYY\') as date_end,to_char(date_start,\'DD-MM-YYYY\') as date_start,price,pets,prefered_customer,sale,rent FROM public.listing WHERE public.listing.property_gid=$1;';
      client.query(text, [gid], (error, result) => {
        logger.info(this.text);
        done();
        if (result) {
          if (result.rows.length === 0) {
            res.sendStatus(404);
          } else {
            res.json(result.rows[0]);
          }
        } else {
          res.sendStatus(404);
        }
      })
    }
  })
})
.post(function (req, res) {
  var property_gid = '\'' + req.body.property_gid + '\'';
  var date_start = '\'' + req.body.date_start + '\'';
  var date_end = '\'' + req.body.date_end + '\'';
  var pets = '\'' + req.body.pets + '\'';
  var prefered_customer = '\'' + req.body.prefered_customer + '\'';
  var price = '\'' + req.body.price + '\'';
  var rent = '\'' + req.body.rent + '\'';
  var sale = '\'' + req.body.sale + '\'';
  pg.connect(config.connection, function (err, client, done) {
    if (err) {
      logger.info('Could not connect to postgres');
    } else {
      client.query('BEGIN', function (err) {
        if (err) return rollback(client, done);
        process.nextTick(function () {
          var columns = '(property_gid,date_start,date_end,price,pets,prefered_customer,rent,sale) ';
          var values = property_gid + ',' + 'to_date(' + date_start + ',\'DD-MM-YYYY\')' + ',' + 'to_date(' + date_end + ',\'DD-MM-YYYY\')' + ',' + price + ',' + pets + ',' + prefered_customer + ',' + rent + ',' + sale;
          client.query('INSERT INTO public.listing ' + columns + 'VALUES (' + values + ');', function (error, result) {
            // logger.info(this.text);
            if (error) {
              throw error;
            }
            if (error) return rollback(client, done);
            if (error) {
              res.sendStatus(404);
            }
            client.query('COMMIT', done);
            res.sendStatus(201);
          });
        });
      });
    }
  // body...
  });
})
.put(function (req, res, next) {
  var listing_id = req.body.listing_id;
  var property_gid = '\'' + req.body.property_gid + '\'';
  var date_start = '\'' + req.body.date_start + '\'';
  var date_end = '\'' + req.body.date_end + '\'';
  var pets = '\'' + req.body.pets + '\'';
  var prefered_customer = '\'' + req.body.prefered_customer + '\'';
  var price = '\'' + req.body.price + '\'';
  var rent = '\'' + req.body.rent + '\'';
  var sale = '\'' + req.body.sale + '\'';
  pg.connect(config.connection, function (err, client, done) {
    if (err) {
      logger.info('Could not connect to postgres');
    } else {
      client.query('BEGIN', function (err) {
        if (err) return rollback(client, done);
        process.nextTick(function () {
          var columns = '(property_gid,date_start,date_end,price,pets,prefered_customer,rent,sale) ';
          var values = property_gid + ',' + 'to_date(' + date_start + ',\'DD-MM-YYYY\')' + ',' + 'to_date(' + date_end + ',\'DD-MM-YYYY\')' + ',' + price + ',' + pets + ',' + prefered_customer + ',' + rent + ',' + sale;
          client.query('UPDATE public.listing SET ' + columns + ' = (' + values + ') WHERE id=$1;', [listing_id], function (error, result) {
            logger.info(this.text);
            if (error) {
              throw error;
            }
            if (error) return rollback(client, done);
            if (error) {
              res.sendStatus(404);
            }
            client.query('COMMIT', done);
            res.sendStatus(201);
          });
        });
      });
    }
  });
});

module.exports = router;
