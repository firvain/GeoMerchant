var $loading = $('.mdl-spinner');

var center = [3677385, 4120949];
var extent = [3590094, 4102833, 3855483, 4261211];
var lang = document.documentElement.lang;
var geoJSONFormat = new ol.format.GeoJSON({
  defaultDataProjection: 'EPSG:4326'
});
var propertySource;
var property;
var map;
var features;
var drawnProperties;
var draw;
var select;
var translate;
var bing = new ol.layer.Tile({
  visible: true,
  source: new ol.source.BingMaps({
    key: 'Ak2Gq8VUfICsPpuf7LRANXmXt2sHWmSLPhohmVLFtFIEwYjs_5MCyAhAFwRSVpLj',
    imagerySet: 'Aerial'
  }),
  maxZoom: 19,
  crossOrigin: 'anonymous',
  preload: Infinity,
  id: 'bing'
});
var mapbox = new ol.layer.Tile({
  source: new ol.source.XYZ({
    attributions: [new ol.Attribution({
      html: '<a href="https://www.mapbox.com/about/maps/" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>'
    })],
    url: 'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmlydmFpbiIsImEiOiJlOWYyYTM0NThiNWM0YjJjODJjNDE4ODQzNzA2MGQyNiJ9.-NVDO27Hzt-w_nQosUPfLA'
  }),
  id: 'mapbox'
});

function getIconType(estateType) {
  var iconType = {
    Apartment: function () {
      return 'apartment';
    },
    Store: function () {
      return 'store';
    },
    'Detached House': function () {
      return 'detached';
    }
  };
  return (iconType[estateType])();
}

function getIconPath(listingType) {
  var iconPath = {
    true: function () {
      return './images/pins/sale/';
    },
    false: function () {
      return './images/pins/rent/';
    },
    none: function () {
      return './images/pins/none/';
    }
  };
  return (iconPath[listingType])();
}

function PropertyStyle(feature) {
  var src;
  src = getIconPath('none') + getIconType(feature.get('estatetype_en')) + '-48.png';
  return new ol.style.Style({
    image: new ol.style.Icon(({
      src: src,
      anchorOrigin: 'bottom-left',
      anchor: [
        0.5, 0
      ],
      scale: 1
    }))
  });
}
propertySource = new ol.source.Vector({
  format: geoJSONFormat,
  loader: function (extent, resolution, projection) {
    var url = 'http://127.0.0.1:3000/db/admin';
    var self = this;
    self.clear();
    $.ajax({
      url: url,
      type: 'POST',
      beforeSend: function (xhr) {
        if (localStorage.getItem('userToken')) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
        }
      },
      dataType: 'json',
      data: {
        id: id
      }
    }).done(function (response) {
      var features = geoJSONFormat.readFeatures(response, {
        featureProjection: 'EPSG:3857'
      });
      self.addFeatures(features);
    }).fail(function () {
      logger.error('error');
    });
  },
  strategy: ol.loadingstrategy.all
});
property = new ol.layer.Vector({
  source: propertySource,
  id: 'property',
  visible: true,
  style: PropertyStyle
});
property.setZIndex(2);
map = new ol.Map({
  target: 'adminMap',
  layers: [
    mapbox, property
  ],
  loadTilesWhileAnimating: true,
  loadTilesWhileInteracting: true,
  renderer: 'canvas',
  controls: ol.control.defaults({
    attributionOptions: {
      collapsible: false,
      collapsed: false
    }
  }).extend([
    new ol.control.ScaleLine({
      units: 'metric'
    }),
    new ol.control.OverviewMap({
      className: 'ol-overviewmap ol-custom-overviewmap',
      collapsible: true,
      collapsed: true,
      layers: [bing]
    }),
    new ol.control.ZoomToExtent({
      extent: extent
    })
  ]),
  view: new ol.View({
    center: center,
    // extent: extent,
    projection: 'EPSG:3857',
    zoom: 14,
    maxZoom: 19,
    minZoom: 10
  })
});
if (lang === 'el') {
  bing.set('name', 'Δορυφορική εικόνα');
  mapbox.set('name', 'Χάρτης');
  property.set('name', 'Ακίνητα');
} else {
  bing.set('name', 'Sattelite Image');
  mapbox.set('name', 'Map');
  property.set('name', 'Properties');
}
// ====== interactions ======
features = new ol.Collection();

