(function(dust){dust.register("modalInfo.dust",body_0);function body_0(chk,ctx){return chk.s(ctx.get(["feature"], false),ctx,{"block":body_1},{});}body_0.__dustBody=!0;function body_1(chk,ctx){return chk.w("<h4>").f(ctx.get(["type"], false),ctx,"h").w("</h4><div class=\"mdl-grid\"><div class=\"mdl-cell mdl-cell--2-col\"><ul><li>").f(ctx.getPath(false, ["title","estateCode"]),ctx,"h").w("</li><li>").f(ctx.getPath(false, ["title","address"]),ctx,"h").w("</li><li>").f(ctx.getPath(false, ["title","area"]),ctx,"h").w("</li><li>").f(ctx.getPath(false, ["title","bedrooms"]),ctx,"h").w("</li><li>").f(ctx.getPath(false, ["title","price"]),ctx,"h").w("</li><li>").f(ctx.getPath(false, ["title","new"]),ctx,"h").w("</li><li>").f(ctx.getPath(false, ["title","parking"]),ctx,"h").w("</li><li>").f(ctx.getPath(false, ["title","furnished"]),ctx,"h").w("</li><li>").f(ctx.getPath(false, ["title","pets"]),ctx,"h").w("</li><li>").f(ctx.getPath(false, ["title","view"]),ctx,"h").w("</li><li>").f(ctx.getPath(false, ["title","heating"]),ctx,"h").w("</li><li>").f(ctx.getPath(false, ["title","cooling"]),ctx,"h").w("</li></ul></div><div class=\"mdl-cell mdl-cell--2-col\"><ul><li>").f(ctx.get(["gid"], false),ctx,"h").w("</li><li>").f(ctx.get(["address"], false),ctx,"h").w("</li><li>").f(ctx.get(["area"], false),ctx,"h").w("</li><li>").f(ctx.get(["bedrooms"], false),ctx,"h").w("</li><li>").f(ctx.get(["price"], false),ctx,"h").w("</li><li>").h("eq",ctx,{"else":body_2,"block":body_3},{"key":ctx.get(["new"], false),"type":"boolean","value":"true"},"h").w("</li><li>").h("eq",ctx,{"else":body_4,"block":body_5},{"key":ctx.get(["parking"], false),"type":"boolean","value":"true"},"h").w("</li><li>").h("eq",ctx,{"else":body_6,"block":body_7},{"key":ctx.get(["furnished"], false),"type":"boolean","value":"true"},"h").w("</li><li>").h("eq",ctx,{"else":body_8,"block":body_9},{"key":ctx.get(["pets"], false),"type":"boolean","value":"true"},"h").w("</li><li>").h("eq",ctx,{"else":body_10,"block":body_11},{"key":ctx.get(["view"], false),"type":"boolean","value":"true"},"h").w("</li><li>").h("eq",ctx,{"else":body_12,"block":body_13},{"key":ctx.get(["heating"], false),"type":"boolean","value":"true"},"h").w("</li><li>").h("eq",ctx,{"else":body_14,"block":body_15},{"key":ctx.get(["cooling"], false),"type":"boolean","value":"true"},"h").w("</li></ul></div><div class=\"mdl-cell mdl-cell--8-col\"><img style=\"max-width: 100%;\" src=\"../images/properties/placeholder-big.png\" alt=\"Big Property Image\"></div></div><h6>").f(ctx.getPath(false, ["title","contactInfo"]),ctx,"h").w("</h6><div class=\"mdl-grid\"><div class=\"mdl-cell mdl-cell--12-col\"><address> ").f(ctx.getPath(false, ["title","name"]),ctx,"h").w(" : ").f(ctx.get(["name"], false),ctx,"h").w("<br> ").f(ctx.getPath(false, ["title","lastname"]),ctx,"h").w(" : ").f(ctx.get(["lastname"], false),ctx,"h").w("<br> ").f(ctx.getPath(false, ["title","phone"]),ctx,"h").w(" : ").f(ctx.get(["phone"], false),ctx,"h").w("<br> ").f(ctx.getPath(false, ["title","email"]),ctx,"h").w(" : <a href=\"mailto:").f(ctx.get(["email"], false),ctx,"h").w("\">").f(ctx.get(["email"], false),ctx,"h").w("</a><br> </address></div></div> ");}body_1.__dustBody=!0;function body_2(chk,ctx){return chk.w("<i class=\"material-icons\">clear</i>");}body_2.__dustBody=!0;function body_3(chk,ctx){return chk.w("<i class=\"material-icons\">done</i>");}body_3.__dustBody=!0;function body_4(chk,ctx){return chk.w("<i class=\"material-icons\">clear</i>");}body_4.__dustBody=!0;function body_5(chk,ctx){return chk.w("<i class=\"material-icons\">done</i>");}body_5.__dustBody=!0;function body_6(chk,ctx){return chk.w("<i class=\"material-icons\">clear</i>");}body_6.__dustBody=!0;function body_7(chk,ctx){return chk.w("<i class=\"material-icons\">done</i>");}body_7.__dustBody=!0;function body_8(chk,ctx){return chk.w("<i class=\"material-icons\">clear</i>");}body_8.__dustBody=!0;function body_9(chk,ctx){return chk.w("<i class=\"material-icons\">done</i>");}body_9.__dustBody=!0;function body_10(chk,ctx){return chk.w("<i class=\"material-icons\">clear</i>");}body_10.__dustBody=!0;function body_11(chk,ctx){return chk.w("<i class=\"material-icons\">done</i>");}body_11.__dustBody=!0;function body_12(chk,ctx){return chk.w("<i class=\"material-icons\">clear</i>");}body_12.__dustBody=!0;function body_13(chk,ctx){return chk.w("<i class=\"material-icons\">done</i>");}body_13.__dustBody=!0;function body_14(chk,ctx){return chk.w("<i class=\"material-icons\">clear</i>");}body_14.__dustBody=!0;function body_15(chk,ctx){return chk.w("<i class=\"material-icons\">done</i>");}body_15.__dustBody=!0;return body_0}(dust));