(function(dust){dust.register("weatherPopup",body_0);function body_0(chk,ctx){return chk.w("<div class=\"weather-popup-content text-primary-color\"><ul><li class=\"icon-basecloud\"></li><li class=\"icon-showers icon-sunny\"></li><li>").f(ctx.get(["temp"], false),ctx,"h").w(" <a class=\"weather-icon\" data-icon=\"*\"></a></li><li>").f(ctx.get(["pressure"], false),ctx,"h").w("<a class=\"weather-icon\" data-icon=\"'\"></a></li><li>").f(ctx.get(["humidity"], false),ctx,"h").w("<a class=\"weather-icon\">% humidity </li></ul></div>");}body_0.__dustBody=!0;return body_0}(dust));