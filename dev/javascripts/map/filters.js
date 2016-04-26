window.app || (window.app = {});
var app = window.app;
app.Filters = function (options) {
  this.estateType = options.estateType;
  this.leaseType = options.leaseType !== undefined ? options.leaseType : 'Rent';
  this.startPrice = options.startPrice !== undefined ? options.startPrice : 0;
  this.endPrice = options.endPrice !== undefined ? options.endPrice : 2147483647;
  this.parking = options.parking !== undefined ? options.parking : false;
  this.furnished = options.furnished !== undefined ? options.furnished : false;
  this.heating = options.heating !== undefined ? options.heating : false;
  this.cooling = options.cooling !== undefined ? options.cooling : false;
  this.view = options.view !== undefined ? options.view : false;
  console.log(this.startPrice);
};
app.Filters.prototype.createValidator = function () {
  var p = $('form[name=filters]').parsley();
  return p;
};
app.Filters.prototype.setDefaults = function () {
  var epsg4326Extent;
  PSA.setSource(null);
  if (selectSource.getFeatures().length === 0) {
    epsg4326Extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
  } else {
    epsg4326Extent = ol.proj.transformExtent(selectSource.getFeatures()[0]
      .getGeometry().getExtent(), 'EPSG:3857', 'EPSG:4326');
  }
  this.extent = epsg4326Extent;
  this.p = this.createValidator();
};
app.Filters.prototype.ajaxCall = function () {
  if (this.p.validate() === true) {
    $.ajax({
      url: 'http://127.0.0.1:3000/db/listed/filters?bbox[x1]=' + this.extent[0] + '&bbox[y1]=' + this.extent[1] + '&bbox[x2]=' + this.extent[2] + '&bbox[y2]=' + this.extent[3],
      type: 'GET',
      dataType: 'json',
      data: {
        estateType: this.estateType,
        leaseType: this.leaseType,
        furnished: this.furnished,
        heating: this.heating,
        parking: this.parking,
        cooling: this.cooling,
        view: this.view,
        startPrice: this.startPrice,
        endPrice: this.endPrice
      }
    }).done(function succeded(data, textStatus, jqXHR) {
      var features = geoJSONFormat.readFeatures(data, {
        featureProjection: 'EPSG:3857'
      });
        toastr.clear();
        filteredEstates.getSource().clear();
        filteredEstates.getSource().addFeatures(features);
        filteredEstates.setVisible(true);
        property.setVisible(false);
        toastr.info('Found ' + features.length + ' properties');
    })
    .fail(function failed(jqXHR) {
      // var a = jQuery.parseJSON(jqXHR.responseText); // response is Json so we need to parse
      toastr.clear();
      if (jqXHR.status === 404) {
        toastr.error('No properties found wit these filters');
      } else if (jqXHR.status === 503) {
        toastr.error('Service Unavailable');
      } else {
        toastr.error('Internal Server Error');
      }
      filteredEstates.setVisible(false);
      property.setVisible(true);
    });
  }
};
$('#invokeFilters').click(function () {
  var filters;
  var options = {};
  options.estateType = $('#estateType').val();
  options.leaseType = $('input[name=options]:checked').val();
  options.startPrice = $('#startPrice').val();
  options.endPrice = $('#endPrice').val();
  options.parking = $('#checkbox-1').prop('checked');
  options.furnished = $('#checkbox-2').prop('checked');
  options.heating = $('#checkbox-3').prop('checked');
  options.cooling = $('#checkbox-4').prop('checked');
  options.view = $('#checkbox-5').prop('checked');
  console.log(options);
  filters = new app.Filters(options);
  filters.setDefaults();
  filters.ajaxCall();
});
$('#clearFilters').click(function () {
  var lang = document.documentElement.lang;
  $('label[for=option-1]').addClass('is-checked');
  $('#option-1').prop('checked', true);
  $('label[for=option-2]').removeClass('is-checked');
  $('#option-2').prop('checked', false);
  $('label[for=checkbox-1]').removeClass('is-checked');
  $('label[for=checkbox-2]').removeClass('is-checked');
  $('label[for=checkbox-3]').removeClass('is-checked');
  $('label[for=checkbox-4]').removeClass('is-checked');
  $('label[for=checkbox-5]').removeClass('is-checked');
  $('label[for=checkbox-6]').removeClass('is-checked');
  $('#estateType').attr('data-val', 'Apartment');
  $('#priceSelect').attr('data-val', '0');
  if (lang === 'en') {
    $('#priceSelect').val('To 300');
    $('#estateType').val('Apartment');
  } else {
    $('#priceSelect').val('Εώς 300');
    $('#estateType').val('Διαμέρισμα');
  }
  $('#startPrice').val('0').parent().eq(0).addClass('is-dirty');
  $('#endPrice').val('300').parent().eq(0).addClass('is-dirty');
  $('#estate-filters').addClass('visuallyhidden');
  $('#price-range').addClass('visuallyhidden');
  filteredEstates.getSource().clear();
  property.setVisible(true);
  PSA.setSource(null);
  selectSource.clear();
  map.removeInteraction(draw);
});
var draw;
function addInteraction() {
  selectSource.clear();
  draw = new ol.interaction.Draw({
    source: selectSource,
    type: 'LineString',
    geometryFunction: geometryFunction,
    maxPoints: 2
  });
  draw.on('drawstart', function () {
    selectSource.clear();
  });
  draw.on('drawend', function () {
    map.removeInteraction(draw);
  });
  map.addInteraction(draw);
}
function geometryFunction(coordinates, geometry) {
  if (!geometry) {
    geometry = new ol.geom.Polygon(null);
  }
  var start = coordinates[0];
  var end = coordinates[1];
  geometry.setCoordinates([
    [
      start,
      [
        start[0], end[1]
      ],
      end,
      [
        end[0], start[1]
      ],
      start
    ]
  ]);
  return geometry;
}
$('#checkbox-6').click(function () {
  if (this.checked) {
    addInteraction();
  } else {
    map.removeInteraction(draw);
    selectSource.clear();
  }
});


