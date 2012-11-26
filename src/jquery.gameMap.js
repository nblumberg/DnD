/*!
 * jQuery Isometric Map Plugin
 * http://www.cw-internetdienste.de/
 *
 * Copyright 2010, Christian Weber
 * Free for commercial and
 * non-commercial use. Please shoot
 * me an email if you use it. Would love
 * to see it in action. <img src='http://www.cw-internetdienste.de/wp-includes/images/smilies/icon_smile.gif' alt=':)' class='wp-smiley' />
 *
 * Date: Wed May 5 17:12:43 2010 +0100
 */

 // enables the $ function even if its disabled because of jQuery compatibility mode
(function($) {
	// create gameMap namespace / main function
	// so it can be used using $(element).gameMap();
    /**
     * @param {Object} options
     * @param {Number} options.xpos
     * @param {Number} options.ypos
     * @param {Number} options.mapsize
     * @param {Number} options.tilesize
     * @param {Number} options.xcorrection
     * @param {Number} options.ycorrection
     * @param {String} options.bgcolor
     * @param {Array} options.map 2D Array of Object of the form { tile: "tileImageClass", viewPortect: "extraTileClass" }
     */
	$.fn.gameMap = function(options) {
	    var config, wWidth, wHeight, half, viewPort, content;
	    
        // just to be on the secure side we overload the variable to a local one
        // so we have access to it for every instance and not globally
        viewPort = $(this);
        
		// public property access
		// those set the base values
		$.fn.gameMap.defaults = {
			xpos : 50,
			ypos : 50,
			mapsize:100,
			tilesize:64,
			xcorrection:30,
			ycorrection:15,
			bgcolor:'#000000',
			map : {}
		};

		// create the configuration file
		// this merges the defaults properties with the given options
		// the boolean value at the beginning lets the function check recursively
		config = $.extend(true, $.fn.gameMap.defaults, options);

		// get the elements height and width
		// self explaining
		wWidth = viewPort.width();
		wHeight = viewPort.height();

		// sets the baseline for rendering of the isometric tiles
		// as they go diagonal, we have to begin in the middle
		half = (config.mapsize * (config.tilesize / 2)) / 2;

        /**
         * @param {Object} options
         * @param {String} options.name
         * @param {String} options.img
         * @param {Number} options.tileWidth
         * @param {Number} options.tileHeight
         * @param {Number} options.tileBaseline (px from bottom to "floor-level")
         * @param {String} options.layer ("Floor" | "Floor_Decor" | "Walls" | "Wall_Decor")
         */
        $.fn.gameMap.TileSet = function(options) {
            this.name = options.name;
            this.image = new Image();
            this.image.onLoad = (function(event) {
                this.length = Math.floor(this.image.width / this.tileWidth) * Math.floor(this.image.height / this.tileHeight);
            }).bind(this);
            this.image.src = options.img;
            this.tileWidth = options.tileWidth;
            this.tileHeight = options.tileHeight;
            this.tileBaseline = options.tileBaseline;
            this.layer = options.layer;
        };
        
	    /**
	     * @param {Object} options
	     * @param {HTMLElement} options.viewPort
	     * @param {Object} options.tileConfig
	     * @param {Number} options.mapSize
	     * @param {Number} options.x
	     * @param {Number} options.y
	     * @param {Number} options.xpos
	     * @param {Number} options.ypos
	     * @param {Boolean} options.isSelected
	     */
		$.fn.gameMap.Tile = function(options) {
	        this.x = options.x;
	        this.y = options.y;
	        this.index = { x: this.x, y: this.y };
	        this.xpos = options.xpos;
	        this.ypos = options.ypos;
	        this.position = { xpos: this.xpos, ypos: this.ypos };
	        this.config = options.tileConfig;
	        this.id = options.viewPort.attr("id") + "_tile_" + this.x + "_" + this.y;
	        this.title = "(" + this.x + ", " + this.y + ")"
	        // create element
	        // we create a div element with the correct tile class and the calculated x and y
	        // positions as top and left values of the inline css
	        // this also calculated the correct z-index as bottom left elements will aways
	        // need a higher priority than the tiles behind them.
	        this.tile = $("<div></div>");
	        this.tile.attr("id", this.id);
	        this.tile.attr("title", this.title);
	        this.tile.addClass("tile");
	        if (options.tileConfig.hasOwnProperty("tile") && options.tileConfig.tile) {
	            this.tile.addClass(options.tileConfig.tile);
	        }
	        this.tile.css("top", this.ypos + "px");
	        this.tile.css("left", this.xpos + "px");
	        this.tile.css("z-index", options.mapSize - this.y + this.x);
	        this.subtile = $("<div></div>");
	        this.subtile.addClass("viewPortect");
	        if (options.tileConfig.hasOwnProperty("viewPortect") && options.tileConfig.viewPortect) {
	            this.subtile.addClass(options.tileConfig.viewPortect);
	        }
	        this.subtile.css("z-index", options.mapsize - this.y + this.x + options.mapsize);
	        this.subtile.appendTo(this.tile);
	        
            // check if this is the starting position and mark it
            // this was just for testing purposes so we can see
            // the given starting position visually
	        this.select = function(selected) {
                this.tile.css("border", selected ? "1px solid #990000" : "none");
	        };
	        this.select(options.isSelected);

	        this.tile.data("gameTile", this);

	        // attach information event
	        // this was also added for testing purposes but might be useful
	        options.viewPort.gameMap.tileInfo(this.tile, this.x, this.y);
	        
	        return this.tile;
	    };
	    
	    // create base function
		// this is the constructor function that gets
		// called at the end of this plugin
		$.fn.gameMap._init_game_interface = function() {
		    var i, tileSet;

			// set the first game map properties
			// fill the backgorund with a base color
			// isometric maps wont be filling at the corners
			viewPort.css("background-color", config.bgcolor);

			// check if the content container is existing
			// if not add it to the given div. this is needed
			// for easy displaying of the correct part of the map
			// if it is bigger than the elements size
			content = viewPort.children("div.content").length ? viewPort.children("div.content")[ 0 ] : null;
			if (!content) {
			    content = jQuery('<div class="content ui-draggable"></div>');
			    viewPort.append(content); 
			    content.draggable({ cursor: "move" });
		    }

            // Load tilesets
			$.fn.gameMap.tileSets = {}; 
			for (i = 0; config.tileSets && i < config.tileSets.length; i++) {
			    tileSet = new $.fn.gameMap.Tile(config.tileSets[ i ]);
	            $.fn.gameMap.tileSets[ tileSet.name ] = tileSet;
			}
			
			// paint the map
			// initialize the map rendering
			viewPort.gameMap._initMap();
		};

		// map rendering function
		$.fn.gameMap._initMap = function() {
		    var x, y;
			// set the size of the content element so nothing gets lost <img src='http://www.cw-internetdienste.de/wp-includes/images/smilies/icon_smile.gif' alt=':)' class='wp-smiley' />
			// the height gets only multiplicated with half of the tiles size
			// as they are positioned differently and only half of the tiles size
			// matters. else we would have free sapce between the tiles
			content.css("width", (config.mapsize * config.tilesize) + "px").css("height", (config.map[0].length * (config.tilesize / 2)) + "px");

			// create the isomap
			// loops through the whole map data array
			// no matter where it starts
			for (y in config.map) {
				for (x in config.map[ y ]) {
					// call the intern function to create a new tile
					// can also be used to add new tiles after the
					// plugin got initialized
					viewPort.gameMap.addTile(config.map[y][x], x, y);
				}
			}
			// move to the starting position
			// this will center on the given coordinates
			viewPort.gameMap.moveMap(config.xpos, config.ypos);
		};

		// tile adding function
		$.fn.gameMap.addTile = function(tile, x, y) {
		    var xpos, ypos, tile;
		    
			// calculate x and y position of the tile
			// sometimes the images have not totally correct dimensions like in our case
			// so we have to use x and y corrections to position everything correctly
			// for the xposition of the tile we just have to sum the x and y position
			// as for example 1,0 and 0,1 will have the same x-position
			xpos = config.tilesize + ((x * config.xcorrection) + ((y) * config.xcorrection));

			// the y position is a bit more complicated. we have to remember that sometimes
			// it has to go up and sometimes down from the baseline, we calculated at the
			// beginning. so we just subtract the calculation of the y value minus the x value
			// if a positive value will be subtracted from the baseline it will be an addition
			// as + and - results in - so the tile will be higher than the baseline.
			// on a negative value - - it will result in a positive value so the position of
			// the tile will be lower than the baseline
			ypos = half - (((y) * config.ycorrection) - (x * config.ycorrection));

			// create element
			tile = new $.fn.gameMap.Tile({
			     viewPort: viewPort,
			     tileConfig: config.map[ y ][ x ],
			     mapSize: config.mapsize,
			     x: x,
			     y: y, 
			     xpos: xpos,
			     ypos: ypos,
			     isSelected: x === config.xpos && y === config.ypos
			});

			// add to content element
			// just adds the element to the content element
			tile.appendTo(content);
		};

		// the information event i created for testing purposes
		$.fn.gameMap.tileInfo = function(tile, x, y) {
			// on mouse over it shows some details of the tile including its position
			// and the top and left values
			tile.mouseover(function() {
				$("div#interface p").html(typeof(tile) + ' (' + tile.attr("id") + ") on " + x + "," + y + " Pos: " + tile.css("left") + "px, " + tile.css("top") + "px");
			});

		};

		// this function centers the map on a given position
		$.fn.gameMap.moveMap = function(x, y) {
			// set the correct position of the viewPortect
			// the calculations are the same as the ones of each tile
			// except that we subtract the half of the elements height
			// and width to have the coordinate at the middle
			viewPort.scrollLeft((config.tilesize + ((x * config.xcorrection) + ((y) * config.xcorrection))) - (wWidth / 2)).scrollTop((half - (((y) * config.ycorrection) - (x * config.ycorrection))) - (wHeight / 2));
		};

		// call the constructor function
		$.fn.gameMap._init_game_interface();
		// return the jQuery viewPortect as every jQuery function does
		// enables something like this $(element).gameMap().css('border','5px solid #990000');
		return viewPort;
	};

})(jQuery);
