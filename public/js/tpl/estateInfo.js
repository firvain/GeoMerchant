(function(dust){dust.register("estateInfo",body_0);function body_0(chk,ctx){return chk.w("<table class=\"mdl-data-table mdl-js-data-table\"><thead>").s(ctx.get(["title"], false),ctx,{"block":body_1},{}).w("</thead><tbody> ").s(ctx.get(["features"], false),ctx,{"block":body_2},{}).w(" </tbody></table>");}body_0.__dustBody=!0;function body_1(chk,ctx){return chk.w("<tr><th class=\"mdl-data-table__cell--non-numeric\">").f(ctx.get(["type"], false),ctx,"h").w("</th><th class=\"mdl-data-table__cell--non-numeric\">").f(ctx.get(["area"], false),ctx,"h").w("</th><th class=\"mdl-data-table__cell--non-numeric\">").f(ctx.get(["address"], false),ctx,"h").w("</th></tr>");}body_1.__dustBody=!0;function body_2(chk,ctx){return chk.s(ctx.get(["feature"], false),ctx,{"block":body_3},{});}body_2.__dustBody=!0;function body_3(chk,ctx){return chk.w("<tr><td class=\"mdl-data-table__cell--non-numeric\">").f(ctx.get(["type"], false),ctx,"h").w("</td><td class=\"mdl-data-table__cell--non-numeric\">").f(ctx.get(["area"], false),ctx,"h").w("</td><td class=\"mdl-data-table__cell--non-numeric\">").f(ctx.get(["address"], false),ctx,"h").w("</td></tr>  ");}body_3.__dustBody=!0;return body_0}(dust));