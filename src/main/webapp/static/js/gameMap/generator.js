(function generatorIIFE(DnD) {
    "use strict";

    DnD.define("generator", [ "Actor", "map", "Material", "Math", "Tile" ], (Actor, map, Material, Math, Tile) => {

        Promise.all([
            Actor.PORTRAIT.ready(),
            Material.ready(),
        ]).then(() => {
            /**
             * Returns a random property value from obj
             * @param {Object} obj The Object to pick from
             * @returns {*} The value of a random property on obj
             */
            function randomProperty(obj) {
                let properties = Object.keys(obj);
                let index = Math.floor(Math.random() * properties.length);
                return obj[ properties[ index ] ];
            }

            /**
             * @returns {Material} A random floor Material
             */
            function randomFloor() {
                return randomProperty(Material.FLOOR);
            }

            /**
             * @returns {Material|undefined} A random wall Material
             */
            function randomWall() {
                if (Math.random() < 0.2) {
                    return randomProperty(Material.WALL);
                }
                return undefined;
            }

            for (let floor = 0; floor < 3; floor++) {
                for (let row = 0; row < 10; row++) {
                    for (let column = 0; column < 10; column++) {
                        new Tile({
                            ground: randomFloor(),
                            walls: {
                                n: randomWall(),
                                e: randomWall(),
                                s: randomWall(),
                                w: randomWall()
                            },
                            x: column,
                            y: row,
                            z: floor
                        });
                    }
                }
            }
            map.setTiles(Tile.getInstances());
            map.setActors([
                {
                    floor: 2,
                    x: 0,
                    y: 0,
                    image: Actor.PORTRAIT.AMYRIA,
                    size: "medium",
                    pc: true
                },
                {
                    floor: 2,
                    x: 1,
                    y: 0,
                    image: Actor.PORTRAIT.BERBALANG,
                    size: "small",
                    pc: false
                },
                {
                    floor: 2,
                    x: 2,
                    y: 0,
                    image: Actor.PORTRAIT.BERBALANG,
                    size: "tiny",
                    pc: false
                },
                {
                    floor: 2,
                    x: 1,
                    y: 1,
                    image: Actor.PORTRAIT.BEHIR,
                    size: "large"
                },
                {
                    floor: 2,
                    x: 3,
                    y: 3,
                    image: Actor.PORTRAIT.ANTHAROSK,
                    size: "huge"
                },
                {
                    floor: 2,
                    x: 6,
                    y: 0,
                    image: Actor.PORTRAIT.ANTHAROSK,
                    size: "colossal"
                }
            ]);
        });
        return Tile.getInstances();
    }, false);
})(window.DnD);