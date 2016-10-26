jQuery(document).ready(function() {
    "use strict";

    var PEOPLE, GROUPS, PLACES, $window, $body, $fragment, $popover = null;
    PEOPLE = [
        "Barases",
        "Bin",
        "Camulos",
        "Festivus",
        "Kallista",
        "Karrion",
        "Kitara",
        "Lechonero",
        "Melvin",
        "Oomoroo",
        "Richard D'Eversholt",
        "Ringo",
        "Smudge",
        
        "Adronsius",
        "Aerun",
        "Alys",
        "Amyria",
        "Andor and Toris Scrollstone",
        "Azarr Kul",
        "Aziff",
        "Bahamut",
        "Bede",
        "Bernath",
        "Birdman",
        "Bram Ironfell",
        "Cachlain",
        "Cadrick",
        "Chend",
        "Coggin",
        "Darkus Comahni",
        "Dorion Light-Step",
        "Durkik",
        "Fangren",
        "Falrinth",
        "Fariex",
        "Filth King",
        "Gallia",
        "Gal'ott",
        "Garth Cooper",
        "Gilgathorn",
        "Gith",
        "Grovald",
        "Hethralga",
        "Ioun",
        "Iquel",
        "Iranda",
        "Jalissa",
        "Jen",
        "Jerra Dauralis",
        "Kalad",
        "Karros",
        "Kartenix",
        "Kath'ik",
        "Kerden Jarmaan",
        "Kyrion",
        "Lavinya",
        "Leena",
        "Leucis",
        "Lotho Elberesk",
        "Maglubiyet",
        "Marduk Goldbludgeon",
        "Megan Swiftblade",
        "Mirtala",
        "Modra",
        "Morgoff",
        "Morrik",
        "Myrissa",
        "Nial",
        "Nerislove Stoneheart",
        "Odos",
        "Onthorirfel",
        "Pennel",
        "Reniss",
        "Sariel",
        "Sarshan",
        "Sertanian",
        "Serten",
        "Shephatiah",
        "Sinruth",
        "Sovacles",
        "Telicanthus",
        "Thannu",
        "Tiamat",
        "Tokk'it",
        "Tusk",
        "Two-Teeth",
        "Tyrgarun",
        "Thurann",
        "Vlaakith",
        "Warden",
        "Wellik",
        "Yeenoghu",
        "Zereni Cyss",
        "Zerthimon",
        "Zerriska",
        "Zithiruun",
        "_END_"
    ];
    GROUPS = [
        "Axenhaft Security",
        "Black Knife Goblins",
        "Council of Elders",
        "Dawn Wardens",
        "Dusk Wardens",
        "Elsir Consortium",
        "Farstriders",
        "Freeriders",
        "Kulkor Zhul",
        "Laughing Shadows",
        "Lost Ones",
        "Red Hand of Doom",
        "Red Hand",
        "Tiri Kitor",
        "Wicked Fang",
        "Wyrmsmoke tribe",
        "_END_"
    ];
    PLACES = [
        "Akma'ad",
        "Antler and Thistle",
        "Astral Sea",
        "Astrazalian",
        "Auger",
        "Blackfens Swamp",
        "Bordrin's Watch",
        "Brindol",
        "Caer Overlook",
        "Castle Rivenroar",
        "City of Greyhawk",
        "Dauth",
        "Dawn Way",
        "Deep Cartography",
        "Dennovar",
        "Divine Knot",
        "Drellin's Ferry",
        "Dunesend",
        "Elemental Chaos",
        "Elsir Vale",
        "Endless Plains",
        "Fane of Tiamat",
        "Feydark",
        "Feywild",
        "Fortress Graystone",
        "Giantshield Mountains",
        "Golden Plains",
        "Hall of Great Valor",
        "Happy Beggar",
        "Harg Kulkor",
        "High Hall",
        "Jarmaan Keep",
        "Karak Lode",
        "Lake Ern",
        "Monastery of the Sundered Chain",
        "Nine Bells",
        "the Nexus",
        "Overlook",
        "Pig and Bucket Tavern",
        "Prosser",
        "Red Rock",
        "Rhestilor",
        "Rhest",
        "Sayre",
        "Shadowfell",
        "Sherrbyr",
        "Skull Gorge",
        "Stonehome Mountains",
        "Sunset Sea",
        "Talar", 
        "Terrelton",
        "Tower of Djamela",
        "Tu'narath",
        "Umbraforge",
        "the Vents",
        "Vraath Keep",
        "Witchwood",
        "Wyrmsmoke Mountains",
        "Wyvernwatch Mountains",
        "Zerthadlun",
        "_END_"
    ];
    $window = jQuery(window);
    $body = jQuery("body");
    $fragment = jQuery(document.createDocumentFragment());

    function initPartial($partial) {
        // Highlight terms
        $partial.find("p, ul").html(function(index, html) {
            var i;
            for (i = 0; i < PEOPLE.length; i++) {
                html = html.replace(new RegExp("\\b" + PEOPLE[ i ] + "\\b", "gim"), "<dfn class=\"person\">" + PEOPLE[ i ] + "</dfn>");
            }
            for (i = 0; i < GROUPS.length; i++) {
                html = html.replace(new RegExp("\\b" + GROUPS[ i ] + "\\b", "gim"), "<dfn class=\"group\">" + GROUPS[ i ] + "</dfn>");
            }
            for (i = 0; i < PLACES.length; i++) {
                html = html.replace(new RegExp("\\b" + PLACES[ i ] + "\\b", "gim"), "<dfn class=\"place\">" + PLACES[ i ] + "</dfn>");
            }
            return html;
        });

        // Anchor headers
        $partial.find("h1, h2, h3, h4, h5, h6").each(function() {
            var $h, name;
            $h = jQuery(this);
            name = $h.html();
            $h.html(jQuery("<a/>").attr("name", name).html(name));
        });
        
        $partial.find(".person, .place, .group").on({
            click: function() {
                var w, $trigger;
                $trigger = jQuery(this);
                $popover = jQuery(document.getElementById($trigger.html())).show();
                w = window.open("", "_blank");
                w.document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"index.css\" />\n");
                w.document.write("<style>img { float: left; }</style>\n");
                w.document.write($popover.html());
                initPartial(jQuery(w.document.documentElement));
            },
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

    jQuery("article").each(function() {
        initPartial(jQuery(this));
    });

    // Set Table of Content link hrefs
    jQuery(".toc a").each(function() {
        var $link, html;
        $link = jQuery(this);
        html = $link.html();
        $link.attr("href", "#" + html);
    });
        
    // Load character descriptions via AJAX
    // jQuery("<div></div>").load("html/characters.html", function() {
    //     jQuery(this).children().appendTo("body");
    // });

    // Accordion headers
    $body.on("click", "h1, h2, h3, h4", function() {
        var h = this;
        jQuery(h).parent().children().each(function() {
            if (this !== h) {
                jQuery(this).toggle();
            }
        });
    });

    // Image windows
    $body.on("click", "img", function() {
        window.open(this.src, "_blank");
    });

    // Slideshows
    (function slidesPlugin() {
        var $slides, i, $containers;
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
