/* ==========================================================
 * gii-slideshow.js v1.0.1
 * http://www.getskarinnovation.se/gii-slideshow
 * ==========================================================
 * Copyright 2013, Getsk�r IT Innovation AB, Sweden
 * http://www.getskarinnovation.se
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Changelog:
 * 1.0.1    Getsk�r, May 27th, 2013.
 *          * Minor adjustments in image animation calculations to support new
 *          * behavior in jQuery 1.10.
 * 
 * 1.0.0    Getsk�r, October 25th, 2012.
 *          * Initial commit.
 *
 * w        Month nnnn, 20nn.
 *          * Changed so that when a slideshow frame becomes visible, it is
 *          initiated with an image. Also, when a slideshow is being hidden,
 *          the script stops loading images.
 *
 * ========================================================== */
(function( $ ){

  $.fn.slideshow = function( options ) {

    // Create some defaults, extending them with any options that were provided
    var msettings = $.extend( {
      'interval'        : 5000,
      'width'           : 326,
      'height'          : 200,
      'rescale'         : false,
      'rescalepadding'  : 8,
      'animate'         : true,
      'caption'         : true,
      'resizeimg'       : false,
      'resizeimgfactor' : 1.5
    }, options);

    return this.each(function() {


        function vpadding(elm) {
            var p = 0;
            var t = elm.css("padding-top");
            var b = elm.css("padding-bottom");

            if (typeof t != 'undefined') p += parseInt(t.replace("px", ""));
            if (typeof b != 'undefined') p += parseInt(b.replace("px", ""));

            return p;
        }

        var self = $(this);

        var settings = jQuery.extend({}, msettings);

        // Override default settings by data-* attributes
        $.each(settings, function(key, val) {
            if (self.attr("data-" + key)) {
                var newval = self.attr("data-" + key);
                if (newval.toLowerCase() == 'true') settings[key] = true;
                if (newval.toLowerCase() == 'false') settings[key] = false;
                else settings[key] = newval;
            }
        });

        var urls = [];
        var links = [];
        var texts = [];

        $(this).children(".gii-slideshow-element").each(function(ch) {
            urls.push($(this).attr("data-url"));
            links.push($(this).attr("data-link"));
            texts.push($(this).html());
        });

        if (self.has(".gii-slideshow-outer-frame").length == 0) {
            self.append("<div class='gii-slideshow-outer-frame'><div class='gii-slideshow-inner-frame'> </div></div>");
            var p = -1;

            var slide = function () {

                if (self.is(":visible")) {

                    p++;
                    if (p >= urls.length) p = 0;

                    var rendw = settings.width;
                    var rendh = settings.height;

                    if (settings.rescale) {
                        rendw = parseInt(self.css("width").replace("px", ""))- settings.rescalepadding;
                        rendh = Math.round(rendw * (settings.height / settings.width));
                    }

                    var frame = self.find(".gii-slideshow-inner-frame");
                    var oldimg = frame.find(".gii-slideshow-image:not(.fadeOn)");

                    self.find(".gii-slideshow-outer-frame").css("width", rendw+6).css("height", rendh+6);
                    frame.css("width", rendw).css("height", rendh);

                    var ls = "";
                    var le = "";

                    if (typeof links[p] != 'undefined' && links[p].length > 0) {
                        ls = "<a href='" + links[p] + "'>";
                        le = "</a>";
                    }

                    frame.append(ls + "<img class='gii-slideshow-image gii-fadein' src='" + urls[p] + "' />"+ le);

                    frame.find(".gii-slideshow-image.gii-fadein").load(function() {

                        var img = frame.find(".gii-slideshow-image.gii-fadein");

                        var fw = frame.width();
                        var fh = frame.height();
                        var w = img.width();
                        var h = img.height();

                        if (settings.resizeimg) {
                            var oldw = w;
                            w = fw * settings.resizeimgfactor;
                            h = h * (w / oldw);
                            img.width(w);
                            img.height(h);
                        }

                        if (w < fw) {
                            var fx = fw / w;
                            w = fw;
                            h = Math.round(h * fx);
                            img.width(w);
                            img.height(h);
                        }
                        if (h < fh) {
                            var fy = fh / h;
                            h = fh;
                            w = Math.round(w * fy);
                            img.width(w);
                            img.height(h);
                        }

                        var deltax = w - fw;
                        var deltay = h - fh;
                        var halfx = Math.floor(deltax / 2);
                        var halfy = Math.floor(deltay / 2);

                        var ltor = Math.floor(Math.random()*2);
                        var ttob = Math.floor(Math.random()*2);

                        var left = "";
                        var top = "";
                        var leftanm = "";
                        var topanm = "";

                        if (ltor == 1) {
                            left = "-" + deltax + "px";
                            leftanm = "0px";
                        } else {
                            left = "0px";
                            leftanm = "-=" + (w - fw);
                        }

                        if (ttob == 1) {
                            top = "-" + deltay + "px";
                            topanm = "0px";
                        } else {
                            top = "0px";
                            topanm = "-=" + (h - fh);
                        }

                        img.css("left", left);
                        img.css("top", top);
                        if (settings.animate) {
                            img .animate(   {   left: [leftanm, 'linear'],
                                                top:  [topanm, 'linear']   },
                                            {duration: Math.round(settings.interval * 1.2), queue: false});
                        }
                        frame.find(".gii-slideshow-caption").remove();
                        if (settings.caption && texts[p].length > 0) {
                            var hl = "";
                            frame.append("<div class='gii-slideshow-caption gii-fadein'>" + texts[p] + "</div>");
                            var caption = frame.find(".gii-slideshow-caption.gii-fadein");
                            caption.css("top", fh).css("width", rendw);
                            caption
                                .fadeIn("slow")
                                .animate({ top: fh - (caption.height() + vpadding(caption))})
                                .delay(Math.round(settings.interval * 0.6))
                                .fadeOut("slow");
                        }
                        img .fadeIn(Math.round(settings.interval * 0.4), function() {
                                img.removeClass("gii-fadein");
                            });
                        oldimg.delay(settings.interval * 0.8).fadeOut("slow", function() {
                            oldimg.remove();
                        });
                    });
                }
                setTimeout(slide, settings.interval);
            }

            slide();
        }

    });


  };
})( jQuery );