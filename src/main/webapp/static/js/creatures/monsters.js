(function() {
    "use strict";

    DnD.define(
        "creatures.monsters",
        [
            // start dependencies
            "creatures.monsters.adult_pact_dragon",
            "creatures.monsters.amyria",
            "creatures.monsters.antharosk",
            "creatures.monsters.base.arctic_sahuagin",
            "creatures.monsters.arctic_sahuagin_guard",
            "creatures.monsters.arctic_sahuagin_priest",
            "creatures.monsters.arctic_sahuagin_raider",
            "creatures.monsters.arctide_spiralith",
            "creatures.monsters.arzoa_githyanki_assassin",
            "creatures.monsters.banshrae_dartswarmer",
            "creatures.monsters.battle_wight_bodyguard",
            "creatures.monsters.beholder_eye_of_frost",
            "creatures.monsters.berbalang",
            "creatures.monsters.bitterglass",
            "creatures.monsters.blackroot_treant",
            "creatures.monsters.bone_archivist",
            "creatures.monsters.bone_scribe",
            "creatures.monsters.bram_ironfell",
            "creatures.monsters.brann_ot_githyanki_gish",
            "creatures.monsters.cachlain",
            "creatures.monsters.calaunxin",
            "creatures.monsters.centaur_ravager",
            "creatures.monsters.chaos_mauler",
            "creatures.monsters.chillfire_destroyer",
            "creatures.monsters.chillreaver",
            "creatures.monsters.chimera",
            "creatures.monsters.cyclops_crusher",
            "creatures.monsters.cyclops_guard",
            "creatures.monsters.cyclops_slaver",
            "creatures.monsters.base.dragonborn",
            "creatures.monsters.dragonborn_gladiator",
            "creatures.monsters.dragonborn_raider",
            "creatures.monsters.drider_fanglord",
            "creatures.monsters.drow_underling",
            "creatures.monsters.druenmeth_goldtemple",
            "creatures.monsters.duergar_hellcaller",
            "creatures.monsters.eidolon",
            "creatures.monsters.eladrin_feydark_gladiator",
            "creatures.monsters.eladrin_winter_blade",
            "creatures.monsters.elder_troglodyte_curse_chanter",
            "creatures.monsters.filth_king",
            "creatures.monsters.firbolg_bloodbear",
            "creatures.monsters.firbolg_bloodbear_bear_form",
            "creatures.monsters.firbolg_ghostraven",
            "creatures.monsters.flame_shard",
            "creatures.monsters.flesh_golem",
            "creatures.monsters.flux_slaad",
            "creatures.monsters.foulspawn_seer",
            "creatures.monsters.frost_giant",
            "creatures.monsters.frost_giant_scout",
            "creatures.monsters.gallia",
            "creatures.monsters.githyanki_lancer",
            "creatures.monsters.githyanki_mindslicer",
            "creatures.monsters.githyanki_myrmidon",
            "creatures.monsters.githyanki_thug",
            "creatures.monsters.githyanki_warrior",
            "creatures.monsters.githzerai_cenobite",
            "creatures.monsters.gluttonous_cube",
            "creatures.monsters.grimlock_ambusher",
            "creatures.monsters.hethralga",
            "creatures.monsters.howling_spirit",
            "creatures.monsters.ice_gargoyle",
            "creatures.monsters.ice_gargoyle_reaver",
            "creatures.monsters.icetouched_behir",
            "creatures.monsters.icetouched_umber_hulk",
            "creatures.monsters.inferno_bat",
            "creatures.monsters.iquel_githyanki_captain",
            "creatures.monsters.kle_th_githyanki_mindslicer",
            "creatures.monsters.laughing_shadow_groveler",
            "creatures.monsters.laughing_shadow_scrabbler",
            "creatures.monsters.laughing_shadow_sentry",
            "creatures.monsters.laughing_shadow_streetfighter",
            "creatures.monsters.legion_devil_hellguard",
            "creatures.monsters.lingering_spectre",
            "creatures.monsters.mezzodemon",
            "creatures.monsters.nara_of_the_wastes",
            "creatures.monsters.night_hag",
            "creatures.monsters.odos",
            "creatures.monsters.oni_spiritmaster",
            "creatures.monsters.pennel",
            "creatures.monsters.portal_hound",
            "creatures.monsters.purplespawn_nightmare",
            "creatures.monsters.pyradan",
            "creatures.monsters.quickling_zephyr",
            "creatures.monsters.rakshasa_archer",
            "creatures.monsters.rakshasa_warrior",
            "creatures.monsters.rathoraiax",
            "creatures.monsters.redspawn_firebelcher",
            "creatures.monsters.sarshan",
            "creatures.monsters.scarred_bulette",
            "creatures.monsters.scion_of_chaos",
            "creatures.monsters.seed_of_winter",
            "creatures.monsters.shadar_kai_warrior",
            "creatures.monsters.shadar_kai_witch",
            "creatures.monsters.shadow_snake",
            "creatures.monsters.skulking_terror",
            "creatures.monsters.skull_lord_servitor",
            "creatures.monsters.slaad_guard",
            "creatures.monsters.slaad_midwife",
            "creatures.monsters.slaad_tadpole",
            "creatures.monsters.slystone_dwarf_ruffian",
            "creatures.monsters.sovacles",
            "creatures.monsters.spitting_troll",
            "creatures.monsters.stone_golem",
            "creatures.monsters.storm_abishai_sniper",
            "creatures.monsters.streetwise_thug",
            "creatures.monsters.telicanthus",
            "creatures.monsters.thaggriel_githyanki_dragonknight",
            "creatures.monsters.thunderfury_boar",
            "creatures.monsters.treasure_golem",
            "creatures.monsters.troglodyte_warrior",
            "creatures.monsters.troll",
            "creatures.monsters.troll_vinespeaker",
            "creatures.monsters.two_headed_troll",
            "creatures.monsters.uarion",
            "creatures.monsters.base.virizan",
            "creatures.monsters.virizan_naga",
            "creatures.monsters.virizan_snake_swarm",
            "creatures.monsters.virizan_snaketongue",
            "creatures.monsters.virizan_venom_wisp",
            "creatures.monsters.wailing_ghost",
            "creatures.monsters.war_troll",
            "creatures.monsters.windstriker",
            "creatures.monsters.winter_wolf",
            "creatures.monsters.xirakis_adult_pact_dragon",
            "creatures.monsters.xurgelmek",
            "creatures.monsters.zithiruun_the_broken_general",
            // end dependencies
            "jQuery"
        ],
        function() {
            /**
             STAT grammar: "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA" | "HS"
             STAT_EXPR grammar: STAT_EXPR | "STR/DEX" | "STAT_EXPR^STAT_EXPR"
             ROLL grammar: String of form "(\d+(d\d+|\[W])|STAT_EXPR)\+(\d+|STAT_EXPR)"
             DAMAGE grammar: ROLL | { amount: ROLL[, type: String,] [crit: DAMAGE]} | [ DAMAGE ]
             EFFECT grammar: String | { name: String, [amount: Number,] [type: String,] [duration: "startTargetNext" | "endTargetNext" | "endAttackerNext",] [saveEnds: Boolean,] [children: [ EFFECT ]] }
             FREQUENCY grammar: "At-Will" | "Encounter" | "Daily" | "Recharge"

             String: {
                    name: String, level: Number, image: URL,
                    hp: { total: Number },
                    defenses: { ac: Number, fort: Number, ref: Number, will: Number },
                    [resistances: { "type": Number },]
                    [immunities: [ String ],]
                    [vulnerabilities: [ String ],]
                    [savingThrows: Number,]
                    init: Number,
                    speed: Number | { "method": Number },
                    abilities: { STR: Number, CON: Number, DEX: Number, INT: Number, WIS: Number, CHA: Number },
                    skills: { acrobatics: Number, arcana: Number, athletics: Number, bluff: Number, diplomacy: Number, dungeoneering: Number, endurance: Number, heal: Number, history: Number, insight: Number, intimidate: Number, nature: Number, perception: Number, religion: Number, stealth: Number, streetwise: Number, thievery: Number },
                    [weapons: [ { name: String, isMelee: Boolean, [enhancement: Number,] proficiency: Number, damage: DAMAGE } ],]
                    [implements: [ { name: String, [enhancement: Number,] crit: DAMAGE } ],]
                    [healing: [ { name: String, frequency: FREQUENCY, isTempHP: Boolean, usesHealingSurge: Boolean, amount: ROLL } ],]
                    attackBonuses: [
                        name: String,
                        [toHit: Number,]
                        [damage: DAMAGE,]
                        [effects: [ EFFECT ]]
                    ],
                    attacks: [
                        {
                            name: String,
                            [usage: { [frequency: "At-Will" | "Encounter" | "Daily" | "Recharge",] [recharge: Number | "Bloodied"] },]
                            [target: { [area: "Close Burst" | "Blast" | "Burst",] [size: Number,] [range: Number,] [enemiesOnly: Boolean] },]
                            [range: "melee" | "reach",] // TODO: remove?
                            toHit: Number | "automatic",
                            defense: "AC" | "Fort" | "Ref" | "Will",
                            damage: DAMAGE,
                            [effects: [ EFFECT ],]
                            [miss: {
                                [damage: DAMAGE,]
                                [halfDamage: Boolean,]
                                [effects: [ EFFECT ],]
                            },]
                            keywords: [ String ]
                        }
                    ]
                },
             */
            var monsters, i;
            monsters = {};
            for (i = 0; i < arguments.length; i++) {
                if (typeof arguments[ i ] === "object" && typeof arguments[ i ].name === "string") {
                    monsters[ arguments[ i ].name ] = arguments[ i ];
                }
            }
            return monsters;
        },
        false
    );
})();
