(function() {
  $('.weather').change(function() {
    var center = ol.proj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
    var lat = center[1];
    var lon = center[0];
    $.ajax({
      url: 'http://api.openweathermap.org/data/2.5/find?lat=' + lat + '&lon=' + lon + '&cnt=5&cluster=no&units=metric&type=accurate&APPID=f9cd9fa2c427c3b115e87e4862619c5c',
      type: 'GET',
      dataType: 'json',
    }).done(function(data) {
      function createWeatherOverlay(position, index) {
        var elem = document.createElement('div');
        elem.setAttribute('class', 'weather-popup default-primary-color  paper-shadow-bottom-z-4');
        elem.setAttribute('id', index);
        return new ol.Overlay({
          element: elem,
          position: position
        });
      }
      var objs = data.list;
      var overlay, coordinates;
      $.each(objs, function(index, val) {
        coordinates = ol.proj.transform([val.coord.lon, val.coord.lat], 'EPSG:4326', 'EPSG:3857');
        overlay = createWeatherOverlay(coordinates, index);
        map.addOverlay(overlay);
        weatherData = {
          'name': val.name,
          'temp': val.main.temp,
          'pressure': val.main.pressure,
          'humidity': val.main.humidity
        };
        dust.render('weatherPopup.dust', weatherData, function(err, out) {
          $("#"+index).html(out);
        });
      });
    }).fail(function() {
      // toastr.error("Δεν βρέθηκαν πληροφορίες για τις καιρικές συνθήκες!");
    });
  });
}());
