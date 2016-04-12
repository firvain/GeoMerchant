// BASE SETUP
// ==============================================
var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/map/login');
var pg = require('pg');
var config = require('../config/config');
var logger = require('../utils/logger');

var dbgeo = require('dbgeo');
var parking;
var furnished;
var heating;
var cooling;
var view;
var estateType;
var qprice;
var startPrice;
var endPrice;
var router;
var rollback = require('../utils/rollback');
var listings = require('./controllers/listing');
var uses = require('./controllers/uses');
var property = require('./controllers/property');


pg.defaults.poolSize = 25;


// ROUTES
// ==============================================
// create routes
// get an instance of router
router = express.Router();
router.use('/', listings);
router.use('/', uses);
router.use('/', property);


router.post('/admin', function (req, res) {
  var gid = req.body.id;
  pg.connect(config.connection, function (err, client, done) {
    var whatTofetch;
    var fromWhat;
    var query;
    if (err) {
      logger.info('Could not connect to postgres');
    } else {
      logger.info('Connected');
      whatTofetch = 'public.property.estatetype,public.property.estatetype_en,public.property.plotarea,public.property.gid,public.property.estatearea,public.property.bedrooms,public.property.parking,public.property.furnished,  public.property.view,  public.property.heating,  public.property.cooling,public.property.title,public.property.year,public.property.other,public.property.parcel_num,public.property.plan_num,public.property.area_name,public.property.street_el,public.property.ps_code,public.property.floor,public.property.street_en,public.property.street_number,public.property."isnew"';
      fromWhat = 'public.owner_property ' + 'INNER JOIN public.owner ON (public.owner_property.owner_id = public.owner.id)' + 'INNER JOIN public.property ON (public.owner_property.property_gid = public.property.gid)';
      query = client.query('select ' + whatTofetch + ',ST_AsGeoJSON(public.property.the_geom) as geom ' + 'FROM ' + fromWhat + ' where public.owner.id=$1 ', [gid], function (error, result) {
        // logger.info(this.text);
        done();
        if (result) {
          dbgeo.parse({
            data: result.rows,
            geometryColumn: 'geom'
          }, function (error, result) {
            if (error) {
              logger.info(' --- error --- ', error);
            } else {
              res.send(result);
            }
          });
        } else {
          logger.info(error);
        }
      });
    }
  });
});
router.post('/insert', function (req, res, next) {
  var estatetype = '\'' + req.body.estateType + '\'';
  var estatetype_en = '\'' + req.body.estateType_en + '\'';
  var estatearea = '\'' + req.body.estatearea + '\'';
  var plotarea = '\'' + req.body.plotarea + '\'';
  var bedrooms = '\'' + req.body.bedrooms + '\'';
  var parking = '\'' + req.body.parking + '\'';
  var furnished = '\'' + req.body.furnished + '\'';
  var title = '\'' + req.body.title + '\'';
  var year = '\'' + req.body.year + '\'';
  var other = '\'' + req.body.other + '\'';
  var parcel_num = '\'' + req.body.parcel_num + '\'';
  var plan_num = '\'' + req.body.plan_num + '\'';
  var area_name = '\'' + req.body.area_name + '\'';
  var street_el = '\'' + req.body.street_el + '\'';
  var street_number = '\'' + req.body.street_number + '\'';
  var ps_code = '\'' + req.body.ps_code + '\'';
  var floor = '\'' + req.body.floor + '\'';
  var street_en = '\'' + req.body.street_en + '\'';
  var isnew = '\'' + req.body.isnew + '\'';
  var view = '\'' + req.body.view + '\'';
  var heating = '\'' + req.body.heating + '\'';
  var cooling = '\'' + req.body.cooling + '\'';
  var x = req.body.x;
  var y = req.body.y;
  var adminId = req.body.adminId;
  pg.connect(config.connection, function (err, client, done) {
    if (err) {
      logger.info('Could not connect to postgres');
    } else {
      logger.info('Connected');
      client.query('BEGIN', function (err) {
        if (err) return rollback(client, done);
        process.nextTick(function () {
          var columns = '(estatetype,estatetype_en,estatearea,plotarea,bedrooms,parking,furnished,title,year,other,parcel_num,plan_num,area_name,street_el,street_number,ps_code,floor,street_en,isnew,view,heating,cooling,the_geom) ';
          var values = estatetype + ',' + estatetype_en + ',' + estatearea + ',' + plotarea + ',' + bedrooms + ',' + parking + ',' + furnished + ',' + title + ',' + year + ',' + other + ',' + parcel_num + ',' + plan_num + ',' + area_name + ',' + street_el + ',' + street_number + ',' + ps_code + ',' + floor + ',' + street_en + ',' + isnew + ',' + view + ',' + heating + ',' + cooling;
          var geom = ',ST_GeomFromText(\'POINT(' + x + ' ' + y + ')\',4326)) RETURNING gid';
          client.query('INSERT INTO public.property ' + columns + 'VALUES (' + values + geom, function (error, result) {
            var propertygid;
            if (error) {
              throw error;
            }
            if (error) return rollback(client, done);
            propertygid = result.rows[0].gid;
            client.query('INSERT INTO public.owner_property (owner_id,property_gid) VALUES (' + adminId + ',' + propertygid + ')', function (error, result) {
              if (error) {
                throw error;
              }
              if (err) return rollback(client, done);
              client.query('COMMIT', done);
              res.sendStatus(201);
            });
          });
        });
      });
    }
  });
});
router.post('/delete', function (req, res) {
  var gid = req.body.gid;
  logger.info('asdasdd' + gid);
  pg.connect(config.connection, function (err, client, done) {
    if (err) {
      throw err;
    }
    client.query('BEGIN', function (err1) {
      if (err1) return rollback(client, done);
      // as long as we do not call the `done` callback we can do
      // whatever we want...the client is ours until we call `done`
      // on the flip side, if you do call `done` before either COMMIT or ROLLBACK
      // what you are doing is returning a client back to the pool while it
      // is in the middle of a transaction.
      // Returning a client while its in the middle of a transaction
      // will lead to weird & hard to diagnose errors.
      process.nextTick(function () {
        var text = 'DELETE FROM public.property WHERE gid= $1';
        client.query(text, [gid], function (error) {
          // logger.info(this.text);
          if (error) return rollback(client, done);
          client.query('COMMIT', done);
          res.sendStatus(200);
        });
      });
    });
  });
});
router.post('/fetch', function (req, res, next) {
  var gid = req.body.gid;
  pg.connect(config.connection, function (err, client, done) {
    var text = 'SELECT *,ST_AsGeoJSON(public.property.the_geom) as geom FROM public.property where gid=$1';
    if (err) {
      throw err;
    }
    client.query(text, [gid], function (error, result) {
      logger.info(this.text);
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
});
router.post('/update', ensureLoggedIn, function (req, res) {
  var estatetype = '\'' + req.body.estateType + '\'';
  var estatetype_en = '\'' + req.body.estateType_en + '\'';
  var estatearea = '\'' + req.body.estatearea + '\'';
  var plotarea = '\'' + req.body.plotarea + '\'';
  var bedrooms = '\'' + req.body.bedrooms + '\'';
  var parking = '\'' + req.body.parking + '\'';
  var furnished = '\'' + req.body.furnished + '\'';
  var title = '\'' + req.body.title + '\'';
  var year = '\'' + req.body.year + '\'';
  var other = '\'' + req.body.other + '\'';
  var parcel_num = '\'' + req.body.parcel_num + '\'';
  var plan_num = '\'' + req.body.plan_num + '\'';
  var area_name = '\'' + req.body.area_name + '\'';
  var street_el = '\'' + req.body.street_el + '\'';
  var street_number = '\'' + req.body.street_number + '\'';
  var ps_code = '\'' + req.body.ps_code + '\'';
  var floor = '\'' + req.body.floor + '\'';
  var street_en = '\'' + req.body.street_en + '\'';
  var isnew = '\'' + req.body.isnew + '\'';
  var view = '\'' + req.body.view + '\'';
  var heating = '\'' + req.body.heating + '\'';
  var cooling = '\'' + req.body.cooling + '\'';
  var x = req.body.x;
  var y = req.body.y;
  var gid = req.body.gid;
  pg.connect(config.connection, function (err, client, done) {
    if (err) {
      logger.info('Could not connect to postgres');
    } else {
      logger.info('Connected');
      client.query('BEGIN', function (err) {
        if (err) return rollback(client, done);
        process.nextTick(function () {
          var columns = '(estatetype,estatetype_en,estatearea,plotarea,bedrooms,parking,furnished,title,year,other,parcel_num,plan_num,area_name,street_el,street_number,ps_code,floor,street_en,isnew,view,heating,cooling,the_geom) ';
          var values = estatetype + ',' + estatetype_en + ',' + estatearea + ',' + plotarea + ',' + bedrooms + ',' + parking + ',' + furnished + ',' + title + ',' + year + ',' + other + ',' + parcel_num + ',' + plan_num + ',' + area_name + ',' + street_el + ',' + street_number + ',' + ps_code + ',' + floor + ',' + street_en + ',' + isnew + ',' + view + ',' + heating + ',' + cooling;
          var geom = ',ST_GeomFromText(\'POINT(' + x + ' ' + y + ')\',4326)) ';
          client.query('UPDATE public.property SET ' + columns + '= (' + values + geom + 'WHERE gid=$1', [gid], function (error, result) {
            // logger.info(this.text);
            if (error)
              throw error;
            if (error) return rollback(client, done);
            client.query('COMMIT', done);
            if (result) {
              res.sendStatus(200);
            } else {
              res.sendStatus(500);
            }
          });
        });
      });
    }
  });
});

module.exports = router;
