'use strict';
/* eslint no-shadow: ["error", { "hoist": "never" }] */
var config = require('../../config/config');
var express = require('express');
var logger = require('../../utils/logger');
var pg = require('pg');
var router = express.Router();
var rollback = require('../../utils/rollback');

router.route('/listing')
.get(function getListing(req, res) {
  var propertyGid = req.query.gid;
  var text;
  pg.connect(config.connection, function connectToPG(err, client, done) {
    if (err) {
      res.status(503).json({
        msg: 'Service Unavailable'
      });
      logger.error('Could not connect to postgres');
      return err;
    }
    text = 'SELECT id,to_char(date_end,\'DD-MM-YYYY\') as date_end,to_char(date_start,\'DD-MM-YYYY\') as date_start,price,pets,prefered_customer,sale,rent FROM public.listing WHERE public.listing.property_gid=$1;';
    client.query(text, [propertyGid], function queryDB(queryErr, queryRes) {
      done();
      if (queryErr) {
        res.sendStatus(500);
        logger.error(queryErr);
        return queryErr;
      }
      if (queryRes.rowCount === 0) {
        res.status(404).json({
          msg: 'Sorry, we cannot find listing!',
          propertyId: propertyGid
        });
        return false;
      }
      res.status(200).json(queryRes.rows[0]);
      return true;
    });
    return true;
  });
})
.post(function insertListing(req, res) {
  var propertyGid = '\'' + req.body.property_gid + '\'';
  var dateStart = '\'' + req.body.date_start + '\'';
  var dateEnd = '\'' + req.body.date_end + '\'';
  var pets = '\'' + req.body.pets + '\'';
  var preferedCustomer = '\'' + req.body.prefered_customer + '\'';
  var price = '\'' + req.body.price + '\'';
  var rent = '\'' + req.body.rent + '\'';
  var sale = '\'' + req.body.sale + '\'';
  pg.connect(config.connection, function connectToPG(err, client, done) {
    if (err) {
      res.status(503).json({
        msg: 'Service Unavailable'
      });
      logger.error('Could not connect to postgres');
      return err;
    }
    client.query('BEGIN', function beginTransaction(error) {
      if (error) {
        res.sendStatus(500);
        logger.error(error);
        return rollback(client, done);
      }
      process.nextTick(function queryDB() {
        var columns = '(property_gid,date_start,date_end,price,pets,prefered_customer,rent,sale) ';
        var values = propertyGid + ',' + 'to_date(' + dateStart + ',\'DD-MM-YYYY\')' + ',' + 'to_date(' + dateEnd + ',\'DD-MM-YYYY\')' + ',' + price + ',' + pets + ',' + preferedCustomer + ',' + rent + ',' + sale;
        client.query('INSERT INTO public.listing ' + columns + 'VALUES (' + values + ');',
          function queryResult(queryErr) {
            if (queryErr) {
              res.status(500).json({
                msg: 'Internal Server Error'
              });
              logger.error(queryErr);
              return rollback(client, done);
            }
            client.query('COMMIT', done);
            res.status(201).json({
              msg: 'Successfully Created',
              propertyId: propertyGid
            });
            return true;
          });
      });
      return true;
    });
    return true;
  });
})
.put(function updateListing(req, res) {
  var listingId = req.body.listing_id;
  var propertyGid = '\'' + req.body.property_gid + '\'';
  var dateStart = '\'' + req.body.date_start + '\'';
  var dateEnd = '\'' + req.body.date_end + '\'';
  var pets = '\'' + req.body.pets + '\'';
  var preferedCustomer = '\'' + req.body.prefered_customer + '\'';
  var price = '\'' + req.body.price + '\'';
  var rent = '\'' + req.body.rent + '\'';
  var sale = '\'' + req.body.sale + '\'';
  pg.connect(config.connection, function connectToPG(err, client, done) {
    if (err) {
      res.status(503).json({
        msg: 'Service Unavailable'
      });
      logger.error('Could not connect to postgres');
      return err;
    }
    client.query('BEGIN', function beginTransaction(error) {
      if (error) {
        res.sendStatus(500);
        logger.error(error);
        return rollback(client, done);
      }
      process.nextTick(function queryDB() {
        var columns = '(property_gid,date_start,date_end,price,pets,prefered_customer,rent,sale) ';
        var values = propertyGid + ',' + 'to_date(' + dateStart + ',\'DD-MM-YYYY\')' + ',' + 'to_date(' + dateEnd + ',\'DD-MM-YYYY\')' + ',' + price + ',' + pets + ',' + preferedCustomer + ',' + rent + ',' + sale;
        client.query('UPDATE public.listing SET ' + columns + ' = (' + values + ') WHERE id=$1;', [listingId],
        function queryResult(queryErr) {
          if (queryErr) {
            res.status(500).json({
              msg: 'Internal Server Error'
            });
            logger.error(queryErr);
            return rollback(client, done);
          }
          client.query('COMMIT', done);
          res.status(200).json({
            msg: 'Successfully Updated',
            propertyId: listingId
          });
          return true;
        });
      });
      return true;
    });
    return true;
  });
})
.delete(function deleteListing(req, res) {
  var listingId = req.body.listing_id;
  pg.connect(config.connection, function connectToPG(err, client, done) {
    if (err) {
      res.status(503).json({
        msg: 'Service Unavailable'
      });
      logger.error('Could not connect to postgres');
    } else {
      client.query('BEGIN', function beginTransaction(error) {
        if (error) {
          res.status(500).json({
            msg: 'Internal Server Error'
          });
          logger.error(error);
          return rollback(client, done);
        }
        process.nextTick(function queryDB() {
          client.query('DELETE from public.listing WHERE public.listing.property_gid=$1;',
            [listingId],
            function queryResult(queryErr, queryRes) {
              if (queryErr) {
                res.sendStatus(500);
                logger.error(queryErr);
                return rollback(client, done);
              }
              client.query('COMMIT', done);
              if (queryRes.rowCount === 0) {
                res.status(404).json({
                  msg: 'Sorry, we cannot find listing!',
                  propertyId: listingId
                });
                return false;
              }
              res.status(200).json({
                msg: 'Successfully Deleted',
                propertyId: listingId
              });
              return true;
            });
        });
        return true;
      });
    }
  });
});
module.exports = router;
