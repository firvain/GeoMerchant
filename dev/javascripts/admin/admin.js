 var center = [3677385, 4120949],
   extent = [3590094, 4102833, 3855483, 4261211],
   lang = document.documentElement.lang,
   styleCache = {},
   geoJSONFormat = new ol.format.GeoJSON({
     defaultDataProjection: 'EPSG:4326'
   });
 var bing = new ol.layer.Tile({
   visible: true,
   source: new ol.source.BingMaps({
     key: 'Ak2Gq8VUfICsPpuf7LRANXmXt2sHWmSLPhohmVLFtFIEwYjs_5MCyAhAFwRSVpLj',
     imagerySet: 'Aerial'
   }),
   maxZoom: 19,
   crossOrigin: 'anonymous',
   preload: Infinity,
   id: 'bing'
 });
 var mapbox = new ol.layer.Tile({
   source: new ol.source.XYZ({
     attributions: [new ol.Attribution({
       html: '<a href=\"https://www.mapbox.com/about/maps/\" target=\"_blank\">&copy; Mapbox &copy; OpenStreetMap</a>'
     })],
     url: 'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmlydmFpbiIsImEiOiJlOWYyYTM0NThiNWM0YjJjODJjNDE4ODQzNzA2MGQyNiJ9.-NVDO27Hzt-w_nQosUPfLA'
   }),
   id: 'mapbox'
 });

 function PropertyStyle() {
   var src;
   src = '../images/map-icons/pins/48/pin1.png';
   return new ol.style.Style({
     image: new ol.style.Icon(({
       src: src,
       anchor: [0.5, 1],
       scale: 0.7,
     }))
   });
 }
 var propertySource = new ol.source.Vector({
   format: geoJSONFormat,
   loader: function(extent, resolution, projection) {
     var url = 'http://localhost:3000/db/admin';
     var that = this;
     this.clear();
     $.ajax({
       url: url,
       type: 'POST',
       'beforeSend': function(xhr) {
         if (localStorage.getItem('userToken')) {
           xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
         }
       },
       dataType: 'json',
       data: {
         id: id
       },
     }).done(function(response) {
       var features = geoJSONFormat.readFeatures(response, {
         featureProjection: 'EPSG:3857'
       });
       that.addFeatures(features);
     }).fail(function() {
       console.log("error");
     });
   },
   strategy: ol.loadingstrategy.all
 });
 var property = new ol.layer.Vector({
   source: propertySource,
   id: 'property',
   visible: true,
   style: PropertyStyle()
 });
 property.setZIndex(2);
 var map = new ol.Map({
   target: 'adminMap',
   layers: [mapbox, property],
   loadTilesWhileAnimating: true,
   loadTilesWhileInteracting: true,
   renderer: 'canvas',
   controls: ol.control.defaults({
     attributionOptions: {
       collapsible: false,
       collapsed: false
     }
   }).extend([
     new ol.control.ScaleLine({
       units: 'metric'
     }), new ol.control.OverviewMap({
       className: 'ol-overviewmap ol-custom-overviewmap',
       collapsible: true,
       collapsed: true,
       layers: [bing]
     }),
     new ol.control.ZoomToExtent({
       extent: extent
     })
   ]),
   view: new ol.View({
     center: center,
     // extent: extent,
     projection: 'EPSG:3857',
     zoom: 14,
     maxZoom: 19,
     minZoom: 10
   })
 });
 if (lang === 'el') {
   bing.set('name', 'Δορυφορική εικόνα');
   mapbox.set('name', 'Χάρτης');
   property.set('name', 'Ακίνητα');
 } else {
   bing.set('name', 'Sattelite Image');
   mapbox.set('name', 'Map');
   property.set('name', 'Properties');
 }
 //====== interactions ======
 var features = new ol.Collection();
 var drawnProperties = new ol.layer.Vector({
   source: new ol.source.Vector(),
   style: new ol.style.Style({
     fill: new ol.style.Fill({
       color: 'rgba(255, 255, 255, 0.2)'
     }),
     stroke: new ol.style.Stroke({
       color: '#ffcc33',
       width: 2
     }),
     image: new ol.style.Circle({
       radius: 7,
       fill: new ol.style.Fill({
         color: '#ffcc33'
       })
     })
   }),
   id: 'drawnProperties'
 });
 map.addLayer(drawnProperties);
 //draw
 var draw = new ol.interaction.Draw({
   // features: features,
   source: drawnProperties.getSource(),
   type: 'Point',
   style: new ol.style.Style({
     fill: new ol.style.Fill({
       color: 'rgba(255, 255, 255, 0.2)'
     }),
     stroke: new ol.style.Stroke({
       color: '#ffcc33',
       width: 2
     }),
     image: new ol.style.Circle({
       radius: 7,
       fill: new ol.style.Fill({
         color: '#ffcc33'
       })
     })
   })
 });
 map.addInteraction(draw);
 draw.setActive(false);
 //select
 var select = new ol.interaction.Select({
   layers: [
     property
   ],
   features: features,
   style: new ol.style.Style({
     fill: new ol.style.Fill({
       color: 'rgba(255, 0, 0, 0.2)'
     }),
     stroke: new ol.style.Stroke({
       color: '#FF00003',
       width: 2
     }),
     image: new ol.style.Circle({
       radius: 7,
       fill: new ol.style.Fill({
         color: '#FF0000'
       })
     })
   })
 });
 map.addInteraction(select);
 select.setActive(false);
 //translate(move)
 var translate = new ol.interaction.Translate({
   features: select.getFeatures()
 });
 //====== info ======
 map.on('click', clickInfo);

 function clickInfo(evt) {
   evt.preventDefault();
   var obj = {};
   var clickedFeature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
     return {
       feature: feature,
       layer: layer
     };
   }, this, function(layer) {
     if (layer.get('id') === 'property') {
       return true;
     }
   }, this);
   console.log(clickedFeature);
   if (clickedFeature) {
     obj.feature = {};
     clickedFeature.feature.getKeys().forEach(function(key) {
       obj.feature[key] = clickedFeature.feature.get(key);
     });
     console.log(obj);
     dust.render('adminEstateInfo.dust', obj, function(err, out) {
       console.log(out);
       $('.property-info').html(out);
       $('.property-info').removeClass('visuallyhidden');
     });
   } else {
     $('.property-info').addClass('visuallyhidden');
   }
 }
 //====== insert ======
 $('#insertProperty').click(function() {
   $('.property-info').addClass('visuallyhidden');
   toastr.options = {
     "positionClass": "toast-top-center"
   };
   toastr.info('Add New Property');
   map.un('click', clickInfo);
   select.setActive(false);
   draw.setActive(true);
   draw.on('drawend', function(evt) {
     draw.setActive(false);
   });
 });
 //====== delete ======
 $('#deleteProperty').click(function(event) {
   $('.property-info').addClass('visuallyhidden');
   toastr.options = {
     "positionClass": "toast-top-center"
   };
   toastr.info('Delete Property');
   map.un('click', clickInfo);
   draw.setActive(false);
   features.clear();
   select.setActive(true);
   select.on('select', function(e) {
     if (e.target.getFeatures().getLength() === 1) {
       toastr.options.newestOnTop = true;
       toastr.options.preventDuplicates = true;
       toastr.options.extendedTimeOut = 0;
       toastr.options.timeOut = 0;
       toastr.options.closeButton = true;
       var $toast = toastr.warning('<p>Are you sure?</p><div class="toastr-btns"><button id="yesDelete" class="mdl-button mdl-js-button ">Yes</button><button id="noDelete" class="mdl-button mdl-js-button">No</button></div>');
       if ($toast.find('#yesDelete').length) {
         $toast.on('click', '#yesDelete', function() {
           alert('you clicked ok');
           $toast.remove();
         });
       }
       if ($toast.find('#noDelete').length) {
         $toast.on('click', '#noDelete', function() {
           alert('Surprise! you clicked me.');
         });
       }
     }
   });
 });
 $('#logout').click(function() {
   location.href = "/map/logout";
 });
