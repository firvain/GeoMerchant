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
  var center = [3677385, 4120949];
  var extent = [3652772, 4112808, 3700000, 4132797];
  var geoJSONFormat = new ol.format.GeoJSON({
    defaultDataProjection: 'EPSG:4326'
  });

  var mapStyles = {
    iconType: function getIconType(estateType) {
      var iconType = {
        Apartment: function getApartmentIcon() {
          return 'apartment';
        },
        Store: function getStoreIcon() {
          return 'store';
        },
        'Detached House': function getDetachedHouseIcon() {
          return 'detached';
        },
        Maisonette: function getMaisonetteIcon() {
          return 'maisonette';
        },
        Villa: function getVillaIon() {
          return 'villa';
        }
      };
      return (iconType[estateType])();
    },
    estates: function estates(feature) {
      var src = './images/pins/none/' +
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
        loader: function propertyLoader() {
          var url = 'http://127.0.0.1:3000/api/property/all/' + id;
          var self = this;
          Promise.resolve(
            $.ajax({
              url: url,
              type: 'GET',
              dataType: 'json'
            })
          )
          .then(function resolve(data) {
            var features = geoJSONFormat.readFeatures(data, {
              featureProjection: 'EPSG:3857'
            });
            self.addFeatures(features);
          })
          .then(function resolve() {
            self.getFeatures().forEach(function addIds(feature) {
              feature.setId(feature.getProperties().gid);
            });
          })
          .catch(function error(e) {
            console.log(e);
            if (e.status === 404) {
              toastr.error('Sorry, we cannot find any properties!');
            } else if (e.status === 503) {
              toastr.error('Service Unavailable!');
            } else {
              toastr.error('Internal Server Error! Please reload page or try again later');
            }
          });
        }
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
    estates: function estates() {
      return new ol.layer.Vector({
        source: mapSources.estates(),
        id: 'estates',
        visible: true,
        style: mapStyles.estates
      });
    },
    newEstates: function newEstates(trans) {
      return new ol.layer.Vector({
        source: new ol.source.Vector(),
        id: 'newEstates',
        visible: false
      });
    }
  };
  var initialize = function initialize() {
    var trans = App.config.commons.trans;
    var layers = Object.keys(mapLayers).map(function addMapLayers(key) {
      if (key !== 'bing') { return mapLayers[key](trans); }
      return null;
    });
    return new ol.Map({
      target: 'appwrapper__map',
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
  var editButton = document.querySelector('#edit');
  var deleteButton = document.querySelector('#delete');
  var infoBoxContent = document.querySelector('#appwrapper__infobox-content');
  var dustBluebird = App.config.promises.dustBluebird;
  var utils = App.utils;
  function dustEstateInfo(data) {
    dustBluebird.renderAsync('edit', data)
    .then(function resolveDust(result) {
      utils.removeClass(infoBoxContent, 'visuallyhidden');
      infoBoxContent.innerHTML = result;
      getmdlSelect.init('.getmdl-select');
    })
    .catch(function error(e) {
      console.log(e);
    });
  }
  function selectFeature(evt) {
    var map = evt.map;
    var coordinates;
    var estate;
    var gid;
    var renderData = _.cloneDeep(App.config.commons.trans);
    var style = new ol.style.Style({
      image: new ol.style.Icon(({
        src: './images/pins/generic-48.png',
        anchorOrigin: 'bottom-left',
        anchor: [0.5, 0],
        scale: 1,
        color: 'rgb(255,82,82)'
      }))
    });
    // var coordinate = evt.coordinate;
    var clickedFeature = map.forEachFeatureAtPixel(evt.pixel, function findFeature(feature, layer) {
      return {
        feature: feature,
        layer: layer
      };
    }, this, function clickedFeatureLayerFilter(layer) {
      if (layer.get('id') === 'estates') {
        return true;
      }
      return false;
    }, this);
    if (clickedFeature) {
      utils.findById(map, 'estates').getSource().getFeatures()
      .forEach(function resetStyle(feature) {
        feature.setStyle(null);
      });
      estate = clickedFeature.feature;
      coordinates = estate.getGeometry().getCoordinates();
      map.getView().setCenter(coordinates);
      map.getView().setZoom(16);
      gid = estate.getProperties().gid;
      estate.setStyle(style);
      var p1 = Promise.resolve(
        $.ajax({
          url: 'http://127.0.0.1:3000/api/property',
          type: 'GET',
          data: {
            gid: gid
          }
        })
        );
      p1.then(function resolve(data) {
        var feature = data.features[0];
        App.config.cache.activeEstate = feature.properties;
        return feature;
      })
      .then(function resolve(feature) {
        if (lang === 'el') {
          renderData.values = {
            gid: feature.properties.gid,
            x: coordinates[0],
            y: coordinates[1],
            areaName: feature.properties.area_name,
            estateType: feature.properties.estatetype,
            address: feature.properties.street_el,
            addressNumber: feature.properties.street_number,
            pscode: feature.properties.ps_code,
            estateArea: feature.properties.estatearea,
            bedrooms: feature.properties.bedrooms,
            floor: feature.properties.floor,
            year: feature.properties.year,
            planNumber: feature.properties.plan_num,
            plotArea: feature.properties.plotarea,
            parcelNumber: feature.properties.parcel_num,
            parking: feature.properties.parking,
            furnished: feature.properties.furnished,
            isnew: feature.properties.isnew,
            heating: feature.properties.heating,
            cooling: feature.properties.cooling,
            view: feature.properties.view,
            title: feature.properties.title
          };
        } else {
          renderData.values = {
            gid: feature.properties.gid,
            x: feature.geometry.coordinates[0],
            y: feature.geometry.coordinates[1],
            areaName: feature.properties.area_name,
            estateType: feature.properties.estatetype_en,
            address: feature.properties.street_en,
            addressNumber: feature.properties.street_number,
            pscode: feature.properties.ps_code,
            estateArea: feature.properties.estatearea,
            bedrooms: feature.properties.bedrooms,
            floor: feature.properties.floor,
            year: feature.properties.year,
            planNumber: feature.properties.plan_num,
            plotArea: feature.properties.plotarea,
            parcelNumber: feature.properties.parcel_num,
            parking: feature.properties.parking,
            furnished: feature.properties.furnished,
            isnew: feature.properties.isnew,
            heating: feature.properties.heating,
            cooling: feature.properties.cooling,
            view: feature.properties.view,
            title: feature.properties.title
          };
        }
      });
      p1.catch(function error(e) {
        console.log(e);
      });
      var p2 = Promise.resolve(
        $.ajax({
          url: 'http://127.0.0.1:3000/api/listing',
          type: 'GET',
          data: {
            gid: gid
          }
        })
        )
      .then(function resolve(data) {
        App.config.cache.activeEstateListing = data;
        renderData.listing.values = data;
        renderData.listing.values.date_start = utils.handleDate(data.date_start, lang);
        renderData.listing.values.date_end = utils.handleDate(data.date_end, lang);
        renderData.listing.exists = true;
      })
      .catch(function error(e) {
        var snackbarContainer = document.querySelector('#appwrapper__snackbar');
        var data = { message: App.config.commons.trans.errors.listing404 };
        console.log(e);
        if (e.status === 404) {
          renderData.listing.exists = false;
          snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
      });
      Promise.each([p1, p2], function e(result) {
      })
      .then(function resolve() {
        dustEstateInfo(renderData);
        editButton.removeAttribute('disabled');
        deleteButton.removeAttribute('disabled');

        utils.addClass(editButton, 'mdl-button--accent');
        utils.addClass(deleteButton, 'mdl-button--accent');
      })
      .catch(function error(e) {
        console.log(e);
      });
    } else {
      infoBoxContent.innerHTML = '';
      utils.addClass(infoBoxContent, 'visuallyhidden');
      editButton.setAttribute('disabled', true);

      deleteButton.setAttribute('disabled', true);

      utils.findById(map, 'estates').getSource().getFeatures()
      .forEach(function resetStyle(feature) {
        feature.setStyle(null);
      });
    }
  }

  function init() {
    var map = App.config.commons.map;
    document.querySelector('body').dataset.active = 'info';
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

App.config.modules.edit = (function edit(window, document, Promise, $, dPick, moment) {
  'use strict';
  var content = document.querySelector('#appwrapper__infobox-content');
  var lang = document.documentElement.lang;
  var info = App.config.modules.info;
  var utils = App.utils;
  var editButton = document.querySelector('#edit');
  var deleteButton = document.querySelector('#delete');
  var body = document.querySelector('body');
  function clearContent() {
    if (content.children.length > 0) {
      content.innerHTML = '';
    }
  }
  function getInteraction(id) {
    var map = App.config.commons.map;
    var interactions = map.getInteractions();
    var found = {};
    interactions.forEach(function getInteractionId(interaction) {
      if (interaction.get('id') === id) {
        found = interaction;
        return false;
      }
      return true;
    });
    return found;
  }
  function assignValidators() {
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

  function setEstateType(type) {
    var types;
    if (lang === 'el') {
      types = {
        Διαμέρισμα: function getApartment() {
          return 'Apartment';
        },
        Μονοκατοικία: function getDetachedHouse() {
          return 'Detached House';
        },
        Μεζονέτα: function getMaisonette() {
          return 'Maisonette';
        },
        Έπαυλη: function getVilla() {
          return 'Villa';
        }
      };
    } else {
      types = {
        Apartment: function getApartment() {
          return 'Διαμέρισμα';
        },
        'Detached House': function getDetachedHouse() {
          return 'Μονοκατοικία';
        },
        Maisonette: function getMaisonette() {
          return 'Μεζονέτα';
        },
        Villa: function getVilla() {
          return 'Έπαυλη';
        }
      };
    }
    return types[type]();
  }
  function collectValues() {
    var values = {};
    var filteredValues = {};
    var inputs = content.querySelectorAll('input[type=text]');
    var checkboxes = content.querySelectorAll('input[type=checkbox]');
    values.estate = {};
    values.listing = {};

    [].forEach.call(inputs, function collectFromInputs(el) {
      var name = _.last(_.split(el.getAttribute('id'), '-', 3));
      var value = el.value;
      var newX = document.querySelector('#estate').dataset.newx;
      var newY = document.querySelector('#estate').dataset.newy;
      var originalX = document.querySelector('#estate').dataset.originalx;
      var originalY = document.querySelector('#estate').dataset.originaly;

      if (el.getAttribute('id').indexOf('estate') > -1) {
        if (typeof newX !== 'undefined') {
          values.estate.x = newX;
          values.estate.y = newY;
        } else {
          values.estate.x = originalX;
          values.estate.y = originalY;
        }
        if (lang === 'el') {
          if (name === 'type') {
            values.estate.estatetypeEn = setEstateType(value);
            values.estate.estatetype = value;
          }
          if (name === 'address') {
            values.estate.streetEn = utils.elToEn(value);
            values.estate.streetEl = value;
          }
        } else {
          if (name === 'type') {
            values.estate.estatetypeEn = value;
            values.estate.estatetype = setEstateType(value);
          }
          if (name === 'address') {
            values.estate.streetEn = value;
            values.estate.streetEl = utils.elToEn(value);
          }
        }
        if (name === 'addressNumber') {
          values.estate.streetNumber = value;
        }
        values.estate[name] = value;
      } else {
        if (name === 'type') {
          if (value === 'Sale' || value === 'Πώληση') {
            values.listing.sale = true;
            values.listing.rent = false;
          } else {
            values.listing.sale = false;
            values.listing.rent = true;
          }
        } else {
          values.listing[name] = value;
        }
      }
    });
    [].forEach.call(checkboxes, function collectFromCheckboxes(el) {
      var name = _.last(_.split(el.getAttribute('id'), '-', 3));
      var value = el.checked;
      if (name !== 'pets') {
        values.estate[name] = value;
      } else {
        values.listing[name] = value;
      }
    });
    filteredValues.estate = _.omit(values.estate, ['address', 'addressNumber', 'type', 'toggle']);
    filteredValues.listing = values.listing;
    return filteredValues;
  }
  function update(data) {
    var snackbarContainer = document.querySelector('#appwrapper__snackbar');
    var msgData = {};
    function addGidToListing(input, gid) {
      var returnedData = input;
      returnedData.gid = gid;
      return returnedData;
    }
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/property',
        type: 'PUT',
        data: data.estate
      })
      )
    .then(function resolve(estateResult) {
      msgData.estateId = estateResult.propertyGid;
      if (!_.isEmpty(data.listing)) {
        return $.ajax({
          url: 'http://127.0.0.1:3000/api/listing',
          type: 'PUT',
          data: addGidToListing(data.listing, estateResult.propertyGid)
        });
      }
      return null;
    })
    .then(function resolve(listingResult) {
      var msg;
      // console.log(result)
      if (listingResult === null) {
        msg = { message: 'Updated Estate: ' + msgData.estateId };
      } else {
        msg = { message: 'Updated EstateID: ' + msgData.estateId + ' and ListingID: ' + listingResult.listingId };
      }
      snackbarContainer.MaterialSnackbar.showSnackbar(msg);
    })
    .catch(function error(e) {
      var msg = { message: e };
      console.log(e);
      snackbarContainer.MaterialSnackbar.showSnackbar(msg);
    })
    .finally(function closeUpdate() {
      var map = App.config.commons.map;
      clearContent();
      utils.addClass(content, 'visuallyhidden');
      utils.findById(map, 'estates').getSource().getFeatures()
      .forEach(function resetStyle(feature) {
        feature.setStyle(null);
      });
      editButton.setAttribute('disabled', true);
      deleteButton.setAttribute('disabled', true);
      info.init();
      body.dataset.active = 'info';
      getInteraction('translate').setActive(false);
    });
  }
  function datePicker() {
    var format = (lang === 'el') ? 'DD-MM-YYYY' : 'MM-DD-YYYY';
    var dateStartPicker;
    var dateEndPicker;
    var dateStartBtn = document.getElementById('infobox__date-start');
    var dateEndBtn = document.getElementById('infobox__date-end');
    var dateStartInput = document.getElementById('listing__general-dateStart');
    var dateEndInput = document.getElementById('listing__general-dateEnd');
    var dateStartPickerInit;
    var dateEndPickerInit;
    var observeDatePicker = new MutationObserver(function observeDatePicker(mutations) {
      var attributeValue;
      mutations.forEach(function foerEachMutation(mutation) {
        if (mutation.attributeName === 'class') {
          attributeValue = $(mutation.target).prop(mutation.attributeName);
          if (attributeValue.indexOf('mddtp-picker--inactive') > -1) {
            utils.removeClass(document.getElementById('appwrapper__infobox'), 'unclickable');
          } else {
            utils.addClass(document.getElementById('appwrapper__infobox'), 'unclickable');
          }
        }
      });
    });
    if (dateStartInput !== null) {
      console.log(dateStartInput.value);
      if (dateStartInput.value !== 'undefined') {
        dateStartPickerInit = moment(dateStartInput.value, format);
      } else {
        dateStartPickerInit = moment();
      }
      dateStartPicker = new dPick.default({
        type: 'date',
        init: dateStartPickerInit,
        future: moment().add(5, 'years'),
        trigger: dateStartInput,
        orientation: 'PORTRAIT'
      });
      observeDatePicker.observe(document.getElementById('mddtp-picker__date'), {
        attributes: true
      });
      dateStartInput.addEventListener('onOk', function displayPickedate() {
        utils.addClass(this.parentNode, 'is-dirty');
        this.value = dateStartPicker.time.format(format).toString();
      });
      dateStartBtn.addEventListener('click', function showDatePicker() {
        dateStartPicker.toggle();
      });
    }
    if (dateEndInput !== null) {
      if (dateEndInput.value !== 'undefined') {
        dateEndPickerInit = moment(dateStartInput.value, format);
      } else {
        dateEndPickerInit = moment();
      }
      dateEndInput.addEventListener('onOk', function displayPickedate() {
        utils.addClass(this.parentNode, 'is-dirty');
        this.value = dateEndPicker.time.format(format).toString();
      });
      dateEndPicker = new dPick.default({
        type: 'date',
        init: dateEndPickerInit,
        future: moment().add(5, 'years'),
        trigger: dateEndInput,
        orientation: 'PORTRAIT'
      });
      observeDatePicker.observe(document.getElementById('mddtp-picker__date'), {
        attributes: true
      });
      dateEndBtn.addEventListener('click', function showDatePicker() {
        dateEndPicker.toggle();
      });
    }
  }
  function enableEdit() {
    var observeListingInput = new MutationObserver(function observeListingInput(mutations) {
      var attributeValue;
      mutations.forEach(function foerEachMutation(mutation) {
        if (mutation.attributeName === 'data-val') {
          attributeValue = mutation.target.value;
          if (attributeValue === 'Rent' || attributeValue === 'Ενοικίαση') {
            utils.removeClass(document.querySelector('#listing__general-pets-wrapper'), 'visuallyhidden');
          } else {
            utils.addClass(document.querySelector('#listing__general-pets-wrapper'), 'visuallyhidden');
          }
        }
      });
    });
    var map = App.config.commons.map;
    var inputs = content.querySelectorAll('input');
    var labels = content.querySelectorAll('label');
    var buttons = content.querySelectorAll('button');
    var editCloseButton = document.querySelector('.close');
    var editAgreeButton = document.querySelector('.agree');
    var locationSwitch = document.querySelector('#estate_location-toggle');
    var gid = document.querySelector('#estate__info-gid').value;
    var translate = new ol.interaction.Translate({
      features: new ol.Collection([utils.findById(map, 'estates').getSource().getFeatureById(gid)]),
      layers: [utils.findById(map, 'estates')]
    });

    assignValidators();
    translate.set('id', 'translate');
    if (document.getElementById('listing__idAndType-type') !== null) {
      observeListingInput.observe(document.getElementById('listing__idAndType-type'), {
        attributes: true,
        characterData: true
      });
    }
    translate.on('translateend', function setTranslatedCoordinates(e) {
      var element = document.querySelector('#estate');
      element.dataset.newx = e.coordinate[0];
      element.dataset.newy = e.coordinate[1];
      locationSwitch.checked = false;
      utils.removeClass(locationSwitch.parentNode, 'is-checked');
      // App.config.modules.info.init();
      translate.setActive(false);
    });
    map.addInteraction(translate);
    translate.setActive(false);

    locationSwitch.addEventListener('click', function watchLocationSwitch() {
      if (this.checked) {
        // App.config.modules.info.disable();
        translate.setActive(true);
      } else {
        // App.config.modules.info.init();
        translate.setActive(false);
      }
    });

    [].forEach.call(document.getElementsByClassName('listing'), function removeDisabledListing(el) {
      utils.removeClass(el, 'listing-disabled');
    });

    [].forEach.call(inputs, function removeDisabledInputs(el) {
      if (!utils.hasClass(el, 'not-edditable')) {
        el.removeAttribute('disabled');
      }
    });

    [].forEach.call(labels, function removeDisabledLabels(el) {
      utils.removeClass(el, 'is-disabled');
    });

    [].forEach.call(buttons, function removeDisabledLabels(el) {
      el.removeAttribute('disabled');
    });

    utils.removeClass(document.querySelector('#confirmBtns'), 'visuallyhidden');
    editCloseButton.addEventListener('click', function cancelEdit() {
      clearContent();
      utils.addClass(content, 'visuallyhidden');
      utils.findById(map, 'estates').getSource().getFeatures()
      .forEach(function resetStyle(feature) {
        feature.setStyle(null);
      });
      editButton.setAttribute('disabled', true);
      deleteButton.setAttribute('disabled', true);
      info.init();
      body.dataset.active = 'info';
      getInteraction('translate').setActive(false);
    });
    editAgreeButton.addEventListener('click', function updateEdit() {
      // sanitize();
      var data = collectValues();
      console.log(data);
      update(data);
    });
    datePicker();
  }

  function init() {
    info.disable();
    enableEdit();
  }

  return {
    init: init
  };
}(window, document, Promise, $, mdDateTimePicker, moment, App));

App.config.modules.delete = (function edit(window, document, Promise, $, App, dialogPolyfill) {
  'use strict';
  var utils = App.utils;
  var dustBluebird = App.config.promises.dustBluebird;
  var deleteButton = document.getElementById('delete');
  var editButton = document.getElementById('edit');
  var dialog = document.querySelector('dialog');
  var snackbarContainer = document.querySelector('#appwrapper__snackbar');
  var content = document.getElementById('appwrapper__infobox-content');
  var body = document.querySelector('body');
  var info = App.config.modules.info;
  function clearContent() {
    if (content.children.length > 0) {
      content.innerHTML = '';
    }
  }
  function updateEstates() {
    var map = App.config.commons.map;
    utils.findById(map, 'estates').getSource().clear();
  }
  function deleteListing(data) {
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/listing',
        type: 'DELETE',
        data: { id: data }
      })
      )
    .then(function resolve(deleteListingresult) {
      console.log(deleteListingresult);
      content.querySelector('#listing').innerHTML = '';
      content.querySelector('#listing').parentNode.removeChild(content.querySelector('#listing'));
    })
    .finally(function enableInfo() {
      var map = App.config.commons.map;
      clearContent();
      body.dataset.active = 'info';
      editButton.setAttribute('disabled', true);
      deleteButton.setAttribute('disabled', true);
      info.init();
      utils.findById(map, 'estates').getSource().getFeatures()
      .forEach(function resetStyle(feature) {
        feature.setStyle(null);
      });
    })
    .catch(function error(e) {
      var msg = { message: e };
      console.log(e);
      snackbarContainer.MaterialSnackbar.showSnackbar(msg);
    });
  }
  function deleteEstateAndListing(data) {
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/property',
        type: 'DELETE',
        data: { gid: data }
      })
      )
    .then(function resolve() {
      updateEstates();
    })
    .finally(function enableInfo() {
      var map = App.config.commons.map;
      clearContent();
      body.dataset.active = 'info';
      info.init();
      editButton.setAttribute('disabled', true);
      deleteButton.setAttribute('disabled', true);
      utils.findById(map, 'estates').getSource().getFeatures()
      .forEach(function resetStyle(feature) {
        feature.setStyle(null);
      });
    })
    .catch(function error(e) {
      var msg = { message: e };
      console.log(e);
      snackbarContainer.MaterialSnackbar.showSnackbar(msg);
    });
  }
  function whatToDelete() {
    var checkboxes = dialog.querySelectorAll('input[name=options]');
    var values = {};
    if (checkboxes.length !== 0) {
      [].forEach.call(checkboxes, function getValues(el) {
        var key = _.last(_.split(el.getAttribute('id'), '-', 3));
        values[key] = el.checked;
      });
    }
    return values;
  }
  function cancelDelete() {
    dialog.close();
  }
  function confirmDelete() {
    var data;
    var chooser = whatToDelete();
    if (_.isEmpty(chooser)) {
      data = document.getElementById('estate__info-gid').value;
      deleteEstateAndListing(data);
    } else {
      if (chooser.listing === true) {
        data = document.getElementById('listing__idAndType-id').value;
        deleteListing(data);
      }
      if (chooser.estate === true) {
        data = document.getElementById('estate__info-gid').value;
        deleteEstateAndListing(data);
      }
    }
    dialog.close();
  }
  function show() {
    var listing = document.getElementById('listing__idAndType-id');
    var data = {};
    if (listing === null) {
      data.title = 'Delete Estate';
      data.choose = false;
    } else {
      data.title = 'Please choose what you want to delete';
      data.choose = true;
    }
    dustBluebird.renderAsync('deleteDialog', data)
    .then(function resolveDust(result) {
      dialog.innerHTML = result;
      dialog.showModal();
    })
    .then(function resolve() {
      dialog.querySelector('#cancelDelete').addEventListener('click', cancelDelete);
      dialog.querySelector('#confirmDelete').addEventListener('click', confirmDelete);
    })
    .catch(function error(e) {
      console.log(e);
    });
  }
  function initDialog() {
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    show();
  }
  return {
    init: initDialog
  };
}(window, document, Promise, jQuery, App, dialogPolyfill));

