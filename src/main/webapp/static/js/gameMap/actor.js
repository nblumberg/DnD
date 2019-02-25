(function floorIIFE(DnD) {
    "use strict";
    DnD.define("Actor", [ "Image", "Math" ], function actorFactory(Image, Math) {
        let instances = [];

        class Actor {
            /**
             * A figure on the map
             * @param {Object} params
             * @param {Image} params.image
             * @param {Floor} params.floor
             * @param {Tile} params.tile
             * @param {String} params.size
             * @param {Number} params.scale
             * @param {Boolean} params.pc
             */
            constructor(params) {
                this.image = params.image;
                this.floor = params.floor;
                this.sizeCategory = params.size;
                this.tile = params.tile;
                this.resize(params.scale);
                this.isPc = params.pc;
                instances.push(this);
            }

            set floor(floor) {
                this.layer = floor.getLayer("actors");
            }

            set tile(tile) {
                this.square = tile;
                this.x = this.square.x;
                this.y = this.square.y;
            }

            render() {
                let context = this.layer.context;
                let x = this.x * this.offset;
                let circleX = x + this.size / 2;
                let y = this.y * this.offset;
                let circleY = y + this.size / 2;
                let size = this.size / 2;
                context.save();
                context.beginPath();
                context.arc(circleX, circleY, size, 0, 2 * Math.PI);
                context.closePath();
                context.clip();
                let width = this.image.width <= this.image.height ? this.size : this.size * this.image.width / this.image.height;
                let height = this.image.width > this.image.height ? this.size : this.size * this.image.height / this.image.width;
                context.drawImage(
                    this.image,
                    x - (this.size < width ? width - this.size : 0),
                    y - (this.size < height ? height - this.size : 0),
                    width,
                    height
                );
                context.restore();
                let border = new Path2D();
                border.arc(circleX, circleY, size, 0, 2 * Math.PI);
                context.strokeStyle = this.isPc ? "green" : "red";
                context.lineWidth = 5;
                context.stroke(border);
            }

            /**
             * Sets the height and width of, and redraws, the map
             * @param {Number} size Pixel height/width of a Tile on the map
             */
            resize(size) {
                switch (this.sizeCategory) {
                    case "large":
                        this.size = 2;
                        break;
                    case "huge":
                        this.size = 3;
                        break;
                    case "colossal":
                        this.size = 4;
                        break;
                    case "tiny": // falls through
                    case "small": // falls through
                    case "medium": // falls through
                    default:
                        this.size = 1;
                        break;
                }
                this.offset = size;
                this.size *= size;
                this.render();
            }
        }

        /**
         * @param {String} name Property name
         * @param {String} src Image src
         * @returns {Promise<Image>} When the Image loads
         */
        function loadImage(name, src) {
            return new Promise((resolve) => {
                let img = new Image();
                img.onload = () => {
                    Actor.PORTRAIT[ name ] = img;
                    resolve(img);
                };
                img.src = src;
            });
        }

        Actor.PORTRAIT = {
            ready: () => {
                let promises = [];
                for (let p in Actor.PORTRAIT) {
                    if (Actor.PORTRAIT.hasOwnProperty(p) && p !== "ready") {
                        promises.push(loadImage(p, Actor.PORTRAIT[ p ]));
                    }
                }
                return Promise.all(promises);
            }
        };
        Actor.PORTRAIT.AMYRIA = "../images/portraits/amyria.jpg";
        Actor.PORTRAIT.ANTHAROSK = "../images/portraits/antharosk.jpg";
        Actor.PORTRAIT.BEHIR = "../images/portraits/behir.png";
        Actor.PORTRAIT.BERBALANG = "../images/portraits/berbalang.jpg";

        return Actor;
    }, false);
})(window.DnD);