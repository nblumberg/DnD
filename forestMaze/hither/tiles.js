import { linkTiles } from '../tiles.js';

function createLocation(params) {
    return {
        tide: Math.random() > 0.5 ? 'high' : 'low',
        ...params,
    };
}

function createEncounterlessLocation(params) {
    return createLocation({
        ...params,
        noEncounters: true,
    });
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

function createStream(params) {
    return createLowTide({
        ...params,
        stream: true,
    });
}

const rawTiles = [
    // Key locations
    createLocation({
        name: `Queen's Way, top`,
        description: `You stand at the edge of a raised and broken causeway under a hazy, twilit sky. The causeway, which is built from pale stones that glow faintly from within, towers over the surrounding landscape, but large sections of it have crumbled away. The parts that remain in place are separated by large gaps where portions have collapsed.

        A fog-shrouded swamp spreads out below you in all directions, and up from its murk wafts the smell of rotting plants. Also rising from the swamp is the music of nature — a discordant symphony of croaking frogs and singing birds.`,
        src: `https://cdn.discordapp.com/attachments/989268285575008376/1051650916601839616/obituu_DD_adventuring_party_staring_at_a_fairy_castle_on_the_ho_a33e6c0e-951f-4e0b-84a5-3bc39f0004f9.png`,
        start: true,
        forcedEncounter: `Balloon Crash`,
        notRandom: true,
        down: `Queen's Way, descent`,
    }),
    createLocation({
        name: `Queen's Way, descent`,
        src: `https://rabailen.files.wordpress.com/2022/08/image-8.png`,
        forcedEncounter: `Giant crane flees`,
        notRandom: true,
        down: `Queen's Way Brigands`,
    }),
    createLocation({
        name: `Queen's Way Brigands`,
        description: `Sticky mud squelches beneath your feet. Tangled mangroves grow out of pools of rippling water, half hidden by the thick fog, and purple mushrooms cling to rotting logs and stumps scattered throughout the marsh. Crickets that glow like fireflies chirp serenely before they're snatched out of the air by the tongues of hungry frogs.`,
        src: `https://cdn2.inkarnate.com/cdn-cgi/image/width=1800,height=1200/https://inkarnate-api-as-production.s3.amazonaws.com/FJBVqqB469DHyAx6imMhtv`,
        forcedEncounter: `Queen's Way Brigands`,
        notRandom: true,
        right: `Queen's Way bottom`,
    }),
    createLocation({
        name: `Queen's Way bottom`,
        src: `https://preview.redd.it/dtvz93twv3q71.jpg?auto=webp&s=6eb33e9f49a18d7a58f4568df1176bec2f01b219`,
    }),
    createEncounterlessLocation({
        name: `Inn at the End of the Road`,
        description: `Nearby you feel, as much as hear, a thundering rumble like a stampede or an earthquake, growing stronger as time passes.

        The disturbance stops abruptly, and you round a corner to find a squat, two-story structure with a slate-shingled roof and worm-eaten wood walls. Dozens of tiny orbs of pale light buzz about the exterior like flies.

        As you approach, you catch the smell of hearty stew wafting from its open windows and see smoke rising in cottony puffs from its stone chimney.`,
        src: `https://i.pinimg.com/originals/bc/c4/ae/bcc4ae1d0e544d09bb2fe6542c74decc.jpg`,
        // src: `https://64.media.tumblr.com/f31dc781960d2bb1878c6415a69091b9/tumblr_ps68eseLL11re1snbo1_r1_1280.png`,
        // src: `https://media.dndbeyond.com/compendium-images/twbtw/JtUXxjur9QWtb7E3/02-002.the-inn.png`,
    }),
    createEncounterlessLocation({
        name: `Slanty Tower`,
        description: `A crumbling stone tower rises out of the swamp, leaning at such an angle that it threatens to keel over. Black brambles surround the base of the tower and cling to its lower half. Hanging from the crenellations on the lower side of the tower's peak is a large woven basket at the end of a tangle of ropes and tattered fabric. The basket dangles thirty feet above the surface of the swamp.`,
        src: `https://i.redd.it/c1fg5haj0ni81.png`,
    }),
    createEncounterlessLocation({
        name: `Telemy Hill`,
        description: `You are greeted by the scent of sweet-smelling fruit. Damp, downy, silvery-green moss blankets a gentle upward slope before giving way to a craggy ridge that marks the top of the hill. Dozens of enormous willow trees dot the hillside, swaying as though in a breeze despite the absence of one.`,
        src: `https://i.redd.it/3q5ngxf4ykp81.png`,
    }),
    createLocation({
        name: `Brigand's Tollway`,
        description: `A foggy marsh stretches out before you. Rickety causeways made of wooden planks form a wide, web-like structure above the bog. Three hundred feet away, many of these causeways converge on an enormous, ivy-covered tree stump that rises a good ten feet above the twenty-foot-high fog bank that enshrouds it.`,
        forcedEncounter: `Agdon Longscarf`,
        src: `https://i.redd.it/1mdat11476o81.png`,
    }),
    createEncounterlessLocation({
        name: `Downfall`,
        description: `Thick fog hangs heavy in the air, obscuring the area around you so that the world appears to have shrunk to only twenty feet in all directions. Before you, the waterway widens and the current slows, giving the impression that you have entered a lake. Croaking voices penetrate the fog, through which dark shapes appear, resolving into two rowboats. Manning the oars of each rowboat are two bullywugs.`,
        src: `https://i.redd.it/pykbrqksj2k81.png`,
    }),

    // O'-Wells
    createOWell(createLowTide({
        name: `Low-tide O'-Well`,
        src: `https://i.redd.it/the-gushing-well-and-a-mini-dungeon-for-hither-v0-hjw3ika29tv81.jpg?width=1600&format=pjpg&auto=webp&s=ff2161b82467ed0e50df58748b52848ef985e5c8`,
    })),
    createGushingOWell(createHighTide({
        name: `Hide-tide O'-Well`,
        description: ``,
        src: `https://preview.redd.it/the-gushing-well-and-a-mini-dungeon-for-hither-v0-u1vtjga29tv81.jpg?width=640&crop=smart&auto=webp&s=e77501e0a90e2b361a3e80b886d002f4cdc39595`,
    })),
    createOWell(createHighTide({
        name: `Swampy O'-Well`,
        description: ``,
        src: `https://preview.redd.it/813q1e349ij81.jpg?width=640&crop=smart&auto=webp&s=5430e4a9a92729177652b04928f5daaa69f5d82d`,
    })),
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
        name: `Gushing O'-Well 7`,
        src: `https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Fountain_Geyser_eruption_%281_00-1_29_PM%2C_6_August_2017%29_%2836202001980%29.jpg/391px-Fountain_Geyser_eruption_%281_00-1_29_PM%2C_6_August_2017%29_%2836202001980%29.jpg`,
    }),
    createGushingOWell({
        name: `Multiple gushing O'-Wells`,
        src: `https://static.wikia.nocookie.net/nodiatis/images/5/57/Geyser_Valley-Main.jpg/revision/latest`,
    }),

    // Downfall streams
    createStream({
        name: `Stream from Downfall 1`,
        src: `https://cdn.pixabay.com/photo/2016/12/15/12/41/waterfalls-1908788__340.jpg`,
    }),
    createStream({
        name: `Stream from Downfall 2`,
        src: `https://www.floridastateparks.org/sites/default/files/styles/single/public/media/image/Blackwater%20stream.jpg?itok=zke65YDv`,
    }),
    createStream({
        name: `Stream from Downfall 3`,
        src: `https://extension.unh.edu/sites/default/files/migrated_unmanaged_files/3BenKimball2stream4Bradford.jpg`,
    }),
    createStream({
        name: `Stream from Downfall 4`,
        src: `https://www.researchgate.net/publication/271078331/figure/fig17/AS:646462291578892@1531140029894/A-slow-moving-freshwater-swamp-forest-stream-at-Nee-Soon-Swamp-Forest-Photograph-by.png`,
    }),
    createStream({
        name: `Stream from Downfall 5`,
        src: `https://c.pxhere.com/photos/35/7d/lake_reflection_high_hires_trail_swamp_resolution_5d-579761.jpg!s2`,
    }),
    createStream({
        name: `Stream from Downfall 6`,
        src: `https://c.pxhere.com/photos/aa/fe/bach_water_waters_flowing_forest_green_movement_wood-1121440.jpg!s2`,
    }),
    createStream({
        name: `Stream from Downfall 7`,
        src: `https://media-cdn.tripadvisor.com/media/photo-m/1280/17/41/dc/15/stream-through-the-swamp.jpg`,
    }),
    createStream({
        name: `Stream from Downfall 8`,
        src: `https://live.staticflickr.com/65535/43283828015_5dfd30cf3e_b.jpg`,
    }),

    // Waterlogged battlefield
    createLocation({
        name: `Waterlogged battlefield`,
        description: `You come upon a bog that was the site of a battle between elves and fomorians long ago. The area is littered with rusted and broken weapons and armor, along with the bones of the dead. As you enter the area, two suits of animated armor stand up from the detritus. The suits are clearly of elven design, their helmets shaped like stylized owl heads.`,
        src: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvywOiNDQ1ALyfX-InIo70Kf1vJpMr9Gv2fxanLnlkhde6Rt9uBxLg97ec3FuWDh4m5P8&usqp=CAU`,
    }),
    createLocation({
        name: `Waterlogged battlefield 2`,
        description: `You come upon a bog that was the site of a battle between elves and fomorians long ago. The area is littered with rusted and broken weapons and armor, along with the bones of the dead. As you enter the area, two suits of animated armor stand up from the detritus. The suits are clearly of elven design, their helmets shaped like stylized owl heads.`,
        src: `https://blogger.googleusercontent.com/img/a/AVvXsEg6A2wVePQ99ZMgG4hxVGszEOQQ58OmK-sG5ZxFWZ8eqCe8HVdvcpfuhn6SyBxTbET4DM9WrZgyrkw972zCd99I0R0xNGjvlUQOCiqvlIyhUF6tnallzIRLVqIzgsIq9VLss0--f4U-7fOJeY-IDCPF47o2DJ4CsTu82PkyvTmde2NtYQGbHvOefLYP=w449-h253`,
    }),


    // Filler locations
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
        name: `Abandoned Village`,
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
    createHighTide({
        name: `Flooded swamp`,
        tide: 'high',
        src: `https://preview.redd.it/hither-encounter-map-with-flooded-variant-v0-i7ora0oopxk91.png?width=640&crop=smart&auto=webp&s=4f1fc58eebbe84b0f40876e71574475e8da58ef9`,
    }),
    createLocation({
        name: `Abandoned Raft`,
        description: `You find an abandoned, 8-foot-square wooden raft. It lacks any means of steering.`,
        src: `https://media.istockphoto.com/id/1170296501/photo/bamboo-raft-is-floating-in-the-lagoon.jpg?s=612x612&w=0&k=20&c=zvJCAMBgNWaBDpfuXer0BOLYH_0daH-yik64k4_A9S8=`,
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
        name: `Will o'the wisps 3`,
        src: `https://cdna.artstation.com/p/assets/images/images/003/796/812/large/hector-ortiz-157913-will-o-wisp-hortiz-final.jpg?1477540654`,
    }),
];

export const tiles = linkTiles(rawTiles);
