App.utils = {
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
    var geom = geometry;
    var start;
    var end;
    if (!geom) {
      geom = new ol.geom.Polygon(null);
    }
    start = coordinates[0];
    end = coordinates[1];
    geom.setCoordinates([
      [start, [start[0], end[1]], end, [end[0], start[1]], start]
      ]);
    return geom;
  },
  hasClass: function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    }
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  },
  removeClass: function removeClass(el, className) {
    var element = el;
    if (element.classList) {
      element.classList.remove(className);
    } else {
      element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  },
  addClass: function removeClass(el, className) {
    var element = el;
    if (element.classList) {
      element.classList.add(className);
    } else {
      element.className += ' ' + className;
    }
  },
  requestFullScreen: function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    var wscript;
    if (requestMethod) { // Native full screen.
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== 'undefined') { // Older IE.
      wscript = new ActiveXObject('WScript.Shell');
      if (wscript !== null) {
        wscript.SendKeys('{F11}');
      }
    }
  },
  exitFullsreen: function exitFullsreen(element) {
    var requestMethod = element.exitFullScreen || element.webkitExitFullscreen || element.mozCancelFullScreen || element.msExitFullscreen;
    var wscript;
    if (requestMethod) { // Native full screen.
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== 'undefined') { // Older IE.
      wscript = new ActiveXObject('WScript.Shell');
      if (wscript !== null) {
        wscript.SendKeys('{Esc}');
      }
    }
  }
  // zoomToGid: function zoomToGid(map, gid) {
  //   var coordinates = utils.findById(map, 'filteredEstates').getSource().getFeatureById(gid)
  //   .getGeometry()
  //   .getCoordinates();
  //   map.getView().setCenter(coordinates);
  // }
};
