/*eslint no-param-reassign: ["error", { "props": false }]*/
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
  toggleClass: function toggleClass(el, className) {
    var classes;
    var existingIndex;
    var element = el;
    if (element.classList) {
      element.classList.toggle(className);
    } else {
      classes = element.className.split(' ');
      existingIndex = classes.indexOf(className);

      if (existingIndex >= 0) {
        classes.splice(existingIndex, 1);
      } else {
        classes.push(className);
      }
      element.className = classes.join(' ');
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
  },
  elToEn: function elToEn(string) {
    var originalString = string;
    var newString;
    var replace = new Array('α', 'ά', 'Ά', 'Α', 'β', 'Β', 'γ', 'Γ', 'δ', 'Δ', 'ε', 'έ', 'Ε', 'Έ', 'ζ', 'Ζ', 'η', 'ή', 'Η', 'θ', 'Θ', 'ι', 'ί', 'ϊ', 'ΐ', 'Ι', 'Ί', 'κ', 'Κ', 'λ', 'Λ', 'μ', 'Μ', 'ν', 'Ν', 'ξ', 'Ξ', 'ο', 'ό', 'Ο', 'Ό', 'π', 'Π', 'ρ', 'Ρ', 'σ', 'ς', 'Σ', 'τ', 'Τ', 'υ', 'ύ', 'Υ', 'Ύ', 'φ', 'Φ', 'χ', 'Χ', 'ψ', 'Ψ', 'ω', 'ώ', 'Ω', 'Ώ', ' ', '\'', '\'', ',');
    var replace_n = new Array('a', 'a', 'A', 'A', 'v', 'V', 'g', 'G', 'd', 'D', 'e', 'e', 'E', 'E', 'z', 'Z', 'i', 'i', 'I', 'th', 'Th', 'i', 'i', 'i', 'i', 'I', 'I', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'x', 'X', 'o', 'o', 'O', 'O', 'p', 'P', 'r', 'R', 's', 's', 'S', 't', 'T', 'u', 'u', 'Y', 'Y', 'f', 'F', 'ch', 'Ch', 'ps', 'Ps', 'o', 'o', 'O', 'O', ' ', '_', '_', '_');

    for (var i = 0; i < replace.length; i++) {
      originalString = originalString.replace(new RegExp(replace[i], 'g'), replace_n[i]);
    }
    newString = originalString;
    return newString;
  },
  handleDate: function handleDate(str, lang) {
    var split;
    var newDate = [];
    if (typeof str === 'string' && lang !== 'el') {
      split = _.split(str, '-', 3);
      newDate = [split[1], split[0], split[2]];
      return _.join(newDate, '-');
    }
    return str;
  },
  sanitize: function sanitize(el) {
    var sanitizedStr;
    var str = el.value;
    sanitizedStr = str.replace(/[^a-z0-9A-ZA-zΑ-Ωα-ωίϊΐόάέύϋΰήώ]/gi, '');
    el.value = sanitizedStr;
    console.log(el);
    console.log(el.value);
    console.log(sanitizedStr);
  }
  // zoomToGid: function zoomToGid(map, gid) {
  //   var coordinates = utils.findById(map, 'filteredEstates').getSource().getFeatureById(gid)
  //   .getGeometry()
  //   .getCoordinates();
  //   map.getView().setCenter(coordinates);
  // }
};
