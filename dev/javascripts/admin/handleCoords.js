var handleCoords = (function (ol) {
  "use strict";
  var coords;
  var l;

  function findById(id) {
    var layers = map.getLayers();
    var length = layers.getLength();
    for (var i = 0; i < length; i++) {
      if (id === layers.item(i).get("id")) {
        return layers.item(i);
      }
    }
    return null;
  }

  function findByName(name) {
    var layers = map.getLayers();
    var length = layers.getLength();
    for (var i = 0; i < length; i++) {
      if (name === layers.item(i).get("nameEn") || name === layers.item(i).get("nameEl")) {
        return layers.item(i);
      }
    }
    return null;
  }

  function setLayer(id) {
    l = findById(id);
  }

  function getCoords() {
    "use strict";
    var coordEPSG3857;
    coordEPSG3857 = l.getSource().getFeatures()[0].getGeometry().getCoordinates();
    coords = ol.proj.transform(coordEPSG3857, "EPSG:3857", "EPSG:4326");
    return coords;
  }
  return {
    coords: getCoords,
    setLayer: setLayer
  };
}(ol));
