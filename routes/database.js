// BASE SETUP
// ==============================================
var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/map/login');
var pg = require('pg');
var conString = "postgres://etsipis:TR81VH83YH1WrSqjeblH@188.226.158.168/cyprus";
// var conString = "postgres://etsipis:TR81VH83YH1WrSqjeblH@localhost/cyprus";
var dbgeo = require("dbgeo");
// var client = new pg.Client(conString);
pg.defaults.poolSize = 25;
var parking, furnished, heating, cooling, view, leaseType, qprice, startPrice, endPrice;

// Connect to postgres
// client.connect(function(error, success) {
//   if (error) {
//     console.log("Could not connect to postgres");
//   } else {
//     console.log("Connected");
//   }
// });
// ROUTES
// ==============================================
// create routes 
// get an instance of router
var router = express.Router();

router.get('/property', function(req, res, next) {

  var bbox = req.query.bbox;
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log("Could not connect to postgres");
    } else {
      console.log("Connected");
      var qstring = 'public.property.estatetype,public.property.plotarea,public.property.gid,public.property.estatearea,public.property.bedrooms,' + 'public.property.parking,public.property.furnished,public.property.view,public.property.heating,public.property.cooling,public.property.title,public.property.year,public.property.other,' + 'public.property.parcel_num,public.property.plan_num,public.property.area_name,public.property.street_el,public.property.h_num_el,public.property.ps_code,' + 'public.property.floor,public.property.street_en,public.property.h_num_en,public.property."new",public.owner.name_el,public.owner.lastname_el,public.owner.fathername_el,public.owner.name_en,public.owner.lastname_en,public.owner.fathername_en,' + 'public.owner.phone1,public.owner.email,public.listing.date_start,public.listing.date_end,public.listing.price,public.listing.prefered_customer,public.listing.pets,' + 'public.listing.type_el,public.listing.type_en,public.owner.phone2';
      var qfrom = 'public.owner_property ' + 'INNER JOIN public.owner ON (public.owner_property.owner_id = public.owner.id) ' + 'INNER JOIN public.property ON (public.owner_property.property_gid = public.property.gid) ' + 'INNER JOIN public.listing ON (public.property.gid = public.listing.property_gid) ';
      var query = client.query('SELECT ' + qstring + ',ST_AsGeoJSON(public.property.the_geom) as geom FROM ' + qfrom + 'WHERE public.property.the_geom && ST_MakeEnvelope(' + bbox.x1 + ',' + bbox.y1 + ',' + bbox.x2 + ',' + bbox.y2 + ',4326)', function(error, result) {
        done();
        // console.log(query.text);
        if (result) {
          dbgeo.parse({
            "data": result.rows,
            "geometryColumn": "geom",
          }, function(error, result) {
            if (error) {
              console.log(" --- error --- ", error);
            } else {
              res.send(result);
            }
          });
        } else {
          console.log(error);
        }
      });
    }
  });
});
router.get('/filteredproperty', function(req, res, next) {
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
    startPrice = parseInt(req.query.startPrice);
  }
  if (req.query.endPrice === '') {
    endPrice = 9999999;
  } else {
    endPrice = parseInt(req.query.endPrice);
  }
  // console.log(req.params.startPrice.req.params.endPrice)
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log("Could not connect to postgres");
    } else {
      console.log("Connected");
      var qstring = 'public.property.estatetype,public.property.plotarea,public.property.gid,public.property.estatearea,public.property.bedrooms,' + 'public.property.parking,public.property.furnished,public.property.view,public.property.heating,public.property.cooling,public.property.title,public.property.year,public.property.other,' + 'public.property.parcel_num,public.property.plan_num,public.property.area_name,public.property.street_el,public.property.h_num_el,public.property.ps_code,' + 'public.property.floor,public.property.street_en,public.property.h_num_en,public.property."new",public.owner.name_el,public.owner.lastname_el,public.owner.fathername_el,public.owner.name_en,public.owner.lastname_en,public.owner.fathername_en,' + 'public.owner.phone1,public.owner.email,public.listing.date_start,public.listing.date_end,public.listing.price,public.listing.prefered_customer,public.listing.pets,' + 'public.listing.type_el,public.listing.type_en,public.owner.phone2';
      var qfrom = 'public.owner_property ' + 'INNER JOIN public.owner ON (public.owner_property.owner_id = public.owner.id) ' + 'INNER JOIN public.property ON (public.owner_property.property_gid = public.property.gid) ' + 'INNER JOIN public.listing ON (public.property.gid = public.listing.property_gid) ';
      var qleaseType = ' AND  public.listing.type_en=\'' + req.query.leaseType + '\'';
      var qparking = ' AND public.property.parking=' + parking;
      var qfurnished = ' AND public.property.furnished=' + furnished;
      var qheating = ' AND public.property.heating=' + heating;
      var qcooling = ' AND public.property.cooling=' + cooling;
      var qview = ' AND public.property.view=' + view;
      var sqlQuery = 'SELECT ' + qstring + ',ST_AsGeoJSON(public.property.the_geom) as geom FROM ' + qfrom + 'WHERE public.property.the_geom && ST_MakeEnvelope(' + bbox.x1 + ',' + bbox.y1 + ',' + bbox.x2 + ',' + bbox.y2 + ',4326)' + qleaseType;
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
      var query = client.query(sqlQuery, function(error, result) {
        done();
        // console.log(query.text);
        if (result) {
          dbgeo.parse({
            "data": result.rows,
            "geometryColumn": "geom",
          }, function(error, result) {
            if (error) {
              console.log(" --- error --- ", error);
            } else {
              res.send(result);
            }
          });
        } else {
          console.log(error);
        }
      });
    }
  });
});
router.get('/uses/:propertygid', function(req, res, next) {
  var gid = req.params.propertygid;
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log("Could not connect to postgres");
    } else {
      console.log("Connected");
      var query = client.query('select property_services_analysis(' + gid + ');', function(error, result) {
        done();
        // console.log(query);
        console.log(error);
        if (result) {
          res.send(result.rows[0]);
        } else {
          console.log('error in quering db');
        }
      });
    }
  });
});
router.post('/admin', ensureLoggedIn, function(req, res, next) {
  var gid = req.body.id;
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log("Could not connect to postgres");
    } else {
      console.log("Connected");
      var whatTofetch = "public.property.estatetype,public.property.plotarea,public.property.gid,public.property.estatearea,public.property.bedrooms,public.property.parking,public.property.furnished,  public.property.view,  public.property.heating,  public.property.cooling,      public.property.title,        public.property.year,        public.property.other,        public.property.parcel_num,        public.property.plan_num,        public.property.area_name,public.property.street_el,        public.property.h_num_el,        public.property.ps_code,public.property.floor,public.property.street_en,public.property.h_num_en,public.property.\"new\"";
      var from = 'public.owner_property ' + 'INNER JOIN public.owner ON (public.owner_property.owner_id = public.owner.id)' + 'INNER JOIN public.property ON (public.owner_property.property_gid = public.property.gid)';
      var query = client.query('select ' + whatTofetch + ',ST_AsGeoJSON(public.property.the_geom) as geom ' + 'FROM ' + from + ' where public.owner.id=$1 ', [gid], function(error, result) {
        done();
        if (result) {
          dbgeo.parse({
            "data": result.rows,
            "geometryColumn": "geom",
          }, function(error, result) {
            if (error) {
              console.log(" --- error --- ", error);
            } else {
              res.send(result);
            }
          });
        } else {
          console.log(error);
        }
      });
    }
  });
});
module.exports = router;
