(function() {
  // var container = document.getElementById('popup');
  // var closer = document.getElementById('popup-closer');
  // closer.onclick = function() {
  //   info.setPosition(undefined);
  //   closer.blur();
  //   return false;
  // };
  // var info = new ol.Overlay(({
  //   element: container,
  //   autoPan: true,
  //   autoPanAnimation: {
  //     duration: 250
  //   }
  // }));
  // map.addOverlay(info);
  function handleInfo(evt) {
    evt.preventDefault();
    var coordinate = evt.coordinate;
    if (map.getView().getResolution() > 4) {
      map.getView().setResolution(2.388657133911758);
      map.getView().setCenter(coordinate);
    } else {
      var obj = {};
      var title = {};
      var features = [];
      obj.title = title;
      if (lang === 'el') {
        title.type = 'Τύπος';
        title.area = 'Εμβαδό';
        title.address = 'Διευθυνση';
        title.bedrooms = 'Υπνοδωμάτια';
        title.price = 'Τιμή';
        title.new = 'Νεόδμητο';
        title.furnished = 'Επιπλωμένο';
        title.pets = 'Επιτρέπονται Κατοικίδια';

      } else {
        title.type = 'Type';
        title.area = 'Size';
        title.address = 'Address';
        title.bedrooms = 'Bedrooms';
        title.price = 'Price';
        title.new = 'Newly Build';
        title.furnished = 'Furnished';
        title.pets = 'Pets Allowed';
      }
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
          a=f;
          var feature = {};
          feature.gid = f.get('gid');
          feature.type = f.get('estatetype');
          feature.area = f.get('estatearea');
          if (lang==='el'){
          feature.address = f.get('street_el') + ' ' + f.get('h_num_el');
          } else {
          feature.address = f.get('street_en') + ' ' + f.get('h_num_en');
          }
          feature.bedrooms = f.get('bedrooms');
          feature.price = f.get('price');
          feature.furnished  = f.get('furnished');
          feature.pets  = f.get('pets');
          feature.new  = f.get('new');
          features.push({
            feature: feature
          });
          featureCoordinate = f.get('geometry').getCoordinates();
          obj.features = features;
          var PSASource = new ol.source.Vector({
            attributions: [new ol.Attribution({
              html: 'POI by ' + '<a href="http://www.terracognita.gr/">Terra Cognita</a>'
            })],
            format: geoJSONFormat,
            loader: function(extent, resolution, projection) {
              var url = 'http://localhost:3000/db/uses/' + feature.gid;
              var that = this;
              $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
              }).done(function(response) {
                var features = geoJSONFormat.readFeatures(response.property_services_analysis, {
                  featureProjection: 'EPSG:3857'
                });
                var area = new ol.style.Style({
                  fill: new ol.style.Fill({
                    color: [156, 39, 176, 0.1]
                  })
                });
                features[0].setStyle(area);
                that.addFeatures(features);
              }).fail(function() {
                console.log("error");
              });
            },
            strategy: ol.loadingstrategy.all
          });
          PSA.setSource(PSASource);
        });
        dust.render('estateInfo.dust', obj, function(err, out) {
          $("#popup-content").html(out);
        });
        dust.render('estateCards.dust', obj, function(err, out) {
          $('.estate-cards').html(out);
          $('.estate-cards').removeClass('visuallyhidden');
        });
        map.getView().setCenter(featureCoordinate);
        // info.setPosition(featureCoordinate);
      }
    }
  }
  $('.info').on('change', function(e) {
    e.preventDefault();
    if ($(this).prop('checked') === true) {
      map.on('click', handleInfo);
    } else {
      map.un('click', handleInfo);
    }
  });
}());