function drawnPropertiesStyle(color) {
  var src;
  src = './images/pins/generic-48.png';
  if (typeof color !== 'undefined') {
    return new ol.style.Style({
      image: new ol.style.Icon(({
        src: src,
        anchorOrigin: 'bottom-left',
        anchor: [
          0.5, 0
        ],
        scale: 1,
        color: color
      }))
    });
  }
  return new ol.style.Style({
    image: new ol.style.Icon(({
      src: src,
      anchorOrigin: 'bottom-left',
      anchor: [
        0.5, 0
      ],
      scale: 1
    }))
  });
}
drawnProperties = new ol.layer.Vector({
  source: new ol.source.Vector(),
  id: 'drawnProperties',
  style: drawnPropertiesStyle('#4caf50')
});
map.addLayer(drawnProperties);
// draw
draw = new ol.interaction.Draw({
  // features: features,
  source: drawnProperties.getSource(),
  type: 'Point',
  style: drawnPropertiesStyle('#4caf50')
});
map.addInteraction(draw);
draw.setActive(false);
// select
function selectedStyle(feature) {
  var src;
  src = getIconPath('none') + getIconType(feature.get('estatetype_en')) + '-64.png';
  return new ol.style.Style({
    image: new ol.style.Icon(({
      src: src,
      anchorOrigin: 'bottom-left',
      anchor: [0.5, 0],
      scale: 1,
      color: '#ffeb3b'
    }))
  });
}
select = new ol.interaction.Select({
  layers: [property],
  features: features,
  multi: false,
  style: selectedStyle
});
map.addInteraction(select);
select.setActive(false);
translate = new ol.interaction.Translate({
  features: select.getFeatures()
});
map.addInteraction(translate);
translate.setActive(false);
// ====== info ======
map.on('click', clickInfo);

