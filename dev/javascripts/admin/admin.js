var $loading = $('.mdl-spinner');
$(document)
  .ajaxStart(function() {
    $loading.addClass('is-active');
  })
  .ajaxStop(function() {
    $loading.removeClass('is-active');
  });
var center = [3677385, 4120949],
    extent = [3590094, 4102833, 3855483, 4261211],
    lang = document.documentElement.lang,
    geoJSONFormat = new ol.format.GeoJSON({
      defaultDataProjection: 'EPSG:4326'
    }),
    propertySource, property, map, features, drawnProperties, draw, select, translate;
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

function PropertyStyle() {
  var src = '../images/map-icons/pins/48/pin1.png';
  return new ol.style.Style({
    image: new ol.style.Icon(({
      src: src,
      anchor: [
        0.5, 1
      ],
      scale: 0.7
    }))
  });
}
propertySource = new ol.source.Vector({
  format: geoJSONFormat,
  loader: function(extent, resolution, projection) {
    var url = 'http://127.0.0.1:3000/db/admin';
    var self = this;
    self.clear();
    $.ajax({
      url: url,
      type: 'POST',
      'beforeSend': function(xhr) {
        if (localStorage.getItem('userToken')) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
        }
      },
      dataType: 'json',
      data: {
        id: id
      }
    }).done(function(response) {
      var features = geoJSONFormat.readFeatures(response, {
        featureProjection: 'EPSG:3857'
      });
      self.addFeatures(features);
    }).fail(function() {
      console.log('error');
    });
  },
  strategy: ol.loadingstrategy.all
});
property = new ol.layer.Vector({
  source: propertySource,
  id: 'property',
  visible: true,
  style: PropertyStyle()
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
//====== interactions ======
features = new ol.Collection();
drawnProperties = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  }),
  id: 'drawnProperties'
});
map.addLayer(drawnProperties);
//draw
draw = new ol.interaction.Draw({
  // features: features,
  source: drawnProperties.getSource(),
  type: 'Point',
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  })
});
map.addInteraction(draw);
draw.setActive(false);
//select
select = new ol.interaction.Select({
  layers: [property],
  features: features,
  multi: false,
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 10,
      fill: new ol.style.Fill({
        color: '#448aff'
      })
    })
  })
});
map.addInteraction(select);
select.setActive(false);
translate = new ol.interaction.Translate({
  features: select.getFeatures()
});
map.addInteraction(translate);
translate.setActive(false);
//====== info ======
map.on('click', clickInfo);

