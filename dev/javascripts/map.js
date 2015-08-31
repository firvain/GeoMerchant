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
var map = new ol.Map({
  target: 'map',
  layers: [bing],
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
      collapsed: false,
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
    center: [3713616,4181258],
    projection: 'EPSG:3857',
    zoom: 14,
    maxZoom: 19,
    minZoom: 10
  }),
});