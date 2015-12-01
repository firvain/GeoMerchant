 function selectByFilters() {
   PSA.setSource(null);
   var params = {};
   var epsg4326Extent;
   params.leaseType = $("input[name=options]:checked").val();
   params.startPrice = $('#startPrice').val();
   params.endPrice = $('#endPrice').val();
   params.parking = $('#checkbox-1').prop('checked');
   params.furnished = $('#checkbox-2').prop('checked');
   params.heating = $('#checkbox-3').prop('checked');
   params.cooling = $('#checkbox-4').prop('checked');
   params.view = $('#checkbox-5').prop('checked');
   if (selectSource.getFeatures().length === 0) {
     epsg4326Extent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
   } else {
     epsg4326Extent = ol.proj.transformExtent(selectSource.getFeatures()[0].getGeometry().getExtent(), 'EPSG:3857', 'EPSG:4326');
   }
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
   $.ajax({
     url: 'http://localhost:3000/db/filteredproperty?bbox[x1]=' + epsg4326Extent[0] + '&bbox[y1]=' + epsg4326Extent[1] + '&bbox[x2]=' + epsg4326Extent[2] + '&bbox[y2]=' + epsg4326Extent[3],
     type: 'GET',
     dataType: 'json',
     data: {
       leaseType: params.leaseType,
       furnished: params.furnished,
       heating: params.heating,
       parking: params.parking,
       cooling: params.cooling,
       view: params.view,
       startPrice: params.startPrice,
       endPrice: params.endPrice
     },
   }).done(function(response) {
     var features = geoJSONFormat.readFeatures(response, {
       featureProjection: 'EPSG:3857'
     });

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
 }
 $("#clearFilters").click(function() {
   $("input[name=options]").prop('checked', false);
   $('label[for=option-1]').removeClass('is-checked');
   $('label[for=option-2]').removeClass('is-checked');
   $('label[for=checkbox-1]').removeClass('is-checked');
   $('label[for=checkbox-2]').removeClass('is-checked');
   $('label[for=checkbox-3]').removeClass('is-checked');
   $('label[for=checkbox-4]').removeClass('is-checked');
   $('label[for=checkbox-5]').removeClass('is-checked');
   $('label[for=checkbox-6]').removeClass('is-checked');
   filteredEstates.getSource().clear();
   property.setVisible(true);
   PSA.setSource(null);
   selectSource.clear();
   map.removeInteraction(draw);
 });
 var draw;

 function addInteraction() {
   selectSource.clear();
   draw = new ol.interaction.Draw({
     source: selectSource,
     type: 'LineString',
     geometryFunction: geometryFunction,
     maxPoints: 2
   });
   draw.on('drawstart', function() {
     selectSource.clear();
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
     [start, [start[0], end[1]], end, [end[0], start[1]], start]
   ]);
   return geometry;
 }
 $("#checkbox-6").change(function() {
   if (this.checked) {
     addInteraction();
   } else {
     map.removeInteraction(draw);
     selectSource.clear();
   }
 });
