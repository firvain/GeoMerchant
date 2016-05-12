'use strict';
/* eslint no-shadow: ["error", { "hoist": "never" }] */
var config = require('../../config/config');
var express = require('express');
var logger = require('../../utils/logger');
var pg = require('pg');
var router = express.Router();
var dbgeo = require('dbgeo');

router.route('/listed')
.get(function getProperty(req, res) {
  pg.connect(config.connection, function connectToPG(err, client, done) {
    var qstring;
    var qfrom;
    if (err) {
      res.status(503).json({
        msg: 'Service Unavailable'
      });
      logger.error('Could not connect to postgres');
      return err;
    }
    qstring = 'public.property.estatetype,public.property.estatetype_en,public.property.plotarea,public.property.gid,public.property.estatearea,public.property.bedrooms,' +
    'public.property.parking,public.property.furnished,public.property.view,public.property.heating,public.property.cooling,public.property.title,public.property.year,public.property.other,' +
    'public.property.parcel_num,public.property.plan_num,public.property.area_name,public.property.street_el,public.property.street_number,public.property.ps_code,' +
    'public.property.floor,public.property.street_en,public.property."isnew",public.owner.name_el,public.owner.lastname_el,public.owner.fathername_el,public.owner.name_en,public.owner.lastname_en,public.owner.fathername_en,' +
    'public.owner.phone1,public.owner.email,public.listing.date_start,public.listing.date_end,public.listing.price,public.listing.prefered_customer,public.listing.pets,public.listing.sale,public.listing.rent,' +
    'public.owner.phone2';
    qfrom = 'public.owner_property ' + 'INNER JOIN public.owner ON (public.owner_property.owner_id = public.owner.id) ' + 'INNER JOIN public.property ON (public.owner_property.property_gid = public.property.gid) ' + 'INNER JOIN public.listing ON (public.property.gid = public.listing.property_gid);';
    client.query('SELECT ' + qstring + ',ST_AsGeoJSON(public.property.the_geom) as geom FROM ' + qfrom,
      function queryDB(queryErr, queryRes) {
        done();
        if (queryErr) {
          res.sendStatus(500);
          logger.error(queryErr);
          return queryErr;
        }
        if (queryRes.rowCount === 0) {
          res.status(404).json({
            msg: 'Sorry, we cannot find any properties!'
          });
          return false;
        }
        dbgeo.parse({
          data: queryRes.rows,
          geometryColumn: 'geom'
        },
        function dbgeoTransform(dbgeoError, dbgeoResult) {
          if (dbgeoError) {
            res.sendStatus(500);
            logger.error(dbgeoError);
            return dbgeoError;
          }
          res.status(200).send(dbgeoResult);
          return true;
        });
        return true;
      });
    return true;
  });
});

router.route('/listed/filters')
.get(function getPropertyByFilters(req, res) {
  var filters = {};
  filters.parking = typeof req.query.parking !== 'undefined' ? req.query.parking : false;
  filters.furnished = typeof req.query.furnished !== 'undefined' ? req.query.furnished : false;
  filters.heating = typeof req.query.heating !== 'undefined' ? req.query.heating : false;
  filters.cooling = typeof req.query.cooling !== 'undefined' ? req.query.cooling : false;
  filters.view = typeof req.query.view !== 'undefined' ? req.query.view : false;
  filters.startPrice = req.query.startPrice !== '' ? parseInt(req.query.startPrice, 10) : 0;
  filters.endPrice = req.query.endPrice !== '' ? parseInt(req.query.endPrice, 10) : 2147483647;
  filters.estateType = '\'' + req.query.estateType + '\'';
  pg.connect(config.connection, function connectToPG(err, client, done) {
    var qestateType;
    var qleaseType;
    var sqlQuery;
    var qstring;
    var qfrom;
    var qparking;
    var qfurnished;
    var qheating;
    var qcooling;
    var qview;
    var qprice;
    if (err) {
      res.status(503).json({
        msg: 'Service Unavailable'
      });
      logger.error('Could not connect to postgres');
      return err;
    }
    qstring = 'property.estatetype, property.estatetype_en, property.plotarea, property.gid,' +
    'property.estatearea, property.bedrooms, property.parking, property.furnished, property.view,' +
    'property.heating, property.cooling, property.title, property.year, property.other,' +
    ' property.parcel_num, property.plan_num, property.area_name,' +
    'property.street_el, property.ps_code, property.floor, property.street_en, property.street_number,' +
    'property."isnew", owner.name_el, owner.lastname_el, owner.fathername_el, owner.name_en,' +
    'owner.lastname_en, owner.fathername_en, owner.phone1, owner.email, listing.date_start, listing.date_end,' +
    'listing.price, listing.prefered_customer, listing.pets, listing.sale, listing.rent, owner.phone2';
    qfrom = ' owner_property  INNER JOIN  owner ON ( owner_property.owner_id =  owner.id) ' +
    'INNER JOIN  property ON ( owner_property.property_gid =  property.gid) ' +
    'INNER JOIN  listing ON ( property.gid =  listing.property_gid) ';
    qparking = ' AND  property.parking=' + filters.parking;
    qfurnished = ' AND  property.furnished=' + filters.furnished;
    qheating = ' AND  property.heating=' + filters.heating;
    qcooling = ' AND  property.cooling=' + filters.cooling;
    qview = ' AND  property.view=' + filters.view;
    qestateType = ' AND ( property.estatetype = ' + filters.estateType + ' OR  property.estatetype_en = ' + filters.estateType + ')';
    if (req.query.leaseType === 'Rent') {
      qleaseType = ' AND   listing.sale =false';
    } else {
      qleaseType = ' AND   listing.sale =true';
    }
      // var qleaseType = ' AND   listing.sale =\'' + req.query.leaseType + '\'';
    sqlQuery = 'SELECT ' + qstring + ',ST_AsGeoJSON( property.the_geom) as geom FROM ' + qfrom + qleaseType + qestateType;
    if (filters.parking === 'true') {
      sqlQuery += qparking;
    }
    if (filters.furnished === 'true') {
      sqlQuery += qfurnished;
    }
    if (filters.heating === 'true') {
      sqlQuery += qheating;
    }
    if (filters.cooling === 'true') {
      sqlQuery += qcooling;
    }
    if (filters.view === 'true') {
      sqlQuery += qview;
    }
    qprice = ' AND public.listing.price BETWEEN ' + filters.startPrice + ' AND ' + filters.endPrice;
    sqlQuery += qprice;
    client.query(sqlQuery,
      function queryDB(queryErr, queryRes) {
        console.log(this.text);
        done();
        if (queryErr) {
          res.sendStatus(500);
          logger.error(queryErr);
          return queryErr;
        }
        if (queryRes.rowCount === 0) {
          res.status(404).json({
            msg: 'Sorry, we cannot find any properties with these filters!',
            filters: filters
          });
          return false;
        }
        dbgeo.parse({
          data: queryRes.rows,
          geometryColumn: 'geom'
        },
        function dbgeoTransform(dbgeoError, dbgeoResult) {
          if (dbgeoError) {
            res.sendStatus(500);
            logger.error(dbgeoError);
            return dbgeoError;
          }
          res.status(200).send(dbgeoResult);
          return true;
        });
        return true;
      });
    return true;
  });
});


module.exports = router;
