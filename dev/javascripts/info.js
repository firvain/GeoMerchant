(function() {
  var container = document.getElementById('popup');
  var content = document.getElementById('popup-content');
  var closer = document.getElementById('popup-closer');
  closer.onclick = function() {
    info.setPosition(undefined);
    closer.blur();
    return false;
  };
  var info = new ol.Overlay( /** @type {olx.OverlayOptions} */ ({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  }));
  map.addOverlay(info);

  function handleInfo(evt) {
    evt.preventDefault();
    var coordinate = evt.coordinate;
    content.innerHTML = '<p>You clicked here:</p><code>' + coordinate + '</code>';
    info.setPosition(coordinate);
  }
  $('.info').on('change', function(e) {
    e.preventDefault();
    if ($(this).prop('checked') === true) {
      map.on('singleclick', handleInfo);
    } else {
      map.un('singleclick', handleInfo);
    }
  });
}());
