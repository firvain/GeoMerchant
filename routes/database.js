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
var listings = require('./models/listing');
var rollback = require('../utils/rollback');


pg.defaults.poolSize = 25;


// ROUTES
// ==============================================
// create routes
// get an instance of router
router = express.Router();
router.use('/', listings);


router.get('/property', function (req, res) {
  var bbox = req.query.bbox;
  pg.connect(config.connection, function (err, client, done) {
    var qstring;
    var qfrom;
    var query;
    if (err) {
      logger.error('Could not connect to postgres');
    } else {
      logger.info('Connected');
      qstring = 'public.property.estatetype,public.property.estatetype_en,public.property.plotarea,public.property.gid,public.property.estatearea,public.property.bedrooms,' +
      'public.property.parking,public.property.furnished,public.property.view,public.property.heating,public.property.cooling,public.property.title,public.property.year,public.property.other,' +
      'public.property.parcel_num,public.property.plan_num,public.property.area_name,public.property.street_el,public.property.street_number,public.property.ps_code,' +
      'public.property.floor,public.property.street_en,public.property."isnew",public.owner.name_el,public.owner.lastname_el,public.owner.fathername_el,public.owner.name_en,public.owner.lastname_en,public.owner.fathername_en,' +
      'public.owner.phone1,public.owner.email,public.listing.date_start,public.listing.date_end,public.listing.price,public.listing.prefered_customer,public.listing.pets,public.listing.sale,public.listing.rent,' +
      'public.owner.phone2';
      qfrom = 'public.owner_property ' + 'INNER JOIN public.owner ON (public.owner_property.owner_id = public.owner.id) ' + 'INNER JOIN public.property ON (public.owner_property.property_gid = public.property.gid) ' + 'INNER JOIN public.listing ON (public.property.gid = public.listing.property_gid) ';
      query = client.query('SELECT ' + qstring + ',ST_AsGeoJSON(public.property.the_geom) as geom FROM ' + qfrom + 'WHERE public.property.the_geom && ST_MakeEnvelope(' + bbox.x1 + ',' + bbox.y1 + ',' + bbox.x2 + ',' + bbox.y2 + ',4326)', function (error, result) {
        if (result) {
          dbgeo.parse({
            data: result.rows,
            geometryColumn: 'geom'
          }, function (error, result) {
            if (error) {
              logger.error(' --- error --- ', error);
            } else {
              res.send(result);
            }
          });
        } else {
          logger.error(error);
        }
      });
    }
    done();
  });
});
router.get('/filteredproperty', function (req, res) {
  var bbox = req.query.bbox;
  if (typeof req.query.parking !== 'undefined') {
    parking = req.query.parking;
  } else {
    parking = false;
  }
  if (typeof req.query.furnished !== 'undefined') {
    furnished = req.query.furnished;
  } else {
    furnished = false;
  }
  if (typeof req.query.heating !== 'undefined') {
    heating = req.query.heating;
  } else {
    heating = false;
  }
  if (typeof req.query.cooling !== 'undefined') {
    cooling = req.query.cooling;
  } else {
    cooling = false;
  }
  if (typeof req.query.view !== 'undefined') {
    view = req.query.view;
  } else {
    view = false;
  }
  if (req.query.startPrice === '') {
    startPrice = 0;
  } else {
    startPrice = parseInt(req.query.startPrice, 10);
  }
  if (req.query.endPrice === '') {
    endPrice = 2147483647;
  } else {
    endPrice = parseInt(req.query.endPrice, 10);
  }
  estateType = '\'' + req.query.estateType + '\'';
  pg.connect(config.connection, function (err, client, done) {
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
    var query;
    if (err) {
      logger.error('Could not connect to postgres');
    } else {
      logger.info('Connected to cyprus db');
      qstring = 'public.property.estatetype,public.property.estatetype_en,public.property.plotarea,public.property.gid,public.property.estatearea,public.property.bedrooms,' + 'public.property.parking,public.property.furnished,public.property.view,public.property.heating,public.property.cooling,public.property.title,public.property.year,public.property.other,' + 'public.property.parcel_num,public.property.plan_num,public.property.area_name,public.property.street_el,public.property.ps_code,' + 'public.property.floor,public.property.street_en,public.property.street_number,public.property."isnew",public.owner.name_el,public.owner.lastname_el,public.owner.fathername_el,public.owner.name_en,public.owner.lastname_en,public.owner.fathername_en,' + 'public.owner.phone1,public.owner.email,public.listing.date_start,public.listing.date_end,public.listing.price,public.listing.prefered_customer,public.listing.pets,public.listing.sale,public.listing.rent,' + 'public.owner.phone2';
      qfrom = 'public.owner_property ' + 'INNER JOIN public.owner ON (public.owner_property.owner_id = public.owner.id) ' + 'INNER JOIN public.property ON (public.owner_property.property_gid = public.property.gid) ' + 'INNER JOIN public.listing ON (public.property.gid = public.listing.property_gid) ';
      qparking = ' AND public.property.parking=' + parking;
      qfurnished = ' AND public.property.furnished=' + furnished;
      qheating = ' AND public.property.heating=' + heating;
      qcooling = ' AND public.property.cooling=' + cooling;
      qview = ' AND public.property.view=' + view;
      qestateType = ' AND (public.property.estatetype = ' + estateType + ' OR public.property.estatetype_en = ' + estateType + ')';
      if (req.query.leaseType === 'Rent') {
        qleaseType = ' AND  public.listing.sale =false';
      } else {
        qleaseType = ' AND  public.listing.sale =true';
      }
      // var qleaseType = ' AND  public.listing.sale =\'' + req.query.leaseType + '\'';
      sqlQuery = 'SELECT ' + qstring + ',ST_AsGeoJSON(public.property.the_geom) as geom FROM ' + qfrom + 'WHERE public.property.the_geom && ST_MakeEnvelope(' + bbox.x1 + ',' + bbox.y1 + ',' + bbox.x2 + ',' + bbox.y2 + ',4326)' + qleaseType + qestateType;
      if (parking === 'true') {
        sqlQuery += qparking;
      }
      if (furnished === 'true') {
        sqlQuery += qfurnished;
      }
      if (heating === 'true') {
        sqlQuery += qheating;
      }
      if (cooling === 'true') {
        sqlQuery += qcooling;
      }
      if (view === 'true') {
        sqlQuery += qview;
      }
      qprice = ' AND public.listing.price BETWEEN ' + startPrice + ' AND ' + endPrice;
      sqlQuery += qprice;
      query = client.query(sqlQuery, function (error, result) {
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
router.get('/uses/:propertygid', function (req, res) {
  var gid = req.params.propertygid;
  pg.connect(config.connection, function (err, client, done) {
    var query;
    if (err) {
      logger.info('Could not connect to postgres');
    } else {
      logger.info('Connected');
      query = client.query('select property_services_analysis(' + gid + ');', function (error, result) {
        done();
        // logger.info(query);
        if (error) {
          logger.info(error);
        }
        if (result) {
          res.send(result.rows[0]);
        } else {
          logger.info('error in quering db');
        }
      });
    }
  });
});
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
