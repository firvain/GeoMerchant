// BASE SETUP
// ==============================================
var express = require('express');
var pg = require('pg');
var conString = "postgres://etsipis:TR81VH83YH1WrSqjeblH@188.226.158.168/cyprus";
// var conString = "postgres://etsipis:TR81VH83YH1WrSqjeblH@localhost/cyprus";
var dbgeo = require("dbgeo");
// var client = new pg.Client(conString);
pg.defaults.poolSize = 25;
var parking, furnished, heating, cooling, view;
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
// router.get('/:layer', function(req, res, next) {
//   var layer = req.params.layer;
//   var bbox = req.query.bbox;
//   pg.connect(conString, function(err, client, done) {
//     if (err) {
//       console.log("Could not connect to postgres");
//     } else {
//       console.log("Connected");
//       var query = client.query('SELECT *,ST_AsGeoJSON(' + layer + '.the_geom) as geom FROM ' + layer + ' WHERE ' + layer + '.the_geom && ST_MakeEnvelope(' + bbox.x1 + ',' + bbox.y1 + ',' + bbox.x2 + ',' + bbox.y2 + ',4326)', function(error, result) {
//         done();
//         if (result) {
//           dbgeo.parse({
//             "data": result.rows,
//             "geometryColumn": "geom",
//           }, function(error, result) {
//             if (error) {
//               console.log(" --- error --- ", error);
//             } else {
//               res.header("Access-Control-Allow-Origin", "*");
//               res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//               res.send(result);
//               res.end();
//             }
//           });
//         } else {
//           console.log(error);
//         }
//       });
//     }
//     done();
//   });
// });
router.get('/property', function(req, res, next) {
  // var type;
  // if (req.params.type==='rent'){
  //   type = 'Rent';
  // } else if (req.params.type==='sale'){
  //   type = 'Sale';
  // }
  var bbox = req.query.bbox;
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log("Could not connect to postgres");
    } else {
      console.log("Connected");
      var qstring = 'public.property.estatetype,public.property.plotarea,public.property.gid,public.property.estatearea,public.property.bedrooms,' + 'public.property.parking,public.property.furnished,public.property.view,public.property.heating,public.property.cooling,public.property.title,public.property.year,public.property.other,' + 'public.property.parcel_num,public.property.plan_num,public.property.area_name,public.property.street_el,public.property.h_num_el,public.property.ps_code,' + 'public.property.floor,public.property.street_en,public.property.h_num_en,public.property."new",public.owner.name_el,public.owner.lastname_el,public.owner.fathername_el,public.owner.name_en,public.owner.lastname_en,public.owner.fathername_en,' + 'public.owner.phone1,public.owner.email,public.listing.date_start,public.listing.date_end,public.listing.price,public.listing.prefered_customer,public.listing.pets,' + 'public.listing.type_el,public.listing.type_en,public.owner.phone2';
      var qfrom = 'public.owner_property ' + 'INNER JOIN public.owner ON (public.owner_property.owner_id = public.owner.id) ' + 'INNER JOIN public.property ON (public.owner_property.property_gid = public.property.gid) ' + 'INNER JOIN public.listing ON (public.property.gid = public.listing.property_gid) ';
      // var qwhere = 'public.listing.type_en = \''+type+'\'';
      var query = client.query('SELECT ' + qstring + ',ST_AsGeoJSON(public.property.the_geom) as geom FROM ' + qfrom + 'WHERE public.property.the_geom && ST_MakeEnvelope(' + bbox.x1 + ',' + bbox.y1 + ',' + bbox.x2 + ',' + bbox.y2 + ',4326)', function(error, result) {
        done();
        console.log(query.text);
        if (result) {
          dbgeo.parse({
            "data": result.rows,
            "geometryColumn": "geom",
          }, function(error, result) {
            if (error) {
              console.log(" --- error --- ", error);
            } else {
              res.header("Access-Control-Allow-Origin", "*");
              res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
              res.send(result);
              res.end();
            }
          });
        } else {
          console.log(error);
        }
      });
    }
    done();
  });
});
router.get('/filteredproperty', function(req, res, next) {
  // var type;
  // if (req.params.type==='rent'){
  //   type = 'Rent';
  // } else if (req.params.type==='sale'){
  //   type = 'Sale';
  // }
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
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log("Could not connect to postgres");
    } else {
      console.log("Connected");
      var qstring = 'public.property.estatetype,public.property.plotarea,public.property.gid,public.property.estatearea,public.property.bedrooms,' + 'public.property.parking,public.property.furnished,public.property.view,public.property.heating,public.property.cooling,public.property.title,public.property.year,public.property.other,' + 'public.property.parcel_num,public.property.plan_num,public.property.area_name,public.property.street_el,public.property.h_num_el,public.property.ps_code,' + 'public.property.floor,public.property.street_en,public.property.h_num_en,public.property."new",public.owner.name_el,public.owner.lastname_el,public.owner.fathername_el,public.owner.name_en,public.owner.lastname_en,public.owner.fathername_en,' + 'public.owner.phone1,public.owner.email,public.listing.date_start,public.listing.date_end,public.listing.price,public.listing.prefered_customer,public.listing.pets,' + 'public.listing.type_el,public.listing.type_en,public.owner.phone2';
      var qfrom = 'public.owner_property ' + 'INNER JOIN public.owner ON (public.owner_property.owner_id = public.owner.id) ' + 'INNER JOIN public.property ON (public.owner_property.property_gid = public.property.gid) ' + 'INNER JOIN public.listing ON (public.property.gid = public.listing.property_gid) ';
      var qparking = ' AND public.property.parking=' + parking;
      var qfurnished = ' AND public.property.furnished=' + furnished;
      var qheating = ' AND public.property.heating=' + heating;
      var qcooling = ' AND public.property.cooling=' + cooling;
      var qview = ' AND public.property.view=' + view;
      var query = client.query('SELECT ' + qstring + ',ST_AsGeoJSON(public.property.the_geom) as geom FROM ' + qfrom + 'WHERE public.property.the_geom && ST_MakeEnvelope(' + bbox.x1 + ',' + bbox.y1 + ',' + bbox.x2 + ',' + bbox.y2 + ',4326)' + qparking + qfurnished + qheating + qcooling + qview, function(error, result) {
        done();
        console.log(query.text);
        if (result) {
          dbgeo.parse({
            "data": result.rows,
            "geometryColumn": "geom",
          }, function(error, result) {
            if (error) {
              console.log(" --- error --- ", error);
            } else {
              res.header("Access-Control-Allow-Origin", "*");
              res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
              res.send(result);
              res.end();
            }
          });
        } else {
          console.log(error);
        }
      });
    }
  });
});
// router.get('/:layer/:admingid', function(req, res, next) {
//   var layer = req.params.layer;
//   var admingid = req.params.admingid;
//   pg.connect(conString, function(err, client, done) {
//     if (err) {
//       console.log("Could not connect to postgres");
//     } else {
//       console.log("Connected");
//       var query = client.query('SELECT *,ST_AsGeoJSON(' + req.params.layer + '.the_geom) as geom FROM ' + req.params.layer + ' WHERE admin_gid=$1', [admingid], function(error, result) {
//         done();
//         if (result) {
//           dbgeo.parse({
//             "data": result.rows,
//             "geometryColumn": "geom",
//           }, function(error, result) {
//             if (error) {
//               console.log(" --- error --- ", error);
//             } else {
//               res.header("Access-Control-Allow-Origin", "*");
//               res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//               res.send(result);
//               res.end();
//             }
//           });
//         } else {
//           console.log('error in quering db');
//         }
//       });
//     }
//     done();
//   });
// });
router.get('/uses/:propertygid', function(req, res, next) {
  var gid = req.params.propertygid;
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log("Could not connect to postgres");
    } else {
      console.log("Connected");
      var query = client.query('select property_services_analysis(' + gid + ');', function(error, result) {
        done();
        console.log(query);
        console.log(error);
        if (result) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          res.send(result.rows[0]);
          res.end();
        } else {
          console.log('error in quering db');
        }
      });
    }
  });
});
module.exports = router;
