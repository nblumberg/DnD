(function floorIIFE(DnD) {
    "use strict";
    DnD.define("Floor", [ "document" ], function floorFactory(document) {
        const LAYER = {
            GROUND: "ground",
            EFFECTS: "effects",
            ITEMS: "items",
            HIGHLIGHT: "highlight",
            ACTORS: "actors",
            WALLS: "walls",
            LIGHTING: "lighting",
            PATHS: "paths"
        };
        const ORDER = [
            LAYER.GROUND,
            LAYER.EFFECTS,
            LAYER.ITEMS,
            LAYER.HIGHLIGHT,
            LAYER.ACTORS,
            LAYER.WALLS,
            LAYER.LIGHTING,
            LAYER.PATHS
        ];
        let instances = [];
        let current = 0;

        class Floor {
            /**
             * Represents a floor/level within the overall map
             * @param {Object} params
             * @param {Number} params.index The index of this Floor amongst all Floors
             * @param {HTMLElement} params.parent The element to insert the canvas layers into
             * @param {Number} params.size The rendered size of a Tile per the current zoom
             * @param {Tiles[][]} params.tiles The 2D Array of Tiles that make up this Floor
             */
            constructor(params) {
                let tiles = params.tiles || [ [] ];

                this.index = params.index;
                this.layers = [];
                this.size = params.size;
                this.parent = document.createElement("div");
                this.parent.id = `Floor${this.index}`;
                this.parent.className = "floor";
                params.parent.appendChild(this.parent);

                instances.push(this); // TODO: respect index

                /**
                 * Calls a function against each Tile on the current floor along with its x and y indices
                 * @param {Function} callback A Function to call against each Tile on the current floor along with its x and y indices, if callback returns false, the loop exits prematurely
                 * @param {Number} [afterX] The column to start iterations from, defaults to 0
                 * @param {Number} [afterY] The row to start iterations from, defaults to 0
                 */
                this.iterateTiles = (callback, afterX, afterY) => {
                    for (let y = typeof afterY === "number" ? afterY : 0; y < tiles.length; y++) {
                        for (let x = typeof afterX === "number" ? afterX : 0; x < tiles[ y ].length; x++) {
                            if (callback(tiles[ y ][ x ], x, y) === false) {
                                return;
                            }
                        }
                    }
                };

                /**
                 * Return the number of columns on the Floor
                 * Keeps tiles private
                 * @returns {Number} The number of columns on the Floor
                 * @private
                 */
                this._getColumns = () => {
                    return tiles.reduce((prev, cur) => {
                        return prev.length > cur.length ? prev : cur;
                    }, []).length;
                };

                /**
                 * Return the number of rows on the Floor
                 * Keeps tiles private
                 * @returns {Number} The number of rows on the Floor
                 * @private
                 */
                this._getRows = () => {
                    return tiles.length;
                };

                /**
                 * Get a Tile by indices
                 * @params {Number} x
                 * @params {Number} y
                 * @returns {Tile|null} The corresponding Tile
                 */
                this.getTile = (x, y) => {
                    return tiles[ y ][ x ];
                };



                ORDER.forEach((name, i) => {
                    let canvas = document.createElement("canvas");
                    let context = canvas.getContext("2d");
                    canvas.id = name;
                    canvas.className = `layer ${name}`;
                    canvas.style.zIndex = i;
                    canvas.height = this.height;
                    canvas.width = this.width;
                    this.parent.appendChild(canvas);
                    this.layers.push({
                        canvas,
                        context
                    });
                });
            }

            /**
             * @returns {Number} The max number of columns in the Floor
             */
            get columns() {
                return this._getColumns();
            }

            /**
             * @returns {Number} The height (in pixels) of the Floor
             */
            get height() {
                return this.rows * this.size;
            }

            /**
             * @returns {Number} The number of rows in the Floor
             */
            get rows() {
                return this._getRows();
            }

            /**
             * @returns {Number} The width (in pixels) of the Floor
             */
            get width() {
                return this.columns * this.size;
            }

            /**
             * Desconstructor
             */
            destroy() {
                this.iterateTiles(tile => tile.destroy());
                Tile.destroyFloor(this.index);
                this.parent.parentElement.removeChild(this.parent);
            }

            /**
             * @param {String} name See LAYER
             * @returns {Object} The layer representation in the form { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D }
             */
            getLayer(name) {
                return this.layers[ ORDER.indexOf(name) ];
            }

            show() {
                this.parent.style.display = "block";
            }

            hide() {
                this.parent.style.display = "none";
            }

            /**
             * Mouse move handler
             * @param {Event} event
             */
            mouseMove(event) {
                let topLayer = this.layers[ this.layers.length - 1 ];
                let mouseX = event.offsetX - topLayer.canvas.offsetLeft;
                let mouseY = event.offsetY - topLayer.canvas.offsetTop;
                this.iterateTiles(tile => {
                    let changed = false;
                    if (tile.isIn(mouseX, mouseY)) {
                        changed = tile.highlight(true);
                    } else {
                        changed = tile.highlight(false);
                    }
                    if (changed) {
                        tile.renderHighlight(this.getLayer(LAYER.HIGHLIGHT).context, this.size, 0, 255, 255, 0.2);
                    }
                });
            }

            /**
             * Redraws the Floor
             */
            render() {
                if (!this.layers[ 0 ].context) {
                    return;
                }
                this.layers.forEach(layer => {
                    layer.context.clearRect(0, 0, this.width, this.height);
                });
                let ground = this.getLayer(LAYER.GROUND).context;
                // ground.fillStyle = "gray";
                // ground.fillRect(0, 0, this.width, this.height);
                // ground.fillStyle = "black";
                this.iterateTiles(tile => {
                    tile.renderGround(ground, this.size);
                });
                this.iterateTiles(tile => {
                    tile.renderHighlight(this.getLayer(LAYER.HIGHLIGHT).context, this.size);
                });
                this.iterateTiles(tile => {
                    tile.renderWalls(this.getLayer(LAYER.WALLS).context, this.size);
                });
            }

            /**
             * Sets the height and width of, and redraws, the map
             * @param {Number} size Pixel height/width of a Tile on the map
             */
            resize(size) {
                this.size = size;
                this.layers.forEach(layer => {
                    layer.canvas.height = this.height;
                    layer.canvas.width = this.width;
                });
                this.render();
            }

            static get all() {
                return instances.slice(0);
            }

            /**
             *
             * @returns {Number}
             */
            static get current() {
                return current;
            }

            /**
             *
             * @param {Number} floor
             */
            static set current(floor) {
                current = floor;
                instances.forEach((f, i) => {
                    if (i < current) {
                        f.parent.className = "lower floor";
                    } else if (i === current) {
                        f.parent.className = "current floor";
                    } else {
                        f.parent.className = "upper floor";
                    }
                });
            }
        }

        return Floor;
    }, false);
})(window.DnD);