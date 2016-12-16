jQuery(document).ready(function() {
    "use strict";

    var TERMS, $window, $body, $fragment, $popover = null;

    TERMS = (function formRegEx() {
        var TERMS, baseUrl, type, dir, term, token, i;
        function newToken() {
            return term.replace(/\s/gi, "_") +  + (new Date().getTime());
        }
        function newTarget() {
            TERMS.push({
                term: term,
                termRegex: new RegExp("\\b" + term + "\\b", "gi"),
                token: token,
                tokenRegex: new RegExp("\\b" + token + "\\b", "gi"),
                found: false,
                replace: `<dfn class="${type}"><a href="${baseUrl}/${dir}/${term}.html">${term}</a></dfn>`
            });
        }
        TERMS = [];
        baseUrl = window.location.pathname.substring(0, window.location.pathname.indexOf("/story/dist") + "/story/dist".length);
        type = "person";
        dir = "characters";
        for (i = 0; i < PEOPLE.length; i++) {
            term = PEOPLE[ i ];
            token = newToken();
            newTarget();
        }
        type = "group";
        dir = "groups";
        for (i = 0; i < GROUPS.length; i++) {
            term = GROUPS[ i ];
            token = newToken();
            newTarget();
        }
        type = "place";
        dir = "places";
        for (i = 0; i < PLACES.length; i++) {
            term = PLACES[ i ];
            token = newToken();
            newTarget();
        }
        return TERMS;
    })();

    $window = jQuery(window);
    $body = jQuery("body");
    $fragment = jQuery(document.createDocumentFragment());

    function initPartial($partial) {
        // Highlight terms
        function wrapTerms(element, terms, depth) {
            var childNodes, i, j, childNode, target;
            depth = typeof depth === "undefined" ? 0 : (depth + 1);
            childNodes = Array.prototype.slice.call(element.childNodes);
            for (i = 0; i < childNodes.length; i++) {
                childNode = childNodes[ i ];
                if (childNode.nodeType === 1) {
                    // Element node
                    wrapTerms(childNode, terms, depth);
                }
                else if (childNode.nodeType === 3) {
                    // Text node
                    for (j = 0; j < terms.length; j++) {
                        target = terms[ j ];
                        if (target.termRegex.test(childNode.textContent)) {
                            childNode.textContent = childNode.textContent.replace(target.termRegex, target.token);
                            target.found = true;
                        }
                    }
                }
            }
            if (!depth) {  // wait until the top element to replace innerHTML
                for (j = 0; j < terms.length; j++) {
                    target = terms[ j ];
                    if (target.found) {
                        element.innerHTML = element.innerHTML.replace(target.tokenRegex, target.replace);
                    }
                }
            }
        }

        wrapTerms($partial[ 0 ], TERMS);

        // Anchor headers
        $partial.find("h1, h2, h3, h4, h5, h6").each(function() {
            var $h, name;
            $h = jQuery(this);
            name = $h.html();
            $h.html(jQuery("<a/>").attr("name", name).html(name));
        });

        $partial.find(".person, .place, .group").on({
            // click: function() {
            //     var w, $trigger;
            //     $trigger = jQuery(this);
            //     $popover = jQuery(document.getElementById($trigger.html())).show();
            //     w = window.open("", "_blank");
            //     w.document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"index.css\" />\n");
            //     w.document.write("<style>img { float: left; }</style>\n");
            //     w.document.write($popover.html());
            //     initPartial(jQuery(w.document.documentElement));
            // },
            mouseover: function() {
                var $trigger, offset;
                $trigger = jQuery(this);
                offset = $trigger.offset();
                $popover = jQuery(document.getElementById($trigger.html())).addClass("popover").show();
                window.setTimeout(function() {
                    offset.top -= $popover.height() + $trigger.height() + 21; // TODO: why the extra padding?
                    if (offset.left < $window.width() / 3) {
                        // Left aligned popover
                        //offset.left = $trigger.left;
                        $popover.removeClass("right").addClass("left");
                    }
                    else if (offset.left > $window.width() / 3 * 2) {
                        // Right aligned popover
                        offset.left = offset.left + $trigger.width() - $popover.width();
                        $popover.removeClass("left").addClass("right");
                    }
                    else {
                        // Centered popover
                        offset.left -= $popover.width() / 2;
                        $popover.removeClass("left").removeClass("right");
                    }
                    $popover.offset(offset);
                }, 10);
            },
            mouseout: function() {
                $popover && $popover.hide();
            }
        });
    }

    // function loadArticle(tag, name, callback) {
    //     jQuery("<div/>").load("html/" + escape(name) + ".html", function() {
    //         var $parent, $article;
    //         $parent = jQuery(this);
    //         $article = $parent.children().first();
    //         $article.attr("name", name);
    //         callback(name, $article);
    //     });
    // }

    // function loadSection() {
    //     var $sectionLink, name, $section, articles, articleCount, $articleLinks;
    //     $sectionLink = jQuery(this);
    //     name = $sectionLink.html();
    //     $section = jQuery("<section><h1><a name=\"" + name + "\">" + name + "</a></h1></section>").appendTo($body);

    //     articles = {};
    //     articleCount = 0;

    //     function articleLoaded(name, $article) {
    //         var i, p;
    //         initPartial($article);
    //         articles[ name ] = $article;
    //         articleCount++;
    //         if (articleCount === $articleLinks.length) {
    //             for (i = 0; i < $articleLinks.length; i++) {
    //                 p = jQuery($articleLinks.slice(i, i + 1)).html();
    //                 articles[ p ].appendTo($section);
    //             }
    //         }
    //     }

    //     $articleLinks = $sectionLink.parent().find("a.article");
    //     $articleLinks.each(function(index, element) {
    //         var $articleLink, name;
    //         $articleLink = jQuery(this);
    //         if (!$articleLink.data("initialized")) {
    //             $articleLink.data("initialized", true);
    //             name = $articleLink.html();
    //             articles[ name ] = loadArticle("article", name, articleLoaded);
    //         }
    //     });
    // }

    // Load body via AJAX according to Table of Contents
    // jQuery(".toc a.section").each(loadSection);

    jQuery("body").each(function() {
        initPartial(jQuery(this));
    });

    // Set Table of Content link hrefs
    // jQuery(".toc a").each(function() {
    //     var $link, html;
    //     $link = jQuery(this);
    //     html = $link.html();
    //     $link.attr("href", "#" + html);
    // });

    // Load character descriptions via AJAX
    // jQuery("<div></div>").load("html/characters.html", function() {
    //     jQuery(this).children().appendTo("body");
    // });

    // Accordion headers
    // $body.on("click", "h1, h2, h3, h4", function() {
    //     var h = this;
    //     jQuery(h).parent().children().each(function() {
    //         if (this !== h) {
    //             jQuery(this).toggle();
    //         }
    //     });
    // });

    // Image windows
    $body.on("click", "img", function() {
        window.open(this.src, "_blank");
    });

    // Slideshows
    (function slidesPlugin() {
        var $slides, i, $containers;

        function slidesChange() {
            $slides.each(function slideChange() {
                var $plugin, images, j;
                $plugin = jQuery(this);
                images = $plugin.data("images");
                for (j = 0; j < images.length; j++) {
                    jQuery(images[ j ]).addClass("hide");
                }
                jQuery(images[ i % images.length ]).removeClass("hide");
            });
            i++;
        }

        $slides = jQuery("img[data-slides]");
        if ($slides.length) {
            $slides.each(function slidesInit() {
                var $plugin, $container, urls, images, i;
                $plugin = jQuery(this);
                $container = jQuery("<div></div>");
                $container.addClass($plugin[ 0 ].className).addClass("slides");
                $plugin.replaceWith($container);
                $plugin.data("container", $container);

                urls = $plugin.data("slides").split(",");
                images = [];
                for (i = 0; i < urls.length; i++) {
                    images.push(new Image());
                    images[ i ].src = urls[ i ];
                    $container.append(images[ i ]);
                    images[ i ].addEventListener("load", function slideImageLoaded() {
                        $container.height(Math.max(this.naturalHeight / this.naturalWidth * $container.width(), $container.height()));
                    }.bind(images[ i ]));
                }
                $plugin.data("images", images);
            });

            i = 0;
            slidesChange();
            window.setInterval(slidesChange, 2000);
        }
    })();

    (function() {
        var $pin, $ul, i, $li, $a, PINS = [
              "Akma'ad",
              "Astrazalian",
              "Blackfens Swamp",
              "Bordrin's Watch",
              "Brindol",
              "Castle Rivenroar",
              "Dauth",
              "Dawn Way",
              "Dennovar",
              "Dornaithos",
              "Drellin's Ferry",
              "Dunesend",
              "Endless Plains",
              "Fane of Tiamat",
              "Fortress Graystone",
              "Giantshield Mountains",
              "Golden Plains",
              "Harg Kulkor",
              "Karak Lode",
              "Lake Ern",
              "Monastery of the Sundered Chain",
              "Overlook",
              "Prosser",
              "Red Rock",
              "Rhest",
              "Sayre",
              "Sherrbyr",
              "Skull Gorge",
              "Stonehome Mountains",
              //"Sunset Sea",
              "Talar",
              "Terrelton",
              "the Vents",
              "Vraath Keep",
              "Witchwood",
              "Wyrmsmoke Mountains",
              "Wyvernwatch Mountains"
        ];
        $pin = jQuery("#Places .pin");
        $ul = jQuery("#placeNav");
        for (i = 0; i < PINS.length; i++) {
            $li = jQuery("<li></li>").appendTo($ul);
            jQuery("<a href=\"javascript:void(0);\">" + PINS[ i ] + "</a>").on("click", function() {
                var $this = jQuery(this);
                $pin[ 0 ].className = "pin";
                $pin.addClass($this.html().toLowerCase().replace(/\W/g, "_"));
            }).appendTo($li);
        }
    })();

    /*
    (function createTableOfContents() {
        var $toc, i;
        i = 0;
        $toc = jQuery(".toc ol");

        function listHeadings($parent, level) {
            var $h, $li, $a, $ol;
            i++;
            $h = jQuery(this);
            $a = jQuery("<a/>").attr("name", i).html($h.html());
            $li = jQuery("<li/>").appendTo($parent);
            jQuery("<a/>").attr("href", "#" + i).html($h.html()).appendTo($li);
            $h.html("").append($a);

            $ol = jQuery("<ol/>").appendTo($li);
            if (level < 4) {
                $h.parent().find("h" + (level + 1)).each(function() {
                    listHeadings.call(this, $ol, level + 1);
                });
            }
        }

        jQuery("h1").each(function() {
            listHeadings.call(this, $toc, 1);
        });
    })();
    */
});
