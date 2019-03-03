(function mapIIFE(DnD) {
    "use strict";

    DnD.define("map", [ "Actor", "controls", "document", "Floor", "Material", "Math", "Tile", "window" ], (Actor, Controls, document, Floor, Material, Math, Tile, window) => {
        let actors, api, controls, floors, parent, zoom;

        api = {
            setActors,
            setTiles,
            render
        };

        /**
         *
         * @param {Array} characters An Array of Actor descriptions
         * @param {Object} [characters[]] An Actor description
         * @param {Number} [characters[].floor] The Floor the Actor is on
         * @param {Number} [characters[].x] The x of the Tile the Actor is on
         * @param {Number} [characters[].y] The y of the Tile the Actor is on
         * @param {String} [characters[].name] The name of the Actor
         * @param {String} [characters[].image] The image used to draw the Actor
         * @param {String} [characters[].size] "tiny" | "small" | "medium" | "large" | "huge" | "colossal", default "medium"
         */
        function setActors(characters) {
            actors = [];
            characters.forEach(
                (c) => {
                    actors.push(
                        new Actor(Object.assign({}, c, {
                            floor: floors[ c.floor ],
                            tile: floors[ c.floor ].getTile(c.x, c.y),
                            scale: zoom
                        }))
                    );
                }
            );
            controls.setActors(actors);
            resize();
        }

        /**
         *
         * @param {Array} tiles A three dimensional Array of Tile descriptions
         * @param {Array} tiles[] A two dimensional Array of Tile descriptions representing a "floor"
         * @param {Array} tiles[][] A one dimension Array of Tiles descriptions representing a row of a "floor"
         */
        function setTiles(tiles) {
            if (floors) {
                floors.forEach(f => f.destroy());
            }
            floors = [];
            tiles.forEach(
                (f, i) => floors.push(new Floor({
                    index: i,
                    parent: parent,
                    size: zoom,
                    tiles: f
                }))
            );
            Floor.current = floors.length - 1;
            controls.setFloors(floors);

            resize();
        }

        /**
         * Redraws the map
         */
        function render() {
            floors.forEach(f => f.render());
            actors.forEach(a => a.render());
        }

        /**
         * Key up handler
         * @param {Event} event
         */
        function keyUp(event) {
            if (event.key === "+" || event.key === "=") {
                resize(++zoom);
            } else if (event.key === "-" || event.key === "_") {
                resize(zoom = Math.max(1, zoom - 1));
            } else if (event.key === "0" && zoom !== Tile.STANDARD_SIZE) {
                resize(zoom = Tile.STANDARD_SIZE);
            } else if (event.key === "PageUp") {
                Floor.current = Math.min(floors.length - 1, Floor.current + 1);
            } else if (event.key === "PageDown") {
                Floor.current = Math.max(0, Floor.current - 1);
            }
        }

        /**
         * Mouse move handler
         * @param {Event} event
         */
        function mouseMove(event) {
            let topFloor = floors[ floors.length - 1 ];
            topFloor.mouseMove(event);
        }

        /**
         * Determines and sets the height and width of the map
         * @param {Number} [size] The new Tile size
         */
        function resize(size) {
            zoom = size || zoom;
            floors.forEach(f => f.resize(zoom));
            actors.forEach(a => a.resize(zoom));
        }

        if (!document.getElementById("map") || typeof document.createElement("canvas").getContext !== "function") {
            return;
        }

        zoom = Tile.STANDARD_SIZE;
        floors = [];
        actors = [];
        document.onkeyup = keyUp;
        parent = document.getElementById("map");
        parent.className += " fullscreen";
        parent.onmousemove = mouseMove;
        controls = new Controls({ parent });

        return api;
    }, false);
})(window.DnD);