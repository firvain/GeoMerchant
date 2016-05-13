var utils = {
  findById: function findById(map, id) {
    var layers = map.getLayers();
    var length = layers.getLength();
    for (var i = 0; i < length; i++) {
      if (id === layers.item(i).get('id')) {
        return layers.item(i);
      }
    }
    return null;
  },
  findByName: function findByName(map, name) {
    var layers = map.getLayers();
    var length = layers.getLength();
    for (var i = 0; i < length; i++) {
      if (name === layers.item(i).get('name')) {
        return layers.item(i);
      }
    }
    return null;
  },
  preventDotAndSpace: function preventDotAndSpace(e) {
    var key = e.charCode ? e.charCode : e.keyCode;
    this.innerHTML = key;
    if (key === 46 || key === 32) {
      return false;
    }
    return true;
  },
  geometryFunction: function geometryFunction(coordinates, geometry) {
    var geom;
    var start;
    var end;
    if (!geometry) {
      geom = new ol.geom.Polygon(null);
    } else {
      geom = geometry;
    }
    start = coordinates[0];
    end = coordinates[1];
    geom.setCoordinates([
      [
        start,
        [
          start[0], end[1]
        ],
        end,
        [
          end[0], start[1]
        ],
        start
      ]
    ]);
    return geom;
  }
};
