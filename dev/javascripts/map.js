var geoJSONFormat = new ol.format.GeoJSON({
  defaultDataProjection: 'EPSG:4326'
});
var styleCache = {};
var bing = new ol.layer.Tile({
  visible: true,
  source: new ol.source.BingMaps({
    key: 'Ak2Gq8VUfICsPpuf7LRANXmXt2sHWmSLPhohmVLFtFIEwYjs_5MCyAhAFwRSVpLj',
    imagerySet: 'Aerial'
  }),
  maxZoom: 19,
  crossOrigin: 'anonymous',
  preload: Infinity,
  nameEl: 'Δορυφορική εικόνα',
  nameEn: 'Satellite Image',
  id: 'bing'
});
var mapbox = new ol.layer.Tile({
  source: new ol.source.XYZ({
    attributions: new ol.Attribution({
      html: '<a href=\"https://www.mapbox.com/about/maps/\" target=\"_blank\">&copy; Mapbox &copy; OpenStreetMap</a>'
    }),
    url: 'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmlydmFpbiIsImEiOiJlOWYyYTM0NThiNWM0YjJjODJjNDE4ODQzNzA2MGQyNiJ9.-NVDO27Hzt-w_nQosUPfLA'
  })
});
var propertyStyleFunction = function(feature, resolution) {
  var size = feature.get('features').length;
  var style = styleCache[size];
  if (!style) {
    style = [new ol.style.Style({
      image: new ol.style.Circle({
        radius: 15,
        stroke: new ol.style.Stroke({
          color: [156, 39, 176, 0.8],
          width : 5
        }),
        fill: new ol.style.Fill({
          color: [68, 138, 255, 1.0]
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
    styleCache[size] = style;
  }
  return style;
};
var propertySource = new ol.source.Vector({
  format: geoJSONFormat,
  loader: function(extent, resolution, projection) {
    var epsg4326Extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
    var url = 'http://localhost:3000/db/property?bbox[x1]=' + epsg4326Extent[0] + '&bbox[y1]=' + epsg4326Extent[1] + '&bbox[x2]=' + epsg4326Extent[2] + '&bbox[y2]=' + epsg4326Extent[3];
    var that = this;
    this.clear();
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
    }).done(function(response) {
      var features = geoJSONFormat.readFeatures(response, {
        featureProjection: 'EPSG:3857'
      });
      // that.clear();
      that.addFeatures(features);
    }).fail(function() {
      console.log("error");
    });
  },
  strategy: ol.loadingstrategy.bbox
});
var propertyClusterSource = new ol.source.Cluster({
  distance: 40,
  source: propertySource,
  attributions: [new ol.Attribution({
    html: 'All maps © ' + '<a href="http://www.terracognita.gr/">Terra Cognita</a>'
  })]
});
var property = new ol.layer.Vector({
  source: propertyClusterSource,
  nameEl: 'Ιδιοκτησίες',
  nameEn: 'Estates',
  id: 'estates',
  visible: true,
  style: propertyStyleFunction
});
// var administrativeSource = new ol.source.Vector({
//   format: geoJSONFormat,
//   loader: function(extent, resolution, projection) {
//     var epsg4326Extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
//     var url = 'http://localhost:3000/db/administrative?bbox[x1]=' + epsg4326Extent[0] + '&bbox[y1]=' + epsg4326Extent[1] + '&bbox[x2]=' + epsg4326Extent[2] + '&bbox[y2]=' + epsg4326Extent[3];
//     var that = this;
//     this.clear();
//     $.ajax({
//       url: url,
//       type: 'GET',
//       dataType: 'json',
//     }).done(function(response) {
//       var features = geoJSONFormat.readFeatures(response, {
//         featureProjection: 'EPSG:3857'
//       });
//       // that.clear();
//       that.addFeatures(features);
//     }).fail(function() {
//       console.log("error");
//     });
//   },
//   strategy: ol.loadingstrategy.bbox
// });
// var administrative = new ol.layer.Vector({
//   source: administrativeSource,
//   nameEl: 'Νοσοκομέια',
//   nameEn: 'Hospitals',
//   id: 'hospitals',
//   visible: true
// });
var map = new ol.Map({
  target: 'map',
  layers: [mapbox, property],
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
    }), new ol.control.OverviewMap({
      className: 'ol-overviewmap ol-custom-overviewmap',
      collapsible: true,
      collapsed: true,
      layers: [new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        preload: Infinity,
        crossOrigin: 'anonymous',
        nameEl: 'Μικρός Χάρτης',
        nameEn: 'MiniMap',
        id: 'overviewOsm'
      })]
    })
  ]),
  view: new ol.View({
    center: [3713616, 4181258],
    extent: [3590094, 4102833, 3855483, 4261211],
    projection: 'EPSG:3857',
    zoom: 14,
    maxZoom: 19,
    minZoom: 10
  }),
});
