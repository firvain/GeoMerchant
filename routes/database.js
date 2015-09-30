// BASE SETUP
// ==============================================
var express = require('express');
var pg = require('pg');
// var conString = "postgres://etsipis:TR81VH83YH1WrSqjeblH@188.226.158.168/cyprus";
var conString = "postgres://etsipis:TR81VH83YH1WrSqjeblH@localhost/cyprus";
var dbgeo = require("dbgeo");
// var client = new pg.Client(conString);
pg.defaults.poolSize = 25;
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
router.get('/:layer', function(req, res, next) {
  var layer = req.params.layer;
  var bbox = req.query.bbox;
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log("Could not connect to postgres");
    } else {
      console.log("Connected");
      var query = client.query('SELECT *,ST_AsGeoJSON(' + layer + '.the_geom) as geom FROM ' + layer + ' WHERE ' + layer + '.the_geom && ST_MakeEnvelope(' + bbox.x1 + ',' + bbox.y1 + ',' + bbox.x2 + ',' + bbox.y2 + ',4326)', function(error, result) {
        done();
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
router.get('/:layer/:admingid', function(req, res, next) {
  var layer = req.params.layer;
  var admingid = req.params.admingid;
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log("Could not connect to postgres");
    } else {
      console.log("Connected");
      var query = client.query('SELECT *,ST_AsGeoJSON(' + req.params.layer + '.the_geom) as geom FROM ' + req.params.layer + ' WHERE admin_gid=$1', [admingid], function(error, result) {
        done();
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
          console.log('error in quering db');
        }
      });
    }
    done();
  });
});
module.exports = router;
