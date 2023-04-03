function createLocation(params) {
    return {
        tide: Math.random() > 0.5 ? 'high' : 'low',
        ...params,
    };
}

function createLowTide(params) {
    return createLocation({
        ...params,
        tide: 'low',
    });
}

function createHighTide(params) {
    return createLocation({
        ...params,
        tide: 'low',
    });
}

function createOWell(params) {
    return createLocation({
        ...params,
        owell: true,
    });
}

function createGushingOWell(params) {
    return createOWell({
        description: `You hear the rush of water in the distance. You come to an o'-well that is 10 feet tall and 5 feet in diameter. A steady geyser of water shoots from the well, rising to a height of 30 feet above the well.`,
        ...params,
        gushing: true,
    });
}

const rawTiles = [
    createLocation({
        name: `Queen's Way`,
        description: ``,
        src: `https://rabailen.files.wordpress.com/2022/08/image-8.png`,
        start: true,
    }),
    createLocation({
        name: `Inn at the End of the Road`,
        src: `https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-002.the-inn.png`,
    }),

    createLocation({
        name: `Queen's Way 2`,
        src: `https://cdn2.inkarnate.com/cdn-cgi/image/width=1800,height=1200/https://inkarnate-api-as-production.s3.amazonaws.com/FJBVqqB469DHyAx6imMhtv`,
    }),
    createLocation({
        name: `Queen's Way 3`,
        src: `https://preview.redd.it/dtvz93twv3q71.jpg?auto=webp&s=6eb33e9f49a18d7a58f4568df1176bec2f01b219`,
    }),
    createLocation({
        name: `Swamp bird's eye view 1`,
        src: `https://inkarnate-api-as-production.s3.amazonaws.com/KaqfzESeEhThtxJp2Rqomo`,
    }),
    createLocation({
        name: `Swamp bird's eye view 2`,
        src: `https://preview.redd.it/lhkh1yvlp3r71.jpg?auto=webp&s=0767cf96ea5c734eaa7a0af061e155c436953eed`,
    }),
    createLocation({
        name: `Swamp bird's eye view 3`,
        src: `https://preview.redd.it/z3rfw7873bp71.jpg?auto=webp&s=63c826470a579da8e76574bc31768d18fbfdf490`,
    }),
    createLocation({
        name: `Swamp 1`,
        src: `http://www.kekaiart.com/uploads/5/4/7/6/5476798/2488138_orig.jpg`,
    }),
    createLocation({
        name: `Swamp 2`,
        src: `http://www.kekaiart.com/uploads/5/4/7/6/5476798/6087845_orig.jpg`,
    }),
    createLocation({
        name: `Swamp 3`,
        src: `http://www.kekaiart.com/uploads/5/4/7/6/5476798/1744742_orig.jpg`,
    }),
    createLocation({
        name: `Abandonned Village`,
        tide: 'low',
        src: `http://www.kekaiart.com/uploads/5/4/7/6/5476798/7824023_orig.jpg`,
    }),
    createHighTide({
        name: `Flooded Swamp 1`,
        src: `https://pbs.twimg.com/media/EHGMtyaXUAAdffU.jpg`,
    }),
    createHighTide({
        name: `Flooded Swamp 2`,
        src: `https://i.redd.it/hcrqj7rfgw581.jpg`,
    }),
    createLowTide({
        name: `Flowers`,
        src: `https://inkarnate-api-as-production.s3.amazonaws.com/LZ4V3oZvNL1jcL3xnFRu2M`,
    }),
    createLowTide({
        name: `Foggy Road`,
        src: `https://inkarnate-api-as-production.s3.amazonaws.com/3urZb7xiqUraNnxbGoBZNT`,
    }),
    createLowTide({
        name: `Ruined Statue`,
        src: `https://i.redd.it/5bjgt9r6kf961.jpg`,
    }),
    createOWell(createLowTide({
        name: `Low-tide O'-Well`,
        src: `https://i.redd.it/the-gushing-well-and-a-mini-dungeon-for-hither-v0-hjw3ika29tv81.jpg?width=1600&format=pjpg&auto=webp&s=ff2161b82467ed0e50df58748b52848ef985e5c8`,
    })),
    createOWell(createHighTide({
        name: `Hide-tide O'-Well`,
        description: ``,
        owell: true,
        tide: 'high',
        src: `https://preview.redd.it/the-gushing-well-and-a-mini-dungeon-for-hither-v0-u1vtjga29tv81.jpg?width=640&crop=smart&auto=webp&s=e77501e0a90e2b361a3e80b886d002f4cdc39595`,
    })),
    createOWell(createHighTide({
        name: `Swampy O'-Well`,
        description: ``,
        owell: true,
        tide: 'high',
        src: `https://preview.redd.it/813q1e349ij81.jpg?width=640&crop=smart&auto=webp&s=5430e4a9a92729177652b04928f5daaa69f5d82d`,
    })),
    createHighTide({
        name: `Flooded swamp`,
        description: ``,
        tide: 'high',
        src: `https://preview.redd.it/hither-encounter-map-with-flooded-variant-v0-i7ora0oopxk91.png?width=640&crop=smart&auto=webp&s=4f1fc58eebbe84b0f40876e71574475e8da58ef9`,
    }),
    createLocation({
        name: `Slanty Tower`,
        description: `A crumbling stone tower rises out of the swamp, leaning at such an angle that it threatens to keel over. Black brambles surround the base of the tower and cling to its lower half. Hanging from the crenellations on the lower side of the tower's peak is a large woven basket at the end of a tangle of ropes and tattered fabric. The basket dangles thirty feet above the surface of the swamp.`,
        src: `https://i.redd.it/c1fg5haj0ni81.png`,
    }),
    createLocation({
        name: `Telemy Hill`,
        description: `You are greeted by the scent of sweet-smelling fruit. Damp, downy, silvery-green moss blankets a gentle upward slope before giving way to a craggy ridge that marks the top of the hill. Dozens of enormous willow trees dot the hillside, swaying as though in a breeze despite the absence of one.`,
        src: `https://i.redd.it/3q5ngxf4ykp81.png`,
    }),
    createLocation({
        name: `Brigand's Tollway`,
        description: `A foggy marsh stretches out before you. Rickety causeways made of wooden planks form a wide, web-like structure above the bog. Three hundred feet away, many of these causeways converge on an enormous, ivy-covered tree stump that rises a good ten feet above the twenty-foot-high fog bank that enshrouds it.`,
        src: `https://i.redd.it/1mdat11476o81.png`,
    }),
    createLocation({
        name: `Downfall`,
        description: ``,
        src: `https://i.redd.it/pykbrqksj2k81.png`,
    }),
    createLocation({
        name: `Abandonned Raft`,
        description: `You find an abandoned, 8-foot-square wooden raft. It lacks any means of steering.`,
        src: `https://media.istockphoto.com/id/1170296501/photo/bamboo-raft-is-floating-in-the-lagoon.jpg?s=612x612&w=0&k=20&c=zvJCAMBgNWaBDpfuXer0BOLYH_0daH-yik64k4_A9S8=`,
    }),
    createGushingOWell({
        name: `Gushing O'-Well`,
        src: `https://assets.simpleviewinc.com/simpleview/image/upload/crm/napavalley/Geyser-rainbow_9D25005D-5056-A36A-08FDE367602B3064-9d24fe865056a36_9d250a6f-5056-a36a-0809ebfc394e088f.jpg`,
    }),
    createGushingOWell({
        name: `Gushing O'-Well 2`,
        src: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoi-0BBHJAVfbeQbW-Cd5Za9RCbMriWku-Yw&usqp=CAU`,
    }),
    createGushingOWell({
        name: `Gushing O'-Well 3`,
        src: `https://live.staticflickr.com/5594/31311915221_cdc7ca8ec6_b.jpg`,
    }),
    createGushingOWell({
        name: `Gushing O'-Well 4`,
        src: `https://www.nps.gov/yell/learn/nature/images/HydrothermalFeatures.jpg`,
    }),
    createGushingOWell({
        name: `Gushing O'-Well 5`,
        src: `https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/great-fountain-geyser-richard-mitchell-touching-light-photography.jpg`,
    }),
    createGushingOWell({
        name: `Gushing O'-Well 6`,
        src: `https://i0.wp.com/craigniesen.com/wp-content/uploads/2019/02/Great-Fountain-Geyser-Yellowstone-National-Park-2012.jpg?fit=1500%2C995&ssl=1`,
    }),
    createGushingOWell({
        name: `Gushing O'-Well 6`,
        src: `https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Fountain_Geyser_eruption_%281_00-1_29_PM%2C_6_August_2017%29_%2836202001980%29.jpg/391px-Fountain_Geyser_eruption_%281_00-1_29_PM%2C_6_August_2017%29_%2836202001980%29.jpg`,
    }),
    createGushingOWell({
        name: `Multiple gushing O'-Wells`,
        src: `https://static.wikia.nocookie.net/nodiatis/images/5/57/Geyser_Valley-Main.jpg/revision/latest`,
    }),
    createLocation({
        name: `Will o'the wisps`,
        src: `https://tfwalsh.files.wordpress.com/2012/01/will_o___wisp_by_ilyich-d3dqhl0.jpg`,
    }),
    createLocation({
        name: `Will o'the wisps 2`,
        src: `https://cdna.artstation.com/p/assets/images/images/003/796/812/large/hector-ortiz-157913-will-o-wisp-hortiz-final.jpg?1477540654`,
    }),
    createLocation({
        name: `Will o'the wisps 2`,
        src: `https://cdna.artstation.com/p/assets/images/images/003/796/812/large/hector-ortiz-157913-will-o-wisp-hortiz-final.jpg?1477540654`,
    }),
    createLowTide({
        name: `Stream from Downfall`,
        stream: true,
        src: `https://cdn.pixabay.com/photo/2016/12/15/12/41/waterfalls-1908788__340.jpg`,
    })



];

export const tiles = rawTiles.map((tile, i, array) => ({
    ...tile,
    right: (i !== array.length - 1 ? array[i + 1].name : array[0].name)
}));
