(function() {
  $('.weather').change(function() {
    var center = ol.proj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
    var lat = center[1];
    var lon = center[0];
    console.log(lat, lon);
    $.ajax({
      url: 'http://api.openweathermap.org/data/2.5/find?lat=' + lat + '&lon=' + lon + '&cnt=5&cluster=no&units=metric&type=accurate&APPID=f9cd9fa2c427c3b115e87e4862619c5c',
      type: 'GET',
      dataType: 'json',
    }).done(function(data) {


      function createWeatherOverlay(position,index) {
        var elem = document.createElement('div');
        elem.setAttribute('class', 'weather-popup paper-shadow-bottom-z-4');
        elem.setAttribute('id',index);
        return new ol.Overlay({
          element: elem,
          position: position,
        });
      }
      var objs = data.list;
      var overlay,coordinates;
      $.each(objs, function(index, val) {
        console.log(index);
        coordinates = ol.proj.transform([val.coord.lon, val.coord.lat], 'EPSG:4326', 'EPSG:3857');
        overlay = createWeatherOverlay(coordinates,index);
        map.addOverlay(overlay);
       
        $('#'+index).html(val.name);
      });
      // var featureList = [];
      // var objs = data.list;
      // $.each(objs, function(index, val) {
      //   var feature = new ol.Feature({
      //     geometry: new ol.geom.Point(ol.proj.transform([val.coord.lon, val.coord.lat], 'EPSG:4326', 'EPSG:3857')),
      //     name: val.name,
      //     description: val.weather[0].description,
      //     main: val.main,
      //     clouds: val.clouds,
      //     rain: val.rain,
      //     wind: val.wind,
      //   });
      //   var style = new ol.style.Style({
      //     image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
      //       src: 'http://openweathermap.org/img/w/' + val.weather[0].icon + '.png',
      //       anchorOrigin: 'bottom-left',
      //       anchor: [0.5, 0]
      //     })),
      //     text: new ol.style.Text({
      //       // offsetY : 50,
      //       text: val.main.temp + " °C",
      //       stroke: new ol.style.Stroke({
      //         color: '#000000'
      //       })
      //     })
      //   });
      //   feature.setStyle(style);
      //   featureList.push(feature);
      // });
    }).fail(function() {
      // toastr.error("Δεν βρέθηκαν πληροφορίες για τις καιρικές συνθήκες!");
    });
  });
}());
