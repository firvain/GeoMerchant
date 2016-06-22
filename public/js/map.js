(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

  (function () {
    if (!Element.prototype.scrollIntoViewIfNeeded) {
      Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded) {
        centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;

        var parent = this.parentNode,
        parentComputedStyle = window.getComputedStyle(parent, null),
        parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
        parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
        overTop = this.offsetTop - parent.offsetTop < parent.scrollTop,
        overBottom = (this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight),
        overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft,
        overRight = (this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth),
        alignWithTop = overTop && !overBottom;

        if ((overTop || overBottom) && centerIfNeeded) {
          parent.scrollTop = this.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + this.clientHeight / 2;
        }

        if ((overLeft || overRight) && centerIfNeeded) {
          parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + this.clientWidth / 2;
        }

        if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
          this.scrollIntoView(alignWithTop);
        }
      };
    }
  })();

window.App || (window.App = {});
window.App.config = {
  promises: {
    dustBluebird: Promise.promisifyAll(dust),
    cloudinaryBird: Promise.promisifyAll($.cloudinary)
  },
  commons: {
    map: {},
    trans: {}
  },
  cache: {
    activeEstate: {},
    activeEstateListing: {}
  },
  modules: {
    map: {},
    info: {},
    edit: {},
    delete: {},
    insert: {},
    filters: {}
  }
};
window.App.utils = {};
// var trans;
// var cloudinaryBird = Promise.promisifyAll($.cloudinary);
// var activeEstate;
// var activeEstateListing;
$.cloudinary.config({ cloud_name: 'firvain', api_key: '375138932689591' });

/*eslint no-param-reassign: ["error", { "props": false }]*/
App.utils = {
  findById: function findById(map, id) {
    var layers = map.getLayers();
    var length = layers.getLength();
    for (var i = 0; i < length; i++) {
      if (id === layers.item(i).get('id')) {
        return layers.item(i);
      }
    }
    return null;
  },
  findByName: function findByName(map, name) {
    var layers = map.getLayers();
    var length = layers.getLength();
    for (var i = 0; i < length; i++) {
      if (name === layers.item(i).get('name')) {
        return layers.item(i);
      }
    }
    return null;
  },
  preventDotAndSpace: function preventDotAndSpace(e) {
    var key = e.charCode ? e.charCode : e.keyCode;
    this.innerHTML = key;
    if (key === 46 || key === 32) {
      return false;
    }
    return true;
  },
  geometryFunction: function geometryFunction(coordinates, geometry) {
    var geom = geometry;
    var start;
    var end;
    if (!geom) {
      geom = new ol.geom.Polygon(null);
    }
    start = coordinates[0];
    end = coordinates[1];
    geom.setCoordinates([
      [start, [start[0], end[1]], end, [end[0], start[1]], start]
    ]);
    return geom;
  },
  hasClass: function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    }
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  },
  removeClass: function removeClass(el, className) {
    var element = el;
    if (element.classList) {
      element.classList.remove(className);
    } else {
      element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  },
  addClass: function removeClass(el, className) {
    var element = el;
    if (element.classList) {
      element.classList.add(className);
    } else {
      element.className += ' ' + className;
    }
  },
  toggleClass: function toggleClass(el, className) {
    var classes;
    var existingIndex;
    var element = el;
    if (element.classList) {
      element.classList.toggle(className);
    } else {
      classes = element.className.split(' ');
      existingIndex = classes.indexOf(className);

      if (existingIndex >= 0) {
        classes.splice(existingIndex, 1);
      } else {
        classes.push(className);
      }
      element.className = classes.join(' ');
    }
  },
  requestFullScreen: function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    var wscript;
    if (requestMethod) { // Native full screen.
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== 'undefined') { // Older IE.
      wscript = new ActiveXObject('WScript.Shell');
      if (wscript !== null) {
        wscript.SendKeys('{F11}');
      }
    }
  },
  exitFullsreen: function exitFullsreen(element) {
    var requestMethod = element.exitFullScreen || element.webkitExitFullscreen || element.mozCancelFullScreen || element.msExitFullscreen;
    var wscript;
    if (requestMethod) { // Native full screen.
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== 'undefined') { // Older IE.
      wscript = new ActiveXObject('WScript.Shell');
      if (wscript !== null) {
        wscript.SendKeys('{Esc}');
      }
    }
  },
  elToEn: function elToEn(string) {
    var originalString = string;
    var newString;
    var replace = new Array('α', 'ά', 'Ά', 'Α', 'β', 'Β', 'γ', 'Γ', 'δ', 'Δ', 'ε', 'έ', 'Ε', 'Έ', 'ζ', 'Ζ', 'η', 'ή', 'Η', 'θ', 'Θ', 'ι', 'ί', 'ϊ', 'ΐ', 'Ι', 'Ί', 'κ', 'Κ', 'λ', 'Λ', 'μ', 'Μ', 'ν', 'Ν', 'ξ', 'Ξ', 'ο', 'ό', 'Ο', 'Ό', 'π', 'Π', 'ρ', 'Ρ', 'σ', 'ς', 'Σ', 'τ', 'Τ', 'υ', 'ύ', 'Υ', 'Ύ', 'φ', 'Φ', 'χ', 'Χ', 'ψ', 'Ψ', 'ω', 'ώ', 'Ω', 'Ώ', ' ', '\'', '\'', ',');
    var replace_n = new Array('a', 'a', 'A', 'A', 'v', 'V', 'g', 'G', 'd', 'D', 'e', 'e', 'E', 'E', 'z', 'Z', 'i', 'i', 'I', 'th', 'Th', 'i', 'i', 'i', 'i', 'I', 'I', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'x', 'X', 'o', 'o', 'O', 'O', 'p', 'P', 'r', 'R', 's', 's', 'S', 't', 'T', 'u', 'u', 'Y', 'Y', 'f', 'F', 'ch', 'Ch', 'ps', 'Ps', 'o', 'o', 'O', 'O', ' ', '_', '_', '_');

    for (var i = 0; i < replace.length; i++) {
      originalString = originalString.replace(new RegExp(replace[i], 'g'), replace_n[i]);
    }
    newString = originalString;
    return newString;
  },
  handleDate: function handleDate(str, lang) {
    var split;
    var newDate = [];
    if (typeof str === 'string' && lang !== 'el') {
      split = _.split(str, '-', 3);
      newDate = [split[1], split[0], split[2]];
      return _.join(newDate, '-');
    }
    return str;
  },
  sanitize: function sanitize(el) {
    var sanitizedStr;
    var str = el.value;
    sanitizedStr = str.replace(/[^a-z0-9A-ZA-zΑ-Ωα-ωίϊΐόάέύϋΰήώ]/gi, '');
    el.value = sanitizedStr;
    console.log(el);
    console.log(el.value);
    console.log(sanitizedStr);
  }
  // zoomToGid: function zoomToGid(map, gid) {
  //   var coordinates = utils.findById(map, 'filteredEstates').getSource().getFeatureById(gid)
  //   .getGeometry()
  //   .getCoordinates();
  //   map.getView().setCenter(coordinates);
  // }
};

App.config.modules.map = (function ol3Map(window, document, Promise, ol, App) {
  'use strict';
  var lang = document.documentElement.lang;
  var center = [3677385, 4120949];
  var extent = [3652772, 4112808, 3700000, 4132797];
  var geoJSONFormat = new ol.format.GeoJSON({
    defaultDataProjection: 'EPSG:4326'
  });

  var mapStyles = {
    iconType: function iconType(estateType) {
      var type = {
        Apartment: function apartmentIcon() {
          return 'apartment';
        },
        'Detached House': function detachedHouceIcon() {
          return 'detached';
        },
        Villa: function villaIcon() {
          return 'villa';
        },
        Maisonette: function maisonetteIcon() {
          return 'villa';
        }
      };
      return (type[estateType])();
    },
    iconPath: function iconPath(listingType) {
      var path = {
        true: function saleIcon() {
          return './images/pins/sale/';
        },
        false: function rentIcon() {
          return './images/pins/rent/';
        }
      };
      return (path[listingType])();
    },
    estates: function estates(feature) {
      var src = mapStyles.iconPath(feature.get('sale')) +
      mapStyles.iconType(feature.get('estatetype_en')) + '-48.png';
      return new ol.style.Style({
        geometry: feature.getGeometry(),
        image: new ol.style.Icon(({
          src: src,
          anchorOrigin: 'bottom-left',
          anchor: [0.5, 0],
          scale: 1
        }))
      });
    },
    cluster: function cluster(feature) {
      var size = feature.get('features').length;
      var style;
      var originalFeature;
      if (size > 1) {
        style = [new ol.style.Style({
          image: new ol.style.Circle({
            radius: 20,
            stroke: new ol.style.Stroke({
              color: [156, 39, 176, 1],
              width: 5
            }),
            fill: new ol.style.Fill({
              color: [68, 138, 255, 0.8]
            })
          }),
          text: new ol.style.Text({
            text: size.toString(),
            fill: new ol.style.Fill({
              color: '#FFFFFF'
            })
          }),
          zIndex: 101
        })];
      } else {
        originalFeature = feature.get('features')[0];
        style = [mapStyles.estates(originalFeature)];
      }
      return style;
    },
    poi: function poi(feature) {
      var styleCache = {};
      var symbol = feature.get('style');
      var text;
      if (lang === 'el') {
        text = feature.get('name_el');
      } else {
        text = feature.get('name_en');
      }
      if (!styleCache[symbol]) {
        styleCache = [new ol.style.Style({
          image: new ol.style.Icon(({
            src: '../images/maki/renders/' + symbol + '-24.png',
            anchorOrigin: 'bottom-left',
            anchor: [0.5, 0.5],
            scale: 1
          })),
          text: new ol.style.Text({
            text: text,
            stroke: new ol.style.Stroke({
              color: [156, 39, 176, 0.8],
              width: 1
            }),
            offsetY: 12
          })
        })];
      }
      return styleCache;
    },
    filteredEstates: function filteredEstates(feature) {
      var src = mapStyles.iconPath(feature.get('sale')) +
      mapStyles.iconType(feature.get('estatetype_en')) + '-48.png';
      return new ol.style.Style({
        image: new ol.style.Icon(({
          src: src,
          anchorOrigin: 'bottom-left',
          anchor: [0.5, 0],
          scale: 1
        }))
      });
    }
  };


  var mapSources = {
    bing: function bing() {
      return new ol.source.BingMaps({
        key: 'Ak2Gq8VUfICsPpuf7LRANXmXt2sHWmSLPhohmVLFtFIEwYjs_5MCyAhAFwRSVpLj',
        imagerySet: 'AerialWithLabels'
      });
    },
    mapBox: function mapBox() {
      return new ol.source.XYZ({
        attributions: [new ol.Attribution({
          html: '<a href="https://www.mapbox.com/about/maps/" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a>'
        })],
        url: 'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmlydmFpbiIsImEiOiJlOWYyYTM0NThiNWM0YjJjODJjNDE4ODQzNzA2MGQyNiJ9.-NVDO27Hzt-w_nQosUPfLA'
      });
    },
    estates: function estates() {
      return new ol.source.Vector({
        format: geoJSONFormat,
        loader: function featreLoader() {
          var self = this;
          this.clear();
          $.ajax({
            url: 'http://127.0.0.1:3000/api/listing/all',
            type: 'GET',
            dataType: 'json'
          })
            .done(function succeded(response) {
              var features = geoJSONFormat.readFeatures(response, {
                featureProjection: 'EPSG:3857'
              });
              self.addFeatures(features);
            })
            .fail(function failed(jqXHR) {
              toastr.clear();
              if (jqXHR.status === 404) {
                toastr.error('Sorry, we cannot find any properties!');
              } else if (jqXHR.status === 503) {
                toastr.error('Service Unavailable');
              } else {
                toastr.error('Internal Server Error');
              }
            });
        }
      });
    },
    cluster: function cluster() {
      return new ol.source.Cluster({
        distance: 40,
        source: mapSources.estates(),
        attributions: [new ol.Attribution({
          html: 'All maps © <a href="http://www.terracognita.gr/">Terra Cognita</a>'
        })]
      });
    },
    select: function select() {
      return new ol.source.Vector({});
    },
    poi: function poi() {
      return new ol.source.Vector({
        attributions: [new ol.Attribution({
          html: 'POI by <a href="http://www.terracognita.gr/">Terra Cognita</a>'
        })],
        format: geoJSONFormat
      });
    }
  };

  var mapLayers = {
    bing: function bing(trans) {
      return new ol.layer.Tile({
        visible: true,
        source: mapSources.bing(),
        maxZoom: 19,
        crossOrigin: 'anonymous',
        preload: Infinity,
        id: 'bing',
        name: trans.layers.bing
      });
    },
    mapBox: function mapBox(trans) {
      return new ol.layer.Tile({
        source: mapSources.mapBox(),
        id: 'mapbox',
        name: trans.layers.mapBox
      });
    },
    estates: function estates(trans) {
      return new ol.layer.Vector({
        source: mapSources.cluster(),
        id: 'estates',
        visible: true,
        style: mapStyles.cluster,
        zIndex: 2,
        name: trans.layers.estates
      });
    },
    poi: function poi(trans) {
      return new ol.layer.Vector({
        source: mapSources.poi(),
        style: mapStyles.poi,
        maxResolution: 3,
        zIndex: 1,
        id: 'poi'
      });
    },
    filteredEstates: function filteredEstates(trans) {
      return new ol.layer.Vector({
        source: new ol.source.Vector({
          format: geoJSONFormat
        }),
        id: 'filteredEstates',
        visible: true,
        style: mapStyles.filteredEstates,
        zIndex: 2
      });
    },
    select: function select() {
      return new ol.layer.Vector({
        source: mapSources.select(),
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(227, 72, 27, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: '#E3481B',
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: '#E3481B'
            })
          })
        }),
        zIndex: 3,
        id: 'select'
      });
    }
  };
  var initialize = function initialize() {
     var trans = _.cloneDeep(App.config.commons.trans);
    var layers = Object.keys(mapLayers).map(function addMapLayers(key) {
      if (key !== 'bing') { return mapLayers[key](trans); }
      return null;
    });
    return new ol.Map({
      target: 'map',
      layers: _.compact(layers),
      loadTilesWhileAnimating: true,
      loadTilesWhileInteracting: true,
      renderer: 'canvas',
      controls: ol.control.defaults({
        attributionOptions: {
          collapsible: false,
          collapsed: false
        }
      })
       .extend([
         new ol.control.ScaleLine({
           units: 'metric'
         }), new ol.control.OverviewMap({
           className: 'ol-overviewmap ol-custom-overviewmap',
           collapsible: true,
           collapsed: true,
           layers: [mapLayers.bing(trans)]
         }),
         new ol.control.ZoomToExtent({
           extent: extent
         })
       ]),
      view: new ol.View({
        center: center,
        extent: extent,
        projection: 'EPSG:3857',
        zoom: 14,
        maxZoom: 19,
        minZoom: 14
      })
    });
  };
  return {
    initialize: initialize
  };
}(window, document, Promise, ol, App));

