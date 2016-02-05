var center = [3677385, 4120949],
    extent = [3590094, 4102833, 3855483, 4261211],
    lang = document.documentElement.lang,
    styleCache = {},
    geoJSONFormat = new ol.format.GeoJSON({
      defaultDataProjection: 'EPSG:4326'
    });
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

function createPropertyStyle(feature) {
  var src;
  if (feature.get('type_en') === 'Sale') {
    src = '../images/map-icons/pins/48/pin2.png';
  } else {
    src = '../images/map-icons/pins/48/pin5.png';
  }
  return new ol.style.Style({
    geometry: feature.getGeometry(),
    image: new ol.style.Icon(({
      src: src,
      anchorOrigin: 'bottom-left',
      anchor: [0, 0],
      scale: 0.7
    }))
  });
}

function propertyStyleFunction(feature, resolution) {
  var size = feature.get('features')
    .length;
  var style, originalFeature;
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
    style = [createPropertyStyle(originalFeature)];
  }
  return style;
}

// function selectStyleFunction(feature, resolution) {
//   var styles = [new ol.style.Style({})];
//   var originalFeatures = feature.get('features');
//   var originaFeature;
//   for (var i = originalFeatures.length - 1; i >= 0; --i) {
//     originalFeature = originalFeatures[i];
//     styles.push(createPropertyStyle(originalFeature));
//   }
//   return styles;
// }
var propertySource = new ol.source.Vector({
  format: geoJSONFormat,
  loader: function(extent, resolution, projection) {
    console.log(resolution);
    var epsg4326Extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
    var url = 'http://localhost:3000/db/property?bbox[x1]=' + epsg4326Extent[0] + '&bbox[y1]=' + epsg4326Extent[1] + '&bbox[x2]=' + epsg4326Extent[2] + '&bbox[y2]=' + epsg4326Extent[3];
    var self = this;
    this.clear();
    console.log(extent);
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json'
    })
      .done(function(response) {
        var features = geoJSONFormat.readFeatures(response, {
          featureProjection: 'EPSG:3857'
        });
        self.addFeatures(features);
      })
      .fail(function() {
        console.log('error');
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
  id: 'estates',
  visible: true,
  style: propertyStyleFunction
});
property.setZIndex(2);
var PSAStyleFunction = function(feature, resolution) {
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
};
var PSA = new ol.layer.Vector({
  style: PSAStyleFunction,
  maxResolution: 3
});
PSA.setZIndex(1);

function filteredEsateStyle(feature, resolution) {
  styleCache = [new ol.style.Style({
    image: new ol.style.Icon(({
      src: '../images/map-icons/pins/48/pin4.png',
      anchorOrigin: 'bottom-left',
      anchor: [0.5, 0.5],
      scale: 0.7
    }))
  })];
  return styleCache;
}
var filteredEstates = new ol.layer.Vector({
  source: new ol.source.Vector({
    format: geoJSONFormat
  }),
  id: 'filteredEstates',
  visible: true,
  style: filteredEsateStyle
});
filteredEstates.setZIndex(2);
var selectSource = new ol.source.Vector({});
var selectBox = new ol.layer.Vector({
  source: selectSource,
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
  })
});
selectBox.setZIndex(3);
var map = new ol.Map({
  target: 'map',
  layers: [mapbox, property, PSA, filteredEstates, selectBox],
  // interactions: ol.interaction.defaults().extend([new ol.interaction.Select({
  //   condition: function(evt) {
  //     return evt.type === 'singleclick' && ol.events.condition.shiftKeyOnly(evt);
  //   },
  //   style: selectStyleFunction
  // })]),
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
jQuery(document).ready(function($) {
  $('.spinner').addClass('visuallyhidden');
  $('.mdl-spinner').removeClass('is-active');
});
