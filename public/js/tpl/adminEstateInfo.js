(function(dust){dust.register("adminEstateInfo.dust",body_0);function body_0(chk,ctx){return chk.w("<ul>").s(ctx.get(["feature"], false),ctx,{"block":body_1},{}).w("</ul>");}body_0.__dustBody=!0;function body_1(chk,ctx){return chk.w("<li>Κωδικός/Ιd : <b>").f(ctx.get(["gid"], false),ctx,"h").w("</b></li><li>Τύπος/Type : <b>").f(ctx.get(["estatetype"], false),ctx,"h").w("</b></li><li>Οδός : <b>").f(ctx.get(["street_el"], false),ctx,"h").w(" ").f(ctx.get(["h_num_el"], false),ctx,"h").w("</b></li><li>Street : <b>").f(ctx.get(["street_en"], false),ctx,"h").w(" ").f(ctx.get(["h_num_en"], false),ctx,"h").w("</b></li><li>Ταχ. Κωδικός/PS Code : <b>").f(ctx.get(["ps_code"], false),ctx,"h").w("</b></li><li>Περιοχή/Area Name : <b>").f(ctx.get(["area_name"], false),ctx,"h").w("</b></li><li>Εμβαδό Ακινήτου/Estate Area : <b>").f(ctx.get(["estatearea"], false),ctx,"h").w("</b></li><li>Εβαδό Οικοπέδου/Plot Area : <b>").f(ctx.get(["plotarea"], false),ctx,"h").w("</b></li><li>Αριθμός Οικοπέδου/Plot Number : <b>").f(ctx.get(["plot_num"], false),ctx,"h").w("</b></li><li>Νεόδμητο/Newly Build : <b>").h("eq",ctx,{"else":body_2,"block":body_3},{"key":ctx.get(["new"], false),"type":"boolean","value":"true"},"h").w("</b></li><li>Χρόνος Κατασκευής/Construction Year : <b>").f(ctx.get(["year"], false),ctx,"h").w("</b></li><li>Estate Title/Τίτλος Ιδικτησίας : <b>").f(ctx.get(["title"], false),ctx,"h").w("</b></li><li>Όροφος/Floor : <b>").f(ctx.get(["floor"], false),ctx,"h").w("</b></li><li>Θέρμανση/Heating : <b>").h("eq",ctx,{"else":body_4,"block":body_5},{"key":ctx.get(["heating"], false),"type":"boolean","value":"true"},"h").w("</b></li><li>Κλιματισμός/Air Condition : <b>").h("eq",ctx,{"else":body_6,"block":body_7},{"key":ctx.get(["cooling"], false),"type":"boolean","value":"true"},"h").w("</b></li><li>View/Θέα : <b>").h("eq",ctx,{"else":body_8,"block":body_9},{"key":ctx.get(["view"], false),"type":"boolean","value":"true"},"h").w("</b></li><li>Θέση Στάυμεσης/Parking : <b>").h("eq",ctx,{"else":body_10,"block":body_11},{"key":ctx.get(["parking"], false),"type":"boolean","value":"true"},"h").w("</b></li><li>Επιπλωμένο/Furnished : <b>").h("eq",ctx,{"else":body_12,"block":body_13},{"key":ctx.get(["furnished"], false),"type":"boolean","value":"true"},"h").w("</b></li><li>Αριθμός Υπνοδωματίων/Number of Bedrooms : <b>").f(ctx.get(["bedrooms"], false),ctx,"h").w("</b></li>");}body_1.__dustBody=!0;function body_2(chk,ctx){return chk.w("Όχι/No");}body_2.__dustBody=!0;function body_3(chk,ctx){return chk.w("Ναι/Yes");}body_3.__dustBody=!0;function body_4(chk,ctx){return chk.w("Όχι/No");}body_4.__dustBody=!0;function body_5(chk,ctx){return chk.w("Ναι/Yes");}body_5.__dustBody=!0;function body_6(chk,ctx){return chk.w("Όχι/No");}body_6.__dustBody=!0;function body_7(chk,ctx){return chk.w("Ναι/Yes");}body_7.__dustBody=!0;function body_8(chk,ctx){return chk.w("Όχι/No");}body_8.__dustBody=!0;function body_9(chk,ctx){return chk.w("Ναι/Yes");}body_9.__dustBody=!0;function body_10(chk,ctx){return chk.w("Όχι/No");}body_10.__dustBody=!0;function body_11(chk,ctx){return chk.w("Ναι/Yes");}body_11.__dustBody=!0;function body_12(chk,ctx){return chk.w("Όχι/No");}body_12.__dustBody=!0;function body_13(chk,ctx){return chk.w("Ναι/Yes");}body_13.__dustBody=!0;return body_0}(dust));