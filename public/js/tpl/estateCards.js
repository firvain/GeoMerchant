(function(dust){dust.register("estateCards",body_0);function body_0(chk,ctx){return chk.w("<div class=\"estate-card-square mdl-card\" data-gid=\"").f(ctx.get(["gid"], false),ctx,"h").w("\"><div class=\"mdl-card__title mdl-card--expand estate-image\"><h2 class=\"mdl-card__title-text\">").f(ctx.get(["type"], false),ctx,"h").w("</h2> </div><div class=\"mdl-card__supporting-text\"><div>").f(ctx.getPath(false, ["title","listing_type"]),ctx,"h").w(" : <b class=\"text-bold\">").f(ctx.get(["listing_type"], false),ctx,"h").w("</b></div><div>").f(ctx.getPath(false, ["title","address"]),ctx,"h").w(" : <b class=\"text-bold\">").f(ctx.get(["address"], false),ctx,"h").w("</b></div><div>").f(ctx.getPath(false, ["title","area"]),ctx,"h").w(" : <b class=\"text-bold\">").f(ctx.get(["area"], false),ctx,"h").w("</b></div><div>").f(ctx.getPath(false, ["title","bedrooms"]),ctx,"h").w(" :<b class=\"text-bold\">").f(ctx.get(["bedrooms"], false),ctx,"h").w("</b></div><div>").f(ctx.getPath(false, ["title","price"]),ctx,"h").w(" : <b class=\"text-bold\">").f(ctx.get(["price"], false),ctx,"h").w(" &euro;</b></div><div >").h("eq",ctx,{"block":body_1},{"key":ctx.get(["isnew"], false),"type":"boolean","value":"true"},"h").w("  ").h("eq",ctx,{"block":body_2},{"key":ctx.get(["furnished"], false),"type":"boolean","value":"true"},"h").w("  ").h("eq",ctx,{"block":body_3},{"key":ctx.get(["pets"], false),"type":"boolean","value":"true"},"h").w(" </div><div class=\"mdl-card__actions mdl-card--border\"><div class=\"mdl-grid mdl-grid--no-spacing\"><div class=\"mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-cell--middle\"><input id=\"estate-card-square-extra-info\" class=\"input-align-center mdl-button mdl-js-button mdl-button--raised mdl-button--colored\" type=\"button\" value=\"").f(ctx.getPath(false, ["btns","info"]),ctx,"h").w("\"></div><div class=\"mdl-cell mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-cell--middle\"><input id=\"estate-card-square-close\" class=\"input-align-center mdl-button mdl-js-button \" type=\"button\" value=\"").f(ctx.getPath(false, ["btns","close"]),ctx,"h").w("\"></div></div></div></div>");}body_0.__dustBody=!0;function body_1(chk,ctx){return chk.w("<a href=\"#\" class=\"tooltip-right\" data-tooltip=\"").f(ctx.getPath(false, ["title","isnew"]),ctx,"h").w("\"><i class=\"fa fa-star\"></i></a>");}body_1.__dustBody=!0;function body_2(chk,ctx){return chk.w("<a href=\"#\" class=\"tooltip-right\" data-tooltip=\"").f(ctx.getPath(false, ["title","furnished"]),ctx,"h").w("\"><i class=\"fa fa-bed\"></i></a>");}body_2.__dustBody=!0;function body_3(chk,ctx){return chk.w("<a href=\"#\" class=\"tooltip-right\" data-tooltip=\"").f(ctx.getPath(false, ["title","pets"]),ctx,"h").w("\"><i class=\"fa fa-paw\"></i></a>");}body_3.__dustBody=!0;return body_0}(dust));