'use strict';
var config = require('../../config/config');
var express = require('express');
var logger = require('../../utils/logger');
var pg = require('pg');
var rollback = require('../../utils/rollback');
var dbgeo = require('dbgeo');
var router = express.Router();

router.route('/all/:userId')
.get(function getAllPropertiesForUser(req, res) {
  var id = req.params.userId;
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
    whatTofetch = 'property.estatetype,property.estatetype_en,property.plotarea,property.gid,property.estatearea,property.bedrooms,property.parking,property.furnished,  property.view,  property.heating,  property.cooling,property.title,property.year,property.parcel_num,property.plan_num,property.area_name,property.street_el,property.ps_code,property.floor,property.street_en,property.street_number,property."isnew"';
    fromWhat = 'owner_property ' + 'INNER JOIN owner ON (owner_property.owner_id = owner.id)' + 'INNER JOIN property ON (owner_property.property_gid = property.gid)';
    client.query('select ' + whatTofetch + ',ST_AsGeoJSON(property.the_geom) as geom ' + 'FROM ' + fromWhat + ' where owner.id=$1 ', [id],
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


router.route('/')
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
  console.log(req.body);
  var estatetype = '\'' + req.body.estatetype + '\'';
  var estatetypeEn = '\'' + req.body.estatetypeEn + '\'';
  var estatearea = '\'' + req.body.area + '\'';
  var plotarea = '\'' + req.body.plotArea + '\'';
  var bedrooms = '\'' + req.body.bedrooms + '\'';
  var parking = '\'' + req.body.parking + '\'';
  var furnished = '\'' + req.body.furnished + '\'';
  var title = '\'' + req.body.title + '\'';
  var year = '\'' + req.body.year + '\'';
  var parcelNum = '\'' + req.body.parcelNumber + '\'';
  var planNum = '\'' + req.body.planNumber + '\'';
  var areaName = '\'' + req.body.areaName + '\'';
  var streetEl = '\'' + req.body.streetEl + '\'';
  var streetNumber = '\'' + req.body.streetNumber + '\'';
  var psCode = '\'' + req.body.pscode + '\'';
  var floor = '\'' + req.body.floor + '\'';
  var streetEn = '\'' + req.body.streetEn + '\'';
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
        var columns = '(estatetype,estatetype_en,estatearea,plotarea,bedrooms,parking,furnished,title,year,parcel_num,plan_num,area_name,street_el,street_number,ps_code,floor,street_en,isnew,view,heating,cooling,the_geom) ';
        var values = estatetype + ',' + estatetypeEn + ',' + estatearea + ',' + plotarea + ',' + bedrooms + ',' + parking + ',' + furnished + ',' + title + ',' + year + ',' + parcelNum + ',' + planNum + ',' + areaName + ',' + streetEl + ',' + streetNumber + ',' + psCode + ',' + floor + ',' + streetEn + ',' + isnew + ',' + view + ',' + heating + ',' + cooling;
        var geom = ',ST_Transform(ST_GeomFromText(\'POINT(' + x + ' ' + y + ')\',3857),4326)';
        client.query('INSERT INTO property ' + columns + 'VALUES (' + values + geom + ') RETURNING gid;', function query1(queryErr, queryRes) {
          console.log(this.text);
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
                msg: 'Successfully Created',
                gid: queryRes.rows[0].gid
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
  console.log(gid);
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
        var text = 'DELETE FROM public.property WHERE gid= $1 RETURNING gid as id;';
        client.query(text, [gid], function query1(queryErr, queryRes) {
          console.log(this.text);
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
            propertyId: queryRes.rows[0].id
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
  var estatetype = '\'' + req.body.estatetype + '\'';
  var estatetypeEn = '\'' + req.body.estatetypeEn + '\'';
  var estatearea = '\'' + req.body.area + '\'';
  var plotarea = '\'' + req.body.plotArea + '\'';
  var bedrooms = '\'' + req.body.bedrooms + '\'';
  var parking = '\'' + req.body.parking + '\'';
  var furnished = '\'' + req.body.furnished + '\'';
  var title = '\'' + req.body.title + '\'';
  var year = '\'' + req.body.year + '\'';
  var parcelNum = '\'' + req.body.parcelNumber + '\'';
  var planNum = '\'' + req.body.planNumber + '\'';
  var areaName = '\'' + req.body.areaName + '\'';
  var streetEl = '\'' + req.body.streetEl + '\'';
  var streetNumber = '\'' + req.body.streetNumber + '\'';
  var psCode = '\'' + req.body.pscode + '\'';
  var floor = '\'' + req.body.floor + '\'';
  var streetEn = '\'' + req.body.streetEn + '\'';
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
        var columns = '(estatetype,estatetype_en,estatearea,plotarea,bedrooms,parking,furnished,year,parcel_num,plan_num,area_name,street_el,street_number,ps_code,floor,street_en,isnew,view,heating,cooling,the_geom,title) ';
        var values = estatetype + ',' + estatetypeEn + ',' + estatearea + ',' + plotarea + ',' + bedrooms + ',' + parking + ',' + furnished + ',' + year + ',' + parcelNum + ',' + planNum + ',' + areaName + ',' + streetEl + ',' + streetNumber + ',' + psCode + ',' + floor + ',' + streetEn + ',' + isnew + ',' + view + ',' + heating + ',' + cooling;
        var geom = ',ST_Transform(ST_GeomFromText(\'POINT(' + x + ' ' + y + ')\',3857),4326) ';
        client.query('UPDATE public.property SET ' + columns + '= (' + values + geom + ',' + title + ') WHERE gid=$1 RETURNING gid as gid', [gid],
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
              propertyGid: queryRes.rows[0].gid
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
