(function() {
  var marker = new ol.Feature();
  var iconStyle = new ol.style.Style({
    image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
      anchor: [0.5, 1],
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      opacity: 1,
      scale: 1,
      src: "../images/map-icons/pins/24/pin1.png",
      snapToPixel: false
    })),
    zIndex: 100
  });
  marker.setStyle(iconStyle);
  var featuresOverlayStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "#408080",
      width: 5,
      lineDash: [4, 4]
    })
  });
  var featuresOverlay = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector(),
    style: featuresOverlayStyle,
    id: "route",
    nameEl: "Διαδρομή",
    NameEn: "Route"
  });
  var routeCoords = [];

  function handleMarker(event) {
    event.preventDefault();
    var featureCount = featuresOverlay.getSource().getFeatures().length;
    var coordinates = event.coordinate;
    if (featureCount === 0) {
      marker.setGeometry(new ol.geom.Point(coordinates));
      marker.setId("first");
      featuresOverlay.getSource().addFeature(marker);
      routeCoords[0] = coordinates[0];
      routeCoords[1] = coordinates[1];
    } else if (featureCount === 1) {
      var clone = marker.clone();
      clone.setGeometry(new ol.geom.Point(coordinates));
      clone.setId("second");
      featuresOverlay.getSource().addFeature(clone);
      routeCoords[2] = coordinates[0];
      routeCoords[3] = coordinates[1];
      callRoute(routeCoords);
    } else {
      featuresOverlay.getSource().clear();
    }
  }

  geoJSONFormat = new ol.format.GeoJSON({
    defaultDataProjection: "EPSG:4326",
    geometryName: "geometry"
  });

  function callRoute(routeCoords) {
    var first = ol.proj.transform([routeCoords[0], routeCoords[1]], "EPSG:3857", "EPSG:4326");
    var second = ol.proj.transform([routeCoords[2], routeCoords[3]], "EPSG:3857", "EPSG:4326");
    var x1 = first[0];
    var y1 = first[1];
    var x2 = second[0];
    var y2 = second[1];
    $.ajax({
      url: "https://api.mapbox.com/v4/directions/mapbox.driving/" + x1 + "," + y1 + ";" + x2 + "," + y2 + ".json?alternatives=false&access_token=pk.eyJ1IjoiZmlydmFpbiIsImEiOiJlOWYyYTM0NThiNWM0YjJjODJjNDE4ODQzNzA2MGQyNiJ9.-NVDO27Hzt-w_nQosUPfLA",
      type: "GET",
      dataType: "json"
    }).done(function(data) {
      var route={};
      route.type ="Feature";
      route.geometry = data.routes[0].geometry;
      featuresOverlay.getSource().addFeatures(geoJSONFormat.readFeatures(route, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857"
      }));
      map.getView().fit(featuresOverlay.getSource().getExtent(), map.getSize());
    }).fail(function() {
      console.log("error");
    }).always(function() {
      console.log("complete");
    });
  }
  $(".marker").on("change", function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).prop("checked") === true) {
      map.on("singleclick", handleMarker);
    } else {
      map.un("singleclick", handleMarker);
      featuresOverlay.getSource().clear();
    }
  });
}());
