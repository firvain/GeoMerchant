(function(dust){dust.register("results",body_0);function body_0(chk,ctx){return chk.w("  <ul class=\"results-list mdl-list\">").s(ctx.get(["results"], false),ctx,{"block":body_1},{}).w("</ul>");}body_0.__dustBody=!0;function body_1(chk,ctx){return chk.w("<li class=\"mdl-list__item mdl-list__item--two-line\" data-gid=").f(ctx.get(["gid"], false),ctx,"h").w("><span class=\"mdl-list__item-primary-content\"><span>").f(ctx.get(["address"], false),ctx,"h").w("</span><span class=\"mdl-list__item-sub-title\">").f(ctx.getPath(false, ["title","price"]),ctx,"h").w(" ").f(ctx.get(["price"], false),ctx,"h").w(" &euro; - ").f(ctx.getPath(false, ["title","area"]),ctx,"h").w(" ").f(ctx.get(["area"], false),ctx,"h").w(" ").f(ctx.getPath(false, ["title","areaUnits"]),ctx,"h").w("</span></span><span class=\"mdl-list__item-secondary-content\" id=\"zoom").f(ctx.get(["gid"], false),ctx,"h").w("\"><a class=\"mdl-list__item-secondary-action\" href=\"#\"><i class=\"material-icons\">zoom_in</i></a></li>");}body_1.__dustBody=!0;return body_0}(dust));