(function(dust){dust.register("adminPropertyInfo",body_0);function body_0(chk,ctx){return chk.s(ctx.get(["feature"], false),ctx,{"block":body_1},{}).w("<div class=\"mdl-grid estate-atributes-list\"><div class=\"mdl-cell mdl-cell--12-col\"><ul class='mdl-list'> ").s(ctx.get(["feature"], false),ctx,{"block":body_2},{}).w(" </ul></div></div>");}body_0.__dustBody=!0;function body_1(chk,ctx){return chk.w("<div class=\"mdl-grid\"><div class=\"mdl-cell mdl-cell--12-col\"><button id=\"listing\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored\" data-gid =\"").f(ctx.get(["gid"], false),ctx,"h").w("\"> listing </button></div></div>");}body_1.__dustBody=!0;function body_2(chk,ctx){return chk.w("<li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span>Κωδικός/Ιd : <b>").f(ctx.get(["gid"], false),ctx,"h").w("</b></span></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span>Τύπος/Type : <b>").f(ctx.get(["estatetype"], false),ctx,"h").w(" ").f(ctx.get(["estatetype_en"], false),ctx,"h").w("</b></span></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span>Οδός : <b>").f(ctx.get(["street_el"], false),ctx,"h").w(" ").f(ctx.get(["h_num_el"], false),ctx,"h").w("</b></span></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span>Street : <b>").f(ctx.get(["street_en"], false),ctx,"h").w(" ").f(ctx.get(["h_num_en"], false),ctx,"h").w("</b></span></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span>Ταχ. Κωδικός/PS Code : <b>").f(ctx.get(["ps_code"], false),ctx,"h").w("</b></span></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span></span>Περιοχή/Area Name : <b>").f(ctx.get(["area_name"], false),ctx,"h").w("</b></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span></span>Εμβαδό Ακινήτου/Estate Area : <b>").f(ctx.get(["estatearea"], false),ctx,"h").w("</b></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span>Εβαδό Οικοπέδου/Plot Area : <b>").f(ctx.get(["plotarea"], false),ctx,"h").w("</b></span></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span>Αριθμός Οικοπέδου/Plot Number : <b>").f(ctx.get(["plot_num"], false),ctx,"h").w("</b></span></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span></span>Νεόδμητο/Newly Build : <b>").h("eq",ctx,{"else":body_3,"block":body_4},{"key":ctx.get(["isnew"], false),"type":"boolean","value":"true"},"h").w("</b></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span>Χρόνος Κατασκευής/Construction Year : <b>").f(ctx.get(["year"], false),ctx,"h").w("</b></span></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span>Estate Title/Τίτλος Ιδικτησίας : <b>").f(ctx.get(["title"], false),ctx,"h").w("</b></span></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span>Όροφος/Floor : <b>").f(ctx.get(["floor"], false),ctx,"h").w("</b></span></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span></span>Θέρμανση/Heating : <b>").h("eq",ctx,{"else":body_5,"block":body_6},{"key":ctx.get(["heating"], false),"type":"boolean","value":"true"},"h").w("</b></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span>Κλιματισμός/Air Condition : <b>").h("eq",ctx,{"else":body_7,"block":body_8},{"key":ctx.get(["cooling"], false),"type":"boolean","value":"true"},"h").w("</b></span></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span></span>View/Θέα : <b>").h("eq",ctx,{"else":body_9,"block":body_10},{"key":ctx.get(["view"], false),"type":"boolean","value":"true"},"h").w("</b></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span></span>Θέση Στάυμεσης/Parking : <b>").h("eq",ctx,{"else":body_11,"block":body_12},{"key":ctx.get(["parking"], false),"type":"boolean","value":"true"},"h").w("</b></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span>Επιπλωμένο/Furnished : <b>").h("eq",ctx,{"else":body_13,"block":body_14},{"key":ctx.get(["furnished"], false),"type":"boolean","value":"true"},"h").w("</b></span></span></li><li class=\"mdl-list__item\"><span class=\"mdl-list__item-primary-content\"><i class=\"material-icons secondary-text-color\">info</i><span></span>Αριθμός Υπνοδωματίων/Number of Bedrooms : <b>").f(ctx.get(["bedrooms"], false),ctx,"h").w("</b></span></li> ");}body_2.__dustBody=!0;function body_3(chk,ctx){return chk.w("Όχι/No");}body_3.__dustBody=!0;function body_4(chk,ctx){return chk.w("Ναι/Yes");}body_4.__dustBody=!0;function body_5(chk,ctx){return chk.w("Όχι/No");}body_5.__dustBody=!0;function body_6(chk,ctx){return chk.w("Ναι/Yes");}body_6.__dustBody=!0;function body_7(chk,ctx){return chk.w("Όχι/No");}body_7.__dustBody=!0;function body_8(chk,ctx){return chk.w("Ναι/Yes");}body_8.__dustBody=!0;function body_9(chk,ctx){return chk.w("Όχι/No");}body_9.__dustBody=!0;function body_10(chk,ctx){return chk.w("Ναι/Yes");}body_10.__dustBody=!0;function body_11(chk,ctx){return chk.w("Όχι/No");}body_11.__dustBody=!0;function body_12(chk,ctx){return chk.w("Ναι/Yes");}body_12.__dustBody=!0;function body_13(chk,ctx){return chk.w("Όχι/No");}body_13.__dustBody=!0;function body_14(chk,ctx){return chk.w("Ναι/Yes");}body_14.__dustBody=!0;return body_0}(dust));