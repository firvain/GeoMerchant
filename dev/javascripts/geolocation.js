(function() {
  var geolocation = new ol.Geolocation({
    // take the projection to use from the map's view
    projection: map.getView()
      .getProjection(),
    trackingOptions: {
      maximumAge: 10000,
      enableHighAccuracy: true,
      timeout: 600000
    }
  });
  $('.geolocation')
    .on('click', function(e) {
      e.preventDefault();
      geolocation.setTracking(true);
    });
  var accuracyFeature = new ol.Feature();
  geolocation.on('change:accuracyGeometry', function() {
    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
  });
  var positionFeature = new ol.Feature();
  positionFeature.setStyle(new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: '#3399CC'
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2
      })
    })
  }));
  // listen to changes in position
  geolocation.on('change:position', function() {
    var coordinates = geolocation.getPosition();
    positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
  });
  var featuresOverlay = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
      features: [accuracyFeature, positionFeature]
    })
  });
})();
