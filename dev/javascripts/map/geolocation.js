(function() {
  var geolocation = new ol.Geolocation({
    // take the projection to use from the map's view
    projection: map.getView().getProjection(),
    trackingOptions: {
      maximumAge: 10000,
      enableHighAccuracy: true,
      timeout: 600000
    }
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
  featuresOverlaySource = new ol.source.Vector({});
  var featuresOverlay = new ol.layer.Vector({
    map: map,
    source: featuresOverlaySource
  });
  $('.geolocation').on('change', function(e) {
    e.preventDefault();
    if ($(this).prop('checked') === true) {
      geolocation.setTracking(true);
      featuresOverlaySource.addFeatures([positionFeature,accuracyFeature]);
    } else {
      geolocation.setTracking(false);
      featuresOverlaySource.clear();
    }
  });
}());