App.config.modules.insert = (function edit(window, document, Promise, $, App, dPick, moment, dialogPolyfill, cloudinary, bowser) {
  'use strict';
  var lang = document.documentElement.lang;
  var body = document.querySelector('body');
  var utils = App.utils;
  var dustBluebird = App.config.promises.dustBluebird;
  var content = document.getElementById('appwrapper__infobox-content');
  var addButton = document.getElementById('insert');
  var info = App.config.modules.info;
  var drawnCollection = new ol.Collection();
  function clearContent() {
    if (content.children.length > 0) {
      content.innerHTML = '';
      document.getElementById('activeModule').innerHTML = 'Information';
    }
  }
  function invalidate() {
    var inputs = content.querySelectorAll('input[type=text]');
    Array.prototype.map.call(inputs, function setInvalid(obj) {
      if (obj.value === '') {
        utils.addClass(obj.parentNode, 'is-invalid');
      } else {
        utils.removeClass(obj.parentNode, 'is-invalid');
      }
    });
  }
  function checkEmpty() {
    var inputs = content.querySelectorAll('input[type=text]');
    return _.some(inputs, function isEmpty(input) {
      if (input.value === '') {
        return true;
      }
      return false;
    });
  }
  function getInteraction(id) {
    var map = App.config.commons.map;
    var interactions = map.getInteractions();
    var found = {};
    interactions.forEach(function getInteractionId(interaction) {
      if (interaction.get('id') === id) {
        found = interaction;
        return false;
      }
      return true;
    });
    return found;
  }
  function datePicker() {
    var format = (lang === 'el') ? 'DD-MM-YYYY' : 'MM-DD-YYYY';
    var dateStartPicker;
    var dateEndPicker;
    var dateStartBtn = document.getElementById('infobox__date-start');
    var dateEndBtn = document.getElementById('infobox__date-end');
    var dateStartInput = document.getElementById('listing__general-dateStart');
    var dateEndInput = document.getElementById('listing__general-dateEnd');
    var observeDatePicker = new MutationObserver(function observeDatePicker(mutations) {
      var attributeValue;
      mutations.forEach(function toggleUnclickableInfobox(mutation) {
        if (mutation.attributeName === 'class') {
          attributeValue = $(mutation.target).prop(mutation.attributeName);
          if (attributeValue.indexOf('mddtp-picker--inactive') > -1) {
            utils.removeClass(document.getElementById('appwrapper__infobox'), 'unclickable');
          } else {
            utils.addClass(document.getElementById('appwrapper__infobox'), 'unclickable');
          }
        }
      });
    });

    if (dateStartInput !== null) {
      dateStartPicker = new dPick.default({
        type: 'date',
        init: moment(),
        future: moment().add(5, 'years'),
        trigger: dateStartInput,
        orientation: 'PORTRAIT'
      });
      observeDatePicker.observe(document.getElementById('mddtp-picker__date'), {
        attributes: true
      });
      if (bowser.name !== 'Chrome') {
        dateStartInput.removeAttribute('disabled');
        dateStartInput.addEventListener('onOk', function displayPickedate() {
          utils.addClass(this.parentNode, 'is-dirty');
          this.value = dateStartPicker.time.format(format).toString();
          this.disabled = true;
        });
      } else {
        dateStartInput.addEventListener('onOk', function displayPickedate() {
          utils.addClass(this.parentNode, 'is-dirty');
          this.value = dateStartPicker.time.format(format).toString();
        });
      }
      dateStartBtn.addEventListener('click', function showDatePicker() {
        dateStartPicker.toggle();
      });
    }
    if (dateEndInput !== null) {
      if (bowser.name !== 'Chrome') {
        dateEndInput.removeAttribute('disabled');
        dateEndInput.addEventListener('onOk', function displayPickedate() {
          utils.addClass(this.parentNode, 'is-dirty');
          this.value = dateEndPicker.time.format(format).toString();
          this.disabled = true;
        });
      } else {
        dateEndInput.addEventListener('onOk', function displayPickedate() {
          utils.addClass(this.parentNode, 'is-dirty');
          this.value = dateEndPicker.time.format(format).toString();
        });
      }
      dateEndPicker = new dPick.default({
        type: 'date',
        init: moment(),
        future: moment().add(5, 'years'),
        trigger: dateEndInput,
        orientation: 'PORTRAIT'
      });
      observeDatePicker.observe(document.getElementById('mddtp-picker__date'), {
        attributes: true
      });
      dateEndBtn.addEventListener('click', function showDatePicker() {
        dateEndPicker.toggle();
      });
    }
  }
  function setEstateType(type) {
    var types;
    if (lang === 'el') {
      types = {
        Διαμέρισμα: function getApartment() {
          return 'Apartment';
        },
        Μονοκατοικία: function getDetachedHouse() {
          return 'Detached House';
        },
        Μεζονέτα: function getMaisonette() {
          return 'Maisonette';
        },
        Έπαυλη: function getVilla() {
          return 'Villa';
        }
      };
    } else {
      types = {
        Apartment: function getApartment() {
          return 'Διαμέρισμα';
        },
        'Detached House': function getDetachedHouse() {
          return 'Μονοκατοικία';
        },
        Maisonette: function getMaisonette() {
          return 'Μεζονέτα';
        },
        Villa: function getVilla() {
          return 'Έπαυλη';
        }
      };
    }
    return types[type]();
  }
  function assignValidators() {
    var inputs = content.querySelectorAll('input[type=text]');
    [].forEach.call(inputs, function makeParsleyInputs(el) {
      el.addEventListener('blur', function snitize() {
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
  function collectValues(getXY) {
    var map = App.config.commons.map;
    var values = {};
    var filteredValues = {};
    var inputs = content.querySelectorAll('input[type=text]');
    var checkboxes = content.querySelectorAll('input[type=checkbox]');
    values.estate = {};
    values.listing = {};
    if (getXY) {
      values.estate.x = utils.findById(map, 'newEstates')
      .getSource().getFeatures()[0].getGeometry().getCoordinates()[0];
      values.estate.y = utils.findById(map, 'newEstates')
      .getSource().getFeatures()[0].getGeometry().getCoordinates()[1];
    } else {
      values.estate.x = document.getElementById('estate').dataset.originalx;
      values.estate.y = document.getElementById('estate').dataset.originaly;
    }
    [].forEach.call(inputs, function collectFromInputs(el) {
      var name = _.last(_.split(el.getAttribute('id'), '-', 3));
      var value = el.value;
      if (lang === 'el') {
        if (name === 'type' && el.id === 'estate__general_estate-type') {
          values.estate.estatetypeEn = setEstateType(value);
          values.estate.estatetype = value;
        } else if (name === 'type' && el.id === 'listing__idAndType-type') {
          if (value === 'Sale' || value === 'Πώληση') {
            values.listing.sale = true;
            values.listing.rent = false;
          } else {
            values.listing.sale = false;
            values.listing.rent = true;
          }
        }
        if (name === 'address') {
          values.estate.streetEn = utils.elToEn(value);
          values.estate.streetEl = value;
        }
      } else {
        if (name === 'type' && el.id === 'estate__general_estate-type') {
          values.estate.estatetypeEn = value;
          values.estate.estatetype = setEstateType(value);
        } else if (name === 'type' && el.id === 'listing__idAndType-type') {
          if (value === 'Sale' || value === 'Πώληση') {
            values.listing.sale = true;
            values.listing.rent = false;
          } else {
            values.listing.sale = false;
            values.listing.rent = true;
          }
        }
        if (name === 'address') {
          values.estate.streetEn = value;
          values.estate.streetEl = utils.elToEn(value);
        }
      }
      if (name === 'addressNumber') {
        values.estate.streetNumber = value;
      }
      if (name === 'price') {
        values.listing.price = value;
      }
      if (name === 'dateStart' || name === 'dateEnd') {
        values.listing[name] = value;
      } else {
        values.estate[name] = value;
      }
    });
    [].forEach.call(checkboxes, function collectFromCheckboxes(el) {
      var name = _.last(_.split(el.getAttribute('id'), '-', 3));
      var value = el.checked;
      if (name !== 'pets') {
        values.estate[name] = value;
      } else {
        values.listing[name] = value;
      }
    });
    filteredValues.estate = _.omit(values.estate, ['address', 'addressNumber', 'type', 'toggle']);
    filteredValues.listing = values.listing;
    return filteredValues;
  }
  function ajaxEstateAndListing(data) {
    console.log(data);
    data.estate.adminId = window.id;
    console.log(data.estate);
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/property',
        type: 'POST',
        data: data.estate
      })
      )
    .then(function resolve(estatedata) {
      var gid = estatedata.gid;
      var uploadOptions = {
        cloud_name: 'firvain',
        upload_preset: 'testupload',
        folder: gid,
        client_allowed_formats: 'jpg',
        theme: 'minimal',
        tags: gid
      };
      cloudinary.openUploadWidget(uploadOptions, function upload(error, result) {
        console.log(error, result);
      });
      return gid;
    })
    .then(function resolve(gid) {
      data.listing.gid = gid;
      return $.ajax({
        url: 'http://127.0.0.1:3000/api/listing',
        type: 'POST',
        data: data.listing
      });
    })
    .finally(function closeInsert() {
      clearContent();
      utils.addClass(content, 'visuallyhidden');
      body.dataset.active = 'info';
      info.init();
    })
    .catch(function error(e) {
      console.log(e);
    });
  }
  function ajaxListing(data) {
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/listing',
        type: 'POST',
        data: _.merge({ gid: data.gid }, data.listing)
      })
      )
    .then(function resolve(result) {
      console.log(result);
    })
    .finally(function closeInsert() {
      clearContent();
      utils.addClass(content, 'visuallyhidden');
      body.dataset.active = 'info';
      info.init();
    })
    .catch(function error(e) {
      console.log(e);
    });
  }
  function renderDustListing() {
    dustBluebird.renderAsync('insertListing', _.cloneDeep(App.config.commons.trans))
    .then(function resolve(data) {
      var agree = document.getElementById('confirmBtns__agree');
      var disagree = document.getElementById('confirmBtns__disagree');
      $('#estate').after(data);
      getmdlSelect.init('.getmdl-select');
      utils.removeClass(document.getElementById('confirmBtns'), 'visuallyhidden');
      assignValidators();
      datePicker();
      disagree.addEventListener('click', function insertAgree(e) {
        e.preventDefault();
        e.stopPropagation();
        clearContent();
        content.innerHTML = '';
        utils.addClass(content, 'visuallyhidden');
        body.dataset.active = info;
        info.init();
      });
      agree.addEventListener('click', function insertContinue(e) {
        var ajaxData;
        e.preventDefault();
        e.stopPropagation();
        if (checkEmpty() !== true) {
          ajaxData = collectValues(false);
          ajaxData.gid = document.getElementById('estate__info-gid').value;
          ajaxListing(ajaxData);
        } else {
          invalidate();
        }
      });
    })
    .catch(function error(e) {
      console.log(e);
    });
  }
  function renderDustEsateAndListing() {
    var map = App.config.commons.map;
    var draw = getInteraction('newEstate');
    var renderData = _.cloneDeep(App.config.commons.trans);
    dustBluebird.renderAsync('insert', renderData)
    .then(function resolve(data) {
      clearContent();
      content.innerHTML = data;
      utils.removeClass(content, 'visuallyhidden');
      getmdlSelect.init('.getmdl-select');
    })
    .then(function resolve(data) {
      var agree = document.getElementById('confirmBtns__agree');
      var disagree = document.getElementById('confirmBtns__disagree');
      var listing = document.getElementById('listing');
      assignValidators();
      datePicker();
      disagree.addEventListener('click', function insertAgree(e) {
        e.preventDefault();
        e.stopPropagation();
        clearContent();
        // content.innerHTML = data;
        utils.addClass(content, 'visuallyhidden');
        body.dataset.active = info;
        draw.setActive(false);
        utils.findById(map, 'newEstates').getSource().clear();
        info.init();
      });
      agree.addEventListener('click', function insertContinue(e) {
        e.preventDefault();
        e.stopPropagation();
        utils.removeClass(listing, 'visuallyhidden');
        this.innerHTML = 'Agree';
        e.target.removeEventListener(e.type, insertContinue);
        this.addEventListener('click', function insertAgree(evt) {
          var ajaxData;
          evt.preventDefault();
          evt.stopPropagation();
          // e.target.removeEventListener(e.type, insertAgree);
          if (checkEmpty() !== true) {
            ajaxData = collectValues(true);
            ajaxEstateAndListing(ajaxData);
          } else {
            invalidate();
          }
        });
      });
    })
    .catch(function error(e) {
      console.log(e);
    });
  }

  function createDrawInteraction() {
    var map = App.config.commons.map;
    var draw = new ol.interaction.Draw({
      features: drawnCollection,
      source: utils.findById(map, 'newEstates').getSource(),
      type: 'Point'
    });
    draw.set('id', 'newEstate');
    draw.setActive(false);
    map.addInteraction(draw);
  }
  function checkEstate() {
    if (content.innerHTML === 'undefined' || content.innerHTML === '') {
      return 0; // no estate or listing
    } else if (content.innerHTML !== 'undefined' && document.getElementById('listing') !== null) {
      return 1;  // there is a listing
    }
    return 2; // there is no listing
  }

  function insert() {
    var map = App.config.commons.map;
    var draw = getInteraction('newEstate');
    var newEstates = utils.findById(map, 'newEstates');
    info.disable();
    console.log(checkEstate());
    if (checkEstate() === 0) {
      document.getElementById('activeModule').innerHTML = 'Add Estate And Listing';
      draw.setActive(true);
      utils.findById(map, 'newEstates').setVisible(true);
      drawnCollection.on('change:length', function keepOnlyOneEstate() {
        if (this.getLength() > 0) {
          draw.setActive(false);
          newEstates.getSource().clear();
        }
      });
      draw.on('drawend', renderDustEsateAndListing);
    } else if (checkEstate() === 2) {
      document.getElementById('activeModule').innerHTML = 'Add Listing';
      draw.setActive(false);
      renderDustListing();
    } else {
      draw.setActive(false);
      document.getElementById('activeModule').innerHTML = 'Information';
      info.init();
    }
  }

  function init() {
    if (_.isEmpty(getInteraction('newEstate'))) {
      createDrawInteraction();
    }
    insert();
  }
  return {
    init: init
  };
}(window, document, Promise, jQuery, App, mdDateTimePicker, moment, dialogPolyfill, cloudinary, bowser));

var userMap = (function userMap(window, document, Promise, $, App) {
  'use strict';
  var context = 'admin';
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
      var moduleObserver;
      App.config.modules.info.init();
      moduleObserver = new MutationObserver(function moduleObserverChooser(mutations) {
        mutations.forEach(function foerEachMutation(mutation) {
          if (typeof mutation.target.dataset !== 'undefined') {
            if (mutation.target.dataset.active === 'insert') {
              App.config.modules.insert.init();
            } else if (mutation.target.dataset.active === 'delete') {
              App.config.modules.delete.init();
            } else if (mutation.target.dataset.active === 'edit') {
              App.config.modules.edit.init();
            }
          }
        });
      });
      moduleObserver.observe(document.querySelector('body'), {
        attributes: true
      });
    })
    .catch(function error(e) {
      console.log(e);
    });
  }
  return {
    init: init
  };
}(window, document, Promise, jQuery, App));

userMap.init();