function clickInfo(event) {
  var obj = {};

  event.preventDefault();
  select.setActive(true);
  select.once('select', function(e) {
    var selectedFeatures = e.selected;
    var length = selectedFeatures.length;
    var selectedFeature;
    if (length === 1) {
      obj.feature = {};
      selectedFeature = _.head(e.selected);
      // clickedFeature.feature.setScale(1.2);
      selectedFeature.getKeys().forEach(function(key) {
        obj.feature[key] = selectedFeature.get(key);
      });
      dust.render('adminPropertyInfo', obj, function(err, out) {
        $('.property-info').html(out);
        $('.property-info').removeClass('visuallyhidden');
        componentHandler.upgradeDom();
        $('#listing').on('click', function(event) {
          var gid;
          event.preventDefault();
          gid = $(this).data('gid');
          $.ajax({
            url: 'http://127.0.0.1:3000/db/listing',
            type: 'GET',
            dataType: 'json',
            data: {
              gid: gid
            }
          })
            .done(function(data) {
              // console.log(data);
              var listing_id = data.id;
              $('.modal-dialog').removeClass('visuallyhidden');
              dust.render('listingInsert', data, function(err, out) {
                $('.modal-content').html(out);
                componentHandler.upgradeDom();
                handleForm.set({
                  name: 'insert-update-listing',
                  submitBtnId: 'ok'
                });
                $('input[name=options]').on('change', function(event) {
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
                $('#sent-listing').on('click', function(event) {
                  var data;
                  event.preventDefault();
                  data = handleForm.get();
                  console.log(data);
                  if (data !== null) {
                    data.property_gid = gid;
                    data.listing_id = listing_id;
                    $.ajax({
                      url: 'http://127.0.0.1:3000/db/listing/update',
                      type: 'POST',
                      data: data,
                      dataType: 'text'
                    })
                      .done(function(data, textStatus, jqXHR) {
                        if (jqXHR.status === 201) {
                          toastr.success('Property Updated In Database');
                        } else {
                          toastr.error('Oops Something Went Wrong!!!');
                        }
                      })
                      .fail(function(jqXHR, textStatus, errorThrown) {
                        toastr.error('Oops Something Went Wrong!!!');
                      })
                      .always(function() {
                        handleForm.clear();
                        $('#openModal').addClass('visuallyhidden');
                        propertySource.clear();
                        select.getFeatures().clear();
                        select.setActive(false);
                      });
                  }
                });
                $('#cancel-listing').on('click', function(event) {
                  event.preventDefault();
                  handleForm.clear();
                  select.getFeatures().clear();
                  select.setActive(false);
                  $('#openModal').addClass('visuallyhidden');
                });
              });
            })
            .fail(function() {
              var obj = {};
              if (lang === 'el') {
                obj.msg = 'Δεν Βρέθηκε Αγγελία',
                obj.text = 'Δημιουργία Καινούργιας;',
                obj.yes = 'ΝΑΙ'
                obj.no = 'ΟΧΙ'
              } else {
                obj.msg = 'No Listing Found',
                obj.text = 'Create New Listing?',
                obj.yes = 'YES'
                obj.no = 'NO'
              }
              dust.render('dialog', obj, function(error, out) {
                $('#openModal').removeClass('visuallyhidden');
                $('.modal-content').html(out);
                componentHandler.upgradeDom();
                $('#yes').on('click', function(event) {
                  event.preventDefault();
                  dust.render('listingInsert', {
                    rent: 'true'
                  }, function(err, out) {
                    $('.modal-content').html(out);
                    componentHandler.upgradeDom();
                    handleForm.set({
                      name: 'insert-update-listing',
                      submitBtnId: 'ok'
                    });
                    $('input[name=options]').on('change', function(event) {
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
                    $('#sent-listing').on('click', function(event) {
                      var data;
                      event.preventDefault();
                      data = handleForm.get();
                      if (data !== null) {
                        data.property_gid = gid;
                        $.ajax({
                          url: 'http://127.0.0.1:3000/db/listing/insert',
                          type: 'POST',
                          data: data,
                          dataType: 'text'
                        })
                          .done(function(data, textStatus, jqXHR) {
                            if (jqXHR.status === 201) {
                              toastr.success('Property Updated In Database');
                            } else {
                              toastr.error('Oops Something Went Wrong!!!');
                            }
                          })
                          .fail(function(jqXHR, textStatus, errorThrown) {
                            toastr.error('Oops Something Went Wrong!!!');
                          })
                          .always(function() {
                            handleForm.clear();
                            $('#openModal').addClass('visuallyhidden');
                            select.getFeatures().clear();
                            select.setActive(false);
                          });
                      }
                    });
                    $('#cancel-listing').on('click', function(event) {
                      event.preventDefault();
                      handleForm.clear();
                      select.getFeatures().clear();
                      select.setActive(false);
                      $('#openModal').addClass('visuallyhidden');
                    });
                  })
                });
                $('#no').on('click', function(event) {
                  event.preventDefault();
                  $('#openModal').addClass('visuallyhidden');
                  select.getFeatures().clear();
                  select.setActive(false);
                });
              });
            })
        });
      });
    } else {
      select.getFeatures().clear();
      // select.setActive(false);
      $('.property-info').addClass('visuallyhidden');
      toastr.options = {
        'positionClass': 'toast-bottom-full-width',
        'preventDuplicates': true,
        'timeOut': 60
      };
      toastr.error('Cant Find Any Property There...');
    }
  });
}
//====== logout ======
$('#logout').click(function() {
  location.href = '/map/logout';
});
//====== insert ======
$('#insertProperty').click(function() {
  toastr.clear();
  $('.property-info').addClass('visuallyhidden');
  toastr.options = {
    'positionClass': 'toast-top-center',
    'preventDuplicates': true,
    'timeOut': 60
  };
  map.un('click', clickInfo);
  select.getFeatures().clear();
  select.setActive(false);
  draw.setActive(true);
  draw.on('drawend', function(event) {
    var obj = {};
    event.preventDefault();
    draw.setActive(false);
    $('.modal-dialog').removeClass('visuallyhidden');
    dust.render('propertyInsert', obj, function(err, out) {
      $('.modal-content').html(out);
      componentHandler.upgradeDom();
      handleForm.set({
        name: 'insertProperty',
        submitBtnId: 'insert'
      });
      $('#estateType').change(function() {
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
      $('#estateType_en').change(function() {
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
      $('#cancelInsert').on('click', function(event) {
        event.preventDefault();
        handleForm.clear();
        drawnProperties.getSource().clear();

        $('.modal-dialog').addClass('visuallyhidden');
        map.on('click', clickInfo);
      });
      $('#insert').on('click', function(event) {
        var data, c;
        event.preventDefault();
        data = handleForm.get();
        console.log(data);
        if (data !== null) {
          handleCoords.setLayer('drawnProperties');
          c = handleCoords.coords();
          data.x = c[0];
          data.y = c[1];
          data.adminId = id;
          $.ajax({
            url: 'http://127.0.0.1:3000/db/insert',
            type: 'POST',
            data: data
          }).done(function(data, textStatus, jqXHR) {
            toastr.options = {
              'positionClass': 'toast-bottom-full-width',
              'preventDuplicates': true,
              'timeOut': 60
            };
            if (jqXHR.status === 201) {
              toastr.success('Property Recorded In Database');
            } else {
              toastr.error('Oops Something Went Wrong!!!');
            }
          }).fail(function(jqXHR, textStatus, errorThrown) {
            toastr.error('Oops Something Went Wrong!!!');
          }).always(function() {
            event.preventDefault();
            drawnProperties.getSource().clear();
            propertySource.clear();
            handleForm.clear();
            $('.modal-dialog').addClass('visuallyhidden');
            map.on('click', clickInfo);
          });
        }
      });
    });
  });
});
//====== delete ======
$('#deleteProperty').click(function(event) {
  event.preventDefault();
  toastr.clear();
  $('.property-info').addClass('visuallyhidden');
  toastr.options = {
    'positionClass': 'toast-top-center',
    'preventDuplicates': true,
    'timeOut': 20
  };
  map.un('click', clickInfo);
  draw.setActive(false);
  features.clear();
  propertySource.clear();
  select.getFeatures().clear();
  select.setActive(true);
  select.once('select', function(e) {
    var $toast;
    if (e.target.getFeatures().getLength() === 1) {
      toastr.options.newestOnTop = true;
      toastr.options.preventDuplicates = true;
      toastr.options.extendedTimeOut = 0;
      toastr.options.timeOut = 0;
      toastr.options.closeButton = true;
      $toast = toastr.warning('<p>Are you sure?</p><div class="toastr-btns"><button id="yesDelete" class="mdl-button mdl-js-button ">Yes</button><button id="noDelete" class="mdl-button mdl-js-button">No</button></div>');
      $toast.on('click', '#yesDelete', function() {
        var gid = select.getFeatures().item(0).get('gid');
        $.ajax({
          url: 'http://127.0.0.1:3000/db/delete',
          type: 'POST',
          dataType: 'text',
          data: {
            gid: gid
          }
        })
          .done(function(data, textStatus, jqXHR) {

            // console.log(jqXHR.status);
            toastr.options = {
              'positionClass': 'toast-bottom-full-width',
              'preventDuplicates': true,
              'timeOut': 60
            };
            toastr.success('Property Deleted From Database');
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
            toastr.options = {
              'positionClass': 'toast-bottom-full-width',
              'preventDuplicates': true,
              'timeOut': 60
            };
            toastr.success('Oops Something Went Wrong!!!');
          })
          .always(function() {
            propertySource.clear();
            select.getFeatures().clear();
            select.setActive(false);
            map.on('click', clickInfo);
          });

        $toast.remove();
      });
      $toast.on('click', '#noDelete', function() {
        $toast.remove();
        select.getFeatures().clear();
        select.setActive(false);
      });
    }
  });
});

//====== update ======

$('#updateProperty').on('click', function(event) {
  var gid, obj, coords;
  event.preventDefault();
  toastr.clear();
  map.un('click', clickInfo);
  draw.setActive(false);
  features.clear();
  propertySource.clear();
  select.getFeatures().clear();
  select.setActive(true);
  $('.property-info').addClass('visuallyhidden');
  select.once('select', function(e) {
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
          gid: gid
        }
      })
        .done(function(data) {
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
          $toast.on('click', '#yesChangeXY', function() {
            translate.setActive(true);
            translate.on('translateend', function(e) {
              coords = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
              dataForm(obj, coords);
            })
          })
          $toast.on('click', '#noChangeXY', function() {
            translate.setActive(false);
            toastr.clear();
            dataForm(obj, coords);
          })
        })
        .fail(function() {
          toastr.error('Oops Something Went Wrong!!!');
        })
    }
  });
  function dataForm(obj, coords) {
    $('.modal-dialog').removeClass('visuallyhidden');
    dust.render('propertyUpdate', obj, function(err, out) {
      var oldValues = {};
      $('.modal-content').html(out);
      oldValues.bedrooms = $('#bedrooms').val();
      componentHandler.upgradeDom();
      handleForm.set({
        name: 'updateProperty',
        submitBtnId: 'update'
      });
      $('#estateType').change(function() {
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
      $('#estateType_en').change(function() {
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
      $('#update').on('click', function(event) {
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
            .done(function(data, textStatus, jqXHR) {
              toastr.options = {
                'positionClass': 'toast-bottom-full-width',
                'preventDuplicates': true,
                'timeOut': 60
              };
              if (jqXHR.status === 200) {
                toastr.success('Property Updated In Database');
              } else {
                toastr.error('Oops Something Went Wrong!!!');
              }
            })
            .fail(function() {
              toastr.error('Oops Something Went Wrong!!!');
            })
            .always(function() {
              propertySource.clear();
              select.getFeatures().clear();
              select.setActive(false);
              translate.setActive(false);
              map.on('click', clickInfo);
              $('.modal-dialog').addClass('visuallyhidden');
            });
        }
      });
      $('#cancelUpdate').on('click', function(event) {
        event.preventDefault();
        handleForm.clear();
        propertySource.clear();
        select.getFeatures().clear();
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
$(document).ready(function() {
  window.Parsley.on('field:error', function() {
    // This global callback will be called for any field that fails validation.
    console.log('Validation failed for: ', this.$element);
  });
  window.Parsley
    .addValidator('date', {
      requirementType: 'string',
      validateString: function(value, requirement) {
        if (moment(value, 'DD-MM-YYYY', true).isValid() === true) {
          return true
        } else {
          return false
        }
      },
      messages: {
        en: 'Wrong Date',
        el: 'Λάθος Ημερομηνία'
      }
    });
});
