(function tileIIFE(DnD) {
    "use strict";

    DnD.define("Tile", [ "Material", "Math", "Path2D", "Wall" ], (Material, Math, Path2D, Wall) => {
        const WALLS = [ "w", "n", "e", "s" ];
        let instances = [];

        /**
         * Represents a square on the map grid
         */
        class Tile {
            /**
             * @param {Object} params
             * @param {Number} params.x Horizontal map grid coordinate of the Tile (measured in Tiles)
             * @param {Number} params.y Vertical map grid coordinate of the Tile (measured in Tiles)
             * @param {Number} params.z Map layer ("floor") of the Tile
             * @param {Boolean} [params.isSolid=false] whether the Tile represents a solid material as opposed to open space
             * @param {Material} ground The material of the Tile's ground
             * @param {Object} [walls={}] The walls on the tile, in the form { n: Material, e: Material, s: Material, w: Material }
             */
            constructor(params) {
                let path = new Path2D();

                this.ground = params.ground;
                this.highlighted = false;
                this.isSolid = !!params.isSolid;
                this.size = 0;
                this.walls = {};
                this.x = params.x;
                this.y = params.y;
                this.z = params.z;

                while (instances.length <= this.z) {
                    instances.push([]);
                }
                while (instances[ this.z ].length <= this.y) {
                    instances[ this.z ].push([]);
                }
                while (instances[ this.z ][ this.y ].length < this.x) {
                    instances[ this.z ][ this.y ].push(null);
                }
                instances[ this.z ][ this.y ].push(this);

                WALLS.forEach(side => {
                    if (params.walls[ side ]) {
                        this.walls[ side ] = new Wall({
                            material: params.walls[ side ],
                            side: side
                        });
                    }
                });

                /**
                 * Draws the Tile ground on the map
                 * @param {CanvasRenderingContext2D} context The rendering context
                 * @param {Number} size The size of the Tile in pixels
                 */
                this.renderGround = (context, size) => {
                    this.updateSize(size);

                    // Ground
                    this.ground.render(context);
                    context.fill(path);

                    // Grid border
                    context.strokeStyle = "black";
                    let borderPercent = 1 / Tile.STANDARD_SIZE;
                    context.lineWidth = Math.ceil(size * borderPercent);
                    context.stroke(path);
                };

                /**
                 * Draws the Tile highlight on the map
                 * @param {CanvasRenderingContext2D} context The rendering context
                 * @param {Number} size The size of the Tile in pixels
                 * @param {Number} [red=0] The red color value of the highlight
                 * @param {Number} [green=255] The green color value of the highlight
                 * @param {Number} [blue=255] The blue color value of the highlight
                 * @param {Number} [alpha=0.2] The alpha value of the highlight
                 */
                this.renderHighlight = (context, size, red = 0, green = 255, blue = 255, alpha=0.2) => {
                    this.updateSize(size);

                    if (this.highlighted) {
                        context.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
                        let borderPercent = 2 / Tile.STANDARD_SIZE;
                        context.lineWidth = Math.ceil(size * borderPercent);
                        context.stroke(path);
                        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
                        context.fill(path);
                    } else {
                        context.clearRect(this.x * size - 1, this.y * size - 1, size + 2, size + 2);
                    }
                };

                /**
                 * Draws the Tile ground on the map
                 * @param {Path2D} path The path to render
                 * @param {Number} size The size of the Tile in pixels
                 * @returns {Boolean} Whether the size changed
                 */
                this.updateSize = (size) => {
                    if (size && size !== this.size) {
                        this.size = size;
                        path = new Path2D();
                        path.rect(this.x * size, this.y * size, size, size);
                        return true;
                    }
                    return false;
                };
            }

            /**
             * Deconstructor
             */
            destroy() {
                // TODO: clean up instances properly
                instances[ this.z ][ this.y ][ this.x ] = null;
            }

            static destroyFloor(floor) {
                instances = instances.splice(floor, 1);
            }

            /**
             * Highlight or unhighlight the Tile
             * @param {Boolean} [enable] Set whether the Tile is highlighted, if ommitted, toggles the highlight
             * @returns {Boolean} Whether the highlight changed
             */
            highlight(enable) {
                let changed = typeof enable === "undefined" || this.highlighted !== enable;
                this.highlighted = typeof enable === "boolean" ? enable : !this.highlighted;
                return changed;
            }

            /**
             * Determines if the mouse position intersects this Tile
             * @param {Number} mouseX Mouse coordinate
             * @param {Number} mouseY Mouse coordinate
             * @returns {Boolean} Whether the mouse intersects this Tile
             * @private
             */
            isIn(mouseX, mouseY) {
                // Using path and context.isPointInStroke() didn't seem to work
                return this.x * this.size <= mouseX && mouseX < (this.x + 1) * this.size && this.y * this.size <= mouseY && mouseY < (this.y + 1) * this.size;
            }

            /**
             * Draws the Tile ground on the map
             * @param {CanvasRenderingContext2D} context The rendering context
             * @param {Number} size The size of the Tile in pixels
             * @private
             */
            renderWalls(context, size) {
                // Walls
                WALLS.filter(
                    side => this.walls.hasOwnProperty(side)
                ).forEach(
                    side => this.walls[ side ].render(context, size, this.x, this.y)
                );
            }

            static getInstances() {
                return instances;
            }
        }

        Tile.STANDARD_SIZE = 100;

        return Tile;
    }, false);
})(window.DnD);