App.config.modules.info = (function info(window, document, Promise, $, App) {
  'use strict';
  var lang = document.documentElement.lang;
  var dustBluebird = App.config.promises.dustBluebird;
  var utils = App.utils;

  var geoJSONFormat = new ol.format.GeoJSON({
    defaultDataProjection: 'EPSG:4326'
  });
  function extraInfoModal(feature) {
    var trans = _.cloneDeep(App.config.commons.trans);
    var obj = {};
    if (feature.get('rent')) {
      obj.listing_type = trans.listing.rent;
    } else {
      obj.listing_type = trans.listing.sale;
    }
    obj.gid = feature.get('gid');
    if (lang === 'el') {
      obj.type = feature.get('estatetype');
      obj.address = feature.get('street_el') + '' + feature.get('street_number');
      obj.contact = {
        name: feature.getProperties().name_el,
        lastname: feature.getProperties().lastname_el
      };
    } else {
      obj.type = feature.get('estatetype_en');
      obj.address = feature.get('street_en') + '' + feature.get('street_number');
      obj.contact = {
        name: feature.getProperties().name_en,
        lastname: feature.getProperties().lastname_en
      };
    }
    obj.area = feature.get('estatearea');
    obj.bedrooms = feature.get('bedrooms');
    obj.price = feature.get('price');
    obj.titles = {
      gid: trans.estate.gid,
      listing_type: trans.listing.type,
      address: trans.estate.address,
      area: trans.estate.area,
      bedrooms: trans.estate.amenities.bedrooms,
      price: trans.listing.price,
      isnew: trans.estate.amenities.isnew,
      parking: trans.estate.amenities.parking,
      furnished: trans.estate.amenities.furnished,
      pets: trans.estate.amenities.pets,
      view: trans.estate.amenities.view,
      heating: trans.estate.amenities.heating,
      cooling: trans.estate.amenities.cooling,
      contactInfo: trans.contact.contactInfo,
      name: trans.contact.name,
      lastname: trans.contact.lastname,
      phone: trans.contact.phone,
      email: trans.contact.email,
      title: trans.estate.amenities.title
    };
    obj.furnished = feature.get('furnished');
    obj.heating = feature.get('heating');
    obj.cooling = feature.get('cooling');
    obj.isnew = feature.get('isnew');
    obj.view = feature.get('view');
    obj.parking = feature.get('parking');
    obj.title = feature.get('title');
    obj.pets = feature.get('pets');
    obj.btns = {
      info: trans.btns.info,
      close: trans.btns.close
    };
    if (feature.getProperties().phone2 !== null) {
      obj.contact.phone = feature.getProperties().phone1 + ' ' + feature.getProperties().phone2;
    } else {
      obj.contact.phone = feature.getProperties().phone1;
    }
    obj.contact.email = feature.getProperties().email;
    dustBluebird.renderAsync('modalInfo', obj)
    .then(function resolve(data) {
      $('#modal').removeClass('visuallyhidden');
      $('.modal-content').html(data);
    })
    .then(function resolve() {
      var url = $.cloudinary.url(feature.get('gid').toString(), { format: 'json', type: 'list' });
      Promise.resolve(
        $.get(url)
      )
      .then(function resolveCloudinary(data) {
        $('.big-image').css('background-image', 'url(http://res.cloudinary.com/firvain/image/upload/v' + data.resources[0].version
        + '/' + data.resources[0].public_id + '.' + data.resources[0].format);
      })
      .catch(function error(e) {
        if (e.status === 404) {
          $('.big-image').css('background-image', 'url(/images/no_image_available.png)');
        }
      });
    })
    .catch(function error(e) {
      console.log(e.status);
    });
    $('#modal-close').click(function closeModal() {
      $('#modal').addClass('visuallyhidden');
    });
  }
  function renderEstateCards(feature) {
    var trans = _.cloneDeep(App.config.commons.trans);
    var obj = {};
    if (feature.get('rent')) {
      obj.listing_type = trans.listing.rent;
    } else {
      obj.listing_type = trans.listing.sale;
    }
    obj.gid = feature.get('gid');
    if (lang === 'el') {
      obj.type = feature.get('estatetype');
      obj.address = feature.get('street_el') + '' + feature.get('street_number');
    } else {
      obj.type = feature.get('estatetype_en');
      obj.address = feature.get('street_en') + '' + feature.get('street_number');
    }
    obj.area = feature.get('estatearea');
    obj.bedrooms = feature.get('bedrooms');
    obj.price = feature.get('price');
    obj.title = {
      listing_type: trans.listing.type,
      address: trans.estate.address,
      area: trans.estate.area,
      bedrooms: trans.estate.amenities.bedrooms,
      price: trans.listing.price,
      isnew: trans.estate.amenities.isnew,
      furnished: trans.estate.amenities.furnished,
      pets: trans.estate.amenities.pets
    };
    obj.isnew = feature.get('isnew');
    obj.furnished = feature.get('furnished');
    obj.pets = feature.get('pets');
    obj.btns = {
      info: trans.btns.info,
      close: trans.btns.close
    };
    dustBluebird.renderAsync('estateCards', obj)
    .then(function resolve(data) {
      $('.estate-cards').html(data);
    })
    .then(function resolve() {
      var url = $.cloudinary.url(feature.get('gid').toString(), { format: 'json', type: 'list' });
      Promise.resolve(
        $.get(url)
      )
      .then(function resolveCloudinary(data) {
        $('.estate-image').css('background-image', 'url(http://res.cloudinary.com/firvain/image/upload/v' + data.resources[0].version
        + '/' + data.resources[0].public_id + '.' + data.resources[0].format);
      })
      .catch(function error(e) {
        if (e.status === 404) {
          $('.estate-image').css('background-image', 'url(/images/no_image_available.png)');
        }
      });
    })
    .then(function resolve() {
      $('.estate-image').css('background-image', 'url(http://res.cloudinary.com/firvain/image/upload/h_222,c_scale/' + feature.get('gid') + '.jpg)');
      $('.estate-cards').addClass('estate-cards-active');
      $('#estate-card-square-close').click(function close() {
        $('.estate-cards').removeClass('estate-cards-active');
      });
      $('#estate-card-square-extra-info').click(function extraInfo() {
        extraInfoModal(feature);
      });
    })
    .catch(function error(e) {
      console.log(e);
      if (e.status === 404) {
        $('.big-image').css('background-image', 'url(/images/no_image_available.png)');
      }
    });
  }
  function selectFeature(evt) {
    var map = evt.map;
    // var coordinate = evt.coordinate;
    var f;
    var clickedFeature = map.forEachFeatureAtPixel(evt.pixel, function findFeature(feature, layer) {
      return {
        feature: feature,
        layer: layer
      };
    }, this, function clickedFeatureLayerFilter(layer) {
      if (layer.get('id') === 'estates' || layer.get('id') === 'filteredEstates') {
        return true;
      }
      return false;
    }, this);
    if (clickedFeature) {
      if (clickedFeature.layer.get('id') === 'estates' &&
        clickedFeature.feature.get('features').length === 1) {
        f = clickedFeature.feature.getProperties().features[0];
        renderEstateCards(f);
        map.getView().setCenter(f.getGeometry().getCoordinates());
        map.getView().setZoom(16);
        Promise.resolve(
          $.ajax({
            url: 'http://127.0.0.1:3000/api/uses/' + f.getProperties().gid,
            type: 'GET',
            dataType: 'json'
          })
        )
        .then(function resolve(data) {
          var features;
          utils.findById(map, 'poi').getSource().clear();
          features = geoJSONFormat.readFeatures(data.property_services_analysis, {
            featureProjection: 'EPSG:3857'
          });
          features.forEach(function removePolygon(feature) {
            if (feature.getGeometry().getType() === 'Polygon') {
              features.splice(features.indexOf(feature), 1);
            }
          });
          utils.findById(map, 'poi').getSource().addFeatures(features);
          // map.getView().fit(utils.findById(map, 'poi').getSource().getExtent(), map.getSize());

          toastr.info('Found ' + features.length + ' Points of Interest in 8 minute distance!');
        })
        .catch(function error(e) {
          utils.findById(map, 'poi').getSource().clear();
          if (e.status === 404) {
            toastr.error('Sorry, we cannot find any Points of Interest in 8 minute distance!');
          } else {
            console.log(e);
            toastr.error(e.responseText);
          }
        });
      } else if (clickedFeature.layer.get('id') === 'filteredEstates') {
        f = clickedFeature.feature;
        renderEstateCards(f);
        Promise.resolve(
          $.ajax({
            url: 'http://127.0.0.1:3000/db/uses/' + f.getProperties().gid,
            type: 'GET',
            dataType: 'json'
          })
        )
        .then(function resolve(data) {
          var features;
          if (utils.findById(map, 'poi').getSource().getFeatures().length !== 0) {
            utils.findById(map, 'poi').getSource().clear();
          }
          features = geoJSONFormat.readFeatures(data.property_services_analysis, {
            featureProjection: 'EPSG:3857'
          });
          features.forEach(function removePolygon(feature) {
            if (feature.getGeometry().getType() === 'Polygon') {
              features.splice(features.indexOf(feature), 1);
            }
          });
          utils.findById(map, 'poi').getSource().addFeatures(features);
          map.getView().fit(utils.findById(map, 'poi').getSource().getExtent(), map.getSize());
          toastr.info('Found ' + features.length + ' Points of Interest in 8 minute distance!');
        })
        .catch(function error(e) {
          if (e.status === 404) {
            toastr.error('Sorry, we cannot find any Points of Interest in 8 minute distance!');
          } else {
            console.log(e);
            toastr.error(e.responseText);
          }
        });
      }
    } else {
      utils.findById(map, 'poi').getSource().clear();
    }
  }

  function init() {
    var map = App.config.commons.map;
    map.on('click', selectFeature);
  }
  function disable() {
    var map = App.config.commons.map;
    map.un('click', selectFeature);
  }
  return {
    init: init,
    disable: disable
  };
}(window, document, Promise, jQuery, App));

App.config.modules.filters = (function filters(window, document, Promise, $, Parsley, moment, App) {
  'use strict';
  var lang = document.documentElement.lang;
  var dustBluebird = App.config.promises.dustBluebird;
  var utils = App.utils;

  var xy1 = ol.proj.transform([3652772, 4112808], 'EPSG:3857', 'EPSG:4326');
  var xy2 = ol.proj.transform([3700000, 4132797], 'EPSG:3857', 'EPSG:4326');
  var extent = _.concat(xy1, xy2);
  var bbox = extent;
  function assignValidators() {
    var content = document.getElementById('infobox-content');
    var inputs = content.querySelectorAll('input[type=text]');
    [].forEach.call(inputs, function makeParsleyInputs(el) {
      el.addEventListener('blur', function sanitize() {
        var str = this.value;
        var sanitizedStr;
        if (this.dataset.type === 'number') {
          sanitizedStr = str.replace(/[/\D/ ]/gi, '');
        } else if (this.dataset.type === 'alphanum') {
          sanitizedStr = str.replace(/[^a-z0-9A-ZA-zΑ-Ωα-ωίϊΐόάέύϋΰήώ ]/gi, '');
        } else if (this.dataset.type === 'special') {
          sanitizedStr = str.replace(/[^0-9 \/]/gi, '');
        } else if (this.dataset.type === 'date') {
          sanitizedStr = str.replace(/[^0-9 \-]/gi, '');
        }
        this.value = sanitizedStr;
        utils.removeClass(this.parentNode, 'is-invalid');
      });
    });
  }
  function addResults(data) {
    var map = App.config.commons.map;
    var geoJSONFormat = new ol.format.GeoJSON({
      defaultDataProjection: 'EPSG:4326'
    });
    var features = geoJSONFormat.readFeatures(data, {
      featureProjection: 'EPSG:3857'
    });
    features.forEach(function setId(f) {
      f.setId(f.getProperties().gid);
    });
    utils.findById(map, 'filteredEstates').getSource().addFeatures(features);
    if (lang === 'el') {
      toastr.info('Βρέθηκαν ' + features.length + ' ιδιοκτησίες!');
    } else {
      toastr.info('Found ' + features.length + ' estates!');
    }
  }
  function clearResults() {
    var map = App.config.commons.map;
    utils.findById(map, 'filteredEstates').getSource().clear();
    utils.findById(map, 'select').getSource().clear();
    map.getInteractions().forEach(function findInteractionById(i) {
      if (i.getProperties().id === 'draw') {
        i.setActive(false);
      }
    });
    $(map.getViewport()).off('mouseleave');
    $(map.getViewport()).off('mouseenter');
    bbox = extent;
    utils.findById(map, 'estates').setVisible(true);
    App.config.modules.info.init();
    $('#results').addClass('visuallyhidden').removeAttr('style')
    .empty();
  }
  function setOptions() {
    var filterData = {};
    filterData.estateType = $('#estateType').val();
    filterData.leaseType = $('input[name=options]:checked').val() !== undefined ? $('input[name=options]:checked').val() : 'Rent';
    filterData.startPrice = $('#startPrice').val() !== '' ? $('#startPrice').val() : 0;
    filterData.endPrice = $('#endPrice').val() !== '' ? $('#endPrice').val() : 2147483647;
    filterData.areaStart = $('#area-start').val() !== '' ? $('#area-start').val() : 0;
    filterData.areaEnd = $('#area-end').val() !== '' ? $('#area-end').val() : 2147483647;
    filterData.parking = $('#checkbox-1').prop('checked') !== undefined ? $('#checkbox-1').prop('checked') : false;
    filterData.furnished = $('#checkbox-2').prop('checked') !== undefined ? $('#checkbox-2').prop('checked') : false;
    filterData.heating = $('#checkbox-3').prop('checked') !== undefined ? $('#checkbox-3').prop('checked') : false;
    filterData.cooling = $('#checkbox-4').prop('checked') !== undefined ? $('#checkbox-4').prop('checked') : false;
    filterData.view = $('#checkbox-5').prop('checked') !== undefined ? $('#checkbox-5').prop('checked') : false;
    filterData.bbox = bbox;
    return filterData;
  }
  function getResults(options) {
    var map = App.config.commons.map;
    var trans = _.cloneDeep(App.config.commons.trans);
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/listing/filters',
        type: 'GET',
        dataType: 'json',
        data: options
      })
    )
    .then(function resolve(data) {
      var renderData = {};
      var results = [];

      utils.findById(map, 'estates').setVisible(false);
      utils.findById(map, 'poi').getSource().clear();
      utils.findById(map, 'filteredEstates').getSource().clear();
      // utils.findById(map, 'select').getSource().clear();
      addResults(data);
      _.forEach(data.features, function(value) {
        var address;
        var dateStart;
        var dateEnd;
        var coordinates = ol.proj.transform(value.geometry.coordinates, 'EPSG:3857', 'EPSG:4326');
        if (lang === 'el') {
          address = value.properties.street_el + ' ' + value.properties.street_number;
          dateStart = moment(value.properties.date_start).format('DD-MM-YYYY');
          dateEnd = moment(value.properties.end).format('DD-MM-YYYY');
        } else {
          address = value.properties.street_en + ' ' + value.properties.street_number;
          dateStart = moment(value.properties.date_start).format('MM-DD-YYYY');
          dateEnd = moment(value.properties.end).format('MM-DD-YYYY');
        }
        results.push({
          gid: value.properties.gid,
          price: value.properties.price,
          area: value.properties.estatearea,
          address: address,
          dateStart: dateStart,
          dateEnd: dateEnd,
          title: {
            price: trans.listing.price,
            area: trans.estate.area,
            areaUnits: trans.estate.areaUnits
          },
          coordinates: coordinates
        });
      });
      renderData.results = results;
      return renderData;
    })
    .then(function resolve(data) {
      dustBluebird.renderAsync('results', data)
      .then(function resolveDust(result) {
        var results = document.getElementById('results');
        utils.removeClass(results, 'visuallyhidden');
        results.innerHTML = result;
      })
      .then(function resolvez() {
        var zooms = document.getElementById('contentArea').querySelectorAll('i');
        zooms.forEach(function addZoomToResults(zoom) {
          zoom.addEventListener('click', function zoomToGid() {
            var gid = zoom.parentNode.parentNode.parentNode.dataset.gid;
            var coordinates = utils.findById(map, 'filteredEstates').getSource().getFeatureById(gid)
            .getGeometry()
            .getCoordinates();
            map.getView().setCenter(coordinates);
            map.getView().setZoom(16);
          });
        });
      });
    })
    .then(function resolve() {
      var clusterize = new Clusterize({
        scrollId: 'scrollArea',
        contentId: 'contentArea'
      });
    })
    .catch(function error(e) {
      console.log(e);
      if (e.status === 404) {
        toastr.error(trans.errors.property[404]);
      } else if (e.status === 503) {
        toastr.error(trans.errors.property[503]);
      } else {
        toastr.error(trans.errors.internal);
      }
    });
  }
  function chooseByArea(draw) {
    var map = App.config.commons.map;
    $(map.getViewport()).mouseleave(function leaveMapForAreaSelection(event) {
      event.preventDefault();
      event.stopPropagation();
      draw.setActive(false);
    });
    $(map.getViewport()).mouseenter(function enterMapForAreaSelection(event) {
      event.preventDefault();
      event.stopPropagation();
      draw.setActive(true);
    });
    draw.on('drawstart', function drawstart() {
      utils.findById(map, 'select').getSource().clear();
    });
    draw.on('drawend', function drawend(e) {
      var coordinates = e.feature.getGeometry().getExtent();
      var transformedCoordinates = _.chunk(coordinates, 2).map(function split(currentValue) {
        return ol.proj.transform(currentValue, 'EPSG:3857', 'EPSG:4326');
      });
      bbox = _.concat(transformedCoordinates[0], transformedCoordinates[1]);
    });
  }
  function init() {
    var map = App.config.commons.map;
    var drawInteraction = new ol.interaction.Draw({
      source: utils.findById(map, 'select').getSource(),
      type: 'LineString',
      geometryFunction: utils.geometryFunction,
      maxPoints: 2
      // condition: function(event) {
      //   return ol.events.condition.platformModifierKeyOnly(event);
      // }
    });
    drawInteraction.setProperties({
      id: 'draw'
    });
    drawInteraction.setActive(false);
    $('#checkbox-6').change(function enableAreaSelection() {
      if (this.checked) {
        map.addInteraction(drawInteraction);
        App.config.modules.info.disable();
        chooseByArea(drawInteraction);
      } else {
        App.config.modules.info.init();
        map.removeInteraction(drawInteraction);
        drawInteraction.setActive(false);
        utils.findById(map, 'select').getSource().clear();
        bbox = extent;
      }
    });
    assignValidators();
    $('#invokeFilters').click(function invokeFilters(event) {
      var options;
      event.preventDefault();
      event.stopPropagation();
      options = setOptions();
      if ($('form[name=filters]').parsley().validate()) {
        getResults(options);
      }
    });
    $('#clearFilters').click(function clearFilters(event) {
      event.preventDefault();
      event.stopPropagation();
      clearResults(map);
      $('label[for=option-1]').addClass('is-checked');
      $('#option-1').prop('checked', true);
      $('label[for=option-2]').removeClass('is-checked');
      $('#option-2').prop('checked', false);
      $('.mdl-checkbox__input').each(function clearCheckboxes(index, el) {
        $(el).prop('checked', false).parent('label')
        .removeClass('is-checked');
      });
      $('.mdl-textfield__input').each(function clearInputs(index, el) {
        if ($(el).attr('id') !== 'estateType') {
          $(el).val('').parent()
          .eq(0)
          .removeClass('is-dirty');
        } else {
          $(el).attr('data-val', 'Apartment');
          if (lang === 'el') {
            $(el).val('Διαμέρισμα');
          } else {
            $('#estateType').val('Apartment');
          }
        }
      });
    });
  }
  return {
    init: init
  };
}(window, document, Promise, $, Parsley, moment, App));

