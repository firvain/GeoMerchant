(function() {
  var container = document.getElementById('popup');
  // var content = document.getElementById('popup-content');
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
    var obj = {};
    var title = {};
    var features = [];
    if (document.documentElement.lang === 'el') {
      title.type = 'Τύπος';
      title.area = 'Εμβαδό';
      title.address = 'Διευθυνση';
    } else {
      title.type = 'Type';
      title.area = 'Size';
      title.address = 'Address';
    }
    obj.title = title;
    clickedFeature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
      return {
        feature: feature,
        layer: layer
      };
    }, this, function(layer) {
      if (layer.get('id') === 'estates') {
        return true;
      }
    }, this);
    if (clickedFeature) {
      clickedFeature.feature.get('features').forEach(function(f) {
        var feature = {};
        var gid = f.get('gid');
        feature.type = f.get('estatetype');
        feature.area = f.get('estatearea');
        feature.address = f.get('street') + ' ' + f.get('h_num');
        features.push({
          feature: feature
        });
        // obj.features.gid = f.get('gid');
        obj.features = features;
      });
      dust.render('estateInfo.dust', obj, function(err, out) {
        $("#popup-content").html(out);
      });
      dust.render('estateCards.dust', obj, function(err, out) {
        $('.estate-cards').html(out);
        $('.estate-cards').removeClass('hidden');
      });
      info.setPosition(coordinate);
    }
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