function clickInfo(event) {
  var obj = {};

  event.preventDefault();
  select.setActive(true);
  select.once('select', function (e) {
    var selectedFeatures = e.selected;
    var length = selectedFeatures.length;
    var selectedFeature;
    if (length === 1) {
      obj.feature = {};
      selectedFeature = _.head(e.selected);
      // clickedFeature.feature.setScale(1.2);
      selectedFeature.getKeys().forEach(function (key) {
        obj.feature[key] = selectedFeature.get(key);
      });
      dust.render('adminPropertyInfo', obj, function (err, out) {
        $('.property-info').html(out);
        $('.property-info').removeClass('visuallyhidden');
        componentHandler.upgradeDom();
        $('#listing').on('click', function (event) {
          var gid;
          event.preventDefault();
          gid = $(this).data('gid');
          $.ajax({
              url: 'http://127.0.0.1:3000/db/listing',
              type: 'GET',
              dataType: 'json',
              data: {
                gid: gid,
              },
            })
            .done(function (data) {
              // console.log(data);
              var listing_id = data.id;
              $('#openModal').css('width', 'auto');
              $('.modal-dialog').removeClass('visuallyhidden');
              dust.render('listingInsert', data, function (err, out) {
                $('.modal-content').html(out);
                componentHandler.upgradeDom();
                handleForm.set({
                  name: 'insert-update-listing',
                  submitBtnId: 'ok',
                });
                if ($('input[name=options]:checked').val() === 'Sale') {
                  $('#pets').parent().hide();
                  $('#prefered_customer').parent().hide();
                }
                $('input[name=options]').on('change', function (event) {
                  if ($(this).val() === 'Sale') {
                    $('#pets').prop('disabled', true);
                    $('#pets').prop('checked', false);
                    $('#pets').parent().hide();
                    $('label[for=pets]').removeClass('is-checked');
                    $('#prefered_customer').val('');
                    $('#prefered_customer').parent().eq(0).removeClass('is-dirty');
                    $('#prefered_customer').prop('disabled', true);
                    $('#prefered_customer').parent().hide();
                  } else {
                    $('#pets').prop('disabled', false);
                    $('#pets').parent().show();
                    $('#prefered_customer').prop('disabled', false);
                    $('#prefered_customer').parent().show();
                  }
                });
                $('#sent-listing').on('click', function (event) {
                  var data;
                  event.preventDefault();
                  data = handleForm.get();
                  if (data !== null) {
                    data.property_gid = gid;
                    data.listing_id = listing_id;
                    $.ajax({
                        url: 'http://127.0.0.1:3000/db/listing',
                        type: 'PUT',
                        data: data,
                        dataType: 'text'
                      })
                      .done(function (data, textStatus, jqXHR) {
                        if (jqXHR.status === 201) {
                          toastr.success('Property Updated In Database');
                        } else {
                          toastr.error('Oops Something Went Wrong!!!');
                        }
                      })
                      .fail(function (jqXHR, textStatus, errorThrown) {
                        toastr.error('Oops Something Went Wrong!!!');
                      })
                      .always(function () {
                        handleForm.clear();
                        $('#openModal').addClass('visuallyhidden');
                        propertySource.clear();
                        select.getFeatures().clear();
                        select.setActive(false);
                      });
                  }
                });
                $('#cancel-listing').on('click', function (event) {
                  event.preventDefault();
                  handleForm.clear();
                  select.getFeatures().clear();
                  select.setActive(false);
                  $('#openModal').addClass('visuallyhidden');
                });
              });
            })
            .fail(function () {
              var obj = {};
              if (lang === 'el') {
                obj.msg = 'Δεν Βρέθηκε Αγγελία';
                obj.text = 'Δημιουργία Καινούργιας;';
                obj.yes = 'ΝΑΙ';
                obj.no = 'ΟΧΙ';
              } else {
                obj.msg = 'No Listing Found';
                obj.text = 'Create New Listing?';
                obj.yes = 'YES';
                obj.no = 'NO';
              }
              dust.render('dialog', obj, function (error, out) {
                $('#openModal').removeClass('visuallyhidden');
                $('#openModal').css('width', 'auto');
                $('.modal-content').html(out);
                componentHandler.upgradeDom();
                $('#yes').on('click', function (event) {
                  event.preventDefault();
                  dust.render('listingInsert', {
                    rent: 'true',
                    addImage: 'true',
                  }, function (err, out) {
                    var myDropzone;
                    $('.modal-content').html(out);
                    componentHandler.upgradeDom();
                    myDropzone = new Dropzone(document.getElementById('dropzone'), {
                      uploadMultiple: false,
                      acceptedFiles: '.jpg',
                      parallelUploads: 6,
                      // addRemoveLinks : true,
                      url: 'https://api.cloudinary.com/v1_1/firvain/auto/upload'
                    });
                    myDropzone.on('sending', function (file, xhr, formData) {
                      formData.append('api_key', 375138932689591);
                      formData.append('callback', 'http://127.0.0.1:3000/public/cloudinary_cors.html');
                      formData.append('upload_preset', 'testupload');
                      formData.append('public_id', gid);
                    });
                    myDropzone.on('success', function () {
                      this.element.style.display = 'none';
                    });
                    handleForm.set({
                      name: 'insert-update-listing',
                      submitBtnId: 'ok'
                    });
                    // $('input[name=file]').cloudinary_fileupload();
                    // $('input[name=file]').unsigned_cloudinary_upload('testupload', {
                    //   cloud_name: 'firvain',
                    //   'public_id': gid,
                    // });
                    $('input[name=options]').on('change', function (event) {
                      if ($(this).val() === 'Sale') {
                        $('#pets').prop('disabled', true);
                        $('#pets').prop('checked', false);
                        $('label[for=pets]').removeClass('is-checked');
                        $('#prefered_customer').val('');
                        $('#prefered_customer').parent().eq(0).removeClass('is-dirty');
                        $('#prefered_customer').prop('disabled', true);
                      } else {
                        $('#pets').prop('disabled', false);
                        $('#prefered_customer').prop('disabled', false);
                      }
                    });
                    $('#sent-listing').on('click', function (event) {
                      var data;
                      event.preventDefault();
                      data = handleForm.get();
                      if (data !== null) {
                        data.property_gid = gid;
                        $.ajax({
                            url: 'http://127.0.0.1:3000/db/listing',
                            type: 'POST',
                            data: data,
                            dataType: 'text'
                          })
                          .done(function (data, textStatus, jqXHR) {
                            if (jqXHR.status === 201) {
                              toastr.success('Property Updated In Database');
                            } else {
                              toastr.error('Oops Something Went Wrong!!!');
                            }
                          })
                          .fail(function (jqXHR, textStatus, errorThrown) {
                            toastr.error('Oops Something Went Wrong!!!');
                          })
                          .always(function () {
                            handleForm.clear();
                            $('#openModal').addClass('visuallyhidden');
                            select.getFeatures().clear();
                            select.setActive(false);
                          });
                      }
                    });
                    $('#cancel-listing').on('click', function (event) {
                      event.preventDefault();
                      handleForm.clear();
                      select.getFeatures().clear();
                      select.setActive(false);
                      $('#openModal').addClass('visuallyhidden');
                    });
                  });
                });
                $('#no').on('click', function (event) {
                  event.preventDefault();
                  $('#openModal').addClass('visuallyhidden');
                  select.getFeatures().clear();
                  select.setActive(false);
                });
              });
            });
        });
      });
    } else {
      select.getFeatures().clear();
      // select.setActive(false);
      $('.property-info').addClass('visuallyhidden');
      toastr.options = {
        'positionClass': 'toast-bottom-full-width',
        'preventDuplicates': true,
        'timeOut': 60,
      };
      toastr.error('Cant Find Any Property There...');
    }
  });
}
// ====== logout ======
$('#logout').click(function () {
  location.href = '/map/logout';
});
// ====== insert ======
$('#insertProperty').click(function () {
  var onEndDraw;
  toastr.clear();
  $('.property-info').addClass('visuallyhidden');
  toastr.options = {
    'positionClass': 'toast-top-center',
    'preventDuplicates': true,
    'timeOut': 60,
  };
  map.un('click', clickInfo);
  select.getFeatures().clear();
  select.setActive(false);
  draw.setActive(true);
  onEndDraw = draw.on('drawend', function (event) {
    var obj = {};
    var coords;
    var geocodeObj;
    var latlng;
    var geocodeName_el;
    var geocodeName_en;
    var geocodeAreaName;
    event.preventDefault();
    draw.setActive(false);
    coords = ol.proj.transform(event.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
    obj.coords = coords;
    latlng = coords[1] + '\,' + coords[0];
    geocodeObj = $.getJSON('https://maps.googleapis.com/maps/api/geocode/json', {
      latlng: latlng,
      key: 'AIzaSyCkH39_Ez21_RlC_pjXD09zpJ_ - eVhzCrQ',
    }, function (json, textStatus) {
      return json;
    });
    geocodeObj.then(function () {
      geocodeName_el = _.head(_.head(geocodeObj.responseJSON.results).address_components).long_name;
      geocodeName_en = string_el_to_url(geocodeName_el);
      obj.street_el = geocodeName_el;
      obj.street_en = geocodeName_en;
      geocodeAreaName = _.first(_.drop(_.map(_.head(geocodeObj.responseJSON.results).address_components, 'long_name')));
      obj.area_name = geocodeAreaName;
      dataForm(obj);
    });

  });

  function dataForm(obj) {
    $('.modal-dialog').removeClass('visuallyhidden');
    dust.render('propertyInsert', obj, function (err, out) {
      $('.modal-content').html(out);
      componentHandler.upgradeDom();
      handleForm.set({
        name: 'insertProperty',
        submitBtnId: 'insert',
      });
      $('#estateType').change(function () {
        if ($(this).val() === 'Μονοκατοικία') {
          $('#estateType_en').val('Detached House');
          $('#estateType_en').parent().find('.mdl-selectfield__box-value').html('Detached House');
          $('#bedrooms').val('');
          $('#bedrooms').prop('disabled', false);
        } else if ($(this).val() === 'Διαμέρισμα') {
          $('#estateType_en').val('Apartment');
          $('#estateType_en').parent().find('.mdl-selectfield__box-value').html('Apartment');
          $('#bedrooms').val('');
          $('#bedrooms').prop('disabled', false);
        } else {
          $('#estateType_en').val('Store');
          $('#estateType_en').parent().find('.mdl-selectfield__box-value').html('Store');
          $('#bedrooms').val(0);
          $('#bedrooms').prop('disabled', true);
        }
      });
      $('#estateType_en').change(function () {
        if ($(this).val() === 'Detached House') {
          $('#estateType').val('Μονοκατοικία');
          $('#estateType').parent().find('.mdl-selectfield__box-value').html('Μονοκατοικία');
          $('#bedrooms').val('');
          $('#bedrooms').prop('disabled', false);
        } else if ($(this).val() === 'Apartment') {
          $('#estateType').val('Διαμέρισμα');
          $('#estateType').parent().find('.mdl-selectfield__box-value').html('Διαμέρισμα');
          $('#bedrooms').val('');
          $('#bedrooms').prop('disabled', false);
        } else {
          $('#estateType').val('Κατάστημα');
          $('#estateType').parent().find('.mdl-selectfield__box-value').html('Κατάστημα');
          $('#bedrooms').val(0);
          $('#bedrooms').prop('disabled', true);
        }
      });
      $('#cancelInsert').on('click', function (event) {
        event.preventDefault();
        handleForm.clear();
        drawnProperties.getSource().clear();
        draw.unByKey(onEndDraw);
        $('.modal-dialog').addClass('visuallyhidden');
        map.on('click', clickInfo);
      });
      $('#insert').on('click', function (event) {
        var data;
        event.preventDefault();
        data = handleForm.get();
        if (data !== null) {
          data.x = obj.coords[0];
          data.y = obj.coords[1];
          data.adminId = id;
          $.ajax({
            url: 'http://127.0.0.1:3000/db/insert',
            type: 'POST',
            data: data,
          }).done(function (data, textStatus, jqXHR) {
            toastr.options = {
              'positionClass': 'toast-bottom-full-width',
              'preventDuplicates': true,
              'timeOut': 60,
            };
            if (jqXHR.status === 201) {
              toastr.success('Property Recorded In Database');
            } else {
              toastr.error('Oops Something Went Wrong!!!');
            }
          }).fail(function (jqXHR, textStatus, errorThrown) {
            toastr.error('Oops Something Went Wrong!!!');
          }).always(function () {
            event.preventDefault();
            drawnProperties.getSource().clear();
            propertySource.clear();
            handleForm.clear();
            draw.unByKey(onEndDraw);
            $('.modal-dialog').addClass('visuallyhidden');
            map.on('click', clickInfo);
          });
        }
      });
    });
  }
});
// ====== delete ======
$('#deleteProperty').click(function (event) {
  event.preventDefault();
  toastr.clear();
  $('.property-info').addClass('visuallyhidden');
  toastr.options = {
    'positionClass': 'toast-top-center',
    'preventDuplicates': true,
    'timeOut': 20,
  };
  map.un('click', clickInfo);
  draw.setActive(false);
  features.clear();
  propertySource.clear();
  select.getFeatures().clear();
  select.setActive(true);
  select.once('select', function (e) {
    var $toast;
    if (e.target.getFeatures().getLength() === 1) {
      toastr.options.newestOnTop = true;
      toastr.options.preventDuplicates = true;
      toastr.options.extendedTimeOut = 0;
      toastr.options.timeOut = 0;
      toastr.options.closeButton = true;
      $toast = toastr.warning('<p>Are you sure?</p><div class="toastr-btns"><button id="yesDelete" class="mdl-button mdl-js-button ">Yes</button><button id="noDelete" class="mdl-button mdl-js-button">No</button></div>');
      $toast.on('click', '#yesDelete', function () {
        var gid = select.getFeatures().item(0).get('gid');
        $.ajax({
            url: 'http://127.0.0.1:3000/db/delete',
            type: 'POST',
            dataType: 'text',
            data: {
              gid: gid,
            },
          })
          .done(function (data, textStatus, jqXHR) {

            // console.log(jqXHR.status);
            toastr.options = {
              'positionClass': 'toast-bottom-full-width',
              'preventDuplicates': true,
              'timeOut': 60,
            };
            toastr.success('Property Deleted From Database');
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            toastr.options = {
              'positionClass': 'toast-bottom-full-width',
              'preventDuplicates': true,
              'timeOut': 60,
            };
            toastr.success('Oops Something Went Wrong!!!');
          })
          .always(function () {
            propertySource.clear();
            select.getFeatures().clear();
            select.setActive(false);
            map.on('click', clickInfo);
          });

        $toast.remove();
      });
      $toast.on('click', '#noDelete', function () {
        $toast.remove();
        select.getFeatures().clear();
        select.setActive(false);
      });
    }
  });
});

// ====== update ======

$('#updateProperty').on('click', function (event) {
  var gid, obj, coords;
  var onEndTranslte;
  event.preventDefault();
  toastr.clear();
  map.un('click', clickInfo);
  draw.setActive(false);
  features.clear();
  propertySource.clear();
  select.getFeatures().clear();
  select.setActive(true);
  $('.property-info').addClass('visuallyhidden');
  select.once('select', function (e) {
    var selectedFeatures = e.selected;
    var length = selectedFeatures.length;
    var selectedFeature;
    if (length === 1) {
      gid = _.head(e.selected).get('gid');
      selectedFeature = _.head(e.selected);
      coords = ol.proj.transform(selectedFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
      $.ajax({
          url: 'http://127.0.0.1:3000/db/fetch',
          type: 'POST',
          dataType: 'json',
          data: {
            gid: gid,
          },
        })
        .done(function (data) {
          var $toast = {};
          $toast.options = {};
          obj = _.head(data.features).properties;

          toastr.options.newestOnTop = true;
          toastr.options.preventDuplicates = true;
          toastr.options.extendedTimeOut = 0;
          toastr.options.timeOut = 0;
          toastr.options.closeButton = false;
          toastr.options.positionClass = 'toast-top-center';
          $toast = toastr.warning('<p>Change Property Coordinates?</p><div class="toastr-btns"><button id="yesChangeXY" class="mdl-button mdl-js-button ">Yes</button><button id="noChangeXY" class="mdl-button mdl-js-button">No</button></div>');
          $toast.on('click', '#yesChangeXY', function () {
            var latlng;
            var geocodeObj;
            var geocodeName_el;
            var geocodeName_en;
            var geocodeAreaName;
            translate.setActive(true);
            onEndTranslte = translate.on('translateend', function (e) {
              // var geocodeObj;
              coords = ol.proj.transform(e.features.item(0).getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
              latlng = coords[1] + '\,' + coords[0];
              geocodeObj = $.getJSON('https://maps.googleapis.com/maps/api/geocode/json', {
                latlng: latlng,
                key: 'AIzaSyCkH39_Ez21_RlC_pjXD09zpJ_ - eVhzCrQ',
              }, function (json, textStatus) {
                return json.results;
              });
              geocodeObj.then(function () {
                geocodeName_el = _.head(_.head(geocodeObj.responseJSON.results).address_components).long_name;
                geocodeName_en = string_el_to_url(geocodeName_el);
                obj.street_el = geocodeName_el;
                obj.street_en = geocodeName_en;
                geocodeAreaName = _.first(_.drop(_.map(_.head(geocodeObj.responseJSON.results).address_components, 'long_name')));
                obj.area_name = geocodeAreaName;
                dataForm(obj, coords);
              });
            });
          });
          $toast.on('click', '#noChangeXY', function () {
            translate.setActive(false);
            toastr.clear();
            dataForm(obj, coords);
          });
        })
        .fail(function () {
          toastr.error('Oops Something Went Wrong!!!');
        });
    }
  });

  function dataForm(obj, coords) {
    $('.modal-dialog').removeClass('visuallyhidden');
    dust.render('propertyUpdate', obj, function (err, out) {
      var oldValues = {};
      $('.modal-content').html(out);
      oldValues.bedrooms = $('#bedrooms').val();
      oldValues.street_en = $('#street_en').val();
      oldValues.street_el = $('#street_el').val();
      oldValues.area_name = $('#area_name').val();
      componentHandler.upgradeDom();
      handleForm.set({
        name: 'updateProperty',
        submitBtnId: 'update',
      });
      // $('#street_el').val(obj.geocodeName_el);
      // $('#street_en').val(obj.geocodeName_en);
      $('#estateType').change(function () {
        if ($(this).val() === 'Μονοκατοικία') {
          $('#estateType_en').val('Detached House');
          $('#estateType_en').parent().find('.mdl-selectfield__box-value').html('Detached House');
          $('#bedrooms').val(oldValues.bedrooms);
          $('#bedrooms').prop('disabled', false);
        } else if ($(this).val() === 'Διαμέρισμα') {
          $('#estateType_en').val('Apartment');
          $('#estateType_en').parent().find('.mdl-selectfield__box-value').html('Apartment');
          $('#bedrooms').val(oldValues.bedrooms);
          $('#bedrooms').prop('disabled', false);
        } else {
          $('#estateType_en').val('Store');
          $('#estateType_en').parent().find('.mdl-selectfield__box-value').html('Store');
          $('#bedrooms').val(0);
          $('#bedrooms').prop('disabled', true);
        }
      });
      $('#estateType_en').change(function () {
        if ($(this).val() === 'Detached House') {
          $('#estateType').val('Μονοκατοικία');
          $('#estateType').parent().find('.mdl-selectfield__box-value').html('Μονοκατοικία');
          $('#bedrooms').val(oldValues.bedrooms);
          $('#bedrooms').prop('disabled', false);
        } else if ($(this).val() === 'Apartment') {
          $('#estateType').val('Διαμέρισμα');
          $('#estateType').parent().find('.mdl-selectfield__box-value').html('Διαμέρισμα');
          $('#bedrooms').val(oldValues.bedrooms);
          $('#bedrooms').prop('disabled', false);
        } else {
          $('#estateType').val('Κατάστημα');
          $('#estateType').parent().find('.mdl-selectfield__box-value').html('Κατάστημα');
          $('#bedrooms').val(0);
          $('#bedrooms').prop('disabled', true);
        }
      });
      $('#update').on('click', function (event) {
        var data;
        event.preventDefault();
        data = handleForm.get();
        if (!_.isNil(data)) {
          data.x = coords[0];
          data.y = coords[1];
          data.gid = gid;
          $.ajax({
            url: 'http://127.0.0.1:3000/db/update',
            type: 'POST',
            data: data
          })
            .done(function (data, textStatus, jqXHR) {
              toastr.options = {
                positionClass: 'toast-bottom-full-width',
                preventDuplicates: true,
                timeOut: 60
              };
              if (jqXHR.status === 200) {
                toastr.success('Property Updated In Database');
              } else {
                toastr.error('Oops Something Went Wrong!!!');
              }
            })
            .fail(function () {
              toastr.error('Oops Something Went Wrong!!!');
            })
            .always(function () {
              propertySource.clear();
              select.getFeatures().clear();
              select.setActive(false);
              translate.unByKey(onEndTranslte);
              translate.setActive(false);
              map.on('click', clickInfo);
              $('.modal-dialog').addClass('visuallyhidden');
            });
        }
      });
      $('#cancelUpdate').on('click', function (event) {
        event.preventDefault();
        handleForm.clear();
        propertySource.clear();
        select.getFeatures().clear();
        translate.unByKey(onEndTranslte);
        select.setActive(false);
        translate.setActive(false);
        map.on('click', clickInfo);
        $('.modal-dialog').addClass('visuallyhidden');
        map.on('click', clickInfo);
      });
    });
  }

  $('#adminMap').removeAttr('style');
});
$(document).ready(function () {
  window.Parsley.on('field:error', function () {
    // This global callback will be called for any field that fails validation.
    console.log('Validation failed for: ', this.$element);
  });
  window.Parsley
    .addValidator('date', {
      requirementType: 'string',
      validateString: function (value, requirement) {
        if (moment(value, 'DD-MM-YYYY', true).isValid() === true) {
          return true;
        }
        return false;
      },
      messages: {
        en: 'Wrong Date',
        el: 'Λάθος Ημερομηνία'
      }
    });
});

function string_el_to_url(string) {
  var newString;
  var replace = new Array('α', 'ά', 'Ά', 'Α', 'β', 'Β', 'γ', 'Γ', 'δ', 'Δ', 'ε', 'έ', 'Ε', 'Έ', 'ζ', 'Ζ', 'η', 'ή', 'Η', 'θ', 'Θ', 'ι', 'ί', 'ϊ', 'ΐ', 'Ι', 'Ί', 'κ', 'Κ', 'λ', 'Λ', 'μ', 'Μ', 'ν', 'Ν', 'ξ', 'Ξ', 'ο', 'ό', 'Ο', 'Ό', 'π', 'Π', 'ρ', 'Ρ', 'σ', 'ς', 'Σ', 'τ', 'Τ', 'υ', 'ύ', 'Υ', 'Ύ', 'φ', 'Φ', 'χ', 'Χ', 'ψ', 'Ψ', 'ω', 'ώ', 'Ω', 'Ώ', ' ', '\'', '\'', ',');
  var replace_n = new Array('a', 'a', 'A', 'A', 'v', 'V', 'g', 'G', 'd', 'D', 'e', 'e', 'E', 'E', 'z', 'Z', 'i', 'i', 'I', 'th', 'Th', 'i', 'i', 'i', 'i', 'I', 'I', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'x', 'X', 'o', 'o', 'O', 'O', 'p', 'P', 'r', 'R', 's', 's', 'S', 't', 'T', 'u', 'u', 'Y', 'Y', 'f', 'F', 'ch', 'Ch', 'ps', 'Ps', 'o', 'o', 'O', 'O', ' ', '_', '_', '_');

  for (var i = 0; i < replace.length; i++) {
    newString = string.replace(new RegExp(replace[i], 'g'), replace_n[i]);
  }

  return newString;
}
$(document)
  .ajaxStart(function () {
    $loading.addClass('is-active');
  })
  .ajaxStop(function () {
    $loading.removeClass('is-active');
  });
