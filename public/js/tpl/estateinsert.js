(function(dust){dust.register("estateInsert.dust",body_0);function body_0(chk,ctx){return chk.w("<form class=\"insertProperty\" action=\"#\" method=\"post\" autocomplete=\"off\" name=\"insertProperty\"><div class=\"mdl-grid\"><div class=\"mdl-cell mdl-cell--4-col\"><fieldset><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"estatetype\"><label class=\"mdl-textfield__label\" for=\"estatetype\">estatetype</label></div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" pattern=\"-?[0-9]*(\\.[0-9]+)?\" id=\"estatearea\"><label class=\"mdl-textfield__label\" for=\"estatearea\">estatearea</label> <span class=\"mdl-textfield__error\">Input is not a number!</span> </div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" pattern=\"-?[0-9]*(\\.[0-9]+)?\" id=\"plotarea\"><label class=\"mdl-textfield__label\" for=\"plotarea\">plotarea</label> <span class=\"mdl-textfield__error\">Input is not a number!</span> </div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"title\"><label class=\"mdl-textfield__label\" for=\"title\">title</label></div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" pattern=\"-?[0-9]*(\\.[0-9]+)?\" id=\"year\"><label class=\"mdl-textfield__label\" for=\"year\">year</label> <span class=\"mdl-textfield__error\">Input is not a number!</span> </div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"other\"><label class=\"mdl-textfield__label\" for=\"other\">other</label></div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"parcel_num\"><label class=\"mdl-textfield__label\" for=\"parcel_num\">parcel_num</label></div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" pattern=\"-?[0-9]*(\\.[0-9]+)?\" id=\"bedrooms\"><label class=\"mdl-textfield__label\" for=\"bedrooms\">bedrooms</label><span class=\"mdl-textfield__error\">Input is not a number!</span> </div></fieldset></div><div class=\"mdl-cell mdl-cell--4-col\"><fieldset><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"plan_num\"><label class=\"mdl-textfield__label\" for=\"plan_num\">plan_num</label></div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"area_name\"><label class=\"mdl-textfield__label\" for=\"area_name\">area_name</label></div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"street_el\"><label class=\"mdl-textfield__label\" for=\"street_el\">street_el</label></div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"h_num_el\"><label class=\"mdl-textfield__label\" for=\"h_num_el\">h_num_el</label></div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"ps_code\"><label class=\"mdl-textfield__label\" for=\"ps_code\">ps_code</label></div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" pattern=\"-?[0-9]*(\\.[0-9]+)?\" id=\"floor\"><label class=\"mdl-textfield__label\" for=\"floor\">floor</label><span class=\"mdl-textfield__error\">Input is not a number!</span> </div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"street_en\"><label class=\"mdl-textfield__label\" for=\"street_en\">street_en</label></div><div class=\"mdl-textfield mdl-js-textfield\"><input class=\"mdl-textfield__input\" type=\"text\" id=\"h_num_en\"><label class=\"mdl-textfield__label\" for=\"h_num_en\">h_num_en</label></div></fieldset></div><div class=\"mdl-cell mdl-cell--4-col\"><fieldset><label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"parking\"><input type=\"checkbox\" id=\"parking\" class=\"mdl-checkbox__input\" > <span class=\"mdl-checkbox__label\">parking</span> </label><label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"furnished\"><input type=\"checkbox\" id=\"furnished\" class=\"mdl-checkbox__input\" > <span class=\"mdl-checkbox__label\">furnished</span> </label><label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"isnew\"><input type=\"checkbox\" id=\"isnew\" class=\"mdl-checkbox__input\" > <span class=\"mdl-checkbox__label\">isnew</span> </label><label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"view\"><input type=\"checkbox\" id=\"view\" class=\"mdl-checkbox__input\" > <span class=\"mdl-checkbox__label\">view</span> </label><label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"heating\"><input type=\"checkbox\" id=\"heating\" class=\"mdl-checkbox__input\" > <span class=\"mdl-checkbox__label\">heating</span> </label><label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"cooling\"><input type=\"checkbox\" id=\"cooling\" class=\"mdl-checkbox__input\" > <span class=\"mdl-checkbox__label\">cooling</span> </label></fieldset></div><div class=\"mdl-grid\"><div class=\"mdl-cell mdl-cell--6-col\"><button class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--colored\">Submit</button></div><div class=\"mdl-cell mdl-cell--6-col\"><button class=\"mdl-button mdl-js-button mdl-js-ripple-effect\">Button</button></div></div></div></form>");}body_0.__dustBody=!0;return body_0}(dust));