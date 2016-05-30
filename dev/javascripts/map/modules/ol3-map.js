var mymap = (function (window, document, undefined, Promise, ol, utils) {
  'use strict';
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
      if (window.trans.lang === 'el') {
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
  var initialize = function initialize(trans) {
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
}(window, document, undefined, Promise, ol, utils));
