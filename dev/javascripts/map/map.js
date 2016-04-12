var $loading = $('.mdl-spinner');
var center = [3677385, 4120949];
var extent = [3652772, 4112808, 3700000, 4132797];
var lang = document.documentElement.lang;
var styleCache = {};
var geoJSONFormat = new ol.format.GeoJSON({
  defaultDataProjection: 'EPSG:4326'
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
    Apartment: function apartmentIcon() {
      return 'apartment';
    },
    Store: function storeIcon() {
      return 'store';
    },
    'Detached House': function detachedHouceIcon() {
      return 'detached';
    }
  };
  return (iconType[estateType])();
}

function getIconPath(listingType) {
  var iconPath = {
    true: function saleIcon() {
      return './images/pins/sale/';
    },
    false: function rentIcon() {
      return './images/pins/rent/';
    }
  };
  return (iconPath[listingType])();
}

function createPropertyStyle(feature) {
  var src;
  src = getIconPath(feature.get('sale')) + getIconType(feature.get('estatetype_en')) + '-48.png';
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

function propertyStyleFunction(feature, resolution) {
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
  loader: function featreLoader() {
    var self = this;
    this.clear();
    $.ajax({
      url: 'http://127.0.0.1:3000/db/property',
      type: 'GET',
      dataType: 'json'
    })
      .done(function succeded(response) {
        var features = geoJSONFormat.readFeatures(response, {
          featureProjection: 'EPSG:3857'
        });
        self.addFeatures(features);
      })
      .fail(function failed(jqXHR, textStatus, errorThrown) {
        toastr.clear();
        if (jqXHR.status === 404) {
          toastr.error('Sorry, we cannot find any properties!');
        } else if (jqXHR.status === 503) {
          toastr.error('Service Unavailable');
        } else {
          toastr.error('Internal Server Error');
        }
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
var PSAStyleFunction = function (feature, resolution) {
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
  var src;
  src = getIconPath(feature.get('sale')) + getIconType(feature.get('estatetype_en')) + '-64.png';
  styleCache = [new ol.style.Style({
    image: new ol.style.Icon(({
      src: src,
      anchorOrigin: 'bottom-left',
      anchor: [0.5, 0],
      scale: 1
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
    extent: extent,
    projection: 'EPSG:3857',
    zoom: 14,
    maxZoom: 19,
    minZoom: 14
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
jQuery(document).ready(function ($) {
  $('.spinner').addClass('visuallyhidden');
  $('.mdl-spinner').removeClass('is-active');
  // handleSelect();
});
$(document)
  .ajaxStart(function () {
    $loading.addClass('is-active');
  })
  .ajaxStop(function () {
    $loading.removeClass('is-active');
  });
