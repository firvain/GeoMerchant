'use strict';
/* eslint no-shadow: ["error", { "hoist": "never" }] */
var config = require('../../config/config');
var express = require('express');
var logger = require('../../utils/logger');
var pg = require('pg');
var rollback = require('../../utils/rollback');
var dbgeo = require('dbgeo');
var router = express.Router();

router.route('/property/:adminid')
.get(function getProperty(req, res) {
  var id = req.params.adminid;
  pg.connect(config.connection, function connectToPG(err, client, done) {
    var whatTofetch;
    var fromWhat;
    if (err) {
      res.status(503).json({
        msg: 'Service Unavailable'
      });
      logger.error('Could not connect to postgres');
      return err;
    }
    whatTofetch = 'public.property.estatetype,public.property.estatetype_en,public.property.plotarea,public.property.gid,public.property.estatearea,public.property.bedrooms,public.property.parking,public.property.furnished,  public.property.view,  public.property.heating,  public.property.cooling,public.property.title,public.property.year,public.property.other,public.property.parcel_num,public.property.plan_num,public.property.area_name,public.property.street_el,public.property.ps_code,public.property.floor,public.property.street_en,public.property.street_number,public.property."isnew"';
    fromWhat = 'public.owner_property ' + 'INNER JOIN public.owner ON (public.owner_property.owner_id = public.owner.id)' + 'INNER JOIN public.property ON (public.owner_property.property_gid = public.property.gid)';
    client.query('select ' + whatTofetch + ',ST_AsGeoJSON(public.property.the_geom) as geom ' + 'FROM ' + fromWhat + ' where public.owner.id=$1 ', [id],
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
        }, function dbgeoTransform(dbgeoError, dbgeoResult) {
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


router.route('/property')
.get(function getProperty(req, res) {
  var gid = req.query.gid;
  pg.connect(config.connection, function (err, client, done) {
    var text = 'SELECT *,ST_AsGeoJSON(public.property.the_geom) as geom FROM public.property where gid=$1';
    if (err) {
      throw err;
    }
    client.query(text, [gid], function (error, result) {
      done();
      if (result) {
        if (result.rows.length === 0) {
          res.sendStatus(404);
        } else {
          dbgeo.parse({
            data: result.rows,
            geometryColumn: 'geom'
          }, function (erro, resu) {
            if (erro) {
              res.sendStatus(404);
            } else {
              res.send(resu);
            }
          });
        }
      } else {
        res.sendStatus(404);
      }
    });
  });
})
.post(function insertProperty(req, res, next) {
  var estatetype = '\'' + req.body.estateType + '\'';
  var estatetypeEn = '\'' + req.body.estateType_en + '\'';
  var estatearea = '\'' + req.body.estatearea + '\'';
  var plotarea = '\'' + req.body.plotarea + '\'';
  var bedrooms = '\'' + req.body.bedrooms + '\'';
  var parking = '\'' + req.body.parking + '\'';
  var furnished = '\'' + req.body.furnished + '\'';
  var title = '\'' + req.body.title + '\'';
  var year = '\'' + req.body.year + '\'';
  var other = '\'' + req.body.other + '\'';
  var parcelNum = '\'' + req.body.parcel_num + '\'';
  var planNum = '\'' + req.body.plan_num + '\'';
  var areaName = '\'' + req.body.area_name + '\'';
  var streetEl = '\'' + req.body.street_el + '\'';
  var streetNumber = '\'' + req.body.street_number + '\'';
  var psCode = '\'' + req.body.ps_code + '\'';
  var floor = '\'' + req.body.floor + '\'';
  var streetEn = '\'' + req.body.street_en + '\'';
  var isnew = '\'' + req.body.isnew + '\'';
  var view = '\'' + req.body.view + '\'';
  var heating = '\'' + req.body.heating + '\'';
  var cooling = '\'' + req.body.cooling + '\'';
  var x = req.body.x;
  var y = req.body.y;
  var adminId = req.body.adminId;
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
        var columns = '(estatetype,estatetype_en,estatearea,plotarea,bedrooms,parking,furnished,title,year,other,parcel_num,plan_num,area_name,street_el,street_number,ps_code,floor,street_en,isnew,view,heating,cooling,the_geom) ';
        var values = estatetype + ',' + estatetypeEn + ',' + estatearea + ',' + plotarea + ',' + bedrooms + ',' + parking + ',' + furnished + ',' + title + ',' + year + ',' + other + ',' + parcelNum + ',' + planNum + ',' + areaName + ',' + streetEl + ',' + streetNumber + ',' + psCode + ',' + floor + ',' + streetEn + ',' + isnew + ',' + view + ',' + heating + ',' + cooling;
        var geom = ',ST_GeomFromText(\'POINT(' + x + ' ' + y + ')\',4326)) RETURNING gid';
        client.query('INSERT INTO public.property ' + columns + 'VALUES (' + values + geom, function query1(queryErr, queryRes) {
          var propertygid;
          if (queryErr) {
            res.status(500).json({
              msg: 'Internal Server Error'
            });
            logger.error(queryErr);
            return rollback(client, done);
          }
          propertygid = queryRes.rows[0].gid;
          client.query('INSERT INTO public.owner_property (owner_id,property_gid) VALUES (' + adminId + ',' + propertygid + ')',
          function query2(queryError, queryResult) {
            if (queryError) {
              res.status(500).json({
                msg: 'Internal Server Error'
              });
              logger.error(queryError);
              return rollback(client, done);
            }
            client.query('COMMIT', done);
            res.status(201).json({
              msg: 'Successfully Created'
            });
            return true;
          });
          return true;
        });
      });
      return true;
    });
    return true;
  });
})
.delete(function deleteProperty(req, res) {
  var gid = req.body.gid;
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
        var text = 'DELETE FROM public.property WHERE gid= $1';
        client.query(text, [gid], function query1(queryErr, queryRes) {
          if (queryErr) {
            res.status(500).json({
              msg: 'Internal Server Error'
            });
            logger.error(queryErr);
            return rollback(client, done);
          }
          client.query('COMMIT', done);
          res.status(200).json({
            msg: 'Successfully Deleted',
            propertygid: gid
          });
          return true;
        });
      });
      return true;
    });
    return true;
  });
})
.put(function updateProperty(req, res) {

  var estatetype = '\'' + req.body.estateType + '\'';
  var estatetypeEn = '\'' + req.body.estateType_en + '\'';
  var estatearea = '\'' + req.body.estatearea + '\'';
  var plotarea = '\'' + req.body.plotarea + '\'';
  var bedrooms = '\'' + req.body.bedrooms + '\'';
  var parking = '\'' + req.body.parking + '\'';
  var furnished = '\'' + req.body.furnished + '\'';
  var title = '\'' + req.body.title + '\'';
  var year = '\'' + req.body.year + '\'';
  var other = '\'' + req.body.other + '\'';
  var parcelNum = '\'' + req.body.parcel_num + '\'';
  var planNum = '\'' + req.body.plan_num + '\'';
  var areaName = '\'' + req.body.area_name + '\'';
  var streetEl = '\'' + req.body.street_el + '\'';
  var streetNumber = '\'' + req.body.street_number + '\'';
  var psCode = '\'' + req.body.ps_code + '\'';
  var floor = '\'' + req.body.floor + '\'';
  var streetEn = '\'' + req.body.street_en + '\'';
  var isnew = '\'' + req.body.isnew + '\'';
  var view = '\'' + req.body.view + '\'';
  var heating = '\'' + req.body.heating + '\'';
  var cooling = '\'' + req.body.cooling + '\'';
  var x = req.body.x;
  var y = req.body.y;
  var gid = req.body.gid;
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
        var columns = '(estatetype,estatetype_en,estatearea,plotarea,bedrooms,parking,furnished,title,year,other,parcel_num,plan_num,area_name,street_el,street_number,ps_code,floor,street_en,isnew,view,heating,cooling,the_geom) ';
        var values = estatetype + ',' + estatetypeEn + ',' + estatearea + ',' + plotarea + ',' + bedrooms + ',' + parking + ',' + furnished + ',' + title + ',' + year + ',' + other + ',' + parcelNum + ',' + planNum + ',' + areaName + ',' + streetEl + ',' + streetNumber + ',' + psCode + ',' + floor + ',' + streetEn + ',' + isnew + ',' + view + ',' + heating + ',' + cooling;
        var geom = ',ST_GeomFromText(\'POINT(' + x + ' ' + y + ')\',4326)) ';
        client.query('UPDATE public.property SET ' + columns + '= (' + values + geom + 'WHERE gid=$1', [gid],
        function query1(queryErr, queryRes) {
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
            propertygid: gid
          });
          return true;
        });
        return true;
      });
      return true;
    });
    return true;
  });
});

module.exports = router;
