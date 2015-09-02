(function() {
  $('.addmarker')
    .on('click', function(event) {
      event.preventDefault();
      /* Act on the event */
      var marker = new ol.Feature();
      var iconStyle = new ol.style.Style({
        image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 1,
          scale:1,
          src: '../images/maki/renders/marker-24.png'
        }))
      });
      marker.setStyle(iconStyle);
      var featuresOverlay = new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
          features: [marker]
        })
      });
      map.addLayer(featuresOverlay);
      map.on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var coordinates = event.coordinate;
        marker.setGeometry(new ol.geom.Point(coordinates));
      });
    });
})();