var userMap = (function userMap(window, document, Promise, $, App) {
  'use strict';
  var context = 'map';
  var lang = document.documentElement.lang;
  var $loading = $('.mdl-spinner');
  $(document)
  .ajaxStart(function start() {
    $('.spiner-wrapper').removeClass('visuallyhidden');
    $loading.addClass('is-active');
  })
  .ajaxStop(function stop() {
    $('.spiner-wrapper').addClass('visuallyhidden');
    $loading.removeClass('is-active');
  });
  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: 'toast-top-center',
    preventDuplicates: false,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut'
  };

  function init() {
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/language',
        type: 'GET',
        data: {
          type: lang,
          context: context
        }
      })
      )
    .then(function resolve(data) {
      App.config.commons.trans = data;
      App.config.commons.map = App.config.modules.map.initialize();
    })
    .then(function resolve() {
      App.config.modules.info.init();
      App.config.modules.filters.init();
    })
    .catch(function error(e) {
      console.log(e);
    });
  }

  return {
    init: init
  };
}(window, document, Promise, jQuery, App));


// jQuery(document).ready(function ($) {
//   $('.spinner').addClass('visuallyhidden');
//   $('.mdl-spinner').removeClass('is-active');
//   // handleSelect();
// });

userMap.init();
$('#advanced-filters').click(function toggleFilters() {
  $('#estate-filters').toggleClass('visuallyhidden');
});
// $('#toggle-price-range').click(function togglePriceRange() {
//   $('#price-range').toggleClass('visuallyhidden');
// });

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN1c3RvbUV2ZW50LmpzIiwic2Nyb2xsSW50b1ZpZXdJZk5lZWRlZC5qcyIsImdsb2JhbHMuanMiLCJ1dGlscy5qcyIsIm9sMy1tYXAuanMiLCJpbmZvLmpzIiwiZmlsdGVycy5qcyIsImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDelFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gIGlmICggdHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiICkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICBmdW5jdGlvbiBDdXN0b21FdmVudCAoIGV2ZW50LCBwYXJhbXMgKSB7XHJcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkIH07XHJcbiAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoICdDdXN0b21FdmVudCcgKTtcclxuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoIGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwgKTtcclxuICAgIHJldHVybiBldnQ7XHJcbiAgIH1cclxuXHJcbiAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcclxuXHJcbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XHJcbn0pKCk7XHJcbiIsIiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICghRWxlbWVudC5wcm90b3R5cGUuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCkge1xyXG4gICAgICBFbGVtZW50LnByb3RvdHlwZS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkID0gZnVuY3Rpb24gKGNlbnRlcklmTmVlZGVkKSB7XHJcbiAgICAgICAgY2VudGVySWZOZWVkZWQgPSBhcmd1bWVudHMubGVuZ3RoID09PSAwID8gdHJ1ZSA6ICEhY2VudGVySWZOZWVkZWQ7XHJcblxyXG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGUsXHJcbiAgICAgICAgcGFyZW50Q29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHBhcmVudCwgbnVsbCksXHJcbiAgICAgICAgcGFyZW50Qm9yZGVyVG9wV2lkdGggPSBwYXJzZUludChwYXJlbnRDb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2JvcmRlci10b3Atd2lkdGgnKSksXHJcbiAgICAgICAgcGFyZW50Qm9yZGVyTGVmdFdpZHRoID0gcGFyc2VJbnQocGFyZW50Q29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdib3JkZXItbGVmdC13aWR0aCcpKSxcclxuICAgICAgICBvdmVyVG9wID0gdGhpcy5vZmZzZXRUb3AgLSBwYXJlbnQub2Zmc2V0VG9wIDwgcGFyZW50LnNjcm9sbFRvcCxcclxuICAgICAgICBvdmVyQm90dG9tID0gKHRoaXMub2Zmc2V0VG9wIC0gcGFyZW50Lm9mZnNldFRvcCArIHRoaXMuY2xpZW50SGVpZ2h0IC0gcGFyZW50Qm9yZGVyVG9wV2lkdGgpID4gKHBhcmVudC5zY3JvbGxUb3AgKyBwYXJlbnQuY2xpZW50SGVpZ2h0KSxcclxuICAgICAgICBvdmVyTGVmdCA9IHRoaXMub2Zmc2V0TGVmdCAtIHBhcmVudC5vZmZzZXRMZWZ0IDwgcGFyZW50LnNjcm9sbExlZnQsXHJcbiAgICAgICAgb3ZlclJpZ2h0ID0gKHRoaXMub2Zmc2V0TGVmdCAtIHBhcmVudC5vZmZzZXRMZWZ0ICsgdGhpcy5jbGllbnRXaWR0aCAtIHBhcmVudEJvcmRlckxlZnRXaWR0aCkgPiAocGFyZW50LnNjcm9sbExlZnQgKyBwYXJlbnQuY2xpZW50V2lkdGgpLFxyXG4gICAgICAgIGFsaWduV2l0aFRvcCA9IG92ZXJUb3AgJiYgIW92ZXJCb3R0b207XHJcblxyXG4gICAgICAgIGlmICgob3ZlclRvcCB8fCBvdmVyQm90dG9tKSAmJiBjZW50ZXJJZk5lZWRlZCkge1xyXG4gICAgICAgICAgcGFyZW50LnNjcm9sbFRvcCA9IHRoaXMub2Zmc2V0VG9wIC0gcGFyZW50Lm9mZnNldFRvcCAtIHBhcmVudC5jbGllbnRIZWlnaHQgLyAyIC0gcGFyZW50Qm9yZGVyVG9wV2lkdGggKyB0aGlzLmNsaWVudEhlaWdodCAvIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoKG92ZXJMZWZ0IHx8IG92ZXJSaWdodCkgJiYgY2VudGVySWZOZWVkZWQpIHtcclxuICAgICAgICAgIHBhcmVudC5zY3JvbGxMZWZ0ID0gdGhpcy5vZmZzZXRMZWZ0IC0gcGFyZW50Lm9mZnNldExlZnQgLSBwYXJlbnQuY2xpZW50V2lkdGggLyAyIC0gcGFyZW50Qm9yZGVyTGVmdFdpZHRoICsgdGhpcy5jbGllbnRXaWR0aCAvIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoKG92ZXJUb3AgfHwgb3ZlckJvdHRvbSB8fCBvdmVyTGVmdCB8fCBvdmVyUmlnaHQpICYmICFjZW50ZXJJZk5lZWRlZCkge1xyXG4gICAgICAgICAgdGhpcy5zY3JvbGxJbnRvVmlldyhhbGlnbldpdGhUb3ApO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH1cclxuICB9KSgpO1xyXG4iLCJ3aW5kb3cuQXBwIHx8ICh3aW5kb3cuQXBwID0ge30pO1xyXG53aW5kb3cuQXBwLmNvbmZpZyA9IHtcclxuICBwcm9taXNlczoge1xyXG4gICAgZHVzdEJsdWViaXJkOiBQcm9taXNlLnByb21pc2lmeUFsbChkdXN0KSxcclxuICAgIGNsb3VkaW5hcnlCaXJkOiBQcm9taXNlLnByb21pc2lmeUFsbCgkLmNsb3VkaW5hcnkpXHJcbiAgfSxcclxuICBjb21tb25zOiB7XHJcbiAgICBtYXA6IHt9LFxyXG4gICAgdHJhbnM6IHt9XHJcbiAgfSxcclxuICBjYWNoZToge1xyXG4gICAgYWN0aXZlRXN0YXRlOiB7fSxcclxuICAgIGFjdGl2ZUVzdGF0ZUxpc3Rpbmc6IHt9XHJcbiAgfSxcclxuICBtb2R1bGVzOiB7XHJcbiAgICBtYXA6IHt9LFxyXG4gICAgaW5mbzoge30sXHJcbiAgICBlZGl0OiB7fSxcclxuICAgIGRlbGV0ZToge30sXHJcbiAgICBpbnNlcnQ6IHt9LFxyXG4gICAgZmlsdGVyczoge31cclxuICB9XHJcbn07XHJcbndpbmRvdy5BcHAudXRpbHMgPSB7fTtcclxuLy8gdmFyIHRyYW5zO1xyXG4vLyB2YXIgY2xvdWRpbmFyeUJpcmQgPSBQcm9taXNlLnByb21pc2lmeUFsbCgkLmNsb3VkaW5hcnkpO1xyXG4vLyB2YXIgYWN0aXZlRXN0YXRlO1xyXG4vLyB2YXIgYWN0aXZlRXN0YXRlTGlzdGluZztcclxuJC5jbG91ZGluYXJ5LmNvbmZpZyh7IGNsb3VkX25hbWU6ICdmaXJ2YWluJywgYXBpX2tleTogJzM3NTEzODkzMjY4OTU5MScgfSk7XHJcbiIsIi8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOiBbXCJlcnJvclwiLCB7IFwicHJvcHNcIjogZmFsc2UgfV0qL1xyXG5BcHAudXRpbHMgPSB7XHJcbiAgZmluZEJ5SWQ6IGZ1bmN0aW9uIGZpbmRCeUlkKG1hcCwgaWQpIHtcclxuICAgIHZhciBsYXllcnMgPSBtYXAuZ2V0TGF5ZXJzKCk7XHJcbiAgICB2YXIgbGVuZ3RoID0gbGF5ZXJzLmdldExlbmd0aCgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoaWQgPT09IGxheWVycy5pdGVtKGkpLmdldCgnaWQnKSkge1xyXG4gICAgICAgIHJldHVybiBsYXllcnMuaXRlbShpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfSxcclxuICBmaW5kQnlOYW1lOiBmdW5jdGlvbiBmaW5kQnlOYW1lKG1hcCwgbmFtZSkge1xyXG4gICAgdmFyIGxheWVycyA9IG1hcC5nZXRMYXllcnMoKTtcclxuICAgIHZhciBsZW5ndGggPSBsYXllcnMuZ2V0TGVuZ3RoKCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChuYW1lID09PSBsYXllcnMuaXRlbShpKS5nZXQoJ25hbWUnKSkge1xyXG4gICAgICAgIHJldHVybiBsYXllcnMuaXRlbShpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfSxcclxuICBwcmV2ZW50RG90QW5kU3BhY2U6IGZ1bmN0aW9uIHByZXZlbnREb3RBbmRTcGFjZShlKSB7XHJcbiAgICB2YXIga2V5ID0gZS5jaGFyQ29kZSA/IGUuY2hhckNvZGUgOiBlLmtleUNvZGU7XHJcbiAgICB0aGlzLmlubmVySFRNTCA9IGtleTtcclxuICAgIGlmIChrZXkgPT09IDQ2IHx8IGtleSA9PT0gMzIpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSxcclxuICBnZW9tZXRyeUZ1bmN0aW9uOiBmdW5jdGlvbiBnZW9tZXRyeUZ1bmN0aW9uKGNvb3JkaW5hdGVzLCBnZW9tZXRyeSkge1xyXG4gICAgdmFyIGdlb20gPSBnZW9tZXRyeTtcclxuICAgIHZhciBzdGFydDtcclxuICAgIHZhciBlbmQ7XHJcbiAgICBpZiAoIWdlb20pIHtcclxuICAgICAgZ2VvbSA9IG5ldyBvbC5nZW9tLlBvbHlnb24obnVsbCk7XHJcbiAgICB9XHJcbiAgICBzdGFydCA9IGNvb3JkaW5hdGVzWzBdO1xyXG4gICAgZW5kID0gY29vcmRpbmF0ZXNbMV07XHJcbiAgICBnZW9tLnNldENvb3JkaW5hdGVzKFtcclxuICAgICAgW3N0YXJ0LCBbc3RhcnRbMF0sIGVuZFsxXV0sIGVuZCwgW2VuZFswXSwgc3RhcnRbMV1dLCBzdGFydF1cclxuICAgIF0pO1xyXG4gICAgcmV0dXJuIGdlb207XHJcbiAgfSxcclxuICBoYXNDbGFzczogZnVuY3Rpb24gaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xyXG4gICAgaWYgKGVsLmNsYXNzTGlzdCkge1xyXG4gICAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnKF58ICknICsgY2xhc3NOYW1lICsgJyggfCQpJywgJ2dpJykudGVzdChlbC5jbGFzc05hbWUpO1xyXG4gIH0sXHJcbiAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsLCBjbGFzc05hbWUpIHtcclxuICAgIHZhciBlbGVtZW50ID0gZWw7XHJcbiAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcclxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnKF58XFxcXGIpJyArIGNsYXNzTmFtZS5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKSwgJyAnKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGFkZENsYXNzOiBmdW5jdGlvbiByZW1vdmVDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XHJcbiAgICB2YXIgZWxlbWVudCA9IGVsO1xyXG4gICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XHJcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZWxlbWVudC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgdG9nZ2xlQ2xhc3M6IGZ1bmN0aW9uIHRvZ2dsZUNsYXNzKGVsLCBjbGFzc05hbWUpIHtcclxuICAgIHZhciBjbGFzc2VzO1xyXG4gICAgdmFyIGV4aXN0aW5nSW5kZXg7XHJcbiAgICB2YXIgZWxlbWVudCA9IGVsO1xyXG4gICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XHJcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2xhc3NlcyA9IGVsZW1lbnQuY2xhc3NOYW1lLnNwbGl0KCcgJyk7XHJcbiAgICAgIGV4aXN0aW5nSW5kZXggPSBjbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKTtcclxuXHJcbiAgICAgIGlmIChleGlzdGluZ0luZGV4ID49IDApIHtcclxuICAgICAgICBjbGFzc2VzLnNwbGljZShleGlzdGluZ0luZGV4LCAxKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjbGFzc2VzLnB1c2goY2xhc3NOYW1lKTtcclxuICAgICAgfVxyXG4gICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbignICcpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgcmVxdWVzdEZ1bGxTY3JlZW46IGZ1bmN0aW9uIHJlcXVlc3RGdWxsU2NyZWVuKGVsZW1lbnQpIHtcclxuICAgIC8vIFN1cHBvcnRzIG1vc3QgYnJvd3NlcnMgYW5kIHRoZWlyIHZlcnNpb25zLlxyXG4gICAgdmFyIHJlcXVlc3RNZXRob2QgPSBlbGVtZW50LnJlcXVlc3RGdWxsU2NyZWVuIHx8IGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4gfHwgZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbiB8fCBlbGVtZW50Lm1zUmVxdWVzdEZ1bGxTY3JlZW47XHJcbiAgICB2YXIgd3NjcmlwdDtcclxuICAgIGlmIChyZXF1ZXN0TWV0aG9kKSB7IC8vIE5hdGl2ZSBmdWxsIHNjcmVlbi5cclxuICAgICAgcmVxdWVzdE1ldGhvZC5jYWxsKGVsZW1lbnQpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93LkFjdGl2ZVhPYmplY3QgIT09ICd1bmRlZmluZWQnKSB7IC8vIE9sZGVyIElFLlxyXG4gICAgICB3c2NyaXB0ID0gbmV3IEFjdGl2ZVhPYmplY3QoJ1dTY3JpcHQuU2hlbGwnKTtcclxuICAgICAgaWYgKHdzY3JpcHQgIT09IG51bGwpIHtcclxuICAgICAgICB3c2NyaXB0LlNlbmRLZXlzKCd7RjExfScpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBleGl0RnVsbHNyZWVuOiBmdW5jdGlvbiBleGl0RnVsbHNyZWVuKGVsZW1lbnQpIHtcclxuICAgIHZhciByZXF1ZXN0TWV0aG9kID0gZWxlbWVudC5leGl0RnVsbFNjcmVlbiB8fCBlbGVtZW50LndlYmtpdEV4aXRGdWxsc2NyZWVuIHx8IGVsZW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbiB8fCBlbGVtZW50Lm1zRXhpdEZ1bGxzY3JlZW47XHJcbiAgICB2YXIgd3NjcmlwdDtcclxuICAgIGlmIChyZXF1ZXN0TWV0aG9kKSB7IC8vIE5hdGl2ZSBmdWxsIHNjcmVlbi5cclxuICAgICAgcmVxdWVzdE1ldGhvZC5jYWxsKGVsZW1lbnQpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93LkFjdGl2ZVhPYmplY3QgIT09ICd1bmRlZmluZWQnKSB7IC8vIE9sZGVyIElFLlxyXG4gICAgICB3c2NyaXB0ID0gbmV3IEFjdGl2ZVhPYmplY3QoJ1dTY3JpcHQuU2hlbGwnKTtcclxuICAgICAgaWYgKHdzY3JpcHQgIT09IG51bGwpIHtcclxuICAgICAgICB3c2NyaXB0LlNlbmRLZXlzKCd7RXNjfScpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBlbFRvRW46IGZ1bmN0aW9uIGVsVG9FbihzdHJpbmcpIHtcclxuICAgIHZhciBvcmlnaW5hbFN0cmluZyA9IHN0cmluZztcclxuICAgIHZhciBuZXdTdHJpbmc7XHJcbiAgICB2YXIgcmVwbGFjZSA9IG5ldyBBcnJheSgnzrEnLCAnzqwnLCAnzoYnLCAnzpEnLCAnzrInLCAnzpInLCAnzrMnLCAnzpMnLCAnzrQnLCAnzpQnLCAnzrUnLCAnzq0nLCAnzpUnLCAnzognLCAnzrYnLCAnzpYnLCAnzrcnLCAnzq4nLCAnzpcnLCAnzrgnLCAnzpgnLCAnzrknLCAnzq8nLCAnz4onLCAnzpAnLCAnzpknLCAnzoonLCAnzronLCAnzponLCAnzrsnLCAnzpsnLCAnzrwnLCAnzpwnLCAnzr0nLCAnzp0nLCAnzr4nLCAnzp4nLCAnzr8nLCAnz4wnLCAnzp8nLCAnzownLCAnz4AnLCAnzqAnLCAnz4EnLCAnzqEnLCAnz4MnLCAnz4InLCAnzqMnLCAnz4QnLCAnzqQnLCAnz4UnLCAnz40nLCAnzqUnLCAnzo4nLCAnz4YnLCAnzqYnLCAnz4cnLCAnzqcnLCAnz4gnLCAnzqgnLCAnz4knLCAnz44nLCAnzqknLCAnzo8nLCAnICcsICdcXCcnLCAnXFwnJywgJywnKTtcclxuICAgIHZhciByZXBsYWNlX24gPSBuZXcgQXJyYXkoJ2EnLCAnYScsICdBJywgJ0EnLCAndicsICdWJywgJ2cnLCAnRycsICdkJywgJ0QnLCAnZScsICdlJywgJ0UnLCAnRScsICd6JywgJ1onLCAnaScsICdpJywgJ0knLCAndGgnLCAnVGgnLCAnaScsICdpJywgJ2knLCAnaScsICdJJywgJ0knLCAnaycsICdLJywgJ2wnLCAnTCcsICdtJywgJ00nLCAnbicsICdOJywgJ3gnLCAnWCcsICdvJywgJ28nLCAnTycsICdPJywgJ3AnLCAnUCcsICdyJywgJ1InLCAncycsICdzJywgJ1MnLCAndCcsICdUJywgJ3UnLCAndScsICdZJywgJ1knLCAnZicsICdGJywgJ2NoJywgJ0NoJywgJ3BzJywgJ1BzJywgJ28nLCAnbycsICdPJywgJ08nLCAnICcsICdfJywgJ18nLCAnXycpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVwbGFjZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBvcmlnaW5hbFN0cmluZyA9IG9yaWdpbmFsU3RyaW5nLnJlcGxhY2UobmV3IFJlZ0V4cChyZXBsYWNlW2ldLCAnZycpLCByZXBsYWNlX25baV0pO1xyXG4gICAgfVxyXG4gICAgbmV3U3RyaW5nID0gb3JpZ2luYWxTdHJpbmc7XHJcbiAgICByZXR1cm4gbmV3U3RyaW5nO1xyXG4gIH0sXHJcbiAgaGFuZGxlRGF0ZTogZnVuY3Rpb24gaGFuZGxlRGF0ZShzdHIsIGxhbmcpIHtcclxuICAgIHZhciBzcGxpdDtcclxuICAgIHZhciBuZXdEYXRlID0gW107XHJcbiAgICBpZiAodHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgJiYgbGFuZyAhPT0gJ2VsJykge1xyXG4gICAgICBzcGxpdCA9IF8uc3BsaXQoc3RyLCAnLScsIDMpO1xyXG4gICAgICBuZXdEYXRlID0gW3NwbGl0WzFdLCBzcGxpdFswXSwgc3BsaXRbMl1dO1xyXG4gICAgICByZXR1cm4gXy5qb2luKG5ld0RhdGUsICctJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RyO1xyXG4gIH0sXHJcbiAgc2FuaXRpemU6IGZ1bmN0aW9uIHNhbml0aXplKGVsKSB7XHJcbiAgICB2YXIgc2FuaXRpemVkU3RyO1xyXG4gICAgdmFyIHN0ciA9IGVsLnZhbHVlO1xyXG4gICAgc2FuaXRpemVkU3RyID0gc3RyLnJlcGxhY2UoL1teYS16MC05QS1aQS16zpEtzqnOsS3Pic6vz4rOkM+MzqzOrc+Nz4vOsM6uz45dL2dpLCAnJyk7XHJcbiAgICBlbC52YWx1ZSA9IHNhbml0aXplZFN0cjtcclxuICAgIGNvbnNvbGUubG9nKGVsKTtcclxuICAgIGNvbnNvbGUubG9nKGVsLnZhbHVlKTtcclxuICAgIGNvbnNvbGUubG9nKHNhbml0aXplZFN0cik7XHJcbiAgfVxyXG4gIC8vIHpvb21Ub0dpZDogZnVuY3Rpb24gem9vbVRvR2lkKG1hcCwgZ2lkKSB7XHJcbiAgLy8gICB2YXIgY29vcmRpbmF0ZXMgPSB1dGlscy5maW5kQnlJZChtYXAsICdmaWx0ZXJlZEVzdGF0ZXMnKS5nZXRTb3VyY2UoKS5nZXRGZWF0dXJlQnlJZChnaWQpXHJcbiAgLy8gICAuZ2V0R2VvbWV0cnkoKVxyXG4gIC8vICAgLmdldENvb3JkaW5hdGVzKCk7XHJcbiAgLy8gICBtYXAuZ2V0VmlldygpLnNldENlbnRlcihjb29yZGluYXRlcyk7XHJcbiAgLy8gfVxyXG59O1xyXG4iLCJBcHAuY29uZmlnLm1vZHVsZXMubWFwID0gKGZ1bmN0aW9uIG9sM01hcCh3aW5kb3csIGRvY3VtZW50LCBQcm9taXNlLCBvbCwgQXBwKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG4gIHZhciBsYW5nID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lmxhbmc7XHJcbiAgdmFyIGNlbnRlciA9IFszNjc3Mzg1LCA0MTIwOTQ5XTtcclxuICB2YXIgZXh0ZW50ID0gWzM2NTI3NzIsIDQxMTI4MDgsIDM3MDAwMDAsIDQxMzI3OTddO1xyXG4gIHZhciBnZW9KU09ORm9ybWF0ID0gbmV3IG9sLmZvcm1hdC5HZW9KU09OKHtcclxuICAgIGRlZmF1bHREYXRhUHJvamVjdGlvbjogJ0VQU0c6NDMyNidcclxuICB9KTtcclxuXHJcbiAgdmFyIG1hcFN0eWxlcyA9IHtcclxuICAgIGljb25UeXBlOiBmdW5jdGlvbiBpY29uVHlwZShlc3RhdGVUeXBlKSB7XHJcbiAgICAgIHZhciB0eXBlID0ge1xyXG4gICAgICAgIEFwYXJ0bWVudDogZnVuY3Rpb24gYXBhcnRtZW50SWNvbigpIHtcclxuICAgICAgICAgIHJldHVybiAnYXBhcnRtZW50JztcclxuICAgICAgICB9LFxyXG4gICAgICAgICdEZXRhY2hlZCBIb3VzZSc6IGZ1bmN0aW9uIGRldGFjaGVkSG91Y2VJY29uKCkge1xyXG4gICAgICAgICAgcmV0dXJuICdkZXRhY2hlZCc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBWaWxsYTogZnVuY3Rpb24gdmlsbGFJY29uKCkge1xyXG4gICAgICAgICAgcmV0dXJuICd2aWxsYSc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBNYWlzb25ldHRlOiBmdW5jdGlvbiBtYWlzb25ldHRlSWNvbigpIHtcclxuICAgICAgICAgIHJldHVybiAndmlsbGEnO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuICh0eXBlW2VzdGF0ZVR5cGVdKSgpO1xyXG4gICAgfSxcclxuICAgIGljb25QYXRoOiBmdW5jdGlvbiBpY29uUGF0aChsaXN0aW5nVHlwZSkge1xyXG4gICAgICB2YXIgcGF0aCA9IHtcclxuICAgICAgICB0cnVlOiBmdW5jdGlvbiBzYWxlSWNvbigpIHtcclxuICAgICAgICAgIHJldHVybiAnLi9pbWFnZXMvcGlucy9zYWxlLyc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmYWxzZTogZnVuY3Rpb24gcmVudEljb24oKSB7XHJcbiAgICAgICAgICByZXR1cm4gJy4vaW1hZ2VzL3BpbnMvcmVudC8nO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIChwYXRoW2xpc3RpbmdUeXBlXSkoKTtcclxuICAgIH0sXHJcbiAgICBlc3RhdGVzOiBmdW5jdGlvbiBlc3RhdGVzKGZlYXR1cmUpIHtcclxuICAgICAgdmFyIHNyYyA9IG1hcFN0eWxlcy5pY29uUGF0aChmZWF0dXJlLmdldCgnc2FsZScpKSArXHJcbiAgICAgIG1hcFN0eWxlcy5pY29uVHlwZShmZWF0dXJlLmdldCgnZXN0YXRldHlwZV9lbicpKSArICctNDgucG5nJztcclxuICAgICAgcmV0dXJuIG5ldyBvbC5zdHlsZS5TdHlsZSh7XHJcbiAgICAgICAgZ2VvbWV0cnk6IGZlYXR1cmUuZ2V0R2VvbWV0cnkoKSxcclxuICAgICAgICBpbWFnZTogbmV3IG9sLnN0eWxlLkljb24oKHtcclxuICAgICAgICAgIHNyYzogc3JjLFxyXG4gICAgICAgICAgYW5jaG9yT3JpZ2luOiAnYm90dG9tLWxlZnQnLFxyXG4gICAgICAgICAgYW5jaG9yOiBbMC41LCAwXSxcclxuICAgICAgICAgIHNjYWxlOiAxXHJcbiAgICAgICAgfSkpXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIGNsdXN0ZXI6IGZ1bmN0aW9uIGNsdXN0ZXIoZmVhdHVyZSkge1xyXG4gICAgICB2YXIgc2l6ZSA9IGZlYXR1cmUuZ2V0KCdmZWF0dXJlcycpLmxlbmd0aDtcclxuICAgICAgdmFyIHN0eWxlO1xyXG4gICAgICB2YXIgb3JpZ2luYWxGZWF0dXJlO1xyXG4gICAgICBpZiAoc2l6ZSA+IDEpIHtcclxuICAgICAgICBzdHlsZSA9IFtuZXcgb2wuc3R5bGUuU3R5bGUoe1xyXG4gICAgICAgICAgaW1hZ2U6IG5ldyBvbC5zdHlsZS5DaXJjbGUoe1xyXG4gICAgICAgICAgICByYWRpdXM6IDIwLFxyXG4gICAgICAgICAgICBzdHJva2U6IG5ldyBvbC5zdHlsZS5TdHJva2Uoe1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbMTU2LCAzOSwgMTc2LCAxXSxcclxuICAgICAgICAgICAgICB3aWR0aDogNVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgZmlsbDogbmV3IG9sLnN0eWxlLkZpbGwoe1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbNjgsIDEzOCwgMjU1LCAwLjhdXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIHRleHQ6IG5ldyBvbC5zdHlsZS5UZXh0KHtcclxuICAgICAgICAgICAgdGV4dDogc2l6ZS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICBmaWxsOiBuZXcgb2wuc3R5bGUuRmlsbCh7XHJcbiAgICAgICAgICAgICAgY29sb3I6ICcjRkZGRkZGJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICB6SW5kZXg6IDEwMVxyXG4gICAgICAgIH0pXTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvcmlnaW5hbEZlYXR1cmUgPSBmZWF0dXJlLmdldCgnZmVhdHVyZXMnKVswXTtcclxuICAgICAgICBzdHlsZSA9IFttYXBTdHlsZXMuZXN0YXRlcyhvcmlnaW5hbEZlYXR1cmUpXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc3R5bGU7XHJcbiAgICB9LFxyXG4gICAgcG9pOiBmdW5jdGlvbiBwb2koZmVhdHVyZSkge1xyXG4gICAgICB2YXIgc3R5bGVDYWNoZSA9IHt9O1xyXG4gICAgICB2YXIgc3ltYm9sID0gZmVhdHVyZS5nZXQoJ3N0eWxlJyk7XHJcbiAgICAgIHZhciB0ZXh0O1xyXG4gICAgICBpZiAobGFuZyA9PT0gJ2VsJykge1xyXG4gICAgICAgIHRleHQgPSBmZWF0dXJlLmdldCgnbmFtZV9lbCcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRleHQgPSBmZWF0dXJlLmdldCgnbmFtZV9lbicpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghc3R5bGVDYWNoZVtzeW1ib2xdKSB7XHJcbiAgICAgICAgc3R5bGVDYWNoZSA9IFtuZXcgb2wuc3R5bGUuU3R5bGUoe1xyXG4gICAgICAgICAgaW1hZ2U6IG5ldyBvbC5zdHlsZS5JY29uKCh7XHJcbiAgICAgICAgICAgIHNyYzogJy4uL2ltYWdlcy9tYWtpL3JlbmRlcnMvJyArIHN5bWJvbCArICctMjQucG5nJyxcclxuICAgICAgICAgICAgYW5jaG9yT3JpZ2luOiAnYm90dG9tLWxlZnQnLFxyXG4gICAgICAgICAgICBhbmNob3I6IFswLjUsIDAuNV0sXHJcbiAgICAgICAgICAgIHNjYWxlOiAxXHJcbiAgICAgICAgICB9KSksXHJcbiAgICAgICAgICB0ZXh0OiBuZXcgb2wuc3R5bGUuVGV4dCh7XHJcbiAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgIHN0cm9rZTogbmV3IG9sLnN0eWxlLlN0cm9rZSh7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsxNTYsIDM5LCAxNzYsIDAuOF0sXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDFcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG9mZnNldFk6IDEyXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc3R5bGVDYWNoZTtcclxuICAgIH0sXHJcbiAgICBmaWx0ZXJlZEVzdGF0ZXM6IGZ1bmN0aW9uIGZpbHRlcmVkRXN0YXRlcyhmZWF0dXJlKSB7XHJcbiAgICAgIHZhciBzcmMgPSBtYXBTdHlsZXMuaWNvblBhdGgoZmVhdHVyZS5nZXQoJ3NhbGUnKSkgK1xyXG4gICAgICBtYXBTdHlsZXMuaWNvblR5cGUoZmVhdHVyZS5nZXQoJ2VzdGF0ZXR5cGVfZW4nKSkgKyAnLTQ4LnBuZyc7XHJcbiAgICAgIHJldHVybiBuZXcgb2wuc3R5bGUuU3R5bGUoe1xyXG4gICAgICAgIGltYWdlOiBuZXcgb2wuc3R5bGUuSWNvbigoe1xyXG4gICAgICAgICAgc3JjOiBzcmMsXHJcbiAgICAgICAgICBhbmNob3JPcmlnaW46ICdib3R0b20tbGVmdCcsXHJcbiAgICAgICAgICBhbmNob3I6IFswLjUsIDBdLFxyXG4gICAgICAgICAgc2NhbGU6IDFcclxuICAgICAgICB9KSlcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcblxyXG4gIHZhciBtYXBTb3VyY2VzID0ge1xyXG4gICAgYmluZzogZnVuY3Rpb24gYmluZygpIHtcclxuICAgICAgcmV0dXJuIG5ldyBvbC5zb3VyY2UuQmluZ01hcHMoe1xyXG4gICAgICAgIGtleTogJ0FrMkdxOFZVZklDc1BwdWY3TFJBTlhtWHQyc0hXbVNMUGhvaG1WTEZ0RklFd1lqc181TUN5QWhBRndSU1ZwTGonLFxyXG4gICAgICAgIGltYWdlcnlTZXQ6ICdBZXJpYWxXaXRoTGFiZWxzJ1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBtYXBCb3g6IGZ1bmN0aW9uIG1hcEJveCgpIHtcclxuICAgICAgcmV0dXJuIG5ldyBvbC5zb3VyY2UuWFlaKHtcclxuICAgICAgICBhdHRyaWJ1dGlvbnM6IFtuZXcgb2wuQXR0cmlidXRpb24oe1xyXG4gICAgICAgICAgaHRtbDogJzxhIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL2Fib3V0L21hcHMvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+JmNvcHk7IE1hcGJveCAmY29weTsgT3BlblN0cmVldE1hcDwvYT4nXHJcbiAgICAgICAgfSldLFxyXG4gICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vdjQvbWFwYm94LnN0cmVldHMve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj1way5leUoxSWpvaVptbHlkbUZwYmlJc0ltRWlPaUpsT1dZeVlUTTBOVGhpTldNMFlqSmpPREpqTkRFNE9EUXpOekEyTUdReU5pSjkuLU5WRE8yN0h6dC13X25Rb3NVUGZMQSdcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZXN0YXRlczogZnVuY3Rpb24gZXN0YXRlcygpIHtcclxuICAgICAgcmV0dXJuIG5ldyBvbC5zb3VyY2UuVmVjdG9yKHtcclxuICAgICAgICBmb3JtYXQ6IGdlb0pTT05Gb3JtYXQsXHJcbiAgICAgICAgbG9hZGVyOiBmdW5jdGlvbiBmZWF0cmVMb2FkZXIoKSB7XHJcbiAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAvYXBpL2xpc3RpbmcvYWxsJyxcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIHN1Y2NlZGVkKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGZlYXR1cmVzID0gZ2VvSlNPTkZvcm1hdC5yZWFkRmVhdHVyZXMocmVzcG9uc2UsIHtcclxuICAgICAgICAgICAgICAgIGZlYXR1cmVQcm9qZWN0aW9uOiAnRVBTRzozODU3J1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIHNlbGYuYWRkRmVhdHVyZXMoZmVhdHVyZXMpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbiBmYWlsZWQoanFYSFIpIHtcclxuICAgICAgICAgICAgICB0b2FzdHIuY2xlYXIoKTtcclxuICAgICAgICAgICAgICBpZiAoanFYSFIuc3RhdHVzID09PSA0MDQpIHtcclxuICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcignU29ycnksIHdlIGNhbm5vdCBmaW5kIGFueSBwcm9wZXJ0aWVzIScpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoanFYSFIuc3RhdHVzID09PSA1MDMpIHtcclxuICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcignU2VydmljZSBVbmF2YWlsYWJsZScpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ0ludGVybmFsIFNlcnZlciBFcnJvcicpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBjbHVzdGVyOiBmdW5jdGlvbiBjbHVzdGVyKCkge1xyXG4gICAgICByZXR1cm4gbmV3IG9sLnNvdXJjZS5DbHVzdGVyKHtcclxuICAgICAgICBkaXN0YW5jZTogNDAsXHJcbiAgICAgICAgc291cmNlOiBtYXBTb3VyY2VzLmVzdGF0ZXMoKSxcclxuICAgICAgICBhdHRyaWJ1dGlvbnM6IFtuZXcgb2wuQXR0cmlidXRpb24oe1xyXG4gICAgICAgICAgaHRtbDogJ0FsbCBtYXBzIMKpIDxhIGhyZWY9XCJodHRwOi8vd3d3LnRlcnJhY29nbml0YS5nci9cIj5UZXJyYSBDb2duaXRhPC9hPidcclxuICAgICAgICB9KV1cclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgc2VsZWN0OiBmdW5jdGlvbiBzZWxlY3QoKSB7XHJcbiAgICAgIHJldHVybiBuZXcgb2wuc291cmNlLlZlY3Rvcih7fSk7XHJcbiAgICB9LFxyXG4gICAgcG9pOiBmdW5jdGlvbiBwb2koKSB7XHJcbiAgICAgIHJldHVybiBuZXcgb2wuc291cmNlLlZlY3Rvcih7XHJcbiAgICAgICAgYXR0cmlidXRpb25zOiBbbmV3IG9sLkF0dHJpYnV0aW9uKHtcclxuICAgICAgICAgIGh0bWw6ICdQT0kgYnkgPGEgaHJlZj1cImh0dHA6Ly93d3cudGVycmFjb2duaXRhLmdyL1wiPlRlcnJhIENvZ25pdGE8L2E+J1xyXG4gICAgICAgIH0pXSxcclxuICAgICAgICBmb3JtYXQ6IGdlb0pTT05Gb3JtYXRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIG1hcExheWVycyA9IHtcclxuICAgIGJpbmc6IGZ1bmN0aW9uIGJpbmcodHJhbnMpIHtcclxuICAgICAgcmV0dXJuIG5ldyBvbC5sYXllci5UaWxlKHtcclxuICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgIHNvdXJjZTogbWFwU291cmNlcy5iaW5nKCksXHJcbiAgICAgICAgbWF4Wm9vbTogMTksXHJcbiAgICAgICAgY3Jvc3NPcmlnaW46ICdhbm9ueW1vdXMnLFxyXG4gICAgICAgIHByZWxvYWQ6IEluZmluaXR5LFxyXG4gICAgICAgIGlkOiAnYmluZycsXHJcbiAgICAgICAgbmFtZTogdHJhbnMubGF5ZXJzLmJpbmdcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgbWFwQm94OiBmdW5jdGlvbiBtYXBCb3godHJhbnMpIHtcclxuICAgICAgcmV0dXJuIG5ldyBvbC5sYXllci5UaWxlKHtcclxuICAgICAgICBzb3VyY2U6IG1hcFNvdXJjZXMubWFwQm94KCksXHJcbiAgICAgICAgaWQ6ICdtYXBib3gnLFxyXG4gICAgICAgIG5hbWU6IHRyYW5zLmxheWVycy5tYXBCb3hcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZXN0YXRlczogZnVuY3Rpb24gZXN0YXRlcyh0cmFucykge1xyXG4gICAgICByZXR1cm4gbmV3IG9sLmxheWVyLlZlY3Rvcih7XHJcbiAgICAgICAgc291cmNlOiBtYXBTb3VyY2VzLmNsdXN0ZXIoKSxcclxuICAgICAgICBpZDogJ2VzdGF0ZXMnLFxyXG4gICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgc3R5bGU6IG1hcFN0eWxlcy5jbHVzdGVyLFxyXG4gICAgICAgIHpJbmRleDogMixcclxuICAgICAgICBuYW1lOiB0cmFucy5sYXllcnMuZXN0YXRlc1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBwb2k6IGZ1bmN0aW9uIHBvaSh0cmFucykge1xyXG4gICAgICByZXR1cm4gbmV3IG9sLmxheWVyLlZlY3Rvcih7XHJcbiAgICAgICAgc291cmNlOiBtYXBTb3VyY2VzLnBvaSgpLFxyXG4gICAgICAgIHN0eWxlOiBtYXBTdHlsZXMucG9pLFxyXG4gICAgICAgIG1heFJlc29sdXRpb246IDMsXHJcbiAgICAgICAgekluZGV4OiAxLFxyXG4gICAgICAgIGlkOiAncG9pJ1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBmaWx0ZXJlZEVzdGF0ZXM6IGZ1bmN0aW9uIGZpbHRlcmVkRXN0YXRlcyh0cmFucykge1xyXG4gICAgICByZXR1cm4gbmV3IG9sLmxheWVyLlZlY3Rvcih7XHJcbiAgICAgICAgc291cmNlOiBuZXcgb2wuc291cmNlLlZlY3Rvcih7XHJcbiAgICAgICAgICBmb3JtYXQ6IGdlb0pTT05Gb3JtYXRcclxuICAgICAgICB9KSxcclxuICAgICAgICBpZDogJ2ZpbHRlcmVkRXN0YXRlcycsXHJcbiAgICAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICBzdHlsZTogbWFwU3R5bGVzLmZpbHRlcmVkRXN0YXRlcyxcclxuICAgICAgICB6SW5kZXg6IDJcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgc2VsZWN0OiBmdW5jdGlvbiBzZWxlY3QoKSB7XHJcbiAgICAgIHJldHVybiBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcclxuICAgICAgICBzb3VyY2U6IG1hcFNvdXJjZXMuc2VsZWN0KCksXHJcbiAgICAgICAgc3R5bGU6IG5ldyBvbC5zdHlsZS5TdHlsZSh7XHJcbiAgICAgICAgICBmaWxsOiBuZXcgb2wuc3R5bGUuRmlsbCh7XHJcbiAgICAgICAgICAgIGNvbG9yOiAncmdiYSgyMjcsIDcyLCAyNywgMC4yKSdcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgc3Ryb2tlOiBuZXcgb2wuc3R5bGUuU3Ryb2tlKHtcclxuICAgICAgICAgICAgY29sb3I6ICcjRTM0ODFCJyxcclxuICAgICAgICAgICAgd2lkdGg6IDJcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgaW1hZ2U6IG5ldyBvbC5zdHlsZS5DaXJjbGUoe1xyXG4gICAgICAgICAgICByYWRpdXM6IDcsXHJcbiAgICAgICAgICAgIGZpbGw6IG5ldyBvbC5zdHlsZS5GaWxsKHtcclxuICAgICAgICAgICAgICBjb2xvcjogJyNFMzQ4MUInXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHpJbmRleDogMyxcclxuICAgICAgICBpZDogJ3NlbGVjdCdcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuICB2YXIgaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XHJcbiAgICAgdmFyIHRyYW5zID0gXy5jbG9uZURlZXAoQXBwLmNvbmZpZy5jb21tb25zLnRyYW5zKTtcclxuICAgIHZhciBsYXllcnMgPSBPYmplY3Qua2V5cyhtYXBMYXllcnMpLm1hcChmdW5jdGlvbiBhZGRNYXBMYXllcnMoa2V5KSB7XHJcbiAgICAgIGlmIChrZXkgIT09ICdiaW5nJykgeyByZXR1cm4gbWFwTGF5ZXJzW2tleV0odHJhbnMpOyB9XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gbmV3IG9sLk1hcCh7XHJcbiAgICAgIHRhcmdldDogJ21hcCcsXHJcbiAgICAgIGxheWVyczogXy5jb21wYWN0KGxheWVycyksXHJcbiAgICAgIGxvYWRUaWxlc1doaWxlQW5pbWF0aW5nOiB0cnVlLFxyXG4gICAgICBsb2FkVGlsZXNXaGlsZUludGVyYWN0aW5nOiB0cnVlLFxyXG4gICAgICByZW5kZXJlcjogJ2NhbnZhcycsXHJcbiAgICAgIGNvbnRyb2xzOiBvbC5jb250cm9sLmRlZmF1bHRzKHtcclxuICAgICAgICBhdHRyaWJ1dGlvbk9wdGlvbnM6IHtcclxuICAgICAgICAgIGNvbGxhcHNpYmxlOiBmYWxzZSxcclxuICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgICAuZXh0ZW5kKFtcclxuICAgICAgICAgbmV3IG9sLmNvbnRyb2wuU2NhbGVMaW5lKHtcclxuICAgICAgICAgICB1bml0czogJ21ldHJpYydcclxuICAgICAgICAgfSksIG5ldyBvbC5jb250cm9sLk92ZXJ2aWV3TWFwKHtcclxuICAgICAgICAgICBjbGFzc05hbWU6ICdvbC1vdmVydmlld21hcCBvbC1jdXN0b20tb3ZlcnZpZXdtYXAnLFxyXG4gICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgICAgICAgICBsYXllcnM6IFttYXBMYXllcnMuYmluZyh0cmFucyldXHJcbiAgICAgICAgIH0pLFxyXG4gICAgICAgICBuZXcgb2wuY29udHJvbC5ab29tVG9FeHRlbnQoe1xyXG4gICAgICAgICAgIGV4dGVudDogZXh0ZW50XHJcbiAgICAgICAgIH0pXHJcbiAgICAgICBdKSxcclxuICAgICAgdmlldzogbmV3IG9sLlZpZXcoe1xyXG4gICAgICAgIGNlbnRlcjogY2VudGVyLFxyXG4gICAgICAgIGV4dGVudDogZXh0ZW50LFxyXG4gICAgICAgIHByb2plY3Rpb246ICdFUFNHOjM4NTcnLFxyXG4gICAgICAgIHpvb206IDE0LFxyXG4gICAgICAgIG1heFpvb206IDE5LFxyXG4gICAgICAgIG1pblpvb206IDE0XHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9O1xyXG4gIHJldHVybiB7XHJcbiAgICBpbml0aWFsaXplOiBpbml0aWFsaXplXHJcbiAgfTtcclxufSh3aW5kb3csIGRvY3VtZW50LCBQcm9taXNlLCBvbCwgQXBwKSk7XHJcbiIsIkFwcC5jb25maWcubW9kdWxlcy5pbmZvID0gKGZ1bmN0aW9uIGluZm8od2luZG93LCBkb2N1bWVudCwgUHJvbWlzZSwgJCwgQXBwKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG4gIHZhciBsYW5nID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lmxhbmc7XHJcbiAgdmFyIGR1c3RCbHVlYmlyZCA9IEFwcC5jb25maWcucHJvbWlzZXMuZHVzdEJsdWViaXJkO1xyXG4gIHZhciB1dGlscyA9IEFwcC51dGlscztcclxuXHJcbiAgdmFyIGdlb0pTT05Gb3JtYXQgPSBuZXcgb2wuZm9ybWF0Lkdlb0pTT04oe1xyXG4gICAgZGVmYXVsdERhdGFQcm9qZWN0aW9uOiAnRVBTRzo0MzI2J1xyXG4gIH0pO1xyXG4gIGZ1bmN0aW9uIGV4dHJhSW5mb01vZGFsKGZlYXR1cmUpIHtcclxuICAgIHZhciB0cmFucyA9IF8uY2xvbmVEZWVwKEFwcC5jb25maWcuY29tbW9ucy50cmFucyk7XHJcbiAgICB2YXIgb2JqID0ge307XHJcbiAgICBpZiAoZmVhdHVyZS5nZXQoJ3JlbnQnKSkge1xyXG4gICAgICBvYmoubGlzdGluZ190eXBlID0gdHJhbnMubGlzdGluZy5yZW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb2JqLmxpc3RpbmdfdHlwZSA9IHRyYW5zLmxpc3Rpbmcuc2FsZTtcclxuICAgIH1cclxuICAgIG9iai5naWQgPSBmZWF0dXJlLmdldCgnZ2lkJyk7XHJcbiAgICBpZiAobGFuZyA9PT0gJ2VsJykge1xyXG4gICAgICBvYmoudHlwZSA9IGZlYXR1cmUuZ2V0KCdlc3RhdGV0eXBlJyk7XHJcbiAgICAgIG9iai5hZGRyZXNzID0gZmVhdHVyZS5nZXQoJ3N0cmVldF9lbCcpICsgJycgKyBmZWF0dXJlLmdldCgnc3RyZWV0X251bWJlcicpO1xyXG4gICAgICBvYmouY29udGFjdCA9IHtcclxuICAgICAgICBuYW1lOiBmZWF0dXJlLmdldFByb3BlcnRpZXMoKS5uYW1lX2VsLFxyXG4gICAgICAgIGxhc3RuYW1lOiBmZWF0dXJlLmdldFByb3BlcnRpZXMoKS5sYXN0bmFtZV9lbFxyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb2JqLnR5cGUgPSBmZWF0dXJlLmdldCgnZXN0YXRldHlwZV9lbicpO1xyXG4gICAgICBvYmouYWRkcmVzcyA9IGZlYXR1cmUuZ2V0KCdzdHJlZXRfZW4nKSArICcnICsgZmVhdHVyZS5nZXQoJ3N0cmVldF9udW1iZXInKTtcclxuICAgICAgb2JqLmNvbnRhY3QgPSB7XHJcbiAgICAgICAgbmFtZTogZmVhdHVyZS5nZXRQcm9wZXJ0aWVzKCkubmFtZV9lbixcclxuICAgICAgICBsYXN0bmFtZTogZmVhdHVyZS5nZXRQcm9wZXJ0aWVzKCkubGFzdG5hbWVfZW5cclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIG9iai5hcmVhID0gZmVhdHVyZS5nZXQoJ2VzdGF0ZWFyZWEnKTtcclxuICAgIG9iai5iZWRyb29tcyA9IGZlYXR1cmUuZ2V0KCdiZWRyb29tcycpO1xyXG4gICAgb2JqLnByaWNlID0gZmVhdHVyZS5nZXQoJ3ByaWNlJyk7XHJcbiAgICBvYmoudGl0bGVzID0ge1xyXG4gICAgICBnaWQ6IHRyYW5zLmVzdGF0ZS5naWQsXHJcbiAgICAgIGxpc3RpbmdfdHlwZTogdHJhbnMubGlzdGluZy50eXBlLFxyXG4gICAgICBhZGRyZXNzOiB0cmFucy5lc3RhdGUuYWRkcmVzcyxcclxuICAgICAgYXJlYTogdHJhbnMuZXN0YXRlLmFyZWEsXHJcbiAgICAgIGJlZHJvb21zOiB0cmFucy5lc3RhdGUuYW1lbml0aWVzLmJlZHJvb21zLFxyXG4gICAgICBwcmljZTogdHJhbnMubGlzdGluZy5wcmljZSxcclxuICAgICAgaXNuZXc6IHRyYW5zLmVzdGF0ZS5hbWVuaXRpZXMuaXNuZXcsXHJcbiAgICAgIHBhcmtpbmc6IHRyYW5zLmVzdGF0ZS5hbWVuaXRpZXMucGFya2luZyxcclxuICAgICAgZnVybmlzaGVkOiB0cmFucy5lc3RhdGUuYW1lbml0aWVzLmZ1cm5pc2hlZCxcclxuICAgICAgcGV0czogdHJhbnMuZXN0YXRlLmFtZW5pdGllcy5wZXRzLFxyXG4gICAgICB2aWV3OiB0cmFucy5lc3RhdGUuYW1lbml0aWVzLnZpZXcsXHJcbiAgICAgIGhlYXRpbmc6IHRyYW5zLmVzdGF0ZS5hbWVuaXRpZXMuaGVhdGluZyxcclxuICAgICAgY29vbGluZzogdHJhbnMuZXN0YXRlLmFtZW5pdGllcy5jb29saW5nLFxyXG4gICAgICBjb250YWN0SW5mbzogdHJhbnMuY29udGFjdC5jb250YWN0SW5mbyxcclxuICAgICAgbmFtZTogdHJhbnMuY29udGFjdC5uYW1lLFxyXG4gICAgICBsYXN0bmFtZTogdHJhbnMuY29udGFjdC5sYXN0bmFtZSxcclxuICAgICAgcGhvbmU6IHRyYW5zLmNvbnRhY3QucGhvbmUsXHJcbiAgICAgIGVtYWlsOiB0cmFucy5jb250YWN0LmVtYWlsLFxyXG4gICAgICB0aXRsZTogdHJhbnMuZXN0YXRlLmFtZW5pdGllcy50aXRsZVxyXG4gICAgfTtcclxuICAgIG9iai5mdXJuaXNoZWQgPSBmZWF0dXJlLmdldCgnZnVybmlzaGVkJyk7XHJcbiAgICBvYmouaGVhdGluZyA9IGZlYXR1cmUuZ2V0KCdoZWF0aW5nJyk7XHJcbiAgICBvYmouY29vbGluZyA9IGZlYXR1cmUuZ2V0KCdjb29saW5nJyk7XHJcbiAgICBvYmouaXNuZXcgPSBmZWF0dXJlLmdldCgnaXNuZXcnKTtcclxuICAgIG9iai52aWV3ID0gZmVhdHVyZS5nZXQoJ3ZpZXcnKTtcclxuICAgIG9iai5wYXJraW5nID0gZmVhdHVyZS5nZXQoJ3BhcmtpbmcnKTtcclxuICAgIG9iai50aXRsZSA9IGZlYXR1cmUuZ2V0KCd0aXRsZScpO1xyXG4gICAgb2JqLnBldHMgPSBmZWF0dXJlLmdldCgncGV0cycpO1xyXG4gICAgb2JqLmJ0bnMgPSB7XHJcbiAgICAgIGluZm86IHRyYW5zLmJ0bnMuaW5mbyxcclxuICAgICAgY2xvc2U6IHRyYW5zLmJ0bnMuY2xvc2VcclxuICAgIH07XHJcbiAgICBpZiAoZmVhdHVyZS5nZXRQcm9wZXJ0aWVzKCkucGhvbmUyICE9PSBudWxsKSB7XHJcbiAgICAgIG9iai5jb250YWN0LnBob25lID0gZmVhdHVyZS5nZXRQcm9wZXJ0aWVzKCkucGhvbmUxICsgJyAnICsgZmVhdHVyZS5nZXRQcm9wZXJ0aWVzKCkucGhvbmUyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb2JqLmNvbnRhY3QucGhvbmUgPSBmZWF0dXJlLmdldFByb3BlcnRpZXMoKS5waG9uZTE7XHJcbiAgICB9XHJcbiAgICBvYmouY29udGFjdC5lbWFpbCA9IGZlYXR1cmUuZ2V0UHJvcGVydGllcygpLmVtYWlsO1xyXG4gICAgZHVzdEJsdWViaXJkLnJlbmRlckFzeW5jKCdtb2RhbEluZm8nLCBvYmopXHJcbiAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKGRhdGEpIHtcclxuICAgICAgJCgnI21vZGFsJykucmVtb3ZlQ2xhc3MoJ3Zpc3VhbGx5aGlkZGVuJyk7XHJcbiAgICAgICQoJy5tb2RhbC1jb250ZW50JykuaHRtbChkYXRhKTtcclxuICAgIH0pXHJcbiAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKCkge1xyXG4gICAgICB2YXIgdXJsID0gJC5jbG91ZGluYXJ5LnVybChmZWF0dXJlLmdldCgnZ2lkJykudG9TdHJpbmcoKSwgeyBmb3JtYXQ6ICdqc29uJywgdHlwZTogJ2xpc3QnIH0pO1xyXG4gICAgICBQcm9taXNlLnJlc29sdmUoXHJcbiAgICAgICAgJC5nZXQodXJsKVxyXG4gICAgICApXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uIHJlc29sdmVDbG91ZGluYXJ5KGRhdGEpIHtcclxuICAgICAgICAkKCcuYmlnLWltYWdlJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChodHRwOi8vcmVzLmNsb3VkaW5hcnkuY29tL2ZpcnZhaW4vaW1hZ2UvdXBsb2FkL3YnICsgZGF0YS5yZXNvdXJjZXNbMF0udmVyc2lvblxyXG4gICAgICAgICsgJy8nICsgZGF0YS5yZXNvdXJjZXNbMF0ucHVibGljX2lkICsgJy4nICsgZGF0YS5yZXNvdXJjZXNbMF0uZm9ybWF0KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGZ1bmN0aW9uIGVycm9yKGUpIHtcclxuICAgICAgICBpZiAoZS5zdGF0dXMgPT09IDQwNCkge1xyXG4gICAgICAgICAgJCgnLmJpZy1pbWFnZScpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoL2ltYWdlcy9ub19pbWFnZV9hdmFpbGFibGUucG5nKScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGZ1bmN0aW9uIGVycm9yKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZS5zdGF0dXMpO1xyXG4gICAgfSk7XHJcbiAgICAkKCcjbW9kYWwtY2xvc2UnKS5jbGljayhmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xyXG4gICAgICAkKCcjbW9kYWwnKS5hZGRDbGFzcygndmlzdWFsbHloaWRkZW4nKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiByZW5kZXJFc3RhdGVDYXJkcyhmZWF0dXJlKSB7XHJcbiAgICB2YXIgdHJhbnMgPSBfLmNsb25lRGVlcChBcHAuY29uZmlnLmNvbW1vbnMudHJhbnMpO1xyXG4gICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgaWYgKGZlYXR1cmUuZ2V0KCdyZW50JykpIHtcclxuICAgICAgb2JqLmxpc3RpbmdfdHlwZSA9IHRyYW5zLmxpc3RpbmcucmVudDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9iai5saXN0aW5nX3R5cGUgPSB0cmFucy5saXN0aW5nLnNhbGU7XHJcbiAgICB9XHJcbiAgICBvYmouZ2lkID0gZmVhdHVyZS5nZXQoJ2dpZCcpO1xyXG4gICAgaWYgKGxhbmcgPT09ICdlbCcpIHtcclxuICAgICAgb2JqLnR5cGUgPSBmZWF0dXJlLmdldCgnZXN0YXRldHlwZScpO1xyXG4gICAgICBvYmouYWRkcmVzcyA9IGZlYXR1cmUuZ2V0KCdzdHJlZXRfZWwnKSArICcnICsgZmVhdHVyZS5nZXQoJ3N0cmVldF9udW1iZXInKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9iai50eXBlID0gZmVhdHVyZS5nZXQoJ2VzdGF0ZXR5cGVfZW4nKTtcclxuICAgICAgb2JqLmFkZHJlc3MgPSBmZWF0dXJlLmdldCgnc3RyZWV0X2VuJykgKyAnJyArIGZlYXR1cmUuZ2V0KCdzdHJlZXRfbnVtYmVyJyk7XHJcbiAgICB9XHJcbiAgICBvYmouYXJlYSA9IGZlYXR1cmUuZ2V0KCdlc3RhdGVhcmVhJyk7XHJcbiAgICBvYmouYmVkcm9vbXMgPSBmZWF0dXJlLmdldCgnYmVkcm9vbXMnKTtcclxuICAgIG9iai5wcmljZSA9IGZlYXR1cmUuZ2V0KCdwcmljZScpO1xyXG4gICAgb2JqLnRpdGxlID0ge1xyXG4gICAgICBsaXN0aW5nX3R5cGU6IHRyYW5zLmxpc3RpbmcudHlwZSxcclxuICAgICAgYWRkcmVzczogdHJhbnMuZXN0YXRlLmFkZHJlc3MsXHJcbiAgICAgIGFyZWE6IHRyYW5zLmVzdGF0ZS5hcmVhLFxyXG4gICAgICBiZWRyb29tczogdHJhbnMuZXN0YXRlLmFtZW5pdGllcy5iZWRyb29tcyxcclxuICAgICAgcHJpY2U6IHRyYW5zLmxpc3RpbmcucHJpY2UsXHJcbiAgICAgIGlzbmV3OiB0cmFucy5lc3RhdGUuYW1lbml0aWVzLmlzbmV3LFxyXG4gICAgICBmdXJuaXNoZWQ6IHRyYW5zLmVzdGF0ZS5hbWVuaXRpZXMuZnVybmlzaGVkLFxyXG4gICAgICBwZXRzOiB0cmFucy5lc3RhdGUuYW1lbml0aWVzLnBldHNcclxuICAgIH07XHJcbiAgICBvYmouaXNuZXcgPSBmZWF0dXJlLmdldCgnaXNuZXcnKTtcclxuICAgIG9iai5mdXJuaXNoZWQgPSBmZWF0dXJlLmdldCgnZnVybmlzaGVkJyk7XHJcbiAgICBvYmoucGV0cyA9IGZlYXR1cmUuZ2V0KCdwZXRzJyk7XHJcbiAgICBvYmouYnRucyA9IHtcclxuICAgICAgaW5mbzogdHJhbnMuYnRucy5pbmZvLFxyXG4gICAgICBjbG9zZTogdHJhbnMuYnRucy5jbG9zZVxyXG4gICAgfTtcclxuICAgIGR1c3RCbHVlYmlyZC5yZW5kZXJBc3luYygnZXN0YXRlQ2FyZHMnLCBvYmopXHJcbiAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKGRhdGEpIHtcclxuICAgICAgJCgnLmVzdGF0ZS1jYXJkcycpLmh0bWwoZGF0YSk7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oZnVuY3Rpb24gcmVzb2x2ZSgpIHtcclxuICAgICAgdmFyIHVybCA9ICQuY2xvdWRpbmFyeS51cmwoZmVhdHVyZS5nZXQoJ2dpZCcpLnRvU3RyaW5nKCksIHsgZm9ybWF0OiAnanNvbicsIHR5cGU6ICdsaXN0JyB9KTtcclxuICAgICAgUHJvbWlzZS5yZXNvbHZlKFxyXG4gICAgICAgICQuZ2V0KHVybClcclxuICAgICAgKVxyXG4gICAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlQ2xvdWRpbmFyeShkYXRhKSB7XHJcbiAgICAgICAgJCgnLmVzdGF0ZS1pbWFnZScpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoaHR0cDovL3Jlcy5jbG91ZGluYXJ5LmNvbS9maXJ2YWluL2ltYWdlL3VwbG9hZC92JyArIGRhdGEucmVzb3VyY2VzWzBdLnZlcnNpb25cclxuICAgICAgICArICcvJyArIGRhdGEucmVzb3VyY2VzWzBdLnB1YmxpY19pZCArICcuJyArIGRhdGEucmVzb3VyY2VzWzBdLmZvcm1hdCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChmdW5jdGlvbiBlcnJvcihlKSB7XHJcbiAgICAgICAgaWYgKGUuc3RhdHVzID09PSA0MDQpIHtcclxuICAgICAgICAgICQoJy5lc3RhdGUtaW1hZ2UnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKC9pbWFnZXMvbm9faW1hZ2VfYXZhaWxhYmxlLnBuZyknKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC50aGVuKGZ1bmN0aW9uIHJlc29sdmUoKSB7XHJcbiAgICAgICQoJy5lc3RhdGUtaW1hZ2UnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKGh0dHA6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZmlydmFpbi9pbWFnZS91cGxvYWQvaF8yMjIsY19zY2FsZS8nICsgZmVhdHVyZS5nZXQoJ2dpZCcpICsgJy5qcGcpJyk7XHJcbiAgICAgICQoJy5lc3RhdGUtY2FyZHMnKS5hZGRDbGFzcygnZXN0YXRlLWNhcmRzLWFjdGl2ZScpO1xyXG4gICAgICAkKCcjZXN0YXRlLWNhcmQtc3F1YXJlLWNsb3NlJykuY2xpY2soZnVuY3Rpb24gY2xvc2UoKSB7XHJcbiAgICAgICAgJCgnLmVzdGF0ZS1jYXJkcycpLnJlbW92ZUNsYXNzKCdlc3RhdGUtY2FyZHMtYWN0aXZlJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKCcjZXN0YXRlLWNhcmQtc3F1YXJlLWV4dHJhLWluZm8nKS5jbGljayhmdW5jdGlvbiBleHRyYUluZm8oKSB7XHJcbiAgICAgICAgZXh0cmFJbmZvTW9kYWwoZmVhdHVyZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbiBlcnJvcihlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICBpZiAoZS5zdGF0dXMgPT09IDQwNCkge1xyXG4gICAgICAgICQoJy5iaWctaW1hZ2UnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKC9pbWFnZXMvbm9faW1hZ2VfYXZhaWxhYmxlLnBuZyknKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIHNlbGVjdEZlYXR1cmUoZXZ0KSB7XHJcbiAgICB2YXIgbWFwID0gZXZ0Lm1hcDtcclxuICAgIC8vIHZhciBjb29yZGluYXRlID0gZXZ0LmNvb3JkaW5hdGU7XHJcbiAgICB2YXIgZjtcclxuICAgIHZhciBjbGlja2VkRmVhdHVyZSA9IG1hcC5mb3JFYWNoRmVhdHVyZUF0UGl4ZWwoZXZ0LnBpeGVsLCBmdW5jdGlvbiBmaW5kRmVhdHVyZShmZWF0dXJlLCBsYXllcikge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGZlYXR1cmU6IGZlYXR1cmUsXHJcbiAgICAgICAgbGF5ZXI6IGxheWVyXHJcbiAgICAgIH07XHJcbiAgICB9LCB0aGlzLCBmdW5jdGlvbiBjbGlja2VkRmVhdHVyZUxheWVyRmlsdGVyKGxheWVyKSB7XHJcbiAgICAgIGlmIChsYXllci5nZXQoJ2lkJykgPT09ICdlc3RhdGVzJyB8fCBsYXllci5nZXQoJ2lkJykgPT09ICdmaWx0ZXJlZEVzdGF0ZXMnKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSwgdGhpcyk7XHJcbiAgICBpZiAoY2xpY2tlZEZlYXR1cmUpIHtcclxuICAgICAgaWYgKGNsaWNrZWRGZWF0dXJlLmxheWVyLmdldCgnaWQnKSA9PT0gJ2VzdGF0ZXMnICYmXHJcbiAgICAgICAgY2xpY2tlZEZlYXR1cmUuZmVhdHVyZS5nZXQoJ2ZlYXR1cmVzJykubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgZiA9IGNsaWNrZWRGZWF0dXJlLmZlYXR1cmUuZ2V0UHJvcGVydGllcygpLmZlYXR1cmVzWzBdO1xyXG4gICAgICAgIHJlbmRlckVzdGF0ZUNhcmRzKGYpO1xyXG4gICAgICAgIG1hcC5nZXRWaWV3KCkuc2V0Q2VudGVyKGYuZ2V0R2VvbWV0cnkoKS5nZXRDb29yZGluYXRlcygpKTtcclxuICAgICAgICBtYXAuZ2V0VmlldygpLnNldFpvb20oMTYpO1xyXG4gICAgICAgIFByb21pc2UucmVzb2x2ZShcclxuICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9hcGkvdXNlcy8nICsgZi5nZXRQcm9wZXJ0aWVzKCkuZ2lkLFxyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICApXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gcmVzb2x2ZShkYXRhKSB7XHJcbiAgICAgICAgICB2YXIgZmVhdHVyZXM7XHJcbiAgICAgICAgICB1dGlscy5maW5kQnlJZChtYXAsICdwb2knKS5nZXRTb3VyY2UoKS5jbGVhcigpO1xyXG4gICAgICAgICAgZmVhdHVyZXMgPSBnZW9KU09ORm9ybWF0LnJlYWRGZWF0dXJlcyhkYXRhLnByb3BlcnR5X3NlcnZpY2VzX2FuYWx5c2lzLCB7XHJcbiAgICAgICAgICAgIGZlYXR1cmVQcm9qZWN0aW9uOiAnRVBTRzozODU3J1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBmZWF0dXJlcy5mb3JFYWNoKGZ1bmN0aW9uIHJlbW92ZVBvbHlnb24oZmVhdHVyZSkge1xyXG4gICAgICAgICAgICBpZiAoZmVhdHVyZS5nZXRHZW9tZXRyeSgpLmdldFR5cGUoKSA9PT0gJ1BvbHlnb24nKSB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZXMuc3BsaWNlKGZlYXR1cmVzLmluZGV4T2YoZmVhdHVyZSksIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHV0aWxzLmZpbmRCeUlkKG1hcCwgJ3BvaScpLmdldFNvdXJjZSgpLmFkZEZlYXR1cmVzKGZlYXR1cmVzKTtcclxuICAgICAgICAgIC8vIG1hcC5nZXRWaWV3KCkuZml0KHV0aWxzLmZpbmRCeUlkKG1hcCwgJ3BvaScpLmdldFNvdXJjZSgpLmdldEV4dGVudCgpLCBtYXAuZ2V0U2l6ZSgpKTtcclxuXHJcbiAgICAgICAgICB0b2FzdHIuaW5mbygnRm91bmQgJyArIGZlYXR1cmVzLmxlbmd0aCArICcgUG9pbnRzIG9mIEludGVyZXN0IGluIDggbWludXRlIGRpc3RhbmNlIScpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIGVycm9yKGUpIHtcclxuICAgICAgICAgIHV0aWxzLmZpbmRCeUlkKG1hcCwgJ3BvaScpLmdldFNvdXJjZSgpLmNsZWFyKCk7XHJcbiAgICAgICAgICBpZiAoZS5zdGF0dXMgPT09IDQwNCkge1xyXG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1NvcnJ5LCB3ZSBjYW5ub3QgZmluZCBhbnkgUG9pbnRzIG9mIEludGVyZXN0IGluIDggbWludXRlIGRpc3RhbmNlIScpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY2xpY2tlZEZlYXR1cmUubGF5ZXIuZ2V0KCdpZCcpID09PSAnZmlsdGVyZWRFc3RhdGVzJykge1xyXG4gICAgICAgIGYgPSBjbGlja2VkRmVhdHVyZS5mZWF0dXJlO1xyXG4gICAgICAgIHJlbmRlckVzdGF0ZUNhcmRzKGYpO1xyXG4gICAgICAgIFByb21pc2UucmVzb2x2ZShcclxuICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9kYi91c2VzLycgKyBmLmdldFByb3BlcnRpZXMoKS5naWQsXHJcbiAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIClcclxuICAgICAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKGRhdGEpIHtcclxuICAgICAgICAgIHZhciBmZWF0dXJlcztcclxuICAgICAgICAgIGlmICh1dGlscy5maW5kQnlJZChtYXAsICdwb2knKS5nZXRTb3VyY2UoKS5nZXRGZWF0dXJlcygpLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICB1dGlscy5maW5kQnlJZChtYXAsICdwb2knKS5nZXRTb3VyY2UoKS5jbGVhcigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZmVhdHVyZXMgPSBnZW9KU09ORm9ybWF0LnJlYWRGZWF0dXJlcyhkYXRhLnByb3BlcnR5X3NlcnZpY2VzX2FuYWx5c2lzLCB7XHJcbiAgICAgICAgICAgIGZlYXR1cmVQcm9qZWN0aW9uOiAnRVBTRzozODU3J1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBmZWF0dXJlcy5mb3JFYWNoKGZ1bmN0aW9uIHJlbW92ZVBvbHlnb24oZmVhdHVyZSkge1xyXG4gICAgICAgICAgICBpZiAoZmVhdHVyZS5nZXRHZW9tZXRyeSgpLmdldFR5cGUoKSA9PT0gJ1BvbHlnb24nKSB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZXMuc3BsaWNlKGZlYXR1cmVzLmluZGV4T2YoZmVhdHVyZSksIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHV0aWxzLmZpbmRCeUlkKG1hcCwgJ3BvaScpLmdldFNvdXJjZSgpLmFkZEZlYXR1cmVzKGZlYXR1cmVzKTtcclxuICAgICAgICAgIG1hcC5nZXRWaWV3KCkuZml0KHV0aWxzLmZpbmRCeUlkKG1hcCwgJ3BvaScpLmdldFNvdXJjZSgpLmdldEV4dGVudCgpLCBtYXAuZ2V0U2l6ZSgpKTtcclxuICAgICAgICAgIHRvYXN0ci5pbmZvKCdGb3VuZCAnICsgZmVhdHVyZXMubGVuZ3RoICsgJyBQb2ludHMgb2YgSW50ZXJlc3QgaW4gOCBtaW51dGUgZGlzdGFuY2UhJyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gZXJyb3IoZSkge1xyXG4gICAgICAgICAgaWYgKGUuc3RhdHVzID09PSA0MDQpIHtcclxuICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdTb3JyeSwgd2UgY2Fubm90IGZpbmQgYW55IFBvaW50cyBvZiBJbnRlcmVzdCBpbiA4IG1pbnV0ZSBkaXN0YW5jZSEnKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZS5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1dGlscy5maW5kQnlJZChtYXAsICdwb2knKS5nZXRTb3VyY2UoKS5jbGVhcigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIHZhciBtYXAgPSBBcHAuY29uZmlnLmNvbW1vbnMubWFwO1xyXG4gICAgbWFwLm9uKCdjbGljaycsIHNlbGVjdEZlYXR1cmUpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBkaXNhYmxlKCkge1xyXG4gICAgdmFyIG1hcCA9IEFwcC5jb25maWcuY29tbW9ucy5tYXA7XHJcbiAgICBtYXAudW4oJ2NsaWNrJywgc2VsZWN0RmVhdHVyZSk7XHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0OiBpbml0LFxyXG4gICAgZGlzYWJsZTogZGlzYWJsZVxyXG4gIH07XHJcbn0od2luZG93LCBkb2N1bWVudCwgUHJvbWlzZSwgalF1ZXJ5LCBBcHApKTtcclxuIiwiQXBwLmNvbmZpZy5tb2R1bGVzLmZpbHRlcnMgPSAoZnVuY3Rpb24gZmlsdGVycyh3aW5kb3csIGRvY3VtZW50LCBQcm9taXNlLCAkLCBQYXJzbGV5LCBtb21lbnQsIEFwcCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuICB2YXIgbGFuZyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nO1xyXG4gIHZhciBkdXN0Qmx1ZWJpcmQgPSBBcHAuY29uZmlnLnByb21pc2VzLmR1c3RCbHVlYmlyZDtcclxuICB2YXIgdXRpbHMgPSBBcHAudXRpbHM7XHJcblxyXG4gIHZhciB4eTEgPSBvbC5wcm9qLnRyYW5zZm9ybShbMzY1Mjc3MiwgNDExMjgwOF0sICdFUFNHOjM4NTcnLCAnRVBTRzo0MzI2Jyk7XHJcbiAgdmFyIHh5MiA9IG9sLnByb2oudHJhbnNmb3JtKFszNzAwMDAwLCA0MTMyNzk3XSwgJ0VQU0c6Mzg1NycsICdFUFNHOjQzMjYnKTtcclxuICB2YXIgZXh0ZW50ID0gXy5jb25jYXQoeHkxLCB4eTIpO1xyXG4gIHZhciBiYm94ID0gZXh0ZW50O1xyXG4gIGZ1bmN0aW9uIGFzc2lnblZhbGlkYXRvcnMoKSB7XHJcbiAgICB2YXIgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmZvYm94LWNvbnRlbnQnKTtcclxuICAgIHZhciBpbnB1dHMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9dGV4dF0nKTtcclxuICAgIFtdLmZvckVhY2guY2FsbChpbnB1dHMsIGZ1bmN0aW9uIG1ha2VQYXJzbGV5SW5wdXRzKGVsKSB7XHJcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiBzYW5pdGl6ZSgpIHtcclxuICAgICAgICB2YXIgc3RyID0gdGhpcy52YWx1ZTtcclxuICAgICAgICB2YXIgc2FuaXRpemVkU3RyO1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFzZXQudHlwZSA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgIHNhbml0aXplZFN0ciA9IHN0ci5yZXBsYWNlKC9bL1xcRC8gXS9naSwgJycpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhc2V0LnR5cGUgPT09ICdhbHBoYW51bScpIHtcclxuICAgICAgICAgIHNhbml0aXplZFN0ciA9IHN0ci5yZXBsYWNlKC9bXmEtejAtOUEtWkEtes6RLc6pzrEtz4nOr8+KzpDPjM6szq3Pjc+LzrDOrs+OIF0vZ2ksICcnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGF0YXNldC50eXBlID09PSAnc3BlY2lhbCcpIHtcclxuICAgICAgICAgIHNhbml0aXplZFN0ciA9IHN0ci5yZXBsYWNlKC9bXjAtOSBcXC9dL2dpLCAnJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRhdGFzZXQudHlwZSA9PT0gJ2RhdGUnKSB7XHJcbiAgICAgICAgICBzYW5pdGl6ZWRTdHIgPSBzdHIucmVwbGFjZSgvW14wLTkgXFwtXS9naSwgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZhbHVlID0gc2FuaXRpemVkU3RyO1xyXG4gICAgICAgIHV0aWxzLnJlbW92ZUNsYXNzKHRoaXMucGFyZW50Tm9kZSwgJ2lzLWludmFsaWQnKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gYWRkUmVzdWx0cyhkYXRhKSB7XHJcbiAgICB2YXIgbWFwID0gQXBwLmNvbmZpZy5jb21tb25zLm1hcDtcclxuICAgIHZhciBnZW9KU09ORm9ybWF0ID0gbmV3IG9sLmZvcm1hdC5HZW9KU09OKHtcclxuICAgICAgZGVmYXVsdERhdGFQcm9qZWN0aW9uOiAnRVBTRzo0MzI2J1xyXG4gICAgfSk7XHJcbiAgICB2YXIgZmVhdHVyZXMgPSBnZW9KU09ORm9ybWF0LnJlYWRGZWF0dXJlcyhkYXRhLCB7XHJcbiAgICAgIGZlYXR1cmVQcm9qZWN0aW9uOiAnRVBTRzozODU3J1xyXG4gICAgfSk7XHJcbiAgICBmZWF0dXJlcy5mb3JFYWNoKGZ1bmN0aW9uIHNldElkKGYpIHtcclxuICAgICAgZi5zZXRJZChmLmdldFByb3BlcnRpZXMoKS5naWQpO1xyXG4gICAgfSk7XHJcbiAgICB1dGlscy5maW5kQnlJZChtYXAsICdmaWx0ZXJlZEVzdGF0ZXMnKS5nZXRTb3VyY2UoKS5hZGRGZWF0dXJlcyhmZWF0dXJlcyk7XHJcbiAgICBpZiAobGFuZyA9PT0gJ2VsJykge1xyXG4gICAgICB0b2FzdHIuaW5mbygnzpLPgc6tzrjOt866zrHOvSAnICsgZmVhdHVyZXMubGVuZ3RoICsgJyDOuc60zrnOv866z4TOt8+Dzq/Otc+CIScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdG9hc3RyLmluZm8oJ0ZvdW5kICcgKyBmZWF0dXJlcy5sZW5ndGggKyAnIGVzdGF0ZXMhJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNsZWFyUmVzdWx0cygpIHtcclxuICAgIHZhciBtYXAgPSBBcHAuY29uZmlnLmNvbW1vbnMubWFwO1xyXG4gICAgdXRpbHMuZmluZEJ5SWQobWFwLCAnZmlsdGVyZWRFc3RhdGVzJykuZ2V0U291cmNlKCkuY2xlYXIoKTtcclxuICAgIHV0aWxzLmZpbmRCeUlkKG1hcCwgJ3NlbGVjdCcpLmdldFNvdXJjZSgpLmNsZWFyKCk7XHJcbiAgICBtYXAuZ2V0SW50ZXJhY3Rpb25zKCkuZm9yRWFjaChmdW5jdGlvbiBmaW5kSW50ZXJhY3Rpb25CeUlkKGkpIHtcclxuICAgICAgaWYgKGkuZ2V0UHJvcGVydGllcygpLmlkID09PSAnZHJhdycpIHtcclxuICAgICAgICBpLnNldEFjdGl2ZShmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJChtYXAuZ2V0Vmlld3BvcnQoKSkub2ZmKCdtb3VzZWxlYXZlJyk7XHJcbiAgICAkKG1hcC5nZXRWaWV3cG9ydCgpKS5vZmYoJ21vdXNlZW50ZXInKTtcclxuICAgIGJib3ggPSBleHRlbnQ7XHJcbiAgICB1dGlscy5maW5kQnlJZChtYXAsICdlc3RhdGVzJykuc2V0VmlzaWJsZSh0cnVlKTtcclxuICAgIEFwcC5jb25maWcubW9kdWxlcy5pbmZvLmluaXQoKTtcclxuICAgICQoJyNyZXN1bHRzJykuYWRkQ2xhc3MoJ3Zpc3VhbGx5aGlkZGVuJykucmVtb3ZlQXR0cignc3R5bGUnKVxyXG4gICAgLmVtcHR5KCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIHNldE9wdGlvbnMoKSB7XHJcbiAgICB2YXIgZmlsdGVyRGF0YSA9IHt9O1xyXG4gICAgZmlsdGVyRGF0YS5lc3RhdGVUeXBlID0gJCgnI2VzdGF0ZVR5cGUnKS52YWwoKTtcclxuICAgIGZpbHRlckRhdGEubGVhc2VUeXBlID0gJCgnaW5wdXRbbmFtZT1vcHRpb25zXTpjaGVja2VkJykudmFsKCkgIT09IHVuZGVmaW5lZCA/ICQoJ2lucHV0W25hbWU9b3B0aW9uc106Y2hlY2tlZCcpLnZhbCgpIDogJ1JlbnQnO1xyXG4gICAgZmlsdGVyRGF0YS5zdGFydFByaWNlID0gJCgnI3N0YXJ0UHJpY2UnKS52YWwoKSAhPT0gJycgPyAkKCcjc3RhcnRQcmljZScpLnZhbCgpIDogMDtcclxuICAgIGZpbHRlckRhdGEuZW5kUHJpY2UgPSAkKCcjZW5kUHJpY2UnKS52YWwoKSAhPT0gJycgPyAkKCcjZW5kUHJpY2UnKS52YWwoKSA6IDIxNDc0ODM2NDc7XHJcbiAgICBmaWx0ZXJEYXRhLmFyZWFTdGFydCA9ICQoJyNhcmVhLXN0YXJ0JykudmFsKCkgIT09ICcnID8gJCgnI2FyZWEtc3RhcnQnKS52YWwoKSA6IDA7XHJcbiAgICBmaWx0ZXJEYXRhLmFyZWFFbmQgPSAkKCcjYXJlYS1lbmQnKS52YWwoKSAhPT0gJycgPyAkKCcjYXJlYS1lbmQnKS52YWwoKSA6IDIxNDc0ODM2NDc7XHJcbiAgICBmaWx0ZXJEYXRhLnBhcmtpbmcgPSAkKCcjY2hlY2tib3gtMScpLnByb3AoJ2NoZWNrZWQnKSAhPT0gdW5kZWZpbmVkID8gJCgnI2NoZWNrYm94LTEnKS5wcm9wKCdjaGVja2VkJykgOiBmYWxzZTtcclxuICAgIGZpbHRlckRhdGEuZnVybmlzaGVkID0gJCgnI2NoZWNrYm94LTInKS5wcm9wKCdjaGVja2VkJykgIT09IHVuZGVmaW5lZCA/ICQoJyNjaGVja2JveC0yJykucHJvcCgnY2hlY2tlZCcpIDogZmFsc2U7XHJcbiAgICBmaWx0ZXJEYXRhLmhlYXRpbmcgPSAkKCcjY2hlY2tib3gtMycpLnByb3AoJ2NoZWNrZWQnKSAhPT0gdW5kZWZpbmVkID8gJCgnI2NoZWNrYm94LTMnKS5wcm9wKCdjaGVja2VkJykgOiBmYWxzZTtcclxuICAgIGZpbHRlckRhdGEuY29vbGluZyA9ICQoJyNjaGVja2JveC00JykucHJvcCgnY2hlY2tlZCcpICE9PSB1bmRlZmluZWQgPyAkKCcjY2hlY2tib3gtNCcpLnByb3AoJ2NoZWNrZWQnKSA6IGZhbHNlO1xyXG4gICAgZmlsdGVyRGF0YS52aWV3ID0gJCgnI2NoZWNrYm94LTUnKS5wcm9wKCdjaGVja2VkJykgIT09IHVuZGVmaW5lZCA/ICQoJyNjaGVja2JveC01JykucHJvcCgnY2hlY2tlZCcpIDogZmFsc2U7XHJcbiAgICBmaWx0ZXJEYXRhLmJib3ggPSBiYm94O1xyXG4gICAgcmV0dXJuIGZpbHRlckRhdGE7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGdldFJlc3VsdHMob3B0aW9ucykge1xyXG4gICAgdmFyIG1hcCA9IEFwcC5jb25maWcuY29tbW9ucy5tYXA7XHJcbiAgICB2YXIgdHJhbnMgPSBfLmNsb25lRGVlcChBcHAuY29uZmlnLmNvbW1vbnMudHJhbnMpO1xyXG4gICAgUHJvbWlzZS5yZXNvbHZlKFxyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9hcGkvbGlzdGluZy9maWx0ZXJzJyxcclxuICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgIGRhdGE6IG9wdGlvbnNcclxuICAgICAgfSlcclxuICAgIClcclxuICAgIC50aGVuKGZ1bmN0aW9uIHJlc29sdmUoZGF0YSkge1xyXG4gICAgICB2YXIgcmVuZGVyRGF0YSA9IHt9O1xyXG4gICAgICB2YXIgcmVzdWx0cyA9IFtdO1xyXG5cclxuICAgICAgdXRpbHMuZmluZEJ5SWQobWFwLCAnZXN0YXRlcycpLnNldFZpc2libGUoZmFsc2UpO1xyXG4gICAgICB1dGlscy5maW5kQnlJZChtYXAsICdwb2knKS5nZXRTb3VyY2UoKS5jbGVhcigpO1xyXG4gICAgICB1dGlscy5maW5kQnlJZChtYXAsICdmaWx0ZXJlZEVzdGF0ZXMnKS5nZXRTb3VyY2UoKS5jbGVhcigpO1xyXG4gICAgICAvLyB1dGlscy5maW5kQnlJZChtYXAsICdzZWxlY3QnKS5nZXRTb3VyY2UoKS5jbGVhcigpO1xyXG4gICAgICBhZGRSZXN1bHRzKGRhdGEpO1xyXG4gICAgICBfLmZvckVhY2goZGF0YS5mZWF0dXJlcywgZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICB2YXIgYWRkcmVzcztcclxuICAgICAgICB2YXIgZGF0ZVN0YXJ0O1xyXG4gICAgICAgIHZhciBkYXRlRW5kO1xyXG4gICAgICAgIHZhciBjb29yZGluYXRlcyA9IG9sLnByb2oudHJhbnNmb3JtKHZhbHVlLmdlb21ldHJ5LmNvb3JkaW5hdGVzLCAnRVBTRzozODU3JywgJ0VQU0c6NDMyNicpO1xyXG4gICAgICAgIGlmIChsYW5nID09PSAnZWwnKSB7XHJcbiAgICAgICAgICBhZGRyZXNzID0gdmFsdWUucHJvcGVydGllcy5zdHJlZXRfZWwgKyAnICcgKyB2YWx1ZS5wcm9wZXJ0aWVzLnN0cmVldF9udW1iZXI7XHJcbiAgICAgICAgICBkYXRlU3RhcnQgPSBtb21lbnQodmFsdWUucHJvcGVydGllcy5kYXRlX3N0YXJ0KS5mb3JtYXQoJ0RELU1NLVlZWVknKTtcclxuICAgICAgICAgIGRhdGVFbmQgPSBtb21lbnQodmFsdWUucHJvcGVydGllcy5lbmQpLmZvcm1hdCgnREQtTU0tWVlZWScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhZGRyZXNzID0gdmFsdWUucHJvcGVydGllcy5zdHJlZXRfZW4gKyAnICcgKyB2YWx1ZS5wcm9wZXJ0aWVzLnN0cmVldF9udW1iZXI7XHJcbiAgICAgICAgICBkYXRlU3RhcnQgPSBtb21lbnQodmFsdWUucHJvcGVydGllcy5kYXRlX3N0YXJ0KS5mb3JtYXQoJ01NLURELVlZWVknKTtcclxuICAgICAgICAgIGRhdGVFbmQgPSBtb21lbnQodmFsdWUucHJvcGVydGllcy5lbmQpLmZvcm1hdCgnTU0tREQtWVlZWScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXN1bHRzLnB1c2goe1xyXG4gICAgICAgICAgZ2lkOiB2YWx1ZS5wcm9wZXJ0aWVzLmdpZCxcclxuICAgICAgICAgIHByaWNlOiB2YWx1ZS5wcm9wZXJ0aWVzLnByaWNlLFxyXG4gICAgICAgICAgYXJlYTogdmFsdWUucHJvcGVydGllcy5lc3RhdGVhcmVhLFxyXG4gICAgICAgICAgYWRkcmVzczogYWRkcmVzcyxcclxuICAgICAgICAgIGRhdGVTdGFydDogZGF0ZVN0YXJ0LFxyXG4gICAgICAgICAgZGF0ZUVuZDogZGF0ZUVuZCxcclxuICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIHByaWNlOiB0cmFucy5saXN0aW5nLnByaWNlLFxyXG4gICAgICAgICAgICBhcmVhOiB0cmFucy5lc3RhdGUuYXJlYSxcclxuICAgICAgICAgICAgYXJlYVVuaXRzOiB0cmFucy5lc3RhdGUuYXJlYVVuaXRzXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IGNvb3JkaW5hdGVzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZW5kZXJEYXRhLnJlc3VsdHMgPSByZXN1bHRzO1xyXG4gICAgICByZXR1cm4gcmVuZGVyRGF0YTtcclxuICAgIH0pXHJcbiAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKGRhdGEpIHtcclxuICAgICAgZHVzdEJsdWViaXJkLnJlbmRlckFzeW5jKCdyZXN1bHRzJywgZGF0YSlcclxuICAgICAgLnRoZW4oZnVuY3Rpb24gcmVzb2x2ZUR1c3QocmVzdWx0KSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0cycpO1xyXG4gICAgICAgIHV0aWxzLnJlbW92ZUNsYXNzKHJlc3VsdHMsICd2aXN1YWxseWhpZGRlbicpO1xyXG4gICAgICAgIHJlc3VsdHMuaW5uZXJIVE1MID0gcmVzdWx0O1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbihmdW5jdGlvbiByZXNvbHZleigpIHtcclxuICAgICAgICB2YXIgem9vbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudEFyZWEnKS5xdWVyeVNlbGVjdG9yQWxsKCdpJyk7XHJcbiAgICAgICAgem9vbXMuZm9yRWFjaChmdW5jdGlvbiBhZGRab29tVG9SZXN1bHRzKHpvb20pIHtcclxuICAgICAgICAgIHpvb20uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiB6b29tVG9HaWQoKSB7XHJcbiAgICAgICAgICAgIHZhciBnaWQgPSB6b29tLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmRhdGFzZXQuZ2lkO1xyXG4gICAgICAgICAgICB2YXIgY29vcmRpbmF0ZXMgPSB1dGlscy5maW5kQnlJZChtYXAsICdmaWx0ZXJlZEVzdGF0ZXMnKS5nZXRTb3VyY2UoKS5nZXRGZWF0dXJlQnlJZChnaWQpXHJcbiAgICAgICAgICAgIC5nZXRHZW9tZXRyeSgpXHJcbiAgICAgICAgICAgIC5nZXRDb29yZGluYXRlcygpO1xyXG4gICAgICAgICAgICBtYXAuZ2V0VmlldygpLnNldENlbnRlcihjb29yZGluYXRlcyk7XHJcbiAgICAgICAgICAgIG1hcC5nZXRWaWV3KCkuc2V0Wm9vbSgxNik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oZnVuY3Rpb24gcmVzb2x2ZSgpIHtcclxuICAgICAgdmFyIGNsdXN0ZXJpemUgPSBuZXcgQ2x1c3Rlcml6ZSh7XHJcbiAgICAgICAgc2Nyb2xsSWQ6ICdzY3JvbGxBcmVhJyxcclxuICAgICAgICBjb250ZW50SWQ6ICdjb250ZW50QXJlYSdcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGZ1bmN0aW9uIGVycm9yKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgIGlmIChlLnN0YXR1cyA9PT0gNDA0KSB7XHJcbiAgICAgICAgdG9hc3RyLmVycm9yKHRyYW5zLmVycm9ycy5wcm9wZXJ0eVs0MDRdKTtcclxuICAgICAgfSBlbHNlIGlmIChlLnN0YXR1cyA9PT0gNTAzKSB7XHJcbiAgICAgICAgdG9hc3RyLmVycm9yKHRyYW5zLmVycm9ycy5wcm9wZXJ0eVs1MDNdKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0b2FzdHIuZXJyb3IodHJhbnMuZXJyb3JzLmludGVybmFsKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNob29zZUJ5QXJlYShkcmF3KSB7XHJcbiAgICB2YXIgbWFwID0gQXBwLmNvbmZpZy5jb21tb25zLm1hcDtcclxuICAgICQobWFwLmdldFZpZXdwb3J0KCkpLm1vdXNlbGVhdmUoZnVuY3Rpb24gbGVhdmVNYXBGb3JBcmVhU2VsZWN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBkcmF3LnNldEFjdGl2ZShmYWxzZSk7XHJcbiAgICB9KTtcclxuICAgICQobWFwLmdldFZpZXdwb3J0KCkpLm1vdXNlZW50ZXIoZnVuY3Rpb24gZW50ZXJNYXBGb3JBcmVhU2VsZWN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBkcmF3LnNldEFjdGl2ZSh0cnVlKTtcclxuICAgIH0pO1xyXG4gICAgZHJhdy5vbignZHJhd3N0YXJ0JywgZnVuY3Rpb24gZHJhd3N0YXJ0KCkge1xyXG4gICAgICB1dGlscy5maW5kQnlJZChtYXAsICdzZWxlY3QnKS5nZXRTb3VyY2UoKS5jbGVhcigpO1xyXG4gICAgfSk7XHJcbiAgICBkcmF3Lm9uKCdkcmF3ZW5kJywgZnVuY3Rpb24gZHJhd2VuZChlKSB7XHJcbiAgICAgIHZhciBjb29yZGluYXRlcyA9IGUuZmVhdHVyZS5nZXRHZW9tZXRyeSgpLmdldEV4dGVudCgpO1xyXG4gICAgICB2YXIgdHJhbnNmb3JtZWRDb29yZGluYXRlcyA9IF8uY2h1bmsoY29vcmRpbmF0ZXMsIDIpLm1hcChmdW5jdGlvbiBzcGxpdChjdXJyZW50VmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gb2wucHJvai50cmFuc2Zvcm0oY3VycmVudFZhbHVlLCAnRVBTRzozODU3JywgJ0VQU0c6NDMyNicpO1xyXG4gICAgICB9KTtcclxuICAgICAgYmJveCA9IF8uY29uY2F0KHRyYW5zZm9ybWVkQ29vcmRpbmF0ZXNbMF0sIHRyYW5zZm9ybWVkQ29vcmRpbmF0ZXNbMV0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICB2YXIgbWFwID0gQXBwLmNvbmZpZy5jb21tb25zLm1hcDtcclxuICAgIHZhciBkcmF3SW50ZXJhY3Rpb24gPSBuZXcgb2wuaW50ZXJhY3Rpb24uRHJhdyh7XHJcbiAgICAgIHNvdXJjZTogdXRpbHMuZmluZEJ5SWQobWFwLCAnc2VsZWN0JykuZ2V0U291cmNlKCksXHJcbiAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcclxuICAgICAgZ2VvbWV0cnlGdW5jdGlvbjogdXRpbHMuZ2VvbWV0cnlGdW5jdGlvbixcclxuICAgICAgbWF4UG9pbnRzOiAyXHJcbiAgICAgIC8vIGNvbmRpdGlvbjogZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgLy8gICByZXR1cm4gb2wuZXZlbnRzLmNvbmRpdGlvbi5wbGF0Zm9ybU1vZGlmaWVyS2V5T25seShldmVudCk7XHJcbiAgICAgIC8vIH1cclxuICAgIH0pO1xyXG4gICAgZHJhd0ludGVyYWN0aW9uLnNldFByb3BlcnRpZXMoe1xyXG4gICAgICBpZDogJ2RyYXcnXHJcbiAgICB9KTtcclxuICAgIGRyYXdJbnRlcmFjdGlvbi5zZXRBY3RpdmUoZmFsc2UpO1xyXG4gICAgJCgnI2NoZWNrYm94LTYnKS5jaGFuZ2UoZnVuY3Rpb24gZW5hYmxlQXJlYVNlbGVjdGlvbigpIHtcclxuICAgICAgaWYgKHRoaXMuY2hlY2tlZCkge1xyXG4gICAgICAgIG1hcC5hZGRJbnRlcmFjdGlvbihkcmF3SW50ZXJhY3Rpb24pO1xyXG4gICAgICAgIEFwcC5jb25maWcubW9kdWxlcy5pbmZvLmRpc2FibGUoKTtcclxuICAgICAgICBjaG9vc2VCeUFyZWEoZHJhd0ludGVyYWN0aW9uKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBBcHAuY29uZmlnLm1vZHVsZXMuaW5mby5pbml0KCk7XHJcbiAgICAgICAgbWFwLnJlbW92ZUludGVyYWN0aW9uKGRyYXdJbnRlcmFjdGlvbik7XHJcbiAgICAgICAgZHJhd0ludGVyYWN0aW9uLnNldEFjdGl2ZShmYWxzZSk7XHJcbiAgICAgICAgdXRpbHMuZmluZEJ5SWQobWFwLCAnc2VsZWN0JykuZ2V0U291cmNlKCkuY2xlYXIoKTtcclxuICAgICAgICBiYm94ID0gZXh0ZW50O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGFzc2lnblZhbGlkYXRvcnMoKTtcclxuICAgICQoJyNpbnZva2VGaWx0ZXJzJykuY2xpY2soZnVuY3Rpb24gaW52b2tlRmlsdGVycyhldmVudCkge1xyXG4gICAgICB2YXIgb3B0aW9ucztcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIG9wdGlvbnMgPSBzZXRPcHRpb25zKCk7XHJcbiAgICAgIGlmICgkKCdmb3JtW25hbWU9ZmlsdGVyc10nKS5wYXJzbGV5KCkudmFsaWRhdGUoKSkge1xyXG4gICAgICAgIGdldFJlc3VsdHMob3B0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJCgnI2NsZWFyRmlsdGVycycpLmNsaWNrKGZ1bmN0aW9uIGNsZWFyRmlsdGVycyhldmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgY2xlYXJSZXN1bHRzKG1hcCk7XHJcbiAgICAgICQoJ2xhYmVsW2Zvcj1vcHRpb24tMV0nKS5hZGRDbGFzcygnaXMtY2hlY2tlZCcpO1xyXG4gICAgICAkKCcjb3B0aW9uLTEnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICQoJ2xhYmVsW2Zvcj1vcHRpb24tMl0nKS5yZW1vdmVDbGFzcygnaXMtY2hlY2tlZCcpO1xyXG4gICAgICAkKCcjb3B0aW9uLTInKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAkKCcubWRsLWNoZWNrYm94X19pbnB1dCcpLmVhY2goZnVuY3Rpb24gY2xlYXJDaGVja2JveGVzKGluZGV4LCBlbCkge1xyXG4gICAgICAgICQoZWwpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSkucGFyZW50KCdsYWJlbCcpXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdpcy1jaGVja2VkJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKCcubWRsLXRleHRmaWVsZF9faW5wdXQnKS5lYWNoKGZ1bmN0aW9uIGNsZWFySW5wdXRzKGluZGV4LCBlbCkge1xyXG4gICAgICAgIGlmICgkKGVsKS5hdHRyKCdpZCcpICE9PSAnZXN0YXRlVHlwZScpIHtcclxuICAgICAgICAgICQoZWwpLnZhbCgnJykucGFyZW50KClcclxuICAgICAgICAgIC5lcSgwKVxyXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCdpcy1kaXJ0eScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGVsKS5hdHRyKCdkYXRhLXZhbCcsICdBcGFydG1lbnQnKTtcclxuICAgICAgICAgIGlmIChsYW5nID09PSAnZWwnKSB7XHJcbiAgICAgICAgICAgICQoZWwpLnZhbCgnzpTOuc6xzrzOrc+BzrnPg868zrEnKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJyNlc3RhdGVUeXBlJykudmFsKCdBcGFydG1lbnQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0OiBpbml0XHJcbiAgfTtcclxufSh3aW5kb3csIGRvY3VtZW50LCBQcm9taXNlLCAkLCBQYXJzbGV5LCBtb21lbnQsIEFwcCkpO1xyXG4iLCJ2YXIgdXNlck1hcCA9IChmdW5jdGlvbiB1c2VyTWFwKHdpbmRvdywgZG9jdW1lbnQsIFByb21pc2UsICQsIEFwcCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuICB2YXIgY29udGV4dCA9ICdtYXAnO1xyXG4gIHZhciBsYW5nID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lmxhbmc7XHJcbiAgdmFyICRsb2FkaW5nID0gJCgnLm1kbC1zcGlubmVyJyk7XHJcbiAgJChkb2N1bWVudClcclxuICAuYWpheFN0YXJ0KGZ1bmN0aW9uIHN0YXJ0KCkge1xyXG4gICAgJCgnLnNwaW5lci13cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ3Zpc3VhbGx5aGlkZGVuJyk7XHJcbiAgICAkbG9hZGluZy5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgfSlcclxuICAuYWpheFN0b3AoZnVuY3Rpb24gc3RvcCgpIHtcclxuICAgICQoJy5zcGluZXItd3JhcHBlcicpLmFkZENsYXNzKCd2aXN1YWxseWhpZGRlbicpO1xyXG4gICAgJGxvYWRpbmcucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG4gIH0pO1xyXG4gIHRvYXN0ci5vcHRpb25zID0ge1xyXG4gICAgY2xvc2VCdXR0b246IGZhbHNlLFxyXG4gICAgZGVidWc6IGZhbHNlLFxyXG4gICAgbmV3ZXN0T25Ub3A6IGZhbHNlLFxyXG4gICAgcHJvZ3Jlc3NCYXI6IGZhbHNlLFxyXG4gICAgcG9zaXRpb25DbGFzczogJ3RvYXN0LXRvcC1jZW50ZXInLFxyXG4gICAgcHJldmVudER1cGxpY2F0ZXM6IGZhbHNlLFxyXG4gICAgb25jbGljazogbnVsbCxcclxuICAgIHNob3dEdXJhdGlvbjogJzMwMCcsXHJcbiAgICBoaWRlRHVyYXRpb246ICcxMDAwJyxcclxuICAgIHRpbWVPdXQ6ICc1MDAwJyxcclxuICAgIGV4dGVuZGVkVGltZU91dDogJzEwMDAnLFxyXG4gICAgc2hvd0Vhc2luZzogJ3N3aW5nJyxcclxuICAgIGhpZGVFYXNpbmc6ICdsaW5lYXInLFxyXG4gICAgc2hvd01ldGhvZDogJ2ZhZGVJbicsXHJcbiAgICBoaWRlTWV0aG9kOiAnZmFkZU91dCdcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgUHJvbWlzZS5yZXNvbHZlKFxyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9hcGkvbGFuZ3VhZ2UnLFxyXG4gICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHR5cGU6IGxhbmcsXHJcbiAgICAgICAgICBjb250ZXh0OiBjb250ZXh0XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICApXHJcbiAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKGRhdGEpIHtcclxuICAgICAgQXBwLmNvbmZpZy5jb21tb25zLnRyYW5zID0gZGF0YTtcclxuICAgICAgQXBwLmNvbmZpZy5jb21tb25zLm1hcCA9IEFwcC5jb25maWcubW9kdWxlcy5tYXAuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfSlcclxuICAgIC50aGVuKGZ1bmN0aW9uIHJlc29sdmUoKSB7XHJcbiAgICAgIEFwcC5jb25maWcubW9kdWxlcy5pbmZvLmluaXQoKTtcclxuICAgICAgQXBwLmNvbmZpZy5tb2R1bGVzLmZpbHRlcnMuaW5pdCgpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbiBlcnJvcihlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdDogaW5pdFxyXG4gIH07XHJcbn0od2luZG93LCBkb2N1bWVudCwgUHJvbWlzZSwgalF1ZXJ5LCBBcHApKTtcclxuXHJcblxyXG4vLyBqUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgkKSB7XHJcbi8vICAgJCgnLnNwaW5uZXInKS5hZGRDbGFzcygndmlzdWFsbHloaWRkZW4nKTtcclxuLy8gICAkKCcubWRsLXNwaW5uZXInKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XHJcbi8vICAgLy8gaGFuZGxlU2VsZWN0KCk7XHJcbi8vIH0pO1xyXG5cclxudXNlck1hcC5pbml0KCk7XHJcbiQoJyNhZHZhbmNlZC1maWx0ZXJzJykuY2xpY2soZnVuY3Rpb24gdG9nZ2xlRmlsdGVycygpIHtcclxuICAkKCcjZXN0YXRlLWZpbHRlcnMnKS50b2dnbGVDbGFzcygndmlzdWFsbHloaWRkZW4nKTtcclxufSk7XHJcbi8vICQoJyN0b2dnbGUtcHJpY2UtcmFuZ2UnKS5jbGljayhmdW5jdGlvbiB0b2dnbGVQcmljZVJhbmdlKCkge1xyXG4vLyAgICQoJyNwcmljZS1yYW5nZScpLnRvZ2dsZUNsYXNzKCd2aXN1YWxseWhpZGRlbicpO1xyXG4vLyB9KTtcclxuIl19