// var handleFilters = (function handleFilters() {
//   'use strict';

//   function selectRange() {
//     $('#priceSelect').change(function (e) {
//       var val = $(this).data('data-val');
//       alert(e);
//       if (val === 100000) {
//         $('#startPrice').val('0').parent().eq(0).addClass('is-dirty');
//         $('#endPrice').val('100000').parent().eq(0).addClass('is-dirty');
//       } else if (val === 150000) {
//         $('#startPrice').val('100000').parent().eq(0).addClass('is-dirty');
//         $('#endPrice').val('150000').parent().eq(0).addClass('is-dirty');
//       } else if (val === 200000) {
//         $('#startPrice').val('150000').parent().eq(0).addClass('is-dirty');
//         $('#endPrice').val('200000').parent().eq(0).addClass('is-dirty');
//       } else if (val === 250000) {
//         $('#startPrice').val('200000').parent().eq(0).addClass('is-dirty');
//         $('#endPrice').val('250000').parent().eq(0).addClass('is-dirty');
//       } else if (val === 300000) {
//         $('#startPrice').val('250000').parent().eq(0).addClass('is-dirty');
//         $('#endPrice').val('300000').parent().eq(0).addClass('is-dirty');
//       } else {
//         $('#startPrice').val('250000').parent().eq(0).addClass('is-dirty');
//         $('#endPrice').val('300000').parent().eq(0).addClass('is-dirty');
//       }
//     });
//   }

