(function wallIIFE(DnD) {
    "use strict";

    DnD.define("Wall", [ "Math", "Path2D" ], (Math, Path2D) => {
        /**
         * Represent a wall on a cardinal side of a Tile
         * @private
         */
        class Wall {
            /**
             * @param {Object} params
             * @param {Material} params.material
             * @param {Object} params.side
             */
            constructor(params) {
                this.material = params.material;
                this.side = params.side;
            }

            /**
             * Draws a Tile wall on the map
             * @param {CanvasRenderingContext2D} context The rendering context
             * @param {Number} size The size of the Tile in pixels
             * @param {Number} x Horizontal map grid coordinate of the Tile (measured in Tiles)
             * @param {Number} y Vertical map grid coordinate of the Tile (measured in Tiles)
             * @private
             */
            render(context, size, x, y) {
                let path = new Path2D();
                let width = Math.floor(size / 10);

                // this.material.render(context);
                // context.shadowColor = "rgba(0, 0, 0, 0.5)";
                // context.shadowBlur = 5;
                // context.shadowOffsetX = Math.floor(size / 30);
                // context.shadowOffsetY = Math.floor(size / 30);

                this.renderPath(context, size, x, y, width); // textures are correct, no shadow
                // this.renderRect(context, size, x, y, width); // shadows are correct, textures are all 1 type
                // this.renderFillRect(context, size, x, y, width); // textures are correct, no shadow

                // context.shadowOffsetX = 0;
                // context.shadowOffsetY = 0;
            }

            renderPath(context, size, x, y, width) {
                let wall = new Path2D();
                let shadow = new Path2D();
                if (this.side === "n") {
                    wall.rect(x * size, y * size, size, width);
                    shadow.rect(x * size + width / 2, y * size + width / 2, size, width);
                } else if (this.side === "e") {
                    wall.rect((x + 1) * size - width, y * size, width, size);
                    shadow.rect((x + 1) * size - width / 2, y * size + width / 2, width, size);
                } else if (this.side === "s") {
                    wall.rect(x * size, (y + 1) * size, size, width);
                    shadow.rect(x * size + width / 2, (y + 1) * size + width / 2, size, width);
                } else if (this.side === "w") {
                    wall.rect(x * size, y * size, width, size);
                    shadow.rect(x * size + width / 2, y * size + width / 2, width, size);
                }
                context.fillStyle = "rgba(0, 0, 0, 0.5)";
                context.fill(shadow);
                this.material.render(context);
                context.fill(wall);
            }

            renderRect(context, size, x, y, width) {
                if (this.side === "n") {
                    context.rect(x * size, y * size, size, width);
                } else if (this.side === "e") {
                    context.rect((x + 1) * size - width, y * size, width, size);
                } else if (this.side === "s") {
                    context.rect(x * size, (y + 1) * size, size, width);
                } else if (this.side === "w") {
                    context.rect(x * size, y * size, width, size);
                }
                context.fill();
            }

            renderFillRect(context, size, x, y, width) {
                if (this.side === "n") {
                    context.fillRect(x * size, y * size, size, width);
                } else if (this.side === "e") {
                    context.fillRect((x + 1) * size - width, y * size, width, size);
                } else if (this.side === "s") {
                    context.fillRect(x * size, (y + 1) * size, size, width);
                } else if (this.side === "w") {
                    context.fillRect(x * size, y * size, width, size);
                }
            }
        }

        return Wall;
    }, false);
})(window.DnD);