App.config.modules.map = (function (window, document, undefined, Promise, ol, App) {
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
    estates: function estates(trans){
      return new ol.layer.Vector({
        source: mapSources.estates(),
        id: 'estates',
        visible: true,
        style: mapStyles.estates
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
}(window, document, undefined, Promise, ol, App));
