// BASE SETUP
// ==============================================
var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/map/login');
var pg = require('pg');
var conString = 'postgres://etsipis:TR81VH83YH1WrSqjeblH@188.226.158.168/cyprus';
// var conString = "postgres://etsipis:TR81VH83YH1WrSqjeblH@localhost/cyprus";
var dbgeo = require('dbgeo');
pg.defaults.poolSize = 25;
var parking, furnished, heating, cooling, view, estateType, leaseType, qprice, startPrice, endPrice;
// Connect to postgres
// client.connect(function(error, success) {
//   if (error) {
//     console.log("Could not connect to postgres");
//   } else {
//     console.log("Connected");
//   }
// });
var rollback = function(client, done) {
  client.query('ROLLBACK', function(error) {
    //if there was a problem rolling back the query
    //something is seriously messed up.  Return the error
    //to the done function to close & remove this client from
    //the pool.  If you leave a client in the pool with an unaborted
    //transaction weird, hard to diagnose problems might happen.
    return done(error);
  });
};
// ROUTES
// ==============================================
// create routes
// get an instance of router
var router = express.Router();
router.get('/property', function(req, res, next) {
  var bbox = req.query.bbox;
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log('Could not connect to postgres');
    } else {
      console.log('Connected');
      var qstring = 'public.property.estatetype,public.property.estatetype_en,public.property.plotarea,public.property.gid,public.property.estatearea,public.property.bedrooms,' + 'public.property.parking,public.property.furnished,public.property.view,public.property.heating,public.property.cooling,public.property.title,public.property.year,public.property.other,' + 'public.property.parcel_num,public.property.plan_num,public.property.area_name,public.property.street_el,public.property.street_number,public.property.ps_code,' + 'public.property.floor,public.property.street_en,public.property."isnew",public.owner.name_el,public.owner.lastname_el,public.owner.fathername_el,public.owner.name_en,public.owner.lastname_en,public.owner.fathername_en,' + 'public.owner.phone1,public.owner.email,public.listing.date_start,public.listing.date_end,public.listing.price,public.listing.prefered_customer,public.listing.pets,public.listing.sale,public.listing.rent,' + 'public.owner.phone2';
      var qfrom = 'public.owner_property ' + 'INNER JOIN public.owner ON (public.owner_property.owner_id = public.owner.id) ' + 'INNER JOIN public.property ON (public.owner_property.property_gid = public.property.gid) ' + 'INNER JOIN public.listing ON (public.property.gid = public.listing.property_gid) ';
      var query = client.query('SELECT ' + qstring + ',ST_AsGeoJSON(public.property.the_geom) as geom FROM ' + qfrom + 'WHERE public.property.the_geom && ST_MakeEnvelope(' + bbox.x1 + ',' + bbox.y1 + ',' + bbox.x2 + ',' + bbox.y2 + ',4326)', function(error, result) {
        // console.log(this.text);
        if (result) {
          dbgeo.parse({
            'data': result.rows,
            'geometryColumn': 'geom'
          }, function(error, result) {
            if (error) {
              console.log(' --- error --- ', error);
            } else {
              res.send(result);
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
    endPrice = 2147483647;
  } else {
    endPrice = parseInt(req.query.endPrice);
  }
  estateType = '\'' + req.query.estateType + '\'';
  // console.log(req.params.startPrice.req.params.endPrice)
  pg.connect(conString, function(err, client, done) {
    var qestateType, qleaseType, sqlQuery, qstring, qfrom, qparking, qfurnished, qheating, qcooling, qview, query;
    if (err) {
      console.log('Could not connect to postgres');
    } else {
      console.log('Connected');
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
      query = client.query(sqlQuery, function(error, result) {
        // console.log(this.text);
        done();
        // console.log(query.text);
        if (result) {
          dbgeo.parse({
            'data': result.rows,
            'geometryColumn': 'geom'
          }, function(error, result) {
            if (error) {
              console.log(' --- error --- ', error);
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
    var query;
    if (err) {
      console.log('Could not connect to postgres');
    } else {
      console.log('Connected');
      query = client.query('select property_services_analysis(' + gid + ');', function(error, result) {
        done();
        // console.log(query);
        if (error) {
          console.log(error);
        }
        if (result) {
          res.send(result.rows[0]);
        } else {
          console.log('error in quering db');
        }
      });
    }
  });
});
router.post('/admin', function(req, res, next) {
  var gid = req.body.id;
  pg.connect(conString, function(err, client, done) {
    var whatTofetch,fromWhat,query;
    if (err) {
      console.log('Could not connect to postgres');
    } else {
      console.log('Connected');
      whatTofetch = 'public.property.estatetype,public.property.estatetype_en,public.property.plotarea,public.property.gid,public.property.estatearea,public.property.bedrooms,public.property.parking,public.property.furnished,  public.property.view,  public.property.heating,  public.property.cooling,public.property.title,public.property.year,public.property.other,public.property.parcel_num,public.property.plan_num,public.property.area_name,public.property.street_el,public.property.ps_code,public.property.floor,public.property.street_en,public.property.street_number,public.property."isnew"';
      fromWhat = 'public.owner_property ' + 'INNER JOIN public.owner ON (public.owner_property.owner_id = public.owner.id)' + 'INNER JOIN public.property ON (public.owner_property.property_gid = public.property.gid)';
      query = client.query('select ' + whatTofetch + ',ST_AsGeoJSON(public.property.the_geom) as geom ' + 'FROM ' + fromWhat + ' where public.owner.id=$1 ', [gid], function(error, result) {
        // console.log(this.text);
        done();
        if (result) {
          dbgeo.parse({
            'data': result.rows,
            'geometryColumn': 'geom'
          }, function(error, result) {
            if (error) {
              console.log(' --- error --- ', error);
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
router.post('/insert', function(req, res, next) {
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
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log('Could not connect to postgres');
    } else {
      console.log('Connected');
      client.query('BEGIN', function(err) {
        if (err) return rollback(client, done);
        process.nextTick(function() {
          var columns = '(estatetype,estatetype_en,estatearea,plotarea,bedrooms,parking,furnished,title,year,other,parcel_num,plan_num,area_name,street_el,street_number,ps_code,floor,street_en,isnew,view,heating,cooling,the_geom) ';
          var values = estatetype + ',' + estatetype_en + ',' + estatearea + ',' + plotarea + ',' + bedrooms + ',' + parking + ',' + furnished + ',' + title + ',' + year + ',' + other + ',' + parcel_num + ',' + plan_num + ',' + area_name + ',' + street_el + ',' + street_number + ',' + ps_code + ',' + floor + ',' + street_en + ',' + isnew + ',' + view + ',' + heating + ',' + cooling;
          var geom = ',ST_GeomFromText(\'POINT(' + x + ' ' + y + ')\',4326)) RETURNING gid';
          client.query('INSERT INTO public.property ' + columns + 'VALUES (' + values + geom, function(error, result) {
            if (error) {
              throw error;
            }
            if (error) return rollback(client, done);
            var propertygid = result.rows[0].gid;
            client.query('INSERT INTO public.owner_property (owner_id,property_gid) VALUES (' + adminId + ',' + propertygid + ')', function(error, result) {
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
router.post('/delete', function (req, res, next) {
  var gid = req.body.gid;
  console.log('asdasdd' + gid);
  pg.connect(conString, function (err, client, done) {
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
          // console.log(this.text);
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
  pg.connect(conString, function (err, client, done) {
    var text = 'SELECT *,ST_AsGeoJSON(public.property.the_geom) as geom FROM public.property where gid=$1';
    if (err) {
      throw err;
    }
    client.query(text, [gid], function (error, result) {
      console.log(this.text);
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
router.post('/update', ensureLoggedIn, function(req, res, next) {
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
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log('Could not connect to postgres');
    } else {
      console.log('Connected');
      client.query('BEGIN', function(err) {
        if (err) return rollback(client, done);
        process.nextTick(function() {
          var columns = '(estatetype,estatetype_en,estatearea,plotarea,bedrooms,parking,furnished,title,year,other,parcel_num,plan_num,area_name,street_el,street_number,ps_code,floor,street_en,isnew,view,heating,cooling,the_geom) ';
          var values = estatetype + ',' + estatetype_en + ',' + estatearea + ',' + plotarea + ',' + bedrooms + ',' + parking + ',' + furnished + ',' + title + ',' + year + ',' + other + ',' + parcel_num + ',' + plan_num + ',' + area_name + ',' + street_el + ',' + street_number + ',' + ps_code + ',' + floor + ',' + street_en + ',' + isnew + ',' + view + ',' + heating + ',' + cooling;
          var geom = ',ST_GeomFromText(\'POINT(' + x + ' ' + y + ')\',4326)) ';
          client.query('UPDATE public.property SET ' + columns + '= (' + values + geom + 'WHERE gid=$1', [gid], function(error, result) {
            // console.log(this.text);
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
router.get('/listing', function(req, res, next) {
  var gid = req.query.gid;
  var text;
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log('Could not connect to postgres');
    } else {
      text = 'SELECT id,to_char(date_end,\'DD-MM-YYYY\') as date_end,to_char(date_start,\'DD-MM-YYYY\') as date_start,price,pets,prefered_customer,sale,rent FROM public.listing WHERE public.listing.property_gid=$1;';
      client.query(text, [gid], function(error, result) {
        console.log(this.text)
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
  // body...
  })
});
router.post('/listing/insert', function(req, res, next) {
  var property_gid = '\'' + req.body.property_gid + '\'';
  var date_start = '\'' + req.body.date_start + '\'';
  var date_end = '\'' + req.body.date_end + '\'';
  var pets = '\'' + req.body.pets + '\'';
  var prefered_customer = '\'' + req.body.prefered_customer + '\'';
  var price = '\'' + req.body.price + '\'';
  var rent = '\'' + req.body.rent + '\'';
  var sale = '\'' + req.body.sale + '\'';
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log('Could not connect to postgres');
    } else {
      client.query('BEGIN', function(err) {
        if (err) return rollback(client, done);
        process.nextTick(function() {
          var columns = '(property_gid,date_start,date_end,price,pets,prefered_customer,rent,sale) ';
          var values = property_gid + ',' + 'to_date(' + date_start + ',\'DD-MM-YYYY\')' + ',' + 'to_date(' + date_end + ',\'DD-MM-YYYY\')' + ',' + price + ',' + pets + ',' + prefered_customer + ',' + rent + ',' + sale;
          client.query('INSERT INTO public.listing ' + columns + 'VALUES (' + values + ');', function(error, result) {
            // console.log(this.text);
            if (error)
              throw error;
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
  })
});
router.post('/listing/update', function(req, res, next) {
  var listing_id = req.body.listing_id ;
  var property_gid = '\'' + req.body.property_gid + '\'';
  var date_start = '\'' + req.body.date_start + '\'';
  var date_end = '\'' + req.body.date_end + '\'';
  var pets = '\'' + req.body.pets + '\'';
  var prefered_customer = '\'' + req.body.prefered_customer + '\'';
  var price = '\'' + req.body.price + '\'';
  var rent = '\'' + req.body.rent + '\'';
  var sale = '\'' + req.body.sale + '\'';
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log('Could not connect to postgres');
    } else {
      client.query('BEGIN', function(err) {
        if (err) return rollback(client, done);
        process.nextTick(function() {
          var columns = '(property_gid,date_start,date_end,price,pets,prefered_customer,rent,sale) ';
          var values = property_gid + ',' + 'to_date(' + date_start + ',\'DD-MM-YYYY\')' + ',' + 'to_date(' + date_end + ',\'DD-MM-YYYY\')' + ',' + price + ',' + pets + ',' + prefered_customer + ',' + rent + ',' + sale;
          client.query('UPDATE public.listing SET ' + columns + ' = (' + values + ') WHERE id=$1;', [listing_id], function(error, result) {
            // console.log(this.text);
            if (error)
              throw error;
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
  })
});
module.exports = router;
