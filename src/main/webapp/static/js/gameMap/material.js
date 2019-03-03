(function materialIIFE(DnD) {
    "use strict";

    DnD.define("Material", [ "Image", "Promise", "setTimeout" ], (Image, Promise, setTimeout) => {
        let instances, promise, resolve;
        instances = [];

        /**
         * Represents a physical material that can be drawn on the map
         */
        class Material {
            /**
             * @param {Object} params
             * @param {String} params.name
             * @param {URI|null} params.texture
             * @param {Boolean} [params.difficult=false] Whether the material is considered difficult terrain
             * @param {Boolean} [params.loadBearing=true] Whether the material will support items/actors
             * @param {Boolean} [params.passable=true] Whether the material is considered passable to solid objects
             */
            constructor(params) {
                let img;
                instances.push(this);

                this.name = params.name;
                this.loaded = false;
                if (params.texture) {
                    img = new Image();
                    img.onload = () => {
                        this.loaded = true;
                        setTimeout(Material.ready, 0);
                    };
                    img.src = params.texture;

                    this.render = context => {
                        context.fillStyle = context.createPattern(img, "repeat");
                    };
                } else {
                    this.loaded = true;
                    setTimeout(Material.ready, 0);

                    this.render = context => {
                        context.fillStyle = "rgba(0, 0, 0, 0)";
                    };
                }
            }

            /**
             * Returns a Promise that resolves when all Material images are loaded
             * @returns {Promise<undefined>} A Promise that resolves when all Material images are loaded
             */
            static ready() {
                if (!promise) {
                    promise = new Promise(_resolve => {
                        resolve = _resolve;
                    });
                }
                if (instances.every(instance => instance.loaded)) {
                    resolve();
                }
                return promise;
            }
        }

        Material.WALL = {
            STONE: new Material({
                name: "stone",
                texture: "../images/tiles/wall_stone.jpeg" // "https://res.cloudinary.com/rebelwalls/image/upload/b_black,c_fill,fl_progressive,h_533,q_auto,w_800/v1428564757/article/R10871_image1"
            }),
            WOOD: new Material({
                name: "wood",
                texture: "../images/tiles/wall_wood.jpg" // https://cpsresources.com/wp-content/uploads/2014/12/30-0029-Dark-Woodgrain-Matte-.jpg"
            })
        };
        Material.FLOOR = {
            DIRT: new Material({
                name: "dirt",
                texture: "../images/tiles/floor_dirt.jpg" // "http://3.bp.blogspot.com/-8Jq3-Qk8x_c/VQHAwAXZ4RI/AAAAAAAAHnE/eYV00GIQStM/s1600/Orange%2Bdirtl%2Btexture-1.jpg"
            }),
            EMPTY: new Material({
                name: "empty",
                texture: null
            }),
            GRASS: new Material({
                name: "grass",
                texture: "../images/tiles/floor_grass.jpg" // "http://loring-greenough.org/wp-content/uploads/2014/04/grass-free-texture.jpg"
            }),
            STONE: new Material({
                name: "stone",
                texture: "../images/tiles/floor_stone.jpg" // "https://i.pinimg.com/236x/d3/e1/b5/d3e1b5069b98cbd0b9a4ef4d42ca0ead--stone-texture-seamless-stone-material.jpg"
            }),
            WOOD: new Material({
                name: "wood",
                texture: "../images/tiles/floor_wood.jpg" // "https://slm-assets3.secondlife.com/assets/16097977/view_large/Dark_Wood_Floor.jpg?1484807898"
            })
        };

        return Material;
    }, false);
})(window.DnD);