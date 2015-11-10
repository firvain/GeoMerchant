 function filteredEsateStyle(feature, resolution) {
   styleCache = [new ol.style.Style({
     image: new ol.style.Icon(({
       src: '../images/map-icons/pins/48/pin4.png',
       anchorOrigin: 'bottom-left',
       anchor: [0.5, 0.5],
       scale: 0.7,
     }))
   })];
   return styleCache;
 }

 function selectByFilters() {
   var params = {};
   params.leaseType = $("input[name=options]:checked").val();
   params.startPrice = $('#startPrice').val();
   params.endPrice = $('#endPrice').val();
   features = getFilteredEstates(params);
   if (features.length > 0) {
     filteredEstates.getSource().clear();
     filteredEstates.getSource().addFeatures(features);
     filteredEstates.setVisible(true);
     property.setVisible(false);
     var extent = filteredEstates.getSource().getExtent();
     var center = [];
   } else {
     filteredEstates.setVisible(false);
     property.setVisible(true);
   }
 }

 function getFilteredEstates(params) {
   var features = [];
   var whichOne = {
     'Rent': function(params) {
       propertySource.getFeatures().forEach(function(f) {
         var fprice = f.get('price');
         var ftype = f.get('type_en');
         if (ftype === 'Rent' && fprice >= params.startPrice && fprice <= params.endPrice) {
           var feature = f.clone();
           features.push(feature);
         }
       });
       return features;
     },
     'Sale': function(params) {
       propertySource.getFeatures().forEach(function(f) {
         var fprice = f.get('price');
         var ftype = f.get('type_en');
         if (ftype === 'Sale' && fprice >= params.startPrice && fprice <= params.endPrice) {
           var feature = f.clone();
           features.push(feature);
         }
       });
       return features;
     }
   };
   if (whichOne[params.leaseType]) return whichOne[params.leaseType](params);
 }
 $("#clearFilters").click(function() {
   filteredEstates.getSource().clear();
   filteredEstates.setVisible(false);
   property.setVisible(true);
 });
