(function() {
  var marker = new ol.Feature();
  var iconStyle = new ol.style.Style({
    image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      opacity: 1,
      scale: 1,
      src: '../images/maki/renders/marker-24.png'
    }))
  });
  marker.setStyle(iconStyle);
  var featuresOverlay = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector()
  });

  function handleMarker(event) {
    event.preventDefault();
    featuresOverlay.getSource().clear();
    var coordinates = event.coordinate;
    marker.setGeometry(new ol.geom.Point(coordinates));
    featuresOverlay.getSource().addFeature(marker);
  }
  $('.marker').on('change', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).prop('checked') === true) {
      map.on('singleclick', handleMarker);
      
    } else {
      map.un('singleclick', handleMarker);
      featuresOverlay.getSource().clear();
    }
  });
}());