//   return {
//     selectRange: selectRange
//   };
// }());
function getValueRange(listingType) {
  var saleType = {
    Sale: function sale() {
      $('#startPrice').val('0').parent().eq(0).addClass('is-dirty');
      $('#endPrice').val('100000').parent().eq(0).addClass('is-dirty');
      $('#priceSelect').change(function (e) {
        var val = $(this).attr('data-val');
        if (val === '100000') {
          $('#startPrice').val('0').parent().eq(0).addClass('is-dirty');
          $('#endPrice').val('100000').parent().eq(0).addClass('is-dirty');
        } else if (val === '150000') {
          $('#startPrice').val('100000').parent().eq(0).addClass('is-dirty');
          $('#endPrice').val('150000').parent().eq(0).addClass('is-dirty');
        } else if (val === '200000') {
          $('#startPrice').val('150000').parent().eq(0).addClass('is-dirty');
          $('#endPrice').val('200000').parent().eq(0).addClass('is-dirty');
        } else if (val === '250000') {
          $('#startPrice').val('200000').parent().eq(0).addClass('is-dirty');
          $('#endPrice').val('250000').parent().eq(0).addClass('is-dirty');
        } else if (val === '300000') {
          $('#startPrice').val('250000').parent().eq(0).addClass('is-dirty');
          $('#endPrice').val('300000').parent().eq(0).addClass('is-dirty');
        } else {
          $('#startPrice').val('300000').parent().eq(0).addClass('is-dirty');
          $('#endPrice').val('');
        }
      });
    },
    Rent: function rent() {
      $('#startPrice').val('0').parent().eq(0).addClass('is-dirty');
      $('#endPrice').val('300').parent().eq(0).addClass('is-dirty');
      $('#priceSelect').change(function (e) {
        var val = $(this).attr('data-val');
        if (val === '300') {
          $('#startPrice').val('0').parent().eq(0).addClass('is-dirty');
          $('#endPrice').val('300').parent().eq(0).addClass('is-dirty');
        } else if (val === '450') {
          $('#startPrice').val('300').parent().eq(0).addClass('is-dirty');
          $('#endPrice').val('450').parent().eq(0).addClass('is-dirty');
        } else if (val === '600') {
          $('#startPrice').val('450').parent().eq(0).addClass('is-dirty');
          $('#endPrice').val('600').parent().eq(0).addClass('is-dirty');
        } else {
          $('#startPrice').val('600').parent().eq(0).addClass('is-dirty');
          $('#endPrice').val('');
        }
      });
    }
  };
  return (saleType[listingType])();
}
$(function () {
  getValueRange('Rent');
  $('input[type=radio][name=options]').change(function () {
    var lang = document.documentElement.lang;
    var value = this.value;
    var type = {
      rangeType: this.value
    };
    if (lang === 'en') {
      type.priceTitle = 'Choose Estate Price';
      type.price = 'Price';
      type.from = 'From';
      type.to = 'To';
      type.andMore = 'and more';
    } else {
      type.priceTitle = 'Επιλέξτε Τιμή Ακινήτου';
      type.price = 'Τιμή';
      type.from = 'Από';
      type.to = 'Εώς';
      type.andMore = 'και πάνω';
    }
    dust.render('valueRange', type, function (error, html) {
      $('.priceSelect').html(html);
      // componentHandler.upgradeAllRegistered();
      getmdlSelect.init('.getmdl-select');
      getValueRange(value);
    });
  }
  );
  $('#advanced-filters').on('click', function (event) {
    event.preventDefault();
    if ($('#estate-filters').hasClass('visuallyhidden')) {
      $('#estate-filters').removeClass('visuallyhidden');
    } else {
      $('#estate-filters').addClass('visuallyhidden');
    }
  });
  $('#toggle-price-range').on('click', function(event) {
    event.preventDefault();
    if ($('#price-range').hasClass('visuallyhidden')) {
      $('#price-range').removeClass('visuallyhidden');
    } else {
      $('#price-range').addClass('visuallyhidden');
    }
  });
});
function preventDotAndSpace(e) {
  var key = e.charCode ? e.charCode : e.keyCode;
  this.innerHTML = key;
  if (key === 46 || key === 32) {
    return false;
  }
}
