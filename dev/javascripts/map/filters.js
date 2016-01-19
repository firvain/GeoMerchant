window.app || (window.app = {});
var app = window.app;
app.filters = function(options) {
  this.leaseType = options.leaseType !== undefined
    ? options.leaseType
    : "Rent";
  this.startPrice = options.startPrice !== undefined
    ? options.startPrice
    : 0;
  this.endPrice = options.endPrice !== undefined
    ? options.endPrice
    : 10000000000;
  this.parking = options.parking !== undefined
    ? options.parking
    : false;
  this.furnsished = options.furnished !== undefined
    ? options.pakring
    : false;
  this.heating = options.heating !== undefined
    ? options.heating
    : false;
  this.cooling = options.cooling !== undefined
    ? options.cooling
    : false;
  this.view = options.view !== undefined
    ? options.view
    : false;
};
app.filters.prototype.setDefaults = function() {
  var epsg4326Extent;
  PSA.setSource(null);
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
  if (selectSource.getFeatures().length === 0) {
    epsg4326Extent = ol.proj.transformExtent(extent, "EPSG:3857", "EPSG:4326");
  } else {
    epsg4326Extent = ol.proj.transformExtent(selectSource.getFeatures()[0].getGeometry().getExtent(), "EPSG:3857", "EPSG:4326");
  }
  this.extent = epsg4326Extent;
};
app.filters.prototype.ajaxCall = function() {
  $.ajax({
    url: "http://localhost:3000/db/filteredproperty?bbox[x1]=" + this.extent[0] + "&bbox[y1]=" + this.extent[1] + "&bbox[x2]=" + this.extent[2] + "&bbox[y2]=" + this.extent[3],
    type: "GET",
    dataType: "json",
    data: {
      leaseType: this.leaseType,
      furnished: this.furnished,
      heating: this.heating,
      parking: this.parking,
      cooling: this.cooling,
      view: this.view,
      startPrice: this.startPrice,
      endPrice: this.endPrice
    }
  }).done(function(response) {
    var features = geoJSONFormat.readFeatures(response, {featureProjection: "EPSG:3857"});
    if (features.length > 0) {
      toastr.clear();
      filteredEstates.getSource().clear();
      filteredEstates.getSource().addFeatures(features);
      filteredEstates.setVisible(true);
      property.setVisible(false);
      var extent = filteredEstates.getSource().getExtent();
      var center = [];
    } else {
      toastr.error("No Info Found!");
      filteredEstates.setVisible(false);
      property.setVisible(true);
    }
  });
};
$("#invokeFilters").click(function() {
  window.options || (window.options = {});
  var filters;
  window.options.leaseType = $("input[name=options]:checked").val();
  window.options.startPrice = $("#startPrice").val();
  window.options.endPrice = $("#endPrice").val();
  window.options.parking = $("#checkbox-1").prop("checked");
  window.options.furnished = $("#checkbox-2").prop("checked");
  window.options.heating = $("#checkbox-3").prop("checked");
  window.options.cooling = $("#checkbox-4").prop("checked");
  window.options.view = $("#checkbox-5").prop("checked");
  filters = new app.filters(window.options);
  filters.setDefaults();
  filters.ajaxCall();
});
$("#clearFilters").click(function() {
  $("label[for=option-1]").addClass("is-checked");
  $("label[for=option-2]").removeClass("is-checked");
  $("label[for=checkbox-1]").removeClass("is-checked");
  $("label[for=checkbox-2]").removeClass("is-checked");
  $("label[for=checkbox-3]").removeClass("is-checked");
  $("label[for=checkbox-4]").removeClass("is-checked");
  $("label[for=checkbox-5]").removeClass("is-checked");
  $("label[for=checkbox-6]").removeClass("is-checked");
  filteredEstates.getSource().clear();
  property.setVisible(true);
  PSA.setSource(null);
  selectSource.clear();
  map.removeInteraction(draw);
});
var draw;
function addInteraction() {
  selectSource.clear();
  draw = new ol.interaction.Draw({source: selectSource, type: "LineString", geometryFunction: geometryFunction, maxPoints: 2});
  draw.on("drawstart", function() {
    selectSource.clear();
  });
  draw.on("drawend", function() {
    map.removeInteraction(draw);
  });
  map.addInteraction(draw);
}
function geometryFunction(coordinates, geometry) {
  if (!geometry) {
    geometry = new ol.geom.Polygon(null);
  }
  var start = coordinates[0];
  var end = coordinates[1];
  geometry.setCoordinates([
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
  return geometry;
}
$("#checkbox-6").click(function() {
  if (this.checked) {
    addInteraction();
  } else {
    map.removeInteraction(draw);
    selectSource.clear();
  }
});