$(function Dready() {
  var utils = App.utils;
  var addButton = document.getElementById('insert');
  var deleteButton = document.getElementById('delete');
  var editButton = document.querySelector('#edit');
  $('#logout').click(function logout() {
    location.href = '/logout';
  });
  document.getElementById('enter-fullscreen').addEventListener('click',
    function addClickEventToEnterFullsreen() {
      var elem = document.body;
      utils.requestFullScreen(elem);
      utils.removeClass(document.getElementById('exit-fullscreen').parentNode, 'visuallyhidden');
      utils.addClass(this.parentNode, 'visuallyhidden');
    }
  );
  document.getElementById('exit-fullscreen').addEventListener('click',
    function addClickEventToExitFullsreen() {
      var elem = document;
      utils.exitFullsreen(elem);
      utils.removeClass(document.getElementById('enter-fullscreen').parentNode, 'visuallyhidden');
      utils.addClass(this.parentNode, 'visuallyhidden');
    }
  );
  addButton.addEventListener('click', function activateInsertModule() {
    var body = document.querySelector('body');
    body.dataset.active = 'insert';
  });
  deleteButton.addEventListener('click', function activateDeleteModule() {
    var body = document.querySelector('body');
    body.dataset.active = 'delete';
  });
  editButton.addEventListener('click', function activateEditModule() {
    var body = document.querySelector('body');
    body.dataset.active = 'edit';
  });
  // console.log(bowser);
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN1c3RvbUV2ZW50LmpzIiwic2Nyb2xsSW50b1ZpZXdJZk5lZWRlZC5qcyIsImdsb2JhbHMuanMiLCJ1dGlscy5qcyIsIm9sMy1tYXAuanMiLCJpbmZvLmpzIiwiZWRpdC5qcyIsImRlbGV0ZS5qcyIsImluc2VydC5qcyIsImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFkbWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgaWYgKCB0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSBcImZ1bmN0aW9uXCIgKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gIGZ1bmN0aW9uIEN1c3RvbUV2ZW50ICggZXZlbnQsIHBhcmFtcyApIHtcclxuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7IGJ1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiB1bmRlZmluZWQgfTtcclxuICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCggJ0N1c3RvbUV2ZW50JyApO1xyXG4gICAgZXZ0LmluaXRDdXN0b21FdmVudCggZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCApO1xyXG4gICAgcmV0dXJuIGV2dDtcclxuICAgfVxyXG5cclxuICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xyXG5cclxuICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcclxufSkoKTtcclxuIiwiICAoZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCFFbGVtZW50LnByb3RvdHlwZS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKSB7XHJcbiAgICAgIEVsZW1lbnQucHJvdG90eXBlLnNjcm9sbEludG9WaWV3SWZOZWVkZWQgPSBmdW5jdGlvbiAoY2VudGVySWZOZWVkZWQpIHtcclxuICAgICAgICBjZW50ZXJJZk5lZWRlZCA9IGFyZ3VtZW50cy5sZW5ndGggPT09IDAgPyB0cnVlIDogISFjZW50ZXJJZk5lZWRlZDtcclxuXHJcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZSxcclxuICAgICAgICBwYXJlbnRDb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUocGFyZW50LCBudWxsKSxcclxuICAgICAgICBwYXJlbnRCb3JkZXJUb3BXaWR0aCA9IHBhcnNlSW50KHBhcmVudENvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnYm9yZGVyLXRvcC13aWR0aCcpKSxcclxuICAgICAgICBwYXJlbnRCb3JkZXJMZWZ0V2lkdGggPSBwYXJzZUludChwYXJlbnRDb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2JvcmRlci1sZWZ0LXdpZHRoJykpLFxyXG4gICAgICAgIG92ZXJUb3AgPSB0aGlzLm9mZnNldFRvcCAtIHBhcmVudC5vZmZzZXRUb3AgPCBwYXJlbnQuc2Nyb2xsVG9wLFxyXG4gICAgICAgIG92ZXJCb3R0b20gPSAodGhpcy5vZmZzZXRUb3AgLSBwYXJlbnQub2Zmc2V0VG9wICsgdGhpcy5jbGllbnRIZWlnaHQgLSBwYXJlbnRCb3JkZXJUb3BXaWR0aCkgPiAocGFyZW50LnNjcm9sbFRvcCArIHBhcmVudC5jbGllbnRIZWlnaHQpLFxyXG4gICAgICAgIG92ZXJMZWZ0ID0gdGhpcy5vZmZzZXRMZWZ0IC0gcGFyZW50Lm9mZnNldExlZnQgPCBwYXJlbnQuc2Nyb2xsTGVmdCxcclxuICAgICAgICBvdmVyUmlnaHQgPSAodGhpcy5vZmZzZXRMZWZ0IC0gcGFyZW50Lm9mZnNldExlZnQgKyB0aGlzLmNsaWVudFdpZHRoIC0gcGFyZW50Qm9yZGVyTGVmdFdpZHRoKSA+IChwYXJlbnQuc2Nyb2xsTGVmdCArIHBhcmVudC5jbGllbnRXaWR0aCksXHJcbiAgICAgICAgYWxpZ25XaXRoVG9wID0gb3ZlclRvcCAmJiAhb3ZlckJvdHRvbTtcclxuXHJcbiAgICAgICAgaWYgKChvdmVyVG9wIHx8IG92ZXJCb3R0b20pICYmIGNlbnRlcklmTmVlZGVkKSB7XHJcbiAgICAgICAgICBwYXJlbnQuc2Nyb2xsVG9wID0gdGhpcy5vZmZzZXRUb3AgLSBwYXJlbnQub2Zmc2V0VG9wIC0gcGFyZW50LmNsaWVudEhlaWdodCAvIDIgLSBwYXJlbnRCb3JkZXJUb3BXaWR0aCArIHRoaXMuY2xpZW50SGVpZ2h0IC8gMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgob3ZlckxlZnQgfHwgb3ZlclJpZ2h0KSAmJiBjZW50ZXJJZk5lZWRlZCkge1xyXG4gICAgICAgICAgcGFyZW50LnNjcm9sbExlZnQgPSB0aGlzLm9mZnNldExlZnQgLSBwYXJlbnQub2Zmc2V0TGVmdCAtIHBhcmVudC5jbGllbnRXaWR0aCAvIDIgLSBwYXJlbnRCb3JkZXJMZWZ0V2lkdGggKyB0aGlzLmNsaWVudFdpZHRoIC8gMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgob3ZlclRvcCB8fCBvdmVyQm90dG9tIHx8IG92ZXJMZWZ0IHx8IG92ZXJSaWdodCkgJiYgIWNlbnRlcklmTmVlZGVkKSB7XHJcbiAgICAgICAgICB0aGlzLnNjcm9sbEludG9WaWV3KGFsaWduV2l0aFRvcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0pKCk7XHJcbiIsIndpbmRvdy5BcHAgfHwgKHdpbmRvdy5BcHAgPSB7fSk7XHJcbndpbmRvdy5BcHAuY29uZmlnID0ge1xyXG4gIHByb21pc2VzOiB7XHJcbiAgICBkdXN0Qmx1ZWJpcmQ6IFByb21pc2UucHJvbWlzaWZ5QWxsKGR1c3QpLFxyXG4gICAgY2xvdWRpbmFyeUJpcmQ6IFByb21pc2UucHJvbWlzaWZ5QWxsKCQuY2xvdWRpbmFyeSlcclxuICB9LFxyXG4gIGNvbW1vbnM6IHtcclxuICAgIG1hcDoge30sXHJcbiAgICB0cmFuczoge31cclxuICB9LFxyXG4gIGNhY2hlOiB7XHJcbiAgICBhY3RpdmVFc3RhdGU6IHt9LFxyXG4gICAgYWN0aXZlRXN0YXRlTGlzdGluZzoge31cclxuICB9LFxyXG4gIG1vZHVsZXM6IHtcclxuICAgIG1hcDoge30sXHJcbiAgICBpbmZvOiB7fSxcclxuICAgIGVkaXQ6IHt9LFxyXG4gICAgZGVsZXRlOiB7fSxcclxuICAgIGluc2VydDoge30sXHJcbiAgICBmaWx0ZXJzOiB7fVxyXG4gIH1cclxufTtcclxud2luZG93LkFwcC51dGlscyA9IHt9O1xyXG4vLyB2YXIgdHJhbnM7XHJcbi8vIHZhciBjbG91ZGluYXJ5QmlyZCA9IFByb21pc2UucHJvbWlzaWZ5QWxsKCQuY2xvdWRpbmFyeSk7XHJcbi8vIHZhciBhY3RpdmVFc3RhdGU7XHJcbi8vIHZhciBhY3RpdmVFc3RhdGVMaXN0aW5nO1xyXG4kLmNsb3VkaW5hcnkuY29uZmlnKHsgY2xvdWRfbmFtZTogJ2ZpcnZhaW4nLCBhcGlfa2V5OiAnMzc1MTM4OTMyNjg5NTkxJyB9KTtcclxuIiwiLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246IFtcImVycm9yXCIsIHsgXCJwcm9wc1wiOiBmYWxzZSB9XSovXHJcbkFwcC51dGlscyA9IHtcclxuICBmaW5kQnlJZDogZnVuY3Rpb24gZmluZEJ5SWQobWFwLCBpZCkge1xyXG4gICAgdmFyIGxheWVycyA9IG1hcC5nZXRMYXllcnMoKTtcclxuICAgIHZhciBsZW5ndGggPSBsYXllcnMuZ2V0TGVuZ3RoKCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChpZCA9PT0gbGF5ZXJzLml0ZW0oaSkuZ2V0KCdpZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGxheWVycy5pdGVtKGkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9LFxyXG4gIGZpbmRCeU5hbWU6IGZ1bmN0aW9uIGZpbmRCeU5hbWUobWFwLCBuYW1lKSB7XHJcbiAgICB2YXIgbGF5ZXJzID0gbWFwLmdldExheWVycygpO1xyXG4gICAgdmFyIGxlbmd0aCA9IGxheWVycy5nZXRMZW5ndGgoKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKG5hbWUgPT09IGxheWVycy5pdGVtKGkpLmdldCgnbmFtZScpKSB7XHJcbiAgICAgICAgcmV0dXJuIGxheWVycy5pdGVtKGkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9LFxyXG4gIHByZXZlbnREb3RBbmRTcGFjZTogZnVuY3Rpb24gcHJldmVudERvdEFuZFNwYWNlKGUpIHtcclxuICAgIHZhciBrZXkgPSBlLmNoYXJDb2RlID8gZS5jaGFyQ29kZSA6IGUua2V5Q29kZTtcclxuICAgIHRoaXMuaW5uZXJIVE1MID0ga2V5O1xyXG4gICAgaWYgKGtleSA9PT0gNDYgfHwga2V5ID09PSAzMikge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9LFxyXG4gIGdlb21ldHJ5RnVuY3Rpb246IGZ1bmN0aW9uIGdlb21ldHJ5RnVuY3Rpb24oY29vcmRpbmF0ZXMsIGdlb21ldHJ5KSB7XHJcbiAgICB2YXIgZ2VvbSA9IGdlb21ldHJ5O1xyXG4gICAgdmFyIHN0YXJ0O1xyXG4gICAgdmFyIGVuZDtcclxuICAgIGlmICghZ2VvbSkge1xyXG4gICAgICBnZW9tID0gbmV3IG9sLmdlb20uUG9seWdvbihudWxsKTtcclxuICAgIH1cclxuICAgIHN0YXJ0ID0gY29vcmRpbmF0ZXNbMF07XHJcbiAgICBlbmQgPSBjb29yZGluYXRlc1sxXTtcclxuICAgIGdlb20uc2V0Q29vcmRpbmF0ZXMoW1xyXG4gICAgICBbc3RhcnQsIFtzdGFydFswXSwgZW5kWzFdXSwgZW5kLCBbZW5kWzBdLCBzdGFydFsxXV0sIHN0YXJ0XVxyXG4gICAgXSk7XHJcbiAgICByZXR1cm4gZ2VvbTtcclxuICB9LFxyXG4gIGhhc0NsYXNzOiBmdW5jdGlvbiBoYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XHJcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XHJcbiAgICAgIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgUmVnRXhwKCcoXnwgKScgKyBjbGFzc05hbWUgKyAnKCB8JCknLCAnZ2knKS50ZXN0KGVsLmNsYXNzTmFtZSk7XHJcbiAgfSxcclxuICByZW1vdmVDbGFzczogZnVuY3Rpb24gcmVtb3ZlQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xyXG4gICAgdmFyIGVsZW1lbnQgPSBlbDtcclxuICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xyXG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxcYiknICsgY2xhc3NOYW1lLnNwbGl0KCcgJykuam9pbignfCcpICsgJyhcXFxcYnwkKScsICdnaScpLCAnICcpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWRkQ2xhc3M6IGZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsLCBjbGFzc05hbWUpIHtcclxuICAgIHZhciBlbGVtZW50ID0gZWw7XHJcbiAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcclxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlbGVtZW50LmNsYXNzTmFtZSArPSAnICcgKyBjbGFzc05hbWU7XHJcbiAgICB9XHJcbiAgfSxcclxuICB0b2dnbGVDbGFzczogZnVuY3Rpb24gdG9nZ2xlQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xyXG4gICAgdmFyIGNsYXNzZXM7XHJcbiAgICB2YXIgZXhpc3RpbmdJbmRleDtcclxuICAgIHZhciBlbGVtZW50ID0gZWw7XHJcbiAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcclxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjbGFzc2VzID0gZWxlbWVudC5jbGFzc05hbWUuc3BsaXQoJyAnKTtcclxuICAgICAgZXhpc3RpbmdJbmRleCA9IGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpO1xyXG5cclxuICAgICAgaWYgKGV4aXN0aW5nSW5kZXggPj0gMCkge1xyXG4gICAgICAgIGNsYXNzZXMuc3BsaWNlKGV4aXN0aW5nSW5kZXgsIDEpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChjbGFzc05hbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKCcgJyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICByZXF1ZXN0RnVsbFNjcmVlbjogZnVuY3Rpb24gcmVxdWVzdEZ1bGxTY3JlZW4oZWxlbWVudCkge1xyXG4gICAgLy8gU3VwcG9ydHMgbW9zdCBicm93c2VycyBhbmQgdGhlaXIgdmVyc2lvbnMuXHJcbiAgICB2YXIgcmVxdWVzdE1ldGhvZCA9IGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4gfHwgZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiB8fCBlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuIHx8IGVsZW1lbnQubXNSZXF1ZXN0RnVsbFNjcmVlbjtcclxuICAgIHZhciB3c2NyaXB0O1xyXG4gICAgaWYgKHJlcXVlc3RNZXRob2QpIHsgLy8gTmF0aXZlIGZ1bGwgc2NyZWVuLlxyXG4gICAgICByZXF1ZXN0TWV0aG9kLmNhbGwoZWxlbWVudCk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cuQWN0aXZlWE9iamVjdCAhPT0gJ3VuZGVmaW5lZCcpIHsgLy8gT2xkZXIgSUUuXHJcbiAgICAgIHdzY3JpcHQgPSBuZXcgQWN0aXZlWE9iamVjdCgnV1NjcmlwdC5TaGVsbCcpO1xyXG4gICAgICBpZiAod3NjcmlwdCAhPT0gbnVsbCkge1xyXG4gICAgICAgIHdzY3JpcHQuU2VuZEtleXMoJ3tGMTF9Jyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGV4aXRGdWxsc3JlZW46IGZ1bmN0aW9uIGV4aXRGdWxsc3JlZW4oZWxlbWVudCkge1xyXG4gICAgdmFyIHJlcXVlc3RNZXRob2QgPSBlbGVtZW50LmV4aXRGdWxsU2NyZWVuIHx8IGVsZW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4gfHwgZWxlbWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuIHx8IGVsZW1lbnQubXNFeGl0RnVsbHNjcmVlbjtcclxuICAgIHZhciB3c2NyaXB0O1xyXG4gICAgaWYgKHJlcXVlc3RNZXRob2QpIHsgLy8gTmF0aXZlIGZ1bGwgc2NyZWVuLlxyXG4gICAgICByZXF1ZXN0TWV0aG9kLmNhbGwoZWxlbWVudCk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cuQWN0aXZlWE9iamVjdCAhPT0gJ3VuZGVmaW5lZCcpIHsgLy8gT2xkZXIgSUUuXHJcbiAgICAgIHdzY3JpcHQgPSBuZXcgQWN0aXZlWE9iamVjdCgnV1NjcmlwdC5TaGVsbCcpO1xyXG4gICAgICBpZiAod3NjcmlwdCAhPT0gbnVsbCkge1xyXG4gICAgICAgIHdzY3JpcHQuU2VuZEtleXMoJ3tFc2N9Jyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGVsVG9FbjogZnVuY3Rpb24gZWxUb0VuKHN0cmluZykge1xyXG4gICAgdmFyIG9yaWdpbmFsU3RyaW5nID0gc3RyaW5nO1xyXG4gICAgdmFyIG5ld1N0cmluZztcclxuICAgIHZhciByZXBsYWNlID0gbmV3IEFycmF5KCfOsScsICfOrCcsICfOhicsICfOkScsICfOsicsICfOkicsICfOsycsICfOkycsICfOtCcsICfOlCcsICfOtScsICfOrScsICfOlScsICfOiCcsICfOticsICfOlicsICfOtycsICfOricsICfOlycsICfOuCcsICfOmCcsICfOuScsICfOrycsICfPiicsICfOkCcsICfOmScsICfOiicsICfOuicsICfOmicsICfOuycsICfOmycsICfOvCcsICfOnCcsICfOvScsICfOnScsICfOvicsICfOnicsICfOvycsICfPjCcsICfOnycsICfOjCcsICfPgCcsICfOoCcsICfPgScsICfOoScsICfPgycsICfPgicsICfOoycsICfPhCcsICfOpCcsICfPhScsICfPjScsICfOpScsICfOjicsICfPhicsICfOpicsICfPhycsICfOpycsICfPiCcsICfOqCcsICfPiScsICfPjicsICfOqScsICfOjycsICcgJywgJ1xcJycsICdcXCcnLCAnLCcpO1xyXG4gICAgdmFyIHJlcGxhY2VfbiA9IG5ldyBBcnJheSgnYScsICdhJywgJ0EnLCAnQScsICd2JywgJ1YnLCAnZycsICdHJywgJ2QnLCAnRCcsICdlJywgJ2UnLCAnRScsICdFJywgJ3onLCAnWicsICdpJywgJ2knLCAnSScsICd0aCcsICdUaCcsICdpJywgJ2knLCAnaScsICdpJywgJ0knLCAnSScsICdrJywgJ0snLCAnbCcsICdMJywgJ20nLCAnTScsICduJywgJ04nLCAneCcsICdYJywgJ28nLCAnbycsICdPJywgJ08nLCAncCcsICdQJywgJ3InLCAnUicsICdzJywgJ3MnLCAnUycsICd0JywgJ1QnLCAndScsICd1JywgJ1knLCAnWScsICdmJywgJ0YnLCAnY2gnLCAnQ2gnLCAncHMnLCAnUHMnLCAnbycsICdvJywgJ08nLCAnTycsICcgJywgJ18nLCAnXycsICdfJyk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXBsYWNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIG9yaWdpbmFsU3RyaW5nID0gb3JpZ2luYWxTdHJpbmcucmVwbGFjZShuZXcgUmVnRXhwKHJlcGxhY2VbaV0sICdnJyksIHJlcGxhY2VfbltpXSk7XHJcbiAgICB9XHJcbiAgICBuZXdTdHJpbmcgPSBvcmlnaW5hbFN0cmluZztcclxuICAgIHJldHVybiBuZXdTdHJpbmc7XHJcbiAgfSxcclxuICBoYW5kbGVEYXRlOiBmdW5jdGlvbiBoYW5kbGVEYXRlKHN0ciwgbGFuZykge1xyXG4gICAgdmFyIHNwbGl0O1xyXG4gICAgdmFyIG5ld0RhdGUgPSBbXTtcclxuICAgIGlmICh0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyAmJiBsYW5nICE9PSAnZWwnKSB7XHJcbiAgICAgIHNwbGl0ID0gXy5zcGxpdChzdHIsICctJywgMyk7XHJcbiAgICAgIG5ld0RhdGUgPSBbc3BsaXRbMV0sIHNwbGl0WzBdLCBzcGxpdFsyXV07XHJcbiAgICAgIHJldHVybiBfLmpvaW4obmV3RGF0ZSwgJy0nKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdHI7XHJcbiAgfSxcclxuICBzYW5pdGl6ZTogZnVuY3Rpb24gc2FuaXRpemUoZWwpIHtcclxuICAgIHZhciBzYW5pdGl6ZWRTdHI7XHJcbiAgICB2YXIgc3RyID0gZWwudmFsdWU7XHJcbiAgICBzYW5pdGl6ZWRTdHIgPSBzdHIucmVwbGFjZSgvW15hLXowLTlBLVpBLXrOkS3Oqc6xLc+Jzq/Pis6Qz4zOrM6tz43Pi86wzq7Pjl0vZ2ksICcnKTtcclxuICAgIGVsLnZhbHVlID0gc2FuaXRpemVkU3RyO1xyXG4gICAgY29uc29sZS5sb2coZWwpO1xyXG4gICAgY29uc29sZS5sb2coZWwudmFsdWUpO1xyXG4gICAgY29uc29sZS5sb2coc2FuaXRpemVkU3RyKTtcclxuICB9XHJcbiAgLy8gem9vbVRvR2lkOiBmdW5jdGlvbiB6b29tVG9HaWQobWFwLCBnaWQpIHtcclxuICAvLyAgIHZhciBjb29yZGluYXRlcyA9IHV0aWxzLmZpbmRCeUlkKG1hcCwgJ2ZpbHRlcmVkRXN0YXRlcycpLmdldFNvdXJjZSgpLmdldEZlYXR1cmVCeUlkKGdpZClcclxuICAvLyAgIC5nZXRHZW9tZXRyeSgpXHJcbiAgLy8gICAuZ2V0Q29vcmRpbmF0ZXMoKTtcclxuICAvLyAgIG1hcC5nZXRWaWV3KCkuc2V0Q2VudGVyKGNvb3JkaW5hdGVzKTtcclxuICAvLyB9XHJcbn07XHJcbiIsIkFwcC5jb25maWcubW9kdWxlcy5tYXAgPSAoZnVuY3Rpb24gb2wzTWFwKHdpbmRvdywgZG9jdW1lbnQsIFByb21pc2UsIG9sLCBBcHApIHtcclxuICAndXNlIHN0cmljdCc7XHJcbiAgdmFyIGNlbnRlciA9IFszNjc3Mzg1LCA0MTIwOTQ5XTtcclxuICB2YXIgZXh0ZW50ID0gWzM2NTI3NzIsIDQxMTI4MDgsIDM3MDAwMDAsIDQxMzI3OTddO1xyXG4gIHZhciBnZW9KU09ORm9ybWF0ID0gbmV3IG9sLmZvcm1hdC5HZW9KU09OKHtcclxuICAgIGRlZmF1bHREYXRhUHJvamVjdGlvbjogJ0VQU0c6NDMyNidcclxuICB9KTtcclxuXHJcbiAgdmFyIG1hcFN0eWxlcyA9IHtcclxuICAgIGljb25UeXBlOiBmdW5jdGlvbiBnZXRJY29uVHlwZShlc3RhdGVUeXBlKSB7XHJcbiAgICAgIHZhciBpY29uVHlwZSA9IHtcclxuICAgICAgICBBcGFydG1lbnQ6IGZ1bmN0aW9uIGdldEFwYXJ0bWVudEljb24oKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ2FwYXJ0bWVudCc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBTdG9yZTogZnVuY3Rpb24gZ2V0U3RvcmVJY29uKCkge1xyXG4gICAgICAgICAgcmV0dXJuICdzdG9yZSc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAnRGV0YWNoZWQgSG91c2UnOiBmdW5jdGlvbiBnZXREZXRhY2hlZEhvdXNlSWNvbigpIHtcclxuICAgICAgICAgIHJldHVybiAnZGV0YWNoZWQnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgTWFpc29uZXR0ZTogZnVuY3Rpb24gZ2V0TWFpc29uZXR0ZUljb24oKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ21haXNvbmV0dGUnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVmlsbGE6IGZ1bmN0aW9uIGdldFZpbGxhSW9uKCkge1xyXG4gICAgICAgICAgcmV0dXJuICd2aWxsYSc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gKGljb25UeXBlW2VzdGF0ZVR5cGVdKSgpO1xyXG4gICAgfSxcclxuICAgIGVzdGF0ZXM6IGZ1bmN0aW9uIGVzdGF0ZXMoZmVhdHVyZSkge1xyXG4gICAgICB2YXIgc3JjID0gJy4vaW1hZ2VzL3BpbnMvbm9uZS8nICtcclxuICAgICAgbWFwU3R5bGVzLmljb25UeXBlKGZlYXR1cmUuZ2V0KCdlc3RhdGV0eXBlX2VuJykpICsgJy00OC5wbmcnO1xyXG4gICAgICByZXR1cm4gbmV3IG9sLnN0eWxlLlN0eWxlKHtcclxuICAgICAgICBnZW9tZXRyeTogZmVhdHVyZS5nZXRHZW9tZXRyeSgpLFxyXG4gICAgICAgIGltYWdlOiBuZXcgb2wuc3R5bGUuSWNvbigoe1xyXG4gICAgICAgICAgc3JjOiBzcmMsXHJcbiAgICAgICAgICBhbmNob3JPcmlnaW46ICdib3R0b20tbGVmdCcsXHJcbiAgICAgICAgICBhbmNob3I6IFswLjUsIDBdLFxyXG4gICAgICAgICAgc2NhbGU6IDFcclxuICAgICAgICB9KSlcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIG1hcFNvdXJjZXMgPSB7XHJcbiAgICBiaW5nOiBmdW5jdGlvbiBiaW5nKCkge1xyXG4gICAgICByZXR1cm4gbmV3IG9sLnNvdXJjZS5CaW5nTWFwcyh7XHJcbiAgICAgICAga2V5OiAnQWsyR3E4VlVmSUNzUHB1ZjdMUkFOWG1YdDJzSFdtU0xQaG9obVZMRnRGSUV3WWpzXzVNQ3lBaEFGd1JTVnBMaicsXHJcbiAgICAgICAgaW1hZ2VyeVNldDogJ0FlcmlhbFdpdGhMYWJlbHMnXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIG1hcEJveDogZnVuY3Rpb24gbWFwQm94KCkge1xyXG4gICAgICByZXR1cm4gbmV3IG9sLnNvdXJjZS5YWVooe1xyXG4gICAgICAgIGF0dHJpYnV0aW9uczogW25ldyBvbC5BdHRyaWJ1dGlvbih7XHJcbiAgICAgICAgICBodG1sOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm1hcGJveC5jb20vYWJvdXQvbWFwcy9cIiB0YXJnZXQ9XCJfYmxhbmtcIj4mY29weTsgTWFwYm94ICZjb3B5OyBPcGVuU3RyZWV0TWFwPC9hPidcclxuICAgICAgICB9KV0sXHJcbiAgICAgICAgdXJsOiAnaHR0cHM6Ly9hcGkubWFwYm94LmNvbS92NC9tYXBib3guc3RyZWV0cy97en0ve3h9L3t5fS5wbmc/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pWm1seWRtRnBiaUlzSW1FaU9pSmxPV1l5WVRNME5UaGlOV00wWWpKak9ESmpOREU0T0RRek56QTJNR1F5TmlKOS4tTlZETzI3SHp0LXdfblFvc1VQZkxBJ1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBlc3RhdGVzOiBmdW5jdGlvbiBlc3RhdGVzKCkge1xyXG4gICAgICByZXR1cm4gbmV3IG9sLnNvdXJjZS5WZWN0b3Ioe1xyXG4gICAgICAgIGZvcm1hdDogZ2VvSlNPTkZvcm1hdCxcclxuICAgICAgICBsb2FkZXI6IGZ1bmN0aW9uIHByb3BlcnR5TG9hZGVyKCkge1xyXG4gICAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAvYXBpL3Byb3BlcnR5L2FsbC8nICsgaWQ7XHJcbiAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoXHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24gcmVzb2x2ZShkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBmZWF0dXJlcyA9IGdlb0pTT05Gb3JtYXQucmVhZEZlYXR1cmVzKGRhdGEsIHtcclxuICAgICAgICAgICAgICBmZWF0dXJlUHJvamVjdGlvbjogJ0VQU0c6Mzg1NydcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNlbGYuYWRkRmVhdHVyZXMoZmVhdHVyZXMpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIHJlc29sdmUoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZ2V0RmVhdHVyZXMoKS5mb3JFYWNoKGZ1bmN0aW9uIGFkZElkcyhmZWF0dXJlKSB7XHJcbiAgICAgICAgICAgICAgZmVhdHVyZS5zZXRJZChmZWF0dXJlLmdldFByb3BlcnRpZXMoKS5naWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gZXJyb3IoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgaWYgKGUuc3RhdHVzID09PSA0MDQpIHtcclxuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ1NvcnJ5LCB3ZSBjYW5ub3QgZmluZCBhbnkgcHJvcGVydGllcyEnKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChlLnN0YXR1cyA9PT0gNTAzKSB7XHJcbiAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdTZXJ2aWNlIFVuYXZhaWxhYmxlIScpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcignSW50ZXJuYWwgU2VydmVyIEVycm9yISBQbGVhc2UgcmVsb2FkIHBhZ2Ugb3IgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIG1hcExheWVycyA9IHtcclxuICAgIGJpbmc6IGZ1bmN0aW9uIGJpbmcodHJhbnMpIHtcclxuICAgICAgcmV0dXJuIG5ldyBvbC5sYXllci5UaWxlKHtcclxuICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgIHNvdXJjZTogbWFwU291cmNlcy5iaW5nKCksXHJcbiAgICAgICAgbWF4Wm9vbTogMTksXHJcbiAgICAgICAgY3Jvc3NPcmlnaW46ICdhbm9ueW1vdXMnLFxyXG4gICAgICAgIHByZWxvYWQ6IEluZmluaXR5LFxyXG4gICAgICAgIGlkOiAnYmluZycsXHJcbiAgICAgICAgbmFtZTogdHJhbnMubGF5ZXJzLmJpbmdcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgbWFwQm94OiBmdW5jdGlvbiBtYXBCb3godHJhbnMpIHtcclxuICAgICAgcmV0dXJuIG5ldyBvbC5sYXllci5UaWxlKHtcclxuICAgICAgICBzb3VyY2U6IG1hcFNvdXJjZXMubWFwQm94KCksXHJcbiAgICAgICAgaWQ6ICdtYXBib3gnLFxyXG4gICAgICAgIG5hbWU6IHRyYW5zLmxheWVycy5tYXBCb3hcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZXN0YXRlczogZnVuY3Rpb24gZXN0YXRlcygpIHtcclxuICAgICAgcmV0dXJuIG5ldyBvbC5sYXllci5WZWN0b3Ioe1xyXG4gICAgICAgIHNvdXJjZTogbWFwU291cmNlcy5lc3RhdGVzKCksXHJcbiAgICAgICAgaWQ6ICdlc3RhdGVzJyxcclxuICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgIHN0eWxlOiBtYXBTdHlsZXMuZXN0YXRlc1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBuZXdFc3RhdGVzOiBmdW5jdGlvbiBuZXdFc3RhdGVzKHRyYW5zKSB7XHJcbiAgICAgIHJldHVybiBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcclxuICAgICAgICBzb3VyY2U6IG5ldyBvbC5zb3VyY2UuVmVjdG9yKCksXHJcbiAgICAgICAgaWQ6ICduZXdFc3RhdGVzJyxcclxuICAgICAgICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG4gIHZhciBpbml0aWFsaXplID0gZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcclxuICAgIHZhciB0cmFucyA9IEFwcC5jb25maWcuY29tbW9ucy50cmFucztcclxuICAgIHZhciBsYXllcnMgPSBPYmplY3Qua2V5cyhtYXBMYXllcnMpLm1hcChmdW5jdGlvbiBhZGRNYXBMYXllcnMoa2V5KSB7XHJcbiAgICAgIGlmIChrZXkgIT09ICdiaW5nJykgeyByZXR1cm4gbWFwTGF5ZXJzW2tleV0odHJhbnMpOyB9XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gbmV3IG9sLk1hcCh7XHJcbiAgICAgIHRhcmdldDogJ2FwcHdyYXBwZXJfX21hcCcsXHJcbiAgICAgIGxheWVyczogXy5jb21wYWN0KGxheWVycyksXHJcbiAgICAgIGxvYWRUaWxlc1doaWxlQW5pbWF0aW5nOiB0cnVlLFxyXG4gICAgICBsb2FkVGlsZXNXaGlsZUludGVyYWN0aW5nOiB0cnVlLFxyXG4gICAgICByZW5kZXJlcjogJ2NhbnZhcycsXHJcbiAgICAgIGNvbnRyb2xzOiBvbC5jb250cm9sLmRlZmF1bHRzKHtcclxuICAgICAgICBhdHRyaWJ1dGlvbk9wdGlvbnM6IHtcclxuICAgICAgICAgIGNvbGxhcHNpYmxlOiBmYWxzZSxcclxuICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgICAuZXh0ZW5kKFtcclxuICAgICAgICAgbmV3IG9sLmNvbnRyb2wuU2NhbGVMaW5lKHtcclxuICAgICAgICAgICB1bml0czogJ21ldHJpYydcclxuICAgICAgICAgfSksIG5ldyBvbC5jb250cm9sLk92ZXJ2aWV3TWFwKHtcclxuICAgICAgICAgICBjbGFzc05hbWU6ICdvbC1vdmVydmlld21hcCBvbC1jdXN0b20tb3ZlcnZpZXdtYXAnLFxyXG4gICAgICAgICAgIGNvbGxhcHNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgICAgICAgICBsYXllcnM6IFttYXBMYXllcnMuYmluZyh0cmFucyldXHJcbiAgICAgICAgIH0pLFxyXG4gICAgICAgICBuZXcgb2wuY29udHJvbC5ab29tVG9FeHRlbnQoe1xyXG4gICAgICAgICAgIGV4dGVudDogZXh0ZW50XHJcbiAgICAgICAgIH0pXHJcbiAgICAgICBdKSxcclxuICAgICAgdmlldzogbmV3IG9sLlZpZXcoe1xyXG4gICAgICAgIGNlbnRlcjogY2VudGVyLFxyXG4gICAgICAgIGV4dGVudDogZXh0ZW50LFxyXG4gICAgICAgIHByb2plY3Rpb246ICdFUFNHOjM4NTcnLFxyXG4gICAgICAgIHpvb206IDE0LFxyXG4gICAgICAgIG1heFpvb206IDE5LFxyXG4gICAgICAgIG1pblpvb206IDE0XHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9O1xyXG4gIHJldHVybiB7XHJcbiAgICBpbml0aWFsaXplOiBpbml0aWFsaXplXHJcbiAgfTtcclxufSh3aW5kb3csIGRvY3VtZW50LCBQcm9taXNlLCBvbCwgQXBwKSk7XHJcbiIsIkFwcC5jb25maWcubW9kdWxlcy5pbmZvID0gKGZ1bmN0aW9uIGluZm8od2luZG93LCBkb2N1bWVudCwgUHJvbWlzZSwgJCwgQXBwKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG4gIHZhciBsYW5nID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lmxhbmc7XHJcbiAgdmFyIGVkaXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZWRpdCcpO1xyXG4gIHZhciBkZWxldGVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVsZXRlJyk7XHJcbiAgdmFyIGluZm9Cb3hDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FwcHdyYXBwZXJfX2luZm9ib3gtY29udGVudCcpO1xyXG4gIHZhciBkdXN0Qmx1ZWJpcmQgPSBBcHAuY29uZmlnLnByb21pc2VzLmR1c3RCbHVlYmlyZDtcclxuICB2YXIgdXRpbHMgPSBBcHAudXRpbHM7XHJcbiAgZnVuY3Rpb24gZHVzdEVzdGF0ZUluZm8oZGF0YSkge1xyXG4gICAgZHVzdEJsdWViaXJkLnJlbmRlckFzeW5jKCdlZGl0JywgZGF0YSlcclxuICAgIC50aGVuKGZ1bmN0aW9uIHJlc29sdmVEdXN0KHJlc3VsdCkge1xyXG4gICAgICB1dGlscy5yZW1vdmVDbGFzcyhpbmZvQm94Q29udGVudCwgJ3Zpc3VhbGx5aGlkZGVuJyk7XHJcbiAgICAgIGluZm9Cb3hDb250ZW50LmlubmVySFRNTCA9IHJlc3VsdDtcclxuICAgICAgZ2V0bWRsU2VsZWN0LmluaXQoJy5nZXRtZGwtc2VsZWN0Jyk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGZ1bmN0aW9uIGVycm9yKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gc2VsZWN0RmVhdHVyZShldnQpIHtcclxuICAgIHZhciBtYXAgPSBldnQubWFwO1xyXG4gICAgdmFyIGNvb3JkaW5hdGVzO1xyXG4gICAgdmFyIGVzdGF0ZTtcclxuICAgIHZhciBnaWQ7XHJcbiAgICB2YXIgcmVuZGVyRGF0YSA9IF8uY2xvbmVEZWVwKEFwcC5jb25maWcuY29tbW9ucy50cmFucyk7XHJcbiAgICB2YXIgc3R5bGUgPSBuZXcgb2wuc3R5bGUuU3R5bGUoe1xyXG4gICAgICBpbWFnZTogbmV3IG9sLnN0eWxlLkljb24oKHtcclxuICAgICAgICBzcmM6ICcuL2ltYWdlcy9waW5zL2dlbmVyaWMtNDgucG5nJyxcclxuICAgICAgICBhbmNob3JPcmlnaW46ICdib3R0b20tbGVmdCcsXHJcbiAgICAgICAgYW5jaG9yOiBbMC41LCAwXSxcclxuICAgICAgICBzY2FsZTogMSxcclxuICAgICAgICBjb2xvcjogJ3JnYigyNTUsODIsODIpJ1xyXG4gICAgICB9KSlcclxuICAgIH0pO1xyXG4gICAgLy8gdmFyIGNvb3JkaW5hdGUgPSBldnQuY29vcmRpbmF0ZTtcclxuICAgIHZhciBjbGlja2VkRmVhdHVyZSA9IG1hcC5mb3JFYWNoRmVhdHVyZUF0UGl4ZWwoZXZ0LnBpeGVsLCBmdW5jdGlvbiBmaW5kRmVhdHVyZShmZWF0dXJlLCBsYXllcikge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGZlYXR1cmU6IGZlYXR1cmUsXHJcbiAgICAgICAgbGF5ZXI6IGxheWVyXHJcbiAgICAgIH07XHJcbiAgICB9LCB0aGlzLCBmdW5jdGlvbiBjbGlja2VkRmVhdHVyZUxheWVyRmlsdGVyKGxheWVyKSB7XHJcbiAgICAgIGlmIChsYXllci5nZXQoJ2lkJykgPT09ICdlc3RhdGVzJykge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sIHRoaXMpO1xyXG4gICAgaWYgKGNsaWNrZWRGZWF0dXJlKSB7XHJcbiAgICAgIHV0aWxzLmZpbmRCeUlkKG1hcCwgJ2VzdGF0ZXMnKS5nZXRTb3VyY2UoKS5nZXRGZWF0dXJlcygpXHJcbiAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIHJlc2V0U3R5bGUoZmVhdHVyZSkge1xyXG4gICAgICAgIGZlYXR1cmUuc2V0U3R5bGUobnVsbCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBlc3RhdGUgPSBjbGlja2VkRmVhdHVyZS5mZWF0dXJlO1xyXG4gICAgICBjb29yZGluYXRlcyA9IGVzdGF0ZS5nZXRHZW9tZXRyeSgpLmdldENvb3JkaW5hdGVzKCk7XHJcbiAgICAgIG1hcC5nZXRWaWV3KCkuc2V0Q2VudGVyKGNvb3JkaW5hdGVzKTtcclxuICAgICAgbWFwLmdldFZpZXcoKS5zZXRab29tKDE2KTtcclxuICAgICAgZ2lkID0gZXN0YXRlLmdldFByb3BlcnRpZXMoKS5naWQ7XHJcbiAgICAgIGVzdGF0ZS5zZXRTdHlsZShzdHlsZSk7XHJcbiAgICAgIHZhciBwMSA9IFByb21pc2UucmVzb2x2ZShcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiAnaHR0cDovLzEyNy4wLjAuMTozMDAwL2FwaS9wcm9wZXJ0eScsXHJcbiAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgZ2lkOiBnaWRcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIHAxLnRoZW4oZnVuY3Rpb24gcmVzb2x2ZShkYXRhKSB7XHJcbiAgICAgICAgdmFyIGZlYXR1cmUgPSBkYXRhLmZlYXR1cmVzWzBdO1xyXG4gICAgICAgIEFwcC5jb25maWcuY2FjaGUuYWN0aXZlRXN0YXRlID0gZmVhdHVyZS5wcm9wZXJ0aWVzO1xyXG4gICAgICAgIHJldHVybiBmZWF0dXJlO1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKGZlYXR1cmUpIHtcclxuICAgICAgICBpZiAobGFuZyA9PT0gJ2VsJykge1xyXG4gICAgICAgICAgcmVuZGVyRGF0YS52YWx1ZXMgPSB7XHJcbiAgICAgICAgICAgIGdpZDogZmVhdHVyZS5wcm9wZXJ0aWVzLmdpZCxcclxuICAgICAgICAgICAgeDogY29vcmRpbmF0ZXNbMF0sXHJcbiAgICAgICAgICAgIHk6IGNvb3JkaW5hdGVzWzFdLFxyXG4gICAgICAgICAgICBhcmVhTmFtZTogZmVhdHVyZS5wcm9wZXJ0aWVzLmFyZWFfbmFtZSxcclxuICAgICAgICAgICAgZXN0YXRlVHlwZTogZmVhdHVyZS5wcm9wZXJ0aWVzLmVzdGF0ZXR5cGUsXHJcbiAgICAgICAgICAgIGFkZHJlc3M6IGZlYXR1cmUucHJvcGVydGllcy5zdHJlZXRfZWwsXHJcbiAgICAgICAgICAgIGFkZHJlc3NOdW1iZXI6IGZlYXR1cmUucHJvcGVydGllcy5zdHJlZXRfbnVtYmVyLFxyXG4gICAgICAgICAgICBwc2NvZGU6IGZlYXR1cmUucHJvcGVydGllcy5wc19jb2RlLFxyXG4gICAgICAgICAgICBlc3RhdGVBcmVhOiBmZWF0dXJlLnByb3BlcnRpZXMuZXN0YXRlYXJlYSxcclxuICAgICAgICAgICAgYmVkcm9vbXM6IGZlYXR1cmUucHJvcGVydGllcy5iZWRyb29tcyxcclxuICAgICAgICAgICAgZmxvb3I6IGZlYXR1cmUucHJvcGVydGllcy5mbG9vcixcclxuICAgICAgICAgICAgeWVhcjogZmVhdHVyZS5wcm9wZXJ0aWVzLnllYXIsXHJcbiAgICAgICAgICAgIHBsYW5OdW1iZXI6IGZlYXR1cmUucHJvcGVydGllcy5wbGFuX251bSxcclxuICAgICAgICAgICAgcGxvdEFyZWE6IGZlYXR1cmUucHJvcGVydGllcy5wbG90YXJlYSxcclxuICAgICAgICAgICAgcGFyY2VsTnVtYmVyOiBmZWF0dXJlLnByb3BlcnRpZXMucGFyY2VsX251bSxcclxuICAgICAgICAgICAgcGFya2luZzogZmVhdHVyZS5wcm9wZXJ0aWVzLnBhcmtpbmcsXHJcbiAgICAgICAgICAgIGZ1cm5pc2hlZDogZmVhdHVyZS5wcm9wZXJ0aWVzLmZ1cm5pc2hlZCxcclxuICAgICAgICAgICAgaXNuZXc6IGZlYXR1cmUucHJvcGVydGllcy5pc25ldyxcclxuICAgICAgICAgICAgaGVhdGluZzogZmVhdHVyZS5wcm9wZXJ0aWVzLmhlYXRpbmcsXHJcbiAgICAgICAgICAgIGNvb2xpbmc6IGZlYXR1cmUucHJvcGVydGllcy5jb29saW5nLFxyXG4gICAgICAgICAgICB2aWV3OiBmZWF0dXJlLnByb3BlcnRpZXMudmlldyxcclxuICAgICAgICAgICAgdGl0bGU6IGZlYXR1cmUucHJvcGVydGllcy50aXRsZVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVuZGVyRGF0YS52YWx1ZXMgPSB7XHJcbiAgICAgICAgICAgIGdpZDogZmVhdHVyZS5wcm9wZXJ0aWVzLmdpZCxcclxuICAgICAgICAgICAgeDogZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlc1swXSxcclxuICAgICAgICAgICAgeTogZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSxcclxuICAgICAgICAgICAgYXJlYU5hbWU6IGZlYXR1cmUucHJvcGVydGllcy5hcmVhX25hbWUsXHJcbiAgICAgICAgICAgIGVzdGF0ZVR5cGU6IGZlYXR1cmUucHJvcGVydGllcy5lc3RhdGV0eXBlX2VuLFxyXG4gICAgICAgICAgICBhZGRyZXNzOiBmZWF0dXJlLnByb3BlcnRpZXMuc3RyZWV0X2VuLFxyXG4gICAgICAgICAgICBhZGRyZXNzTnVtYmVyOiBmZWF0dXJlLnByb3BlcnRpZXMuc3RyZWV0X251bWJlcixcclxuICAgICAgICAgICAgcHNjb2RlOiBmZWF0dXJlLnByb3BlcnRpZXMucHNfY29kZSxcclxuICAgICAgICAgICAgZXN0YXRlQXJlYTogZmVhdHVyZS5wcm9wZXJ0aWVzLmVzdGF0ZWFyZWEsXHJcbiAgICAgICAgICAgIGJlZHJvb21zOiBmZWF0dXJlLnByb3BlcnRpZXMuYmVkcm9vbXMsXHJcbiAgICAgICAgICAgIGZsb29yOiBmZWF0dXJlLnByb3BlcnRpZXMuZmxvb3IsXHJcbiAgICAgICAgICAgIHllYXI6IGZlYXR1cmUucHJvcGVydGllcy55ZWFyLFxyXG4gICAgICAgICAgICBwbGFuTnVtYmVyOiBmZWF0dXJlLnByb3BlcnRpZXMucGxhbl9udW0sXHJcbiAgICAgICAgICAgIHBsb3RBcmVhOiBmZWF0dXJlLnByb3BlcnRpZXMucGxvdGFyZWEsXHJcbiAgICAgICAgICAgIHBhcmNlbE51bWJlcjogZmVhdHVyZS5wcm9wZXJ0aWVzLnBhcmNlbF9udW0sXHJcbiAgICAgICAgICAgIHBhcmtpbmc6IGZlYXR1cmUucHJvcGVydGllcy5wYXJraW5nLFxyXG4gICAgICAgICAgICBmdXJuaXNoZWQ6IGZlYXR1cmUucHJvcGVydGllcy5mdXJuaXNoZWQsXHJcbiAgICAgICAgICAgIGlzbmV3OiBmZWF0dXJlLnByb3BlcnRpZXMuaXNuZXcsXHJcbiAgICAgICAgICAgIGhlYXRpbmc6IGZlYXR1cmUucHJvcGVydGllcy5oZWF0aW5nLFxyXG4gICAgICAgICAgICBjb29saW5nOiBmZWF0dXJlLnByb3BlcnRpZXMuY29vbGluZyxcclxuICAgICAgICAgICAgdmlldzogZmVhdHVyZS5wcm9wZXJ0aWVzLnZpZXcsXHJcbiAgICAgICAgICAgIHRpdGxlOiBmZWF0dXJlLnByb3BlcnRpZXMudGl0bGVcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcDEuY2F0Y2goZnVuY3Rpb24gZXJyb3IoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICB9KTtcclxuICAgICAgdmFyIHAyID0gUHJvbWlzZS5yZXNvbHZlKFxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAvYXBpL2xpc3RpbmcnLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIGdpZDogZ2lkXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICApXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uIHJlc29sdmUoZGF0YSkge1xyXG4gICAgICAgIEFwcC5jb25maWcuY2FjaGUuYWN0aXZlRXN0YXRlTGlzdGluZyA9IGRhdGE7XHJcbiAgICAgICAgcmVuZGVyRGF0YS5saXN0aW5nLnZhbHVlcyA9IGRhdGE7XHJcbiAgICAgICAgcmVuZGVyRGF0YS5saXN0aW5nLnZhbHVlcy5kYXRlX3N0YXJ0ID0gdXRpbHMuaGFuZGxlRGF0ZShkYXRhLmRhdGVfc3RhcnQsIGxhbmcpO1xyXG4gICAgICAgIHJlbmRlckRhdGEubGlzdGluZy52YWx1ZXMuZGF0ZV9lbmQgPSB1dGlscy5oYW5kbGVEYXRlKGRhdGEuZGF0ZV9lbmQsIGxhbmcpO1xyXG4gICAgICAgIHJlbmRlckRhdGEubGlzdGluZy5leGlzdHMgPSB0cnVlO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24gZXJyb3IoZSkge1xyXG4gICAgICAgIHZhciBzbmFja2JhckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHB3cmFwcGVyX19zbmFja2JhcicpO1xyXG4gICAgICAgIHZhciBkYXRhID0geyBtZXNzYWdlOiBBcHAuY29uZmlnLmNvbW1vbnMudHJhbnMuZXJyb3JzLmxpc3Rpbmc0MDQgfTtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICBpZiAoZS5zdGF0dXMgPT09IDQwNCkge1xyXG4gICAgICAgICAgcmVuZGVyRGF0YS5saXN0aW5nLmV4aXN0cyA9IGZhbHNlO1xyXG4gICAgICAgICAgc25hY2tiYXJDb250YWluZXIuTWF0ZXJpYWxTbmFja2Jhci5zaG93U25hY2tiYXIoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgUHJvbWlzZS5lYWNoKFtwMSwgcDJdLCBmdW5jdGlvbiBlKHJlc3VsdCkge1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKCkge1xyXG4gICAgICAgIGR1c3RFc3RhdGVJbmZvKHJlbmRlckRhdGEpO1xyXG4gICAgICAgIGVkaXRCdXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgIGRlbGV0ZUJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XHJcblxyXG4gICAgICAgIHV0aWxzLmFkZENsYXNzKGVkaXRCdXR0b24sICdtZGwtYnV0dG9uLS1hY2NlbnQnKTtcclxuICAgICAgICB1dGlscy5hZGRDbGFzcyhkZWxldGVCdXR0b24sICdtZGwtYnV0dG9uLS1hY2NlbnQnKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGZ1bmN0aW9uIGVycm9yKGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpbmZvQm94Q29udGVudC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgdXRpbHMuYWRkQ2xhc3MoaW5mb0JveENvbnRlbnQsICd2aXN1YWxseWhpZGRlbicpO1xyXG4gICAgICBlZGl0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgIGRlbGV0ZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcblxyXG4gICAgICB1dGlscy5maW5kQnlJZChtYXAsICdlc3RhdGVzJykuZ2V0U291cmNlKCkuZ2V0RmVhdHVyZXMoKVxyXG4gICAgICAuZm9yRWFjaChmdW5jdGlvbiByZXNldFN0eWxlKGZlYXR1cmUpIHtcclxuICAgICAgICBmZWF0dXJlLnNldFN0eWxlKG51bGwpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICB2YXIgbWFwID0gQXBwLmNvbmZpZy5jb21tb25zLm1hcDtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5kYXRhc2V0LmFjdGl2ZSA9ICdpbmZvJztcclxuICAgIG1hcC5vbignY2xpY2snLCBzZWxlY3RGZWF0dXJlKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gZGlzYWJsZSgpIHtcclxuICAgIHZhciBtYXAgPSBBcHAuY29uZmlnLmNvbW1vbnMubWFwO1xyXG4gICAgbWFwLnVuKCdjbGljaycsIHNlbGVjdEZlYXR1cmUpO1xyXG4gIH1cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdDogaW5pdCxcclxuICAgIGRpc2FibGU6IGRpc2FibGVcclxuICB9O1xyXG59KHdpbmRvdywgZG9jdW1lbnQsIFByb21pc2UsIGpRdWVyeSwgQXBwKSk7XHJcbiIsIkFwcC5jb25maWcubW9kdWxlcy5lZGl0ID0gKGZ1bmN0aW9uIGVkaXQod2luZG93LCBkb2N1bWVudCwgUHJvbWlzZSwgJCwgZFBpY2ssIG1vbWVudCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuICB2YXIgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHB3cmFwcGVyX19pbmZvYm94LWNvbnRlbnQnKTtcclxuICB2YXIgbGFuZyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nO1xyXG4gIHZhciBpbmZvID0gQXBwLmNvbmZpZy5tb2R1bGVzLmluZm87XHJcbiAgdmFyIHV0aWxzID0gQXBwLnV0aWxzO1xyXG4gIHZhciBlZGl0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VkaXQnKTtcclxuICB2YXIgZGVsZXRlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbGV0ZScpO1xyXG4gIHZhciBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG4gIGZ1bmN0aW9uIGNsZWFyQ29udGVudCgpIHtcclxuICAgIGlmIChjb250ZW50LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29udGVudC5pbm5lckhUTUwgPSAnJztcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gZ2V0SW50ZXJhY3Rpb24oaWQpIHtcclxuICAgIHZhciBtYXAgPSBBcHAuY29uZmlnLmNvbW1vbnMubWFwO1xyXG4gICAgdmFyIGludGVyYWN0aW9ucyA9IG1hcC5nZXRJbnRlcmFjdGlvbnMoKTtcclxuICAgIHZhciBmb3VuZCA9IHt9O1xyXG4gICAgaW50ZXJhY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gZ2V0SW50ZXJhY3Rpb25JZChpbnRlcmFjdGlvbikge1xyXG4gICAgICBpZiAoaW50ZXJhY3Rpb24uZ2V0KCdpZCcpID09PSBpZCkge1xyXG4gICAgICAgIGZvdW5kID0gaW50ZXJhY3Rpb247XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZm91bmQ7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGFzc2lnblZhbGlkYXRvcnMoKSB7XHJcbiAgICB2YXIgaW5wdXRzID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPXRleHRdJyk7XHJcbiAgICBbXS5mb3JFYWNoLmNhbGwoaW5wdXRzLCBmdW5jdGlvbiBtYWtlUGFyc2xleUlucHV0cyhlbCkge1xyXG4gICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24gc2FuaXRpemUoKSB7XHJcbiAgICAgICAgdmFyIHN0ciA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgdmFyIHNhbml0aXplZFN0cjtcclxuICAgICAgICBpZiAodGhpcy5kYXRhc2V0LnR5cGUgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICBzYW5pdGl6ZWRTdHIgPSBzdHIucmVwbGFjZSgvWy9cXEQvIF0vZ2ksICcnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGF0YXNldC50eXBlID09PSAnYWxwaGFudW0nKSB7XHJcbiAgICAgICAgICBzYW5pdGl6ZWRTdHIgPSBzdHIucmVwbGFjZSgvW15hLXowLTlBLVpBLXrOkS3Oqc6xLc+Jzq/Pis6Qz4zOrM6tz43Pi86wzq7PjiBdL2dpLCAnJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRhdGFzZXQudHlwZSA9PT0gJ3NwZWNpYWwnKSB7XHJcbiAgICAgICAgICBzYW5pdGl6ZWRTdHIgPSBzdHIucmVwbGFjZSgvW14wLTkgXFwvXS9naSwgJycpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhc2V0LnR5cGUgPT09ICdkYXRlJykge1xyXG4gICAgICAgICAgc2FuaXRpemVkU3RyID0gc3RyLnJlcGxhY2UoL1teMC05IFxcLV0vZ2ksICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHNhbml0aXplZFN0cjtcclxuICAgICAgICB1dGlscy5yZW1vdmVDbGFzcyh0aGlzLnBhcmVudE5vZGUsICdpcy1pbnZhbGlkJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRFc3RhdGVUeXBlKHR5cGUpIHtcclxuICAgIHZhciB0eXBlcztcclxuICAgIGlmIChsYW5nID09PSAnZWwnKSB7XHJcbiAgICAgIHR5cGVzID0ge1xyXG4gICAgICAgIM6UzrnOsc68zq3Pgc65z4POvM6xOiBmdW5jdGlvbiBnZXRBcGFydG1lbnQoKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ0FwYXJ0bWVudCc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICDOnM6/zr3Ov866zrHPhM6/zrnOus6vzrE6IGZ1bmN0aW9uIGdldERldGFjaGVkSG91c2UoKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ0RldGFjaGVkIEhvdXNlJztcclxuICAgICAgICB9LFxyXG4gICAgICAgIM6czrXOts6/zr3Orc+EzrE6IGZ1bmN0aW9uIGdldE1haXNvbmV0dGUoKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ01haXNvbmV0dGUnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgzojPgM6xz4XOu863OiBmdW5jdGlvbiBnZXRWaWxsYSgpIHtcclxuICAgICAgICAgIHJldHVybiAnVmlsbGEnO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHR5cGVzID0ge1xyXG4gICAgICAgIEFwYXJ0bWVudDogZnVuY3Rpb24gZ2V0QXBhcnRtZW50KCkge1xyXG4gICAgICAgICAgcmV0dXJuICfOlM65zrHOvM6tz4HOuc+DzrzOsSc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAnRGV0YWNoZWQgSG91c2UnOiBmdW5jdGlvbiBnZXREZXRhY2hlZEhvdXNlKCkge1xyXG4gICAgICAgICAgcmV0dXJuICfOnM6/zr3Ov866zrHPhM6/zrnOus6vzrEnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgTWFpc29uZXR0ZTogZnVuY3Rpb24gZ2V0TWFpc29uZXR0ZSgpIHtcclxuICAgICAgICAgIHJldHVybiAnzpzOtc62zr/Ovc6tz4TOsSc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBWaWxsYTogZnVuY3Rpb24gZ2V0VmlsbGEoKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ86Iz4DOsc+FzrvOtyc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHR5cGVzW3R5cGVdKCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNvbGxlY3RWYWx1ZXMoKSB7XHJcbiAgICB2YXIgdmFsdWVzID0ge307XHJcbiAgICB2YXIgZmlsdGVyZWRWYWx1ZXMgPSB7fTtcclxuICAgIHZhciBpbnB1dHMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9dGV4dF0nKTtcclxuICAgIHZhciBjaGVja2JveGVzID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPWNoZWNrYm94XScpO1xyXG4gICAgdmFsdWVzLmVzdGF0ZSA9IHt9O1xyXG4gICAgdmFsdWVzLmxpc3RpbmcgPSB7fTtcclxuXHJcbiAgICBbXS5mb3JFYWNoLmNhbGwoaW5wdXRzLCBmdW5jdGlvbiBjb2xsZWN0RnJvbUlucHV0cyhlbCkge1xyXG4gICAgICB2YXIgbmFtZSA9IF8ubGFzdChfLnNwbGl0KGVsLmdldEF0dHJpYnV0ZSgnaWQnKSwgJy0nLCAzKSk7XHJcbiAgICAgIHZhciB2YWx1ZSA9IGVsLnZhbHVlO1xyXG4gICAgICB2YXIgbmV3WCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlc3RhdGUnKS5kYXRhc2V0Lm5ld3g7XHJcbiAgICAgIHZhciBuZXdZID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VzdGF0ZScpLmRhdGFzZXQubmV3eTtcclxuICAgICAgdmFyIG9yaWdpbmFsWCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlc3RhdGUnKS5kYXRhc2V0Lm9yaWdpbmFseDtcclxuICAgICAgdmFyIG9yaWdpbmFsWSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlc3RhdGUnKS5kYXRhc2V0Lm9yaWdpbmFseTtcclxuXHJcbiAgICAgIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ2lkJykuaW5kZXhPZignZXN0YXRlJykgPiAtMSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbmV3WCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIHZhbHVlcy5lc3RhdGUueCA9IG5ld1g7XHJcbiAgICAgICAgICB2YWx1ZXMuZXN0YXRlLnkgPSBuZXdZO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YWx1ZXMuZXN0YXRlLnggPSBvcmlnaW5hbFg7XHJcbiAgICAgICAgICB2YWx1ZXMuZXN0YXRlLnkgPSBvcmlnaW5hbFk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsYW5nID09PSAnZWwnKSB7XHJcbiAgICAgICAgICBpZiAobmFtZSA9PT0gJ3R5cGUnKSB7XHJcbiAgICAgICAgICAgIHZhbHVlcy5lc3RhdGUuZXN0YXRldHlwZUVuID0gc2V0RXN0YXRlVHlwZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHZhbHVlcy5lc3RhdGUuZXN0YXRldHlwZSA9IHZhbHVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKG5hbWUgPT09ICdhZGRyZXNzJykge1xyXG4gICAgICAgICAgICB2YWx1ZXMuZXN0YXRlLnN0cmVldEVuID0gdXRpbHMuZWxUb0VuKHZhbHVlKTtcclxuICAgICAgICAgICAgdmFsdWVzLmVzdGF0ZS5zdHJlZXRFbCA9IHZhbHVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAobmFtZSA9PT0gJ3R5cGUnKSB7XHJcbiAgICAgICAgICAgIHZhbHVlcy5lc3RhdGUuZXN0YXRldHlwZUVuID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHZhbHVlcy5lc3RhdGUuZXN0YXRldHlwZSA9IHNldEVzdGF0ZVR5cGUodmFsdWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKG5hbWUgPT09ICdhZGRyZXNzJykge1xyXG4gICAgICAgICAgICB2YWx1ZXMuZXN0YXRlLnN0cmVldEVuID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHZhbHVlcy5lc3RhdGUuc3RyZWV0RWwgPSB1dGlscy5lbFRvRW4odmFsdWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmFtZSA9PT0gJ2FkZHJlc3NOdW1iZXInKSB7XHJcbiAgICAgICAgICB2YWx1ZXMuZXN0YXRlLnN0cmVldE51bWJlciA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YWx1ZXMuZXN0YXRlW25hbWVdID0gdmFsdWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKG5hbWUgPT09ICd0eXBlJykge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID09PSAnU2FsZScgfHwgdmFsdWUgPT09ICfOoM+OzrvOt8+DzrcnKSB7XHJcbiAgICAgICAgICAgIHZhbHVlcy5saXN0aW5nLnNhbGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YWx1ZXMubGlzdGluZy5yZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWx1ZXMubGlzdGluZy5zYWxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhbHVlcy5saXN0aW5nLnJlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YWx1ZXMubGlzdGluZ1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBbXS5mb3JFYWNoLmNhbGwoY2hlY2tib3hlcywgZnVuY3Rpb24gY29sbGVjdEZyb21DaGVja2JveGVzKGVsKSB7XHJcbiAgICAgIHZhciBuYW1lID0gXy5sYXN0KF8uc3BsaXQoZWwuZ2V0QXR0cmlidXRlKCdpZCcpLCAnLScsIDMpKTtcclxuICAgICAgdmFyIHZhbHVlID0gZWwuY2hlY2tlZDtcclxuICAgICAgaWYgKG5hbWUgIT09ICdwZXRzJykge1xyXG4gICAgICAgIHZhbHVlcy5lc3RhdGVbbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YWx1ZXMubGlzdGluZ1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGZpbHRlcmVkVmFsdWVzLmVzdGF0ZSA9IF8ub21pdCh2YWx1ZXMuZXN0YXRlLCBbJ2FkZHJlc3MnLCAnYWRkcmVzc051bWJlcicsICd0eXBlJywgJ3RvZ2dsZSddKTtcclxuICAgIGZpbHRlcmVkVmFsdWVzLmxpc3RpbmcgPSB2YWx1ZXMubGlzdGluZztcclxuICAgIHJldHVybiBmaWx0ZXJlZFZhbHVlcztcclxuICB9XHJcbiAgZnVuY3Rpb24gdXBkYXRlKGRhdGEpIHtcclxuICAgIHZhciBzbmFja2JhckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHB3cmFwcGVyX19zbmFja2JhcicpO1xyXG4gICAgdmFyIG1zZ0RhdGEgPSB7fTtcclxuICAgIGZ1bmN0aW9uIGFkZEdpZFRvTGlzdGluZyhpbnB1dCwgZ2lkKSB7XHJcbiAgICAgIHZhciByZXR1cm5lZERhdGEgPSBpbnB1dDtcclxuICAgICAgcmV0dXJuZWREYXRhLmdpZCA9IGdpZDtcclxuICAgICAgcmV0dXJuIHJldHVybmVkRGF0YTtcclxuICAgIH1cclxuICAgIFByb21pc2UucmVzb2x2ZShcclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAvYXBpL3Byb3BlcnR5JyxcclxuICAgICAgICB0eXBlOiAnUFVUJyxcclxuICAgICAgICBkYXRhOiBkYXRhLmVzdGF0ZVxyXG4gICAgICB9KVxyXG4gICAgICApXHJcbiAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKGVzdGF0ZVJlc3VsdCkge1xyXG4gICAgICBtc2dEYXRhLmVzdGF0ZUlkID0gZXN0YXRlUmVzdWx0LnByb3BlcnR5R2lkO1xyXG4gICAgICBpZiAoIV8uaXNFbXB0eShkYXRhLmxpc3RpbmcpKSB7XHJcbiAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAvYXBpL2xpc3RpbmcnLFxyXG4gICAgICAgICAgdHlwZTogJ1BVVCcsXHJcbiAgICAgICAgICBkYXRhOiBhZGRHaWRUb0xpc3RpbmcoZGF0YS5saXN0aW5nLCBlc3RhdGVSZXN1bHQucHJvcGVydHlHaWQpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oZnVuY3Rpb24gcmVzb2x2ZShsaXN0aW5nUmVzdWx0KSB7XHJcbiAgICAgIHZhciBtc2c7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdClcclxuICAgICAgaWYgKGxpc3RpbmdSZXN1bHQgPT09IG51bGwpIHtcclxuICAgICAgICBtc2cgPSB7IG1lc3NhZ2U6ICdVcGRhdGVkIEVzdGF0ZTogJyArIG1zZ0RhdGEuZXN0YXRlSWQgfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBtc2cgPSB7IG1lc3NhZ2U6ICdVcGRhdGVkIEVzdGF0ZUlEOiAnICsgbXNnRGF0YS5lc3RhdGVJZCArICcgYW5kIExpc3RpbmdJRDogJyArIGxpc3RpbmdSZXN1bHQubGlzdGluZ0lkIH07XHJcbiAgICAgIH1cclxuICAgICAgc25hY2tiYXJDb250YWluZXIuTWF0ZXJpYWxTbmFja2Jhci5zaG93U25hY2tiYXIobXNnKTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZnVuY3Rpb24gZXJyb3IoZSkge1xyXG4gICAgICB2YXIgbXNnID0geyBtZXNzYWdlOiBlIH07XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICBzbmFja2JhckNvbnRhaW5lci5NYXRlcmlhbFNuYWNrYmFyLnNob3dTbmFja2Jhcihtc2cpO1xyXG4gICAgfSlcclxuICAgIC5maW5hbGx5KGZ1bmN0aW9uIGNsb3NlVXBkYXRlKCkge1xyXG4gICAgICB2YXIgbWFwID0gQXBwLmNvbmZpZy5jb21tb25zLm1hcDtcclxuICAgICAgY2xlYXJDb250ZW50KCk7XHJcbiAgICAgIHV0aWxzLmFkZENsYXNzKGNvbnRlbnQsICd2aXN1YWxseWhpZGRlbicpO1xyXG4gICAgICB1dGlscy5maW5kQnlJZChtYXAsICdlc3RhdGVzJykuZ2V0U291cmNlKCkuZ2V0RmVhdHVyZXMoKVxyXG4gICAgICAuZm9yRWFjaChmdW5jdGlvbiByZXNldFN0eWxlKGZlYXR1cmUpIHtcclxuICAgICAgICBmZWF0dXJlLnNldFN0eWxlKG51bGwpO1xyXG4gICAgICB9KTtcclxuICAgICAgZWRpdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgIGRlbGV0ZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgIGluZm8uaW5pdCgpO1xyXG4gICAgICBib2R5LmRhdGFzZXQuYWN0aXZlID0gJ2luZm8nO1xyXG4gICAgICBnZXRJbnRlcmFjdGlvbigndHJhbnNsYXRlJykuc2V0QWN0aXZlKGZhbHNlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBkYXRlUGlja2VyKCkge1xyXG4gICAgdmFyIGZvcm1hdCA9IChsYW5nID09PSAnZWwnKSA/ICdERC1NTS1ZWVlZJyA6ICdNTS1ERC1ZWVlZJztcclxuICAgIHZhciBkYXRlU3RhcnRQaWNrZXI7XHJcbiAgICB2YXIgZGF0ZUVuZFBpY2tlcjtcclxuICAgIHZhciBkYXRlU3RhcnRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mb2JveF9fZGF0ZS1zdGFydCcpO1xyXG4gICAgdmFyIGRhdGVFbmRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mb2JveF9fZGF0ZS1lbmQnKTtcclxuICAgIHZhciBkYXRlU3RhcnRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0aW5nX19nZW5lcmFsLWRhdGVTdGFydCcpO1xyXG4gICAgdmFyIGRhdGVFbmRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0aW5nX19nZW5lcmFsLWRhdGVFbmQnKTtcclxuICAgIHZhciBkYXRlU3RhcnRQaWNrZXJJbml0O1xyXG4gICAgdmFyIGRhdGVFbmRQaWNrZXJJbml0O1xyXG4gICAgdmFyIG9ic2VydmVEYXRlUGlja2VyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gb2JzZXJ2ZURhdGVQaWNrZXIobXV0YXRpb25zKSB7XHJcbiAgICAgIHZhciBhdHRyaWJ1dGVWYWx1ZTtcclxuICAgICAgbXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24gZm9lckVhY2hNdXRhdGlvbihtdXRhdGlvbikge1xyXG4gICAgICAgIGlmIChtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lID09PSAnY2xhc3MnKSB7XHJcbiAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZSA9ICQobXV0YXRpb24udGFyZ2V0KS5wcm9wKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUpO1xyXG4gICAgICAgICAgaWYgKGF0dHJpYnV0ZVZhbHVlLmluZGV4T2YoJ21kZHRwLXBpY2tlci0taW5hY3RpdmUnKSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHV0aWxzLnJlbW92ZUNsYXNzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHB3cmFwcGVyX19pbmZvYm94JyksICd1bmNsaWNrYWJsZScpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdXRpbHMuYWRkQ2xhc3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcHdyYXBwZXJfX2luZm9ib3gnKSwgJ3VuY2xpY2thYmxlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGRhdGVTdGFydElucHV0ICE9PSBudWxsKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGVTdGFydElucHV0LnZhbHVlKTtcclxuICAgICAgaWYgKGRhdGVTdGFydElucHV0LnZhbHVlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGRhdGVTdGFydFBpY2tlckluaXQgPSBtb21lbnQoZGF0ZVN0YXJ0SW5wdXQudmFsdWUsIGZvcm1hdCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGF0ZVN0YXJ0UGlja2VySW5pdCA9IG1vbWVudCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGRhdGVTdGFydFBpY2tlciA9IG5ldyBkUGljay5kZWZhdWx0KHtcclxuICAgICAgICB0eXBlOiAnZGF0ZScsXHJcbiAgICAgICAgaW5pdDogZGF0ZVN0YXJ0UGlja2VySW5pdCxcclxuICAgICAgICBmdXR1cmU6IG1vbWVudCgpLmFkZCg1LCAneWVhcnMnKSxcclxuICAgICAgICB0cmlnZ2VyOiBkYXRlU3RhcnRJbnB1dCxcclxuICAgICAgICBvcmllbnRhdGlvbjogJ1BPUlRSQUlUJ1xyXG4gICAgICB9KTtcclxuICAgICAgb2JzZXJ2ZURhdGVQaWNrZXIub2JzZXJ2ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWRkdHAtcGlja2VyX19kYXRlJyksIHtcclxuICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgICBkYXRlU3RhcnRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdvbk9rJywgZnVuY3Rpb24gZGlzcGxheVBpY2tlZGF0ZSgpIHtcclxuICAgICAgICB1dGlscy5hZGRDbGFzcyh0aGlzLnBhcmVudE5vZGUsICdpcy1kaXJ0eScpO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBkYXRlU3RhcnRQaWNrZXIudGltZS5mb3JtYXQoZm9ybWF0KS50b1N0cmluZygpO1xyXG4gICAgICB9KTtcclxuICAgICAgZGF0ZVN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gc2hvd0RhdGVQaWNrZXIoKSB7XHJcbiAgICAgICAgZGF0ZVN0YXJ0UGlja2VyLnRvZ2dsZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmIChkYXRlRW5kSW5wdXQgIT09IG51bGwpIHtcclxuICAgICAgaWYgKGRhdGVFbmRJbnB1dC52YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICBkYXRlRW5kUGlja2VySW5pdCA9IG1vbWVudChkYXRlU3RhcnRJbnB1dC52YWx1ZSwgZm9ybWF0KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkYXRlRW5kUGlja2VySW5pdCA9IG1vbWVudCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGRhdGVFbmRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdvbk9rJywgZnVuY3Rpb24gZGlzcGxheVBpY2tlZGF0ZSgpIHtcclxuICAgICAgICB1dGlscy5hZGRDbGFzcyh0aGlzLnBhcmVudE5vZGUsICdpcy1kaXJ0eScpO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBkYXRlRW5kUGlja2VyLnRpbWUuZm9ybWF0KGZvcm1hdCkudG9TdHJpbmcoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRhdGVFbmRQaWNrZXIgPSBuZXcgZFBpY2suZGVmYXVsdCh7XHJcbiAgICAgICAgdHlwZTogJ2RhdGUnLFxyXG4gICAgICAgIGluaXQ6IGRhdGVFbmRQaWNrZXJJbml0LFxyXG4gICAgICAgIGZ1dHVyZTogbW9tZW50KCkuYWRkKDUsICd5ZWFycycpLFxyXG4gICAgICAgIHRyaWdnZXI6IGRhdGVFbmRJbnB1dCxcclxuICAgICAgICBvcmllbnRhdGlvbjogJ1BPUlRSQUlUJ1xyXG4gICAgICB9KTtcclxuICAgICAgb2JzZXJ2ZURhdGVQaWNrZXIub2JzZXJ2ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWRkdHAtcGlja2VyX19kYXRlJyksIHtcclxuICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgICBkYXRlRW5kQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gc2hvd0RhdGVQaWNrZXIoKSB7XHJcbiAgICAgICAgZGF0ZUVuZFBpY2tlci50b2dnbGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGVuYWJsZUVkaXQoKSB7XHJcbiAgICB2YXIgb2JzZXJ2ZUxpc3RpbmdJbnB1dCA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIG9ic2VydmVMaXN0aW5nSW5wdXQobXV0YXRpb25zKSB7XHJcbiAgICAgIHZhciBhdHRyaWJ1dGVWYWx1ZTtcclxuICAgICAgbXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24gZm9lckVhY2hNdXRhdGlvbihtdXRhdGlvbikge1xyXG4gICAgICAgIGlmIChtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lID09PSAnZGF0YS12YWwnKSB7XHJcbiAgICAgICAgICBhdHRyaWJ1dGVWYWx1ZSA9IG11dGF0aW9uLnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgIGlmIChhdHRyaWJ1dGVWYWx1ZSA9PT0gJ1JlbnQnIHx8IGF0dHJpYnV0ZVZhbHVlID09PSAnzpXOvc6/zrnOus6vzrHPg863Jykge1xyXG4gICAgICAgICAgICB1dGlscy5yZW1vdmVDbGFzcyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbGlzdGluZ19fZ2VuZXJhbC1wZXRzLXdyYXBwZXInKSwgJ3Zpc3VhbGx5aGlkZGVuJyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1dGlscy5hZGRDbGFzcyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbGlzdGluZ19fZ2VuZXJhbC1wZXRzLXdyYXBwZXInKSwgJ3Zpc3VhbGx5aGlkZGVuJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgdmFyIG1hcCA9IEFwcC5jb25maWcuY29tbW9ucy5tYXA7XHJcbiAgICB2YXIgaW5wdXRzID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xyXG4gICAgdmFyIGxhYmVscyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnbGFiZWwnKTtcclxuICAgIHZhciBidXR0b25zID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24nKTtcclxuICAgIHZhciBlZGl0Q2xvc2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xvc2UnKTtcclxuICAgIHZhciBlZGl0QWdyZWVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWdyZWUnKTtcclxuICAgIHZhciBsb2NhdGlvblN3aXRjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlc3RhdGVfbG9jYXRpb24tdG9nZ2xlJyk7XHJcbiAgICB2YXIgZ2lkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VzdGF0ZV9faW5mby1naWQnKS52YWx1ZTtcclxuICAgIHZhciB0cmFuc2xhdGUgPSBuZXcgb2wuaW50ZXJhY3Rpb24uVHJhbnNsYXRlKHtcclxuICAgICAgZmVhdHVyZXM6IG5ldyBvbC5Db2xsZWN0aW9uKFt1dGlscy5maW5kQnlJZChtYXAsICdlc3RhdGVzJykuZ2V0U291cmNlKCkuZ2V0RmVhdHVyZUJ5SWQoZ2lkKV0pLFxyXG4gICAgICBsYXllcnM6IFt1dGlscy5maW5kQnlJZChtYXAsICdlc3RhdGVzJyldXHJcbiAgICB9KTtcclxuXHJcbiAgICBhc3NpZ25WYWxpZGF0b3JzKCk7XHJcbiAgICB0cmFuc2xhdGUuc2V0KCdpZCcsICd0cmFuc2xhdGUnKTtcclxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdGluZ19faWRBbmRUeXBlLXR5cGUnKSAhPT0gbnVsbCkge1xyXG4gICAgICBvYnNlcnZlTGlzdGluZ0lucHV0Lm9ic2VydmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RpbmdfX2lkQW5kVHlwZS10eXBlJyksIHtcclxuICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxyXG4gICAgICAgIGNoYXJhY3RlckRhdGE6IHRydWVcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB0cmFuc2xhdGUub24oJ3RyYW5zbGF0ZWVuZCcsIGZ1bmN0aW9uIHNldFRyYW5zbGF0ZWRDb29yZGluYXRlcyhlKSB7XHJcbiAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VzdGF0ZScpO1xyXG4gICAgICBlbGVtZW50LmRhdGFzZXQubmV3eCA9IGUuY29vcmRpbmF0ZVswXTtcclxuICAgICAgZWxlbWVudC5kYXRhc2V0Lm5ld3kgPSBlLmNvb3JkaW5hdGVbMV07XHJcbiAgICAgIGxvY2F0aW9uU3dpdGNoLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgdXRpbHMucmVtb3ZlQ2xhc3MobG9jYXRpb25Td2l0Y2gucGFyZW50Tm9kZSwgJ2lzLWNoZWNrZWQnKTtcclxuICAgICAgLy8gQXBwLmNvbmZpZy5tb2R1bGVzLmluZm8uaW5pdCgpO1xyXG4gICAgICB0cmFuc2xhdGUuc2V0QWN0aXZlKGZhbHNlKTtcclxuICAgIH0pO1xyXG4gICAgbWFwLmFkZEludGVyYWN0aW9uKHRyYW5zbGF0ZSk7XHJcbiAgICB0cmFuc2xhdGUuc2V0QWN0aXZlKGZhbHNlKTtcclxuXHJcbiAgICBsb2NhdGlvblN3aXRjaC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIHdhdGNoTG9jYXRpb25Td2l0Y2goKSB7XHJcbiAgICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcclxuICAgICAgICAvLyBBcHAuY29uZmlnLm1vZHVsZXMuaW5mby5kaXNhYmxlKCk7XHJcbiAgICAgICAgdHJhbnNsYXRlLnNldEFjdGl2ZSh0cnVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBBcHAuY29uZmlnLm1vZHVsZXMuaW5mby5pbml0KCk7XHJcbiAgICAgICAgdHJhbnNsYXRlLnNldEFjdGl2ZShmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdsaXN0aW5nJyksIGZ1bmN0aW9uIHJlbW92ZURpc2FibGVkTGlzdGluZyhlbCkge1xyXG4gICAgICB1dGlscy5yZW1vdmVDbGFzcyhlbCwgJ2xpc3RpbmctZGlzYWJsZWQnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIFtdLmZvckVhY2guY2FsbChpbnB1dHMsIGZ1bmN0aW9uIHJlbW92ZURpc2FibGVkSW5wdXRzKGVsKSB7XHJcbiAgICAgIGlmICghdXRpbHMuaGFzQ2xhc3MoZWwsICdub3QtZWRkaXRhYmxlJykpIHtcclxuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIFtdLmZvckVhY2guY2FsbChsYWJlbHMsIGZ1bmN0aW9uIHJlbW92ZURpc2FibGVkTGFiZWxzKGVsKSB7XHJcbiAgICAgIHV0aWxzLnJlbW92ZUNsYXNzKGVsLCAnaXMtZGlzYWJsZWQnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIFtdLmZvckVhY2guY2FsbChidXR0b25zLCBmdW5jdGlvbiByZW1vdmVEaXNhYmxlZExhYmVscyhlbCkge1xyXG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB1dGlscy5yZW1vdmVDbGFzcyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29uZmlybUJ0bnMnKSwgJ3Zpc3VhbGx5aGlkZGVuJyk7XHJcbiAgICBlZGl0Q2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiBjYW5jZWxFZGl0KCkge1xyXG4gICAgICBjbGVhckNvbnRlbnQoKTtcclxuICAgICAgdXRpbHMuYWRkQ2xhc3MoY29udGVudCwgJ3Zpc3VhbGx5aGlkZGVuJyk7XHJcbiAgICAgIHV0aWxzLmZpbmRCeUlkKG1hcCwgJ2VzdGF0ZXMnKS5nZXRTb3VyY2UoKS5nZXRGZWF0dXJlcygpXHJcbiAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIHJlc2V0U3R5bGUoZmVhdHVyZSkge1xyXG4gICAgICAgIGZlYXR1cmUuc2V0U3R5bGUobnVsbCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBlZGl0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAgZGVsZXRlQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAgaW5mby5pbml0KCk7XHJcbiAgICAgIGJvZHkuZGF0YXNldC5hY3RpdmUgPSAnaW5mbyc7XHJcbiAgICAgIGdldEludGVyYWN0aW9uKCd0cmFuc2xhdGUnKS5zZXRBY3RpdmUoZmFsc2UpO1xyXG4gICAgfSk7XHJcbiAgICBlZGl0QWdyZWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiB1cGRhdGVFZGl0KCkge1xyXG4gICAgICAvLyBzYW5pdGl6ZSgpO1xyXG4gICAgICB2YXIgZGF0YSA9IGNvbGxlY3RWYWx1ZXMoKTtcclxuICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgIHVwZGF0ZShkYXRhKTtcclxuICAgIH0pO1xyXG4gICAgZGF0ZVBpY2tlcigpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGluZm8uZGlzYWJsZSgpO1xyXG4gICAgZW5hYmxlRWRpdCgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXQ6IGluaXRcclxuICB9O1xyXG59KHdpbmRvdywgZG9jdW1lbnQsIFByb21pc2UsICQsIG1kRGF0ZVRpbWVQaWNrZXIsIG1vbWVudCwgQXBwKSk7XHJcbiIsIkFwcC5jb25maWcubW9kdWxlcy5kZWxldGUgPSAoZnVuY3Rpb24gZWRpdCh3aW5kb3csIGRvY3VtZW50LCBQcm9taXNlLCAkLCBBcHAsIGRpYWxvZ1BvbHlmaWxsKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG4gIHZhciB1dGlscyA9IEFwcC51dGlscztcclxuICB2YXIgZHVzdEJsdWViaXJkID0gQXBwLmNvbmZpZy5wcm9taXNlcy5kdXN0Qmx1ZWJpcmQ7XHJcbiAgdmFyIGRlbGV0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWxldGUnKTtcclxuICB2YXIgZWRpdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0Jyk7XHJcbiAgdmFyIGRpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RpYWxvZycpO1xyXG4gIHZhciBzbmFja2JhckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHB3cmFwcGVyX19zbmFja2JhcicpO1xyXG4gIHZhciBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcHdyYXBwZXJfX2luZm9ib3gtY29udGVudCcpO1xyXG4gIHZhciBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG4gIHZhciBpbmZvID0gQXBwLmNvbmZpZy5tb2R1bGVzLmluZm87XHJcbiAgZnVuY3Rpb24gY2xlYXJDb250ZW50KCkge1xyXG4gICAgaWYgKGNvbnRlbnQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICBjb250ZW50LmlubmVySFRNTCA9ICcnO1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiB1cGRhdGVFc3RhdGVzKCkge1xyXG4gICAgdmFyIG1hcCA9IEFwcC5jb25maWcuY29tbW9ucy5tYXA7XHJcbiAgICB1dGlscy5maW5kQnlJZChtYXAsICdlc3RhdGVzJykuZ2V0U291cmNlKCkuY2xlYXIoKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gZGVsZXRlTGlzdGluZyhkYXRhKSB7XHJcbiAgICBQcm9taXNlLnJlc29sdmUoXHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiAnaHR0cDovLzEyNy4wLjAuMTozMDAwL2FwaS9saXN0aW5nJyxcclxuICAgICAgICB0eXBlOiAnREVMRVRFJyxcclxuICAgICAgICBkYXRhOiB7IGlkOiBkYXRhIH1cclxuICAgICAgfSlcclxuICAgICAgKVxyXG4gICAgLnRoZW4oZnVuY3Rpb24gcmVzb2x2ZShkZWxldGVMaXN0aW5ncmVzdWx0KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRlbGV0ZUxpc3RpbmdyZXN1bHQpO1xyXG4gICAgICBjb250ZW50LnF1ZXJ5U2VsZWN0b3IoJyNsaXN0aW5nJykuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgIGNvbnRlbnQucXVlcnlTZWxlY3RvcignI2xpc3RpbmcnKS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNvbnRlbnQucXVlcnlTZWxlY3RvcignI2xpc3RpbmcnKSk7XHJcbiAgICB9KVxyXG4gICAgLmZpbmFsbHkoZnVuY3Rpb24gZW5hYmxlSW5mbygpIHtcclxuICAgICAgdmFyIG1hcCA9IEFwcC5jb25maWcuY29tbW9ucy5tYXA7XHJcbiAgICAgIGNsZWFyQ29udGVudCgpO1xyXG4gICAgICBib2R5LmRhdGFzZXQuYWN0aXZlID0gJ2luZm8nO1xyXG4gICAgICBlZGl0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAgZGVsZXRlQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAgaW5mby5pbml0KCk7XHJcbiAgICAgIHV0aWxzLmZpbmRCeUlkKG1hcCwgJ2VzdGF0ZXMnKS5nZXRTb3VyY2UoKS5nZXRGZWF0dXJlcygpXHJcbiAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIHJlc2V0U3R5bGUoZmVhdHVyZSkge1xyXG4gICAgICAgIGZlYXR1cmUuc2V0U3R5bGUobnVsbCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbiBlcnJvcihlKSB7XHJcbiAgICAgIHZhciBtc2cgPSB7IG1lc3NhZ2U6IGUgfTtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgIHNuYWNrYmFyQ29udGFpbmVyLk1hdGVyaWFsU25hY2tiYXIuc2hvd1NuYWNrYmFyKG1zZyk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gZGVsZXRlRXN0YXRlQW5kTGlzdGluZyhkYXRhKSB7XHJcbiAgICBQcm9taXNlLnJlc29sdmUoXHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiAnaHR0cDovLzEyNy4wLjAuMTozMDAwL2FwaS9wcm9wZXJ0eScsXHJcbiAgICAgICAgdHlwZTogJ0RFTEVURScsXHJcbiAgICAgICAgZGF0YTogeyBnaWQ6IGRhdGEgfVxyXG4gICAgICB9KVxyXG4gICAgICApXHJcbiAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKCkge1xyXG4gICAgICB1cGRhdGVFc3RhdGVzKCk7XHJcbiAgICB9KVxyXG4gICAgLmZpbmFsbHkoZnVuY3Rpb24gZW5hYmxlSW5mbygpIHtcclxuICAgICAgdmFyIG1hcCA9IEFwcC5jb25maWcuY29tbW9ucy5tYXA7XHJcbiAgICAgIGNsZWFyQ29udGVudCgpO1xyXG4gICAgICBib2R5LmRhdGFzZXQuYWN0aXZlID0gJ2luZm8nO1xyXG4gICAgICBpbmZvLmluaXQoKTtcclxuICAgICAgZWRpdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgIGRlbGV0ZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgIHV0aWxzLmZpbmRCeUlkKG1hcCwgJ2VzdGF0ZXMnKS5nZXRTb3VyY2UoKS5nZXRGZWF0dXJlcygpXHJcbiAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIHJlc2V0U3R5bGUoZmVhdHVyZSkge1xyXG4gICAgICAgIGZlYXR1cmUuc2V0U3R5bGUobnVsbCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbiBlcnJvcihlKSB7XHJcbiAgICAgIHZhciBtc2cgPSB7IG1lc3NhZ2U6IGUgfTtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgIHNuYWNrYmFyQ29udGFpbmVyLk1hdGVyaWFsU25hY2tiYXIuc2hvd1NuYWNrYmFyKG1zZyk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gd2hhdFRvRGVsZXRlKCkge1xyXG4gICAgdmFyIGNoZWNrYm94ZXMgPSBkaWFsb2cucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1vcHRpb25zXScpO1xyXG4gICAgdmFyIHZhbHVlcyA9IHt9O1xyXG4gICAgaWYgKGNoZWNrYm94ZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIFtdLmZvckVhY2guY2FsbChjaGVja2JveGVzLCBmdW5jdGlvbiBnZXRWYWx1ZXMoZWwpIHtcclxuICAgICAgICB2YXIga2V5ID0gXy5sYXN0KF8uc3BsaXQoZWwuZ2V0QXR0cmlidXRlKCdpZCcpLCAnLScsIDMpKTtcclxuICAgICAgICB2YWx1ZXNba2V5XSA9IGVsLmNoZWNrZWQ7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlcztcclxuICB9XHJcbiAgZnVuY3Rpb24gY2FuY2VsRGVsZXRlKCkge1xyXG4gICAgZGlhbG9nLmNsb3NlKCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGNvbmZpcm1EZWxldGUoKSB7XHJcbiAgICB2YXIgZGF0YTtcclxuICAgIHZhciBjaG9vc2VyID0gd2hhdFRvRGVsZXRlKCk7XHJcbiAgICBpZiAoXy5pc0VtcHR5KGNob29zZXIpKSB7XHJcbiAgICAgIGRhdGEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXN0YXRlX19pbmZvLWdpZCcpLnZhbHVlO1xyXG4gICAgICBkZWxldGVFc3RhdGVBbmRMaXN0aW5nKGRhdGEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGNob29zZXIubGlzdGluZyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIGRhdGEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdGluZ19faWRBbmRUeXBlLWlkJykudmFsdWU7XHJcbiAgICAgICAgZGVsZXRlTGlzdGluZyhkYXRhKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY2hvb3Nlci5lc3RhdGUgPT09IHRydWUpIHtcclxuICAgICAgICBkYXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VzdGF0ZV9faW5mby1naWQnKS52YWx1ZTtcclxuICAgICAgICBkZWxldGVFc3RhdGVBbmRMaXN0aW5nKGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBkaWFsb2cuY2xvc2UoKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gc2hvdygpIHtcclxuICAgIHZhciBsaXN0aW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RpbmdfX2lkQW5kVHlwZS1pZCcpO1xyXG4gICAgdmFyIGRhdGEgPSB7fTtcclxuICAgIGlmIChsaXN0aW5nID09PSBudWxsKSB7XHJcbiAgICAgIGRhdGEudGl0bGUgPSAnRGVsZXRlIEVzdGF0ZSc7XHJcbiAgICAgIGRhdGEuY2hvb3NlID0gZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkYXRhLnRpdGxlID0gJ1BsZWFzZSBjaG9vc2Ugd2hhdCB5b3Ugd2FudCB0byBkZWxldGUnO1xyXG4gICAgICBkYXRhLmNob29zZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBkdXN0Qmx1ZWJpcmQucmVuZGVyQXN5bmMoJ2RlbGV0ZURpYWxvZycsIGRhdGEpXHJcbiAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlRHVzdChyZXN1bHQpIHtcclxuICAgICAgZGlhbG9nLmlubmVySFRNTCA9IHJlc3VsdDtcclxuICAgICAgZGlhbG9nLnNob3dNb2RhbCgpO1xyXG4gICAgfSlcclxuICAgIC50aGVuKGZ1bmN0aW9uIHJlc29sdmUoKSB7XHJcbiAgICAgIGRpYWxvZy5xdWVyeVNlbGVjdG9yKCcjY2FuY2VsRGVsZXRlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjYW5jZWxEZWxldGUpO1xyXG4gICAgICBkaWFsb2cucXVlcnlTZWxlY3RvcignI2NvbmZpcm1EZWxldGUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNvbmZpcm1EZWxldGUpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbiBlcnJvcihlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGluaXREaWFsb2coKSB7XHJcbiAgICBpZiAoISBkaWFsb2cuc2hvd01vZGFsKSB7XHJcbiAgICAgIGRpYWxvZ1BvbHlmaWxsLnJlZ2lzdGVyRGlhbG9nKGRpYWxvZyk7XHJcbiAgICB9XHJcbiAgICBzaG93KCk7XHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0OiBpbml0RGlhbG9nXHJcbiAgfTtcclxufSh3aW5kb3csIGRvY3VtZW50LCBQcm9taXNlLCBqUXVlcnksIEFwcCwgZGlhbG9nUG9seWZpbGwpKTtcclxuIiwiQXBwLmNvbmZpZy5tb2R1bGVzLmluc2VydCA9IChmdW5jdGlvbiBlZGl0KHdpbmRvdywgZG9jdW1lbnQsIFByb21pc2UsICQsIEFwcCwgZFBpY2ssIG1vbWVudCwgZGlhbG9nUG9seWZpbGwsIGNsb3VkaW5hcnksIGJvd3Nlcikge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuICB2YXIgbGFuZyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nO1xyXG4gIHZhciBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG4gIHZhciB1dGlscyA9IEFwcC51dGlscztcclxuICB2YXIgZHVzdEJsdWViaXJkID0gQXBwLmNvbmZpZy5wcm9taXNlcy5kdXN0Qmx1ZWJpcmQ7XHJcbiAgdmFyIGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwd3JhcHBlcl9faW5mb2JveC1jb250ZW50Jyk7XHJcbiAgdmFyIGFkZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnNlcnQnKTtcclxuICB2YXIgaW5mbyA9IEFwcC5jb25maWcubW9kdWxlcy5pbmZvO1xyXG4gIHZhciBkcmF3bkNvbGxlY3Rpb24gPSBuZXcgb2wuQ29sbGVjdGlvbigpO1xyXG4gIGZ1bmN0aW9uIGNsZWFyQ29udGVudCgpIHtcclxuICAgIGlmIChjb250ZW50LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29udGVudC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGl2ZU1vZHVsZScpLmlubmVySFRNTCA9ICdJbmZvcm1hdGlvbic7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGludmFsaWRhdGUoKSB7XHJcbiAgICB2YXIgaW5wdXRzID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPXRleHRdJyk7XHJcbiAgICBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoaW5wdXRzLCBmdW5jdGlvbiBzZXRJbnZhbGlkKG9iaikge1xyXG4gICAgICBpZiAob2JqLnZhbHVlID09PSAnJykge1xyXG4gICAgICAgIHV0aWxzLmFkZENsYXNzKG9iai5wYXJlbnROb2RlLCAnaXMtaW52YWxpZCcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHV0aWxzLnJlbW92ZUNsYXNzKG9iai5wYXJlbnROb2RlLCAnaXMtaW52YWxpZCcpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gY2hlY2tFbXB0eSgpIHtcclxuICAgIHZhciBpbnB1dHMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9dGV4dF0nKTtcclxuICAgIHJldHVybiBfLnNvbWUoaW5wdXRzLCBmdW5jdGlvbiBpc0VtcHR5KGlucHV0KSB7XHJcbiAgICAgIGlmIChpbnB1dC52YWx1ZSA9PT0gJycpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gZ2V0SW50ZXJhY3Rpb24oaWQpIHtcclxuICAgIHZhciBtYXAgPSBBcHAuY29uZmlnLmNvbW1vbnMubWFwO1xyXG4gICAgdmFyIGludGVyYWN0aW9ucyA9IG1hcC5nZXRJbnRlcmFjdGlvbnMoKTtcclxuICAgIHZhciBmb3VuZCA9IHt9O1xyXG4gICAgaW50ZXJhY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gZ2V0SW50ZXJhY3Rpb25JZChpbnRlcmFjdGlvbikge1xyXG4gICAgICBpZiAoaW50ZXJhY3Rpb24uZ2V0KCdpZCcpID09PSBpZCkge1xyXG4gICAgICAgIGZvdW5kID0gaW50ZXJhY3Rpb247XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZm91bmQ7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGRhdGVQaWNrZXIoKSB7XHJcbiAgICB2YXIgZm9ybWF0ID0gKGxhbmcgPT09ICdlbCcpID8gJ0RELU1NLVlZWVknIDogJ01NLURELVlZWVknO1xyXG4gICAgdmFyIGRhdGVTdGFydFBpY2tlcjtcclxuICAgIHZhciBkYXRlRW5kUGlja2VyO1xyXG4gICAgdmFyIGRhdGVTdGFydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmZvYm94X19kYXRlLXN0YXJ0Jyk7XHJcbiAgICB2YXIgZGF0ZUVuZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmZvYm94X19kYXRlLWVuZCcpO1xyXG4gICAgdmFyIGRhdGVTdGFydElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RpbmdfX2dlbmVyYWwtZGF0ZVN0YXJ0Jyk7XHJcbiAgICB2YXIgZGF0ZUVuZElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RpbmdfX2dlbmVyYWwtZGF0ZUVuZCcpO1xyXG4gICAgdmFyIG9ic2VydmVEYXRlUGlja2VyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gb2JzZXJ2ZURhdGVQaWNrZXIobXV0YXRpb25zKSB7XHJcbiAgICAgIHZhciBhdHRyaWJ1dGVWYWx1ZTtcclxuICAgICAgbXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24gdG9nZ2xlVW5jbGlja2FibGVJbmZvYm94KG11dGF0aW9uKSB7XHJcbiAgICAgICAgaWYgKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT09ICdjbGFzcycpIHtcclxuICAgICAgICAgIGF0dHJpYnV0ZVZhbHVlID0gJChtdXRhdGlvbi50YXJnZXQpLnByb3AobXV0YXRpb24uYXR0cmlidXRlTmFtZSk7XHJcbiAgICAgICAgICBpZiAoYXR0cmlidXRlVmFsdWUuaW5kZXhPZignbWRkdHAtcGlja2VyLS1pbmFjdGl2ZScpID4gLTEpIHtcclxuICAgICAgICAgICAgdXRpbHMucmVtb3ZlQ2xhc3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcHdyYXBwZXJfX2luZm9ib3gnKSwgJ3VuY2xpY2thYmxlJyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1dGlscy5hZGRDbGFzcyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwd3JhcHBlcl9faW5mb2JveCcpLCAndW5jbGlja2FibGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKGRhdGVTdGFydElucHV0ICE9PSBudWxsKSB7XHJcbiAgICAgIGRhdGVTdGFydFBpY2tlciA9IG5ldyBkUGljay5kZWZhdWx0KHtcclxuICAgICAgICB0eXBlOiAnZGF0ZScsXHJcbiAgICAgICAgaW5pdDogbW9tZW50KCksXHJcbiAgICAgICAgZnV0dXJlOiBtb21lbnQoKS5hZGQoNSwgJ3llYXJzJyksXHJcbiAgICAgICAgdHJpZ2dlcjogZGF0ZVN0YXJ0SW5wdXQsXHJcbiAgICAgICAgb3JpZW50YXRpb246ICdQT1JUUkFJVCdcclxuICAgICAgfSk7XHJcbiAgICAgIG9ic2VydmVEYXRlUGlja2VyLm9ic2VydmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21kZHRwLXBpY2tlcl9fZGF0ZScpLCB7XHJcbiAgICAgICAgYXR0cmlidXRlczogdHJ1ZVxyXG4gICAgICB9KTtcclxuICAgICAgaWYgKGJvd3Nlci5uYW1lICE9PSAnQ2hyb21lJykge1xyXG4gICAgICAgIGRhdGVTdGFydElucHV0LnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcclxuICAgICAgICBkYXRlU3RhcnRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdvbk9rJywgZnVuY3Rpb24gZGlzcGxheVBpY2tlZGF0ZSgpIHtcclxuICAgICAgICAgIHV0aWxzLmFkZENsYXNzKHRoaXMucGFyZW50Tm9kZSwgJ2lzLWRpcnR5Jyk7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gZGF0ZVN0YXJ0UGlja2VyLnRpbWUuZm9ybWF0KGZvcm1hdCkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRhdGVTdGFydElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ29uT2snLCBmdW5jdGlvbiBkaXNwbGF5UGlja2VkYXRlKCkge1xyXG4gICAgICAgICAgdXRpbHMuYWRkQ2xhc3ModGhpcy5wYXJlbnROb2RlLCAnaXMtZGlydHknKTtcclxuICAgICAgICAgIHRoaXMudmFsdWUgPSBkYXRlU3RhcnRQaWNrZXIudGltZS5mb3JtYXQoZm9ybWF0KS50b1N0cmluZygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGRhdGVTdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIHNob3dEYXRlUGlja2VyKCkge1xyXG4gICAgICAgIGRhdGVTdGFydFBpY2tlci50b2dnbGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZGF0ZUVuZElucHV0ICE9PSBudWxsKSB7XHJcbiAgICAgIGlmIChib3dzZXIubmFtZSAhPT0gJ0Nocm9tZScpIHtcclxuICAgICAgICBkYXRlRW5kSW5wdXQucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgIGRhdGVFbmRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdvbk9rJywgZnVuY3Rpb24gZGlzcGxheVBpY2tlZGF0ZSgpIHtcclxuICAgICAgICAgIHV0aWxzLmFkZENsYXNzKHRoaXMucGFyZW50Tm9kZSwgJ2lzLWRpcnR5Jyk7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gZGF0ZUVuZFBpY2tlci50aW1lLmZvcm1hdChmb3JtYXQpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkYXRlRW5kSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignb25PaycsIGZ1bmN0aW9uIGRpc3BsYXlQaWNrZWRhdGUoKSB7XHJcbiAgICAgICAgICB1dGlscy5hZGRDbGFzcyh0aGlzLnBhcmVudE5vZGUsICdpcy1kaXJ0eScpO1xyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IGRhdGVFbmRQaWNrZXIudGltZS5mb3JtYXQoZm9ybWF0KS50b1N0cmluZygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGRhdGVFbmRQaWNrZXIgPSBuZXcgZFBpY2suZGVmYXVsdCh7XHJcbiAgICAgICAgdHlwZTogJ2RhdGUnLFxyXG4gICAgICAgIGluaXQ6IG1vbWVudCgpLFxyXG4gICAgICAgIGZ1dHVyZTogbW9tZW50KCkuYWRkKDUsICd5ZWFycycpLFxyXG4gICAgICAgIHRyaWdnZXI6IGRhdGVFbmRJbnB1dCxcclxuICAgICAgICBvcmllbnRhdGlvbjogJ1BPUlRSQUlUJ1xyXG4gICAgICB9KTtcclxuICAgICAgb2JzZXJ2ZURhdGVQaWNrZXIub2JzZXJ2ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWRkdHAtcGlja2VyX19kYXRlJyksIHtcclxuICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgICBkYXRlRW5kQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gc2hvd0RhdGVQaWNrZXIoKSB7XHJcbiAgICAgICAgZGF0ZUVuZFBpY2tlci50b2dnbGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIHNldEVzdGF0ZVR5cGUodHlwZSkge1xyXG4gICAgdmFyIHR5cGVzO1xyXG4gICAgaWYgKGxhbmcgPT09ICdlbCcpIHtcclxuICAgICAgdHlwZXMgPSB7XHJcbiAgICAgICAgzpTOuc6xzrzOrc+BzrnPg868zrE6IGZ1bmN0aW9uIGdldEFwYXJ0bWVudCgpIHtcclxuICAgICAgICAgIHJldHVybiAnQXBhcnRtZW50JztcclxuICAgICAgICB9LFxyXG4gICAgICAgIM6czr/Ovc6/zrrOsc+Ezr/Ouc66zq/OsTogZnVuY3Rpb24gZ2V0RGV0YWNoZWRIb3VzZSgpIHtcclxuICAgICAgICAgIHJldHVybiAnRGV0YWNoZWQgSG91c2UnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgzpzOtc62zr/Ovc6tz4TOsTogZnVuY3Rpb24gZ2V0TWFpc29uZXR0ZSgpIHtcclxuICAgICAgICAgIHJldHVybiAnTWFpc29uZXR0ZSc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICDOiM+AzrHPhc67zrc6IGZ1bmN0aW9uIGdldFZpbGxhKCkge1xyXG4gICAgICAgICAgcmV0dXJuICdWaWxsYSc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdHlwZXMgPSB7XHJcbiAgICAgICAgQXBhcnRtZW50OiBmdW5jdGlvbiBnZXRBcGFydG1lbnQoKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ86UzrnOsc68zq3Pgc65z4POvM6xJztcclxuICAgICAgICB9LFxyXG4gICAgICAgICdEZXRhY2hlZCBIb3VzZSc6IGZ1bmN0aW9uIGdldERldGFjaGVkSG91c2UoKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ86czr/Ovc6/zrrOsc+Ezr/Ouc66zq/OsSc7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBNYWlzb25ldHRlOiBmdW5jdGlvbiBnZXRNYWlzb25ldHRlKCkge1xyXG4gICAgICAgICAgcmV0dXJuICfOnM61zrbOv869zq3PhM6xJztcclxuICAgICAgICB9LFxyXG4gICAgICAgIFZpbGxhOiBmdW5jdGlvbiBnZXRWaWxsYSgpIHtcclxuICAgICAgICAgIHJldHVybiAnzojPgM6xz4XOu863JztcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHlwZXNbdHlwZV0oKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gYXNzaWduVmFsaWRhdG9ycygpIHtcclxuICAgIHZhciBpbnB1dHMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9dGV4dF0nKTtcclxuICAgIFtdLmZvckVhY2guY2FsbChpbnB1dHMsIGZ1bmN0aW9uIG1ha2VQYXJzbGV5SW5wdXRzKGVsKSB7XHJcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiBzbml0aXplKCkge1xyXG4gICAgICAgIHZhciBzdHIgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIHZhciBzYW5pdGl6ZWRTdHI7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YXNldC50eXBlID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgc2FuaXRpemVkU3RyID0gc3RyLnJlcGxhY2UoL1svXFxELyBdL2dpLCAnJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRhdGFzZXQudHlwZSA9PT0gJ2FscGhhbnVtJykge1xyXG4gICAgICAgICAgc2FuaXRpemVkU3RyID0gc3RyLnJlcGxhY2UoL1teYS16MC05QS1aQS16zpEtzqnOsS3Pic6vz4rOkM+MzqzOrc+Nz4vOsM6uz44gXS9naSwgJycpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhc2V0LnR5cGUgPT09ICdzcGVjaWFsJykge1xyXG4gICAgICAgICAgc2FuaXRpemVkU3RyID0gc3RyLnJlcGxhY2UoL1teMC05IFxcL10vZ2ksICcnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGF0YXNldC50eXBlID09PSAnZGF0ZScpIHtcclxuICAgICAgICAgIHNhbml0aXplZFN0ciA9IHN0ci5yZXBsYWNlKC9bXjAtOSBcXC1dL2dpLCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmFsdWUgPSBzYW5pdGl6ZWRTdHI7XHJcbiAgICAgICAgdXRpbHMucmVtb3ZlQ2xhc3ModGhpcy5wYXJlbnROb2RlLCAnaXMtaW52YWxpZCcpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBjb2xsZWN0VmFsdWVzKGdldFhZKSB7XHJcbiAgICB2YXIgbWFwID0gQXBwLmNvbmZpZy5jb21tb25zLm1hcDtcclxuICAgIHZhciB2YWx1ZXMgPSB7fTtcclxuICAgIHZhciBmaWx0ZXJlZFZhbHVlcyA9IHt9O1xyXG4gICAgdmFyIGlucHV0cyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT10ZXh0XScpO1xyXG4gICAgdmFyIGNoZWNrYm94ZXMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9Y2hlY2tib3hdJyk7XHJcbiAgICB2YWx1ZXMuZXN0YXRlID0ge307XHJcbiAgICB2YWx1ZXMubGlzdGluZyA9IHt9O1xyXG4gICAgaWYgKGdldFhZKSB7XHJcbiAgICAgIHZhbHVlcy5lc3RhdGUueCA9IHV0aWxzLmZpbmRCeUlkKG1hcCwgJ25ld0VzdGF0ZXMnKVxyXG4gICAgICAuZ2V0U291cmNlKCkuZ2V0RmVhdHVyZXMoKVswXS5nZXRHZW9tZXRyeSgpLmdldENvb3JkaW5hdGVzKClbMF07XHJcbiAgICAgIHZhbHVlcy5lc3RhdGUueSA9IHV0aWxzLmZpbmRCeUlkKG1hcCwgJ25ld0VzdGF0ZXMnKVxyXG4gICAgICAuZ2V0U291cmNlKCkuZ2V0RmVhdHVyZXMoKVswXS5nZXRHZW9tZXRyeSgpLmdldENvb3JkaW5hdGVzKClbMV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YWx1ZXMuZXN0YXRlLnggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXN0YXRlJykuZGF0YXNldC5vcmlnaW5hbHg7XHJcbiAgICAgIHZhbHVlcy5lc3RhdGUueSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlc3RhdGUnKS5kYXRhc2V0Lm9yaWdpbmFseTtcclxuICAgIH1cclxuICAgIFtdLmZvckVhY2guY2FsbChpbnB1dHMsIGZ1bmN0aW9uIGNvbGxlY3RGcm9tSW5wdXRzKGVsKSB7XHJcbiAgICAgIHZhciBuYW1lID0gXy5sYXN0KF8uc3BsaXQoZWwuZ2V0QXR0cmlidXRlKCdpZCcpLCAnLScsIDMpKTtcclxuICAgICAgdmFyIHZhbHVlID0gZWwudmFsdWU7XHJcbiAgICAgIGlmIChsYW5nID09PSAnZWwnKSB7XHJcbiAgICAgICAgaWYgKG5hbWUgPT09ICd0eXBlJyAmJiBlbC5pZCA9PT0gJ2VzdGF0ZV9fZ2VuZXJhbF9lc3RhdGUtdHlwZScpIHtcclxuICAgICAgICAgIHZhbHVlcy5lc3RhdGUuZXN0YXRldHlwZUVuID0gc2V0RXN0YXRlVHlwZSh2YWx1ZSk7XHJcbiAgICAgICAgICB2YWx1ZXMuZXN0YXRlLmVzdGF0ZXR5cGUgPSB2YWx1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5hbWUgPT09ICd0eXBlJyAmJiBlbC5pZCA9PT0gJ2xpc3RpbmdfX2lkQW5kVHlwZS10eXBlJykge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID09PSAnU2FsZScgfHwgdmFsdWUgPT09ICfOoM+OzrvOt8+DzrcnKSB7XHJcbiAgICAgICAgICAgIHZhbHVlcy5saXN0aW5nLnNhbGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YWx1ZXMubGlzdGluZy5yZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWx1ZXMubGlzdGluZy5zYWxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhbHVlcy5saXN0aW5nLnJlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmFtZSA9PT0gJ2FkZHJlc3MnKSB7XHJcbiAgICAgICAgICB2YWx1ZXMuZXN0YXRlLnN0cmVldEVuID0gdXRpbHMuZWxUb0VuKHZhbHVlKTtcclxuICAgICAgICAgIHZhbHVlcy5lc3RhdGUuc3RyZWV0RWwgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKG5hbWUgPT09ICd0eXBlJyAmJiBlbC5pZCA9PT0gJ2VzdGF0ZV9fZ2VuZXJhbF9lc3RhdGUtdHlwZScpIHtcclxuICAgICAgICAgIHZhbHVlcy5lc3RhdGUuZXN0YXRldHlwZUVuID0gdmFsdWU7XHJcbiAgICAgICAgICB2YWx1ZXMuZXN0YXRlLmVzdGF0ZXR5cGUgPSBzZXRFc3RhdGVUeXBlKHZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5hbWUgPT09ICd0eXBlJyAmJiBlbC5pZCA9PT0gJ2xpc3RpbmdfX2lkQW5kVHlwZS10eXBlJykge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID09PSAnU2FsZScgfHwgdmFsdWUgPT09ICfOoM+OzrvOt8+DzrcnKSB7XHJcbiAgICAgICAgICAgIHZhbHVlcy5saXN0aW5nLnNhbGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YWx1ZXMubGlzdGluZy5yZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWx1ZXMubGlzdGluZy5zYWxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhbHVlcy5saXN0aW5nLnJlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmFtZSA9PT0gJ2FkZHJlc3MnKSB7XHJcbiAgICAgICAgICB2YWx1ZXMuZXN0YXRlLnN0cmVldEVuID0gdmFsdWU7XHJcbiAgICAgICAgICB2YWx1ZXMuZXN0YXRlLnN0cmVldEVsID0gdXRpbHMuZWxUb0VuKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG5hbWUgPT09ICdhZGRyZXNzTnVtYmVyJykge1xyXG4gICAgICAgIHZhbHVlcy5lc3RhdGUuc3RyZWV0TnVtYmVyID0gdmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG5hbWUgPT09ICdwcmljZScpIHtcclxuICAgICAgICB2YWx1ZXMubGlzdGluZy5wcmljZSA9IHZhbHVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChuYW1lID09PSAnZGF0ZVN0YXJ0JyB8fCBuYW1lID09PSAnZGF0ZUVuZCcpIHtcclxuICAgICAgICB2YWx1ZXMubGlzdGluZ1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhbHVlcy5lc3RhdGVbbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBbXS5mb3JFYWNoLmNhbGwoY2hlY2tib3hlcywgZnVuY3Rpb24gY29sbGVjdEZyb21DaGVja2JveGVzKGVsKSB7XHJcbiAgICAgIHZhciBuYW1lID0gXy5sYXN0KF8uc3BsaXQoZWwuZ2V0QXR0cmlidXRlKCdpZCcpLCAnLScsIDMpKTtcclxuICAgICAgdmFyIHZhbHVlID0gZWwuY2hlY2tlZDtcclxuICAgICAgaWYgKG5hbWUgIT09ICdwZXRzJykge1xyXG4gICAgICAgIHZhbHVlcy5lc3RhdGVbbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YWx1ZXMubGlzdGluZ1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGZpbHRlcmVkVmFsdWVzLmVzdGF0ZSA9IF8ub21pdCh2YWx1ZXMuZXN0YXRlLCBbJ2FkZHJlc3MnLCAnYWRkcmVzc051bWJlcicsICd0eXBlJywgJ3RvZ2dsZSddKTtcclxuICAgIGZpbHRlcmVkVmFsdWVzLmxpc3RpbmcgPSB2YWx1ZXMubGlzdGluZztcclxuICAgIHJldHVybiBmaWx0ZXJlZFZhbHVlcztcclxuICB9XHJcbiAgZnVuY3Rpb24gYWpheEVzdGF0ZUFuZExpc3RpbmcoZGF0YSkge1xyXG4gICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICBkYXRhLmVzdGF0ZS5hZG1pbklkID0gd2luZG93LmlkO1xyXG4gICAgY29uc29sZS5sb2coZGF0YS5lc3RhdGUpO1xyXG4gICAgUHJvbWlzZS5yZXNvbHZlKFxyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9hcGkvcHJvcGVydHknLFxyXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICBkYXRhOiBkYXRhLmVzdGF0ZVxyXG4gICAgICB9KVxyXG4gICAgICApXHJcbiAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKGVzdGF0ZWRhdGEpIHtcclxuICAgICAgdmFyIGdpZCA9IGVzdGF0ZWRhdGEuZ2lkO1xyXG4gICAgICB2YXIgdXBsb2FkT3B0aW9ucyA9IHtcclxuICAgICAgICBjbG91ZF9uYW1lOiAnZmlydmFpbicsXHJcbiAgICAgICAgdXBsb2FkX3ByZXNldDogJ3Rlc3R1cGxvYWQnLFxyXG4gICAgICAgIGZvbGRlcjogZ2lkLFxyXG4gICAgICAgIGNsaWVudF9hbGxvd2VkX2Zvcm1hdHM6ICdqcGcnLFxyXG4gICAgICAgIHRoZW1lOiAnbWluaW1hbCcsXHJcbiAgICAgICAgdGFnczogZ2lkXHJcbiAgICAgIH07XHJcbiAgICAgIGNsb3VkaW5hcnkub3BlblVwbG9hZFdpZGdldCh1cGxvYWRPcHRpb25zLCBmdW5jdGlvbiB1cGxvYWQoZXJyb3IsIHJlc3VsdCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yLCByZXN1bHQpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGdpZDtcclxuICAgIH0pXHJcbiAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKGdpZCkge1xyXG4gICAgICBkYXRhLmxpc3RpbmcuZ2lkID0gZ2lkO1xyXG4gICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICB1cmw6ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAvYXBpL2xpc3RpbmcnLFxyXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICBkYXRhOiBkYXRhLmxpc3RpbmdcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgLmZpbmFsbHkoZnVuY3Rpb24gY2xvc2VJbnNlcnQoKSB7XHJcbiAgICAgIGNsZWFyQ29udGVudCgpO1xyXG4gICAgICB1dGlscy5hZGRDbGFzcyhjb250ZW50LCAndmlzdWFsbHloaWRkZW4nKTtcclxuICAgICAgYm9keS5kYXRhc2V0LmFjdGl2ZSA9ICdpbmZvJztcclxuICAgICAgaW5mby5pbml0KCk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGZ1bmN0aW9uIGVycm9yKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gYWpheExpc3RpbmcoZGF0YSkge1xyXG4gICAgUHJvbWlzZS5yZXNvbHZlKFxyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9hcGkvbGlzdGluZycsXHJcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgIGRhdGE6IF8ubWVyZ2UoeyBnaWQ6IGRhdGEuZ2lkIH0sIGRhdGEubGlzdGluZylcclxuICAgICAgfSlcclxuICAgICAgKVxyXG4gICAgLnRoZW4oZnVuY3Rpb24gcmVzb2x2ZShyZXN1bHQpIHtcclxuICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcclxuICAgIH0pXHJcbiAgICAuZmluYWxseShmdW5jdGlvbiBjbG9zZUluc2VydCgpIHtcclxuICAgICAgY2xlYXJDb250ZW50KCk7XHJcbiAgICAgIHV0aWxzLmFkZENsYXNzKGNvbnRlbnQsICd2aXN1YWxseWhpZGRlbicpO1xyXG4gICAgICBib2R5LmRhdGFzZXQuYWN0aXZlID0gJ2luZm8nO1xyXG4gICAgICBpbmZvLmluaXQoKTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZnVuY3Rpb24gZXJyb3IoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiByZW5kZXJEdXN0TGlzdGluZygpIHtcclxuICAgIGR1c3RCbHVlYmlyZC5yZW5kZXJBc3luYygnaW5zZXJ0TGlzdGluZycsIF8uY2xvbmVEZWVwKEFwcC5jb25maWcuY29tbW9ucy50cmFucykpXHJcbiAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKGRhdGEpIHtcclxuICAgICAgdmFyIGFncmVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbmZpcm1CdG5zX19hZ3JlZScpO1xyXG4gICAgICB2YXIgZGlzYWdyZWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29uZmlybUJ0bnNfX2Rpc2FncmVlJyk7XHJcbiAgICAgICQoJyNlc3RhdGUnKS5hZnRlcihkYXRhKTtcclxuICAgICAgZ2V0bWRsU2VsZWN0LmluaXQoJy5nZXRtZGwtc2VsZWN0Jyk7XHJcbiAgICAgIHV0aWxzLnJlbW92ZUNsYXNzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb25maXJtQnRucycpLCAndmlzdWFsbHloaWRkZW4nKTtcclxuICAgICAgYXNzaWduVmFsaWRhdG9ycygpO1xyXG4gICAgICBkYXRlUGlja2VyKCk7XHJcbiAgICAgIGRpc2FncmVlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gaW5zZXJ0QWdyZWUoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGNsZWFyQ29udGVudCgpO1xyXG4gICAgICAgIGNvbnRlbnQuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgdXRpbHMuYWRkQ2xhc3MoY29udGVudCwgJ3Zpc3VhbGx5aGlkZGVuJyk7XHJcbiAgICAgICAgYm9keS5kYXRhc2V0LmFjdGl2ZSA9IGluZm87XHJcbiAgICAgICAgaW5mby5pbml0KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBhZ3JlZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIGluc2VydENvbnRpbnVlKGUpIHtcclxuICAgICAgICB2YXIgYWpheERhdGE7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgaWYgKGNoZWNrRW1wdHkoKSAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgYWpheERhdGEgPSBjb2xsZWN0VmFsdWVzKGZhbHNlKTtcclxuICAgICAgICAgIGFqYXhEYXRhLmdpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlc3RhdGVfX2luZm8tZ2lkJykudmFsdWU7XHJcbiAgICAgICAgICBhamF4TGlzdGluZyhhamF4RGF0YSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGludmFsaWRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbiBlcnJvcihlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIHJlbmRlckR1c3RFc2F0ZUFuZExpc3RpbmcoKSB7XHJcbiAgICB2YXIgbWFwID0gQXBwLmNvbmZpZy5jb21tb25zLm1hcDtcclxuICAgIHZhciBkcmF3ID0gZ2V0SW50ZXJhY3Rpb24oJ25ld0VzdGF0ZScpO1xyXG4gICAgdmFyIHJlbmRlckRhdGEgPSBfLmNsb25lRGVlcChBcHAuY29uZmlnLmNvbW1vbnMudHJhbnMpO1xyXG4gICAgZHVzdEJsdWViaXJkLnJlbmRlckFzeW5jKCdpbnNlcnQnLCByZW5kZXJEYXRhKVxyXG4gICAgLnRoZW4oZnVuY3Rpb24gcmVzb2x2ZShkYXRhKSB7XHJcbiAgICAgIGNsZWFyQ29udGVudCgpO1xyXG4gICAgICBjb250ZW50LmlubmVySFRNTCA9IGRhdGE7XHJcbiAgICAgIHV0aWxzLnJlbW92ZUNsYXNzKGNvbnRlbnQsICd2aXN1YWxseWhpZGRlbicpO1xyXG4gICAgICBnZXRtZGxTZWxlY3QuaW5pdCgnLmdldG1kbC1zZWxlY3QnKTtcclxuICAgIH0pXHJcbiAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKGRhdGEpIHtcclxuICAgICAgdmFyIGFncmVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbmZpcm1CdG5zX19hZ3JlZScpO1xyXG4gICAgICB2YXIgZGlzYWdyZWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29uZmlybUJ0bnNfX2Rpc2FncmVlJyk7XHJcbiAgICAgIHZhciBsaXN0aW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RpbmcnKTtcclxuICAgICAgYXNzaWduVmFsaWRhdG9ycygpO1xyXG4gICAgICBkYXRlUGlja2VyKCk7XHJcbiAgICAgIGRpc2FncmVlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gaW5zZXJ0QWdyZWUoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGNsZWFyQ29udGVudCgpO1xyXG4gICAgICAgIC8vIGNvbnRlbnQuaW5uZXJIVE1MID0gZGF0YTtcclxuICAgICAgICB1dGlscy5hZGRDbGFzcyhjb250ZW50LCAndmlzdWFsbHloaWRkZW4nKTtcclxuICAgICAgICBib2R5LmRhdGFzZXQuYWN0aXZlID0gaW5mbztcclxuICAgICAgICBkcmF3LnNldEFjdGl2ZShmYWxzZSk7XHJcbiAgICAgICAgdXRpbHMuZmluZEJ5SWQobWFwLCAnbmV3RXN0YXRlcycpLmdldFNvdXJjZSgpLmNsZWFyKCk7XHJcbiAgICAgICAgaW5mby5pbml0KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBhZ3JlZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIGluc2VydENvbnRpbnVlKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB1dGlscy5yZW1vdmVDbGFzcyhsaXN0aW5nLCAndmlzdWFsbHloaWRkZW4nKTtcclxuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICdBZ3JlZSc7XHJcbiAgICAgICAgZS50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLnR5cGUsIGluc2VydENvbnRpbnVlKTtcclxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gaW5zZXJ0QWdyZWUoZXZ0KSB7XHJcbiAgICAgICAgICB2YXIgYWpheERhdGE7XHJcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIC8vIGUudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZS50eXBlLCBpbnNlcnRBZ3JlZSk7XHJcbiAgICAgICAgICBpZiAoY2hlY2tFbXB0eSgpICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGFqYXhEYXRhID0gY29sbGVjdFZhbHVlcyh0cnVlKTtcclxuICAgICAgICAgICAgYWpheEVzdGF0ZUFuZExpc3RpbmcoYWpheERhdGEpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW52YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZnVuY3Rpb24gZXJyb3IoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlRHJhd0ludGVyYWN0aW9uKCkge1xyXG4gICAgdmFyIG1hcCA9IEFwcC5jb25maWcuY29tbW9ucy5tYXA7XHJcbiAgICB2YXIgZHJhdyA9IG5ldyBvbC5pbnRlcmFjdGlvbi5EcmF3KHtcclxuICAgICAgZmVhdHVyZXM6IGRyYXduQ29sbGVjdGlvbixcclxuICAgICAgc291cmNlOiB1dGlscy5maW5kQnlJZChtYXAsICduZXdFc3RhdGVzJykuZ2V0U291cmNlKCksXHJcbiAgICAgIHR5cGU6ICdQb2ludCdcclxuICAgIH0pO1xyXG4gICAgZHJhdy5zZXQoJ2lkJywgJ25ld0VzdGF0ZScpO1xyXG4gICAgZHJhdy5zZXRBY3RpdmUoZmFsc2UpO1xyXG4gICAgbWFwLmFkZEludGVyYWN0aW9uKGRyYXcpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBjaGVja0VzdGF0ZSgpIHtcclxuICAgIGlmIChjb250ZW50LmlubmVySFRNTCA9PT0gJ3VuZGVmaW5lZCcgfHwgY29udGVudC5pbm5lckhUTUwgPT09ICcnKSB7XHJcbiAgICAgIHJldHVybiAwOyAvLyBubyBlc3RhdGUgb3IgbGlzdGluZ1xyXG4gICAgfSBlbHNlIGlmIChjb250ZW50LmlubmVySFRNTCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RpbmcnKSAhPT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gMTsgIC8vIHRoZXJlIGlzIGEgbGlzdGluZ1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIDI7IC8vIHRoZXJlIGlzIG5vIGxpc3RpbmdcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGluc2VydCgpIHtcclxuICAgIHZhciBtYXAgPSBBcHAuY29uZmlnLmNvbW1vbnMubWFwO1xyXG4gICAgdmFyIGRyYXcgPSBnZXRJbnRlcmFjdGlvbignbmV3RXN0YXRlJyk7XHJcbiAgICB2YXIgbmV3RXN0YXRlcyA9IHV0aWxzLmZpbmRCeUlkKG1hcCwgJ25ld0VzdGF0ZXMnKTtcclxuICAgIGluZm8uZGlzYWJsZSgpO1xyXG4gICAgY29uc29sZS5sb2coY2hlY2tFc3RhdGUoKSk7XHJcbiAgICBpZiAoY2hlY2tFc3RhdGUoKSA9PT0gMCkge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aXZlTW9kdWxlJykuaW5uZXJIVE1MID0gJ0FkZCBFc3RhdGUgQW5kIExpc3RpbmcnO1xyXG4gICAgICBkcmF3LnNldEFjdGl2ZSh0cnVlKTtcclxuICAgICAgdXRpbHMuZmluZEJ5SWQobWFwLCAnbmV3RXN0YXRlcycpLnNldFZpc2libGUodHJ1ZSk7XHJcbiAgICAgIGRyYXduQ29sbGVjdGlvbi5vbignY2hhbmdlOmxlbmd0aCcsIGZ1bmN0aW9uIGtlZXBPbmx5T25lRXN0YXRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdldExlbmd0aCgpID4gMCkge1xyXG4gICAgICAgICAgZHJhdy5zZXRBY3RpdmUoZmFsc2UpO1xyXG4gICAgICAgICAgbmV3RXN0YXRlcy5nZXRTb3VyY2UoKS5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGRyYXcub24oJ2RyYXdlbmQnLCByZW5kZXJEdXN0RXNhdGVBbmRMaXN0aW5nKTtcclxuICAgIH0gZWxzZSBpZiAoY2hlY2tFc3RhdGUoKSA9PT0gMikge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aXZlTW9kdWxlJykuaW5uZXJIVE1MID0gJ0FkZCBMaXN0aW5nJztcclxuICAgICAgZHJhdy5zZXRBY3RpdmUoZmFsc2UpO1xyXG4gICAgICByZW5kZXJEdXN0TGlzdGluZygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZHJhdy5zZXRBY3RpdmUoZmFsc2UpO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aXZlTW9kdWxlJykuaW5uZXJIVE1MID0gJ0luZm9ybWF0aW9uJztcclxuICAgICAgaW5mby5pbml0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgaWYgKF8uaXNFbXB0eShnZXRJbnRlcmFjdGlvbignbmV3RXN0YXRlJykpKSB7XHJcbiAgICAgIGNyZWF0ZURyYXdJbnRlcmFjdGlvbigpO1xyXG4gICAgfVxyXG4gICAgaW5zZXJ0KCk7XHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0OiBpbml0XHJcbiAgfTtcclxufSh3aW5kb3csIGRvY3VtZW50LCBQcm9taXNlLCBqUXVlcnksIEFwcCwgbWREYXRlVGltZVBpY2tlciwgbW9tZW50LCBkaWFsb2dQb2x5ZmlsbCwgY2xvdWRpbmFyeSwgYm93c2VyKSk7XHJcbiIsInZhciB1c2VyTWFwID0gKGZ1bmN0aW9uIHVzZXJNYXAod2luZG93LCBkb2N1bWVudCwgUHJvbWlzZSwgJCwgQXBwKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG4gIHZhciBjb250ZXh0ID0gJ2FkbWluJztcclxuICB2YXIgbGFuZyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nO1xyXG4gIHZhciAkbG9hZGluZyA9ICQoJy5tZGwtc3Bpbm5lcicpO1xyXG4gICQoZG9jdW1lbnQpXHJcbiAgLmFqYXhTdGFydChmdW5jdGlvbiBzdGFydCgpIHtcclxuICAgICQoJy5zcGluZXItd3JhcHBlcicpLnJlbW92ZUNsYXNzKCd2aXN1YWxseWhpZGRlbicpO1xyXG4gICAgJGxvYWRpbmcuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG4gIH0pXHJcbiAgLmFqYXhTdG9wKGZ1bmN0aW9uIHN0b3AoKSB7XHJcbiAgICAkKCcuc3BpbmVyLXdyYXBwZXInKS5hZGRDbGFzcygndmlzdWFsbHloaWRkZW4nKTtcclxuICAgICRsb2FkaW5nLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcclxuICB9KTtcclxuICB0b2FzdHIub3B0aW9ucyA9IHtcclxuICAgIGNsb3NlQnV0dG9uOiBmYWxzZSxcclxuICAgIGRlYnVnOiBmYWxzZSxcclxuICAgIG5ld2VzdE9uVG9wOiBmYWxzZSxcclxuICAgIHByb2dyZXNzQmFyOiBmYWxzZSxcclxuICAgIHBvc2l0aW9uQ2xhc3M6ICd0b2FzdC10b3AtY2VudGVyJyxcclxuICAgIHByZXZlbnREdXBsaWNhdGVzOiBmYWxzZSxcclxuICAgIG9uY2xpY2s6IG51bGwsXHJcbiAgICBzaG93RHVyYXRpb246ICczMDAnLFxyXG4gICAgaGlkZUR1cmF0aW9uOiAnMTAwMCcsXHJcbiAgICB0aW1lT3V0OiAnNTAwMCcsXHJcbiAgICBleHRlbmRlZFRpbWVPdXQ6ICcxMDAwJyxcclxuICAgIHNob3dFYXNpbmc6ICdzd2luZycsXHJcbiAgICBoaWRlRWFzaW5nOiAnbGluZWFyJyxcclxuICAgIHNob3dNZXRob2Q6ICdmYWRlSW4nLFxyXG4gICAgaGlkZU1ldGhvZDogJ2ZhZGVPdXQnXHJcbiAgfTtcclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgUHJvbWlzZS5yZXNvbHZlKFxyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9hcGkvbGFuZ3VhZ2UnLFxyXG4gICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHR5cGU6IGxhbmcsXHJcbiAgICAgICAgICBjb250ZXh0OiBjb250ZXh0XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICApXHJcbiAgICAudGhlbihmdW5jdGlvbiByZXNvbHZlKGRhdGEpIHtcclxuICAgICAgQXBwLmNvbmZpZy5jb21tb25zLnRyYW5zID0gZGF0YTtcclxuICAgICAgQXBwLmNvbmZpZy5jb21tb25zLm1hcCA9IEFwcC5jb25maWcubW9kdWxlcy5tYXAuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfSlcclxuICAgIC50aGVuKGZ1bmN0aW9uIHJlc29sdmUoKSB7XHJcbiAgICAgIHZhciBtb2R1bGVPYnNlcnZlcjtcclxuICAgICAgQXBwLmNvbmZpZy5tb2R1bGVzLmluZm8uaW5pdCgpO1xyXG4gICAgICBtb2R1bGVPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIG1vZHVsZU9ic2VydmVyQ2hvb3NlcihtdXRhdGlvbnMpIHtcclxuICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaChmdW5jdGlvbiBmb2VyRWFjaE11dGF0aW9uKG11dGF0aW9uKSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIG11dGF0aW9uLnRhcmdldC5kYXRhc2V0ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBpZiAobXV0YXRpb24udGFyZ2V0LmRhdGFzZXQuYWN0aXZlID09PSAnaW5zZXJ0Jykge1xyXG4gICAgICAgICAgICAgIEFwcC5jb25maWcubW9kdWxlcy5pbnNlcnQuaW5pdCgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG11dGF0aW9uLnRhcmdldC5kYXRhc2V0LmFjdGl2ZSA9PT0gJ2RlbGV0ZScpIHtcclxuICAgICAgICAgICAgICBBcHAuY29uZmlnLm1vZHVsZXMuZGVsZXRlLmluaXQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChtdXRhdGlvbi50YXJnZXQuZGF0YXNldC5hY3RpdmUgPT09ICdlZGl0Jykge1xyXG4gICAgICAgICAgICAgIEFwcC5jb25maWcubW9kdWxlcy5lZGl0LmluaXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgbW9kdWxlT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JyksIHtcclxuICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbiBlcnJvcihlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0OiBpbml0XHJcbiAgfTtcclxufSh3aW5kb3csIGRvY3VtZW50LCBQcm9taXNlLCBqUXVlcnksIEFwcCkpO1xyXG5cclxudXNlck1hcC5pbml0KCk7XHJcblxyXG4kKGZ1bmN0aW9uIERyZWFkeSgpIHtcclxuICB2YXIgdXRpbHMgPSBBcHAudXRpbHM7XHJcbiAgdmFyIGFkZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnNlcnQnKTtcclxuICB2YXIgZGVsZXRlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbGV0ZScpO1xyXG4gIHZhciBlZGl0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VkaXQnKTtcclxuICAkKCcjbG9nb3V0JykuY2xpY2soZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgbG9jYXRpb24uaHJlZiA9ICcvbG9nb3V0JztcclxuICB9KTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW50ZXItZnVsbHNjcmVlbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgIGZ1bmN0aW9uIGFkZENsaWNrRXZlbnRUb0VudGVyRnVsbHNyZWVuKCkge1xyXG4gICAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgIHV0aWxzLnJlcXVlc3RGdWxsU2NyZWVuKGVsZW0pO1xyXG4gICAgICB1dGlscy5yZW1vdmVDbGFzcyhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhpdC1mdWxsc2NyZWVuJykucGFyZW50Tm9kZSwgJ3Zpc3VhbGx5aGlkZGVuJyk7XHJcbiAgICAgIHV0aWxzLmFkZENsYXNzKHRoaXMucGFyZW50Tm9kZSwgJ3Zpc3VhbGx5aGlkZGVuJyk7XHJcbiAgICB9XHJcbiAgKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhpdC1mdWxsc2NyZWVuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgZnVuY3Rpb24gYWRkQ2xpY2tFdmVudFRvRXhpdEZ1bGxzcmVlbigpIHtcclxuICAgICAgdmFyIGVsZW0gPSBkb2N1bWVudDtcclxuICAgICAgdXRpbHMuZXhpdEZ1bGxzcmVlbihlbGVtKTtcclxuICAgICAgdXRpbHMucmVtb3ZlQ2xhc3MoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VudGVyLWZ1bGxzY3JlZW4nKS5wYXJlbnROb2RlLCAndmlzdWFsbHloaWRkZW4nKTtcclxuICAgICAgdXRpbHMuYWRkQ2xhc3ModGhpcy5wYXJlbnROb2RlLCAndmlzdWFsbHloaWRkZW4nKTtcclxuICAgIH1cclxuICApO1xyXG4gIGFkZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIGFjdGl2YXRlSW5zZXJ0TW9kdWxlKCkge1xyXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcbiAgICBib2R5LmRhdGFzZXQuYWN0aXZlID0gJ2luc2VydCc7XHJcbiAgfSk7XHJcbiAgZGVsZXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gYWN0aXZhdGVEZWxldGVNb2R1bGUoKSB7XHJcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuICAgIGJvZHkuZGF0YXNldC5hY3RpdmUgPSAnZGVsZXRlJztcclxuICB9KTtcclxuICBlZGl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gYWN0aXZhdGVFZGl0TW9kdWxlKCkge1xyXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcbiAgICBib2R5LmRhdGFzZXQuYWN0aXZlID0gJ2VkaXQnO1xyXG4gIH0pO1xyXG4gIC8vIGNvbnNvbGUubG9nKGJvd3Nlcik7XHJcbn0pO1xyXG4iXX0=
