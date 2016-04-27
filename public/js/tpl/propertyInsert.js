(function(dust){dust.register("propertyInsert",body_0);function body_0(chk,ctx){return chk.w("<form class=\"insertProperty\" action=\"#\" method=\"post\" autocomplete=\"off\" name=\"insertProperty\"><div class=\"mdl-grid\"><div class=\"mdl-cell mdl-cell--3-col\"><fieldset><div class=\"mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label\"><select id=\"estateType\" name=\"estateType\" class=\"mdl-selectfield__select\"><option value=\"Διαμέρισμα\" selected=\"selected\">Διαμέρισμα</option><option value=\"Μονοκατοικία\">Μονοκατοικία</option><option value=\"Μεζονέτα\">Μεζονέτα</option><option value=\"Έπαυλη\">Έπαυλη</option></select><label class=\"mdl-selectfield__label\" for=\"estateType\">Estate Type (Greek)</label></div><div class=\"mdl-selectfield mdl-js-selectfield mdl-selectfield--floating-label\"><select id=\"estateType_en\" name=\"estateType_en\" class=\"mdl-selectfield__select\"><option value=\"Apartment\" selected=\"selected\">Apartment</option><option value=\"Detached House\">Detached House</option><option value=\"Maisonette\">Maisonette</option><option value=\"Villa\">Villa</option></select><label class=\"mdl-selectfield__label\" for=\"estateType_en\">Estate Type (English)</label></div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" id=\"estatearea\" data-parsley-required data-parsley-type=\"integer\" data-parsley-range=\"[0 , 2147483647]\" data-parsley-errors-container=\"#error-msg-estatearea\" value=\"").f(ctx.get(["estatearea"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"estatearea\">Estate Area (m2)</label><div class=\"error-msg\" id=\"error-msg-estatearea\"></div></div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" id=\"bedrooms\" data-parsley-required data-parsley-type=\"integer\" data-parsley-range=\"[0 , 20]\" data-parsley-errors-container=\"#error-msg-bedrooms\" value=\"").f(ctx.get(["bedrooms"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"bedrooms\">Number of Bedrooms</label><div class=\"error-msg\" id=\"error-msg-bedrooms\"></div></div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" id=\"floor\" data-parsley-required data-parsley-type=\"integer\" data-parsley-range=\"[0 , 100]\" data-parsley-errors-container=\"#error-msg-floor\" value=\"").f(ctx.get(["floor"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"floor\">Floor Number</label><div class=\"error-msg\" id=\"error-msg-floor\"></div></div></fieldset></div><div class=\"mdl-cell mdl-cell--3-col\"><fieldset><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"parcel_num\" data-parsley-required data-parsley-maxlength=\"10\" data-parsley-errors-container=\"#error-msg-parcel_num\" value=\"").f(ctx.get(["parcel_num"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"parcel_num\">Parcel Number</label><div class=\"error-msg\" id=\"error-msg-parcel_num\"></div></div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"title\" data-parsley-required data-parsley-maxlength=\"20\" data-parsley-errors-container=\"#error-msg-title\" value=\"").f(ctx.get(["parcel_num"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"title\">Estate Tilte</label><div class=\"error-msg\" id=\"error-msg-title\"></div></div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" id=\"plotarea\" data-parsley-required data-parsley-type=\"integer\" data-parsley-range=\"[0 , 2147483647]\" data-parsley-errors-container=\"#error-msg-plotarea\" value=\"").f(ctx.get(["plotarea"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"plotarea\">Plot Area</label><div class=\"error-msg\" id=\"error-msg-plotarea\"></div></div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" id=\"year\" data-parsley-required data-parsley-type=\"integer\" data-parsley-range=\"[1000 , 3000]\" data-parsley-errors-container=\"#error-msg-year\" value=\"").f(ctx.get(["year"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"year\">Year Of Construction</label><div class=\"error-msg\" id=\"error-msg-year\"></div></div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"plan_num\" data-parsley-required data-parsley-maxlength=\"15\" data-parsley-errors-container=\"#error-msg-plan_num\" value=\"").f(ctx.get(["plan_num"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"plan_num\">Plan Number</label><div class=\"error-msg\" id=\"error-msg-plan_num\"></div></div></fieldset></div><div class=\"mdl-cell mdl-cell--3-col\"><fieldset><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"street_el\" data-parsley-required data-parsley-maxlength=\"256\" data-parsley-errors-container=\"#error-msg-street_el\" value=\"").f(ctx.get(["street_el"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"street_el\">Street Name (Greek)</label><div class=\"error-msg\" id=\"error-msg-street_el\"></div></div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"street_en\" data-parsley-required data-parsley-maxlength=\"256\" data-parsley-errors-container=\"#error-msg-street_en\" value=\"").f(ctx.get(["street_en"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"street_en\">Street Name (English)</label><div class=\"error-msg\" id=\"error-msg-street_en\"></div></div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"street_number\" data-parsley-required data-parsley-maxlength=\"8\" data-parsley-errors-container=\"#error-msg-street_number\" value=\"").f(ctx.get(["street_number"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"street_number\">Street Number</label><div class=\"error-msg\" id=\"error-msg-street_number\"></div></div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"ps_code\" data-parsley-required data-parsley-maxlength=\"10\" data-parsley-errors-container=\"#error-msg-ps_code\" value=\"").f(ctx.get(["ps_code"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"ps_code\">PS Code</label><div class=\"error-msg\" id=\"error-msg-ps_code\"></div></div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"area_name\" data-parsley-required data-parsley-errors-container=\"#error-msg-area_name\" value=\"").f(ctx.get(["area_name"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"area_name\">Estate Area Name</label><div class=\"error-msg\" id=\"error-msg-area_name\"></div></div><div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"other\" data-parsley-required data-parsley-maxlength=\"256\" data-parsley-errors-container=\"#error-msg-other\" value=\"").f(ctx.get(["other"], false),ctx,"h").w("\"><label class=\"mdl-textfield__label\" for=\"other\">Other Info</label><div class=\"error-msg\" id=\"error-msg-other\"></div></div></fieldset></div><div class=\"mdl-cell mdl-cell--3-col\"><fieldset class=\"checkboxes\"><label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"parking\"><input type=\"checkbox\" id=\"parking\" class=\"mdl-checkbox__input\" ").h("eq",ctx,{"block":body_1},{"key":ctx.get(["parking"], false),"type":"boolean","value":"true"},"h").w("> <span class=\"mdl-checkbox__label\">Parking</span> </label><label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"furnished\"><input type=\"checkbox\" id=\"furnished\" class=\"mdl-checkbox__input\" ").h("eq",ctx,{"block":body_2},{"key":ctx.get(["furnished"], false),"type":"boolean","value":"true"},"h").w("> <span class=\"mdl-checkbox__label\">Furnished</span> </label><label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"isnew\"><input type=\"checkbox\" id=\"isnew\" class=\"mdl-checkbox__input\" ").h("eq",ctx,{"block":body_3},{"key":ctx.get(["isnew"], false),"type":"boolean","value":"true"},"h").w("> <span class=\"mdl-checkbox__label\">Newly Build</span> </label><label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"view\"><input type=\"checkbox\" id=\"view\" class=\"mdl-checkbox__input\" ").h("eq",ctx,{"block":body_4},{"key":ctx.get(["view"], false),"type":"boolean","value":"true"},"h").w("> <span class=\"mdl-checkbox__label\">View</span> </label><label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"heating\"><input type=\"checkbox\" id=\"heating\" class=\"mdl-checkbox__input\" ").h("eq",ctx,{"block":body_5},{"key":ctx.get(["heating"], false),"type":"boolean","value":"true"},"h").w("> <span class=\"mdl-checkbox__label\">Heating</span> </label><label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"cooling\"><input type=\"checkbox\" id=\"cooling\" class=\"mdl-checkbox__input\" ").h("eq",ctx,{"block":body_6},{"key":ctx.get(["cooling"], false),"type":"boolean","value":"true"},"h").w("> <span class=\"mdl-checkbox__label\">Air Condition</span> </label></fieldset></div></div><div class=\"mdl-grid div-centered-50 text-centered\"><div class=\"mdl-cell mdl-cell--6-col\"><button id=\"insert\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--colored\"> Insert </button></div><div class=\"mdl-cell mdl-cell--6-col\"><button id=\"cancelInsert\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect\"> Cancel </button></div></div></form>");}body_0.__dustBody=!0;function body_1(chk,ctx){return chk.w("checked");}body_1.__dustBody=!0;function body_2(chk,ctx){return chk.w("checked");}body_2.__dustBody=!0;function body_3(chk,ctx){return chk.w("checked");}body_3.__dustBody=!0;function body_4(chk,ctx){return chk.w("checked");}body_4.__dustBody=!0;function body_5(chk,ctx){return chk.w("checked");}body_5.__dustBody=!0;function body_6(chk,ctx){return chk.w("checked");}body_6.__dustBody=!0;return body_0}(dust));