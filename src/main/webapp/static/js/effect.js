/* global define, logFn */
/* exported */
(function() {
    "use strict";

    define({
        name: "Effect",
        dependencyNames: [ "Serializable", "state", "jQuery", "console" ],
        factory: function(Serializable, state, jQuery, console) {
            /**
             * @param params {Object | String} If a String, acts as params.name (below)
             * @param [params.name] {String} The name of the Effect, defaults to "Unknown effect"
             * @param [params.noId] {Boolean} Whether the Effect is a template and doesn't require an id or is an instance and should be assigned one
             * @param [params.id] {Number} The id of the Effect, used when loaded from stored data (otherwise the id is automatically assigned)
             * @param [params.amount] {Number} The amount by which this Effect increases, penalizes, or damages something; defaults to 0
             * @param [params.type] {String} The type of damage inflicted by this effect; should be one or more properties of Effect.CONDITIONS[ "ongoing damage" ]
             * @param [params.duration] {String} How long the Effect lasts before destroying itself (Effect.DURATION_START_TARGET_NEXT | Effect.DURATION_END_TARGET_NEXT | Effect.DURATION_START_ATTACKER_NEXT | Effect.DURATION_END_ATTACKER_NEXT)
             * @param [params.isNextTurn] {Boolean} Whether the duration has passed into the target/attacker's next turn (only for Effect instances loaded from stored data)
             * @param [params.saveEnds] {Boolean} Indicates that a saving throw ends this Effect
             */
            function Effect(params) {
                var i, childParams;
                params = params || {};
                this.__log = logFn.bind(this, "Effect");
                if (!params.noId) {
                    this.id = params.id || Effect.id++;
                }
                Effect.effects[ this.id ] = this;
                this.name = "Unknown effect";
                if (typeof(params) === "string") {
                    this.name = params;
                }
                else if (typeof(params) === "object" && params.hasOwnProperty("name") && params.name) {
                    this.name = params.name;
                }
                this.amount = params.amount || 0;
                this.type = params.type || "";
                this.duration = params.duration || null;
                this.isNextTurn = params.isNextTurn || false;
                this.saveEnds = params.saveEnds || false;
                this.target = typeof(params.target) === "number" ? state.findActor(params.target, true) : params.target;
                this.attacker = typeof(params.attacker) === "number" ? state.findActor(params.attacker, true) : params.attacker;
                this.startRound = params.round;
                if (this.target && !this.startRound) {
                    console.warn("Effect " + this.name + "[" + this.target.name + "] created without startRound");
                    this.startRound = state.getCurrentRound();
                }

                this.children = [];
                for (i = 0; params.children && i < params.children.length; i++) {
                    if (typeof(params.children[ i ]) === "string") {
                        childParams = params.children[ i ];
                    }
                    else {
                        childParams = jQuery.extend({}, params.children[ i ], { round: params.round, target: this.target, attacker: this.attacker });
                    }
                    this.children.push(new Effect(childParams));
                }
            }

            Effect.prototype = new Serializable();
            Effect.id = 1;
            Effect.effects = {};

            /**
             * Removes this effect and any of its child Effects from their target(s) and from the attacker's imposed effects list
             */
            Effect.prototype.remove = function() {
                var i;
                for (i = 0; this.children && i < this.children.length; i++) {
                    this.children[ i ].remove();
                }
                if (this.target && typeof(this.target) === "object" && this.target.hasOwnProperty("effects")) {
                    i = this.target.effects.indexOf(this);
                    if (i !== -1) {
                        this.target.effects.splice(i, 1);
                    }
                }
                if (this.attacker && typeof(this.attacker) === "object" && this.attacker.hasOwnProperty("imposedEffects")) {
                    i = this.attacker.imposedEffects.indexOf(this);
                    if (i !== -1) {
                        this.attacker.imposedEffects.splice(i, 1);
                    }
                }
            };

            /**
             * Called by both the Effect's target and attacker at both turn start and turn end to count down the Effect's duration timer and remove itself once expired
             * @param {Number} round The current round
             * @param {Boolean} isTargetTurn Indicates if the target or attacker is calling
             * @param {Boolean} isTurnStart Indicates if it's the start of the turn or the end of the turn
             */
            Effect.prototype.countDown = function(round, isTargetTurn, isTurnStart) {
                if (isTargetTurn && (this.duration === Effect.DURATION_START_TARGET_NEXT || this.duration === Effect.DURATION_END_TARGET_NEXT)) {
                    if (!this.isNextTurn && round > this.startRound) {
                        this.isNextTurn = true;
                    }
                    if (this.isNextTurn) {
                        if (this.duration === Effect.DURATION_START_TARGET_NEXT || // go since it's a later turn so our next start of turn must be happening or already have happened
                            !isTurnStart) { // go only if it's not the start of the turn (because we're waiting for the end of it: Effect.DURATION_END_ATTACKER_NEXT)
                            this.remove();
                            return true;
                        }
                    }
                }
                else if (!isTargetTurn && (this.duration === Effect.DURATION_START_ATTACKER_NEXT || this.duration === Effect.DURATION_END_ATTACKER_NEXT)) {
                    if (!this.isNextTurn && round > this.startRound) {
                        this.isNextTurn = true;
                    }
                    if (this.isNextTurn) {
                        if (this.duration === Effect.DURATION_START_ATTACKER_NEXT || // go since it's a later turn so our next start of turn must be happening or already have happened
                            !isTurnStart) { // go only if it's not the start of the turn (because we're waiting for the end of it: Effect.DURATION_END_ATTACKER_NEXT)
                            this.remove();
                            return true;
                        }
                    }
                }
                return false;
            };

            Effect.prototype.grantsCombatAdvantage = function(isMelee) {
                var gCA = false;
                this.__log("grantsCombatAdvantage", arguments);
                if (!this.name || !Effect.CONDITIONS.hasOwnProperty(this.name)) {
                    return gCA;
                }
                gCA = Effect.CONDITIONS[ this.name ].grantsCombatAdvantage;
                return gCA === true || (gCA === "melee" && isMelee);
            };

            Effect.prototype.toHitModifier = function() {
                var toHit, condition;
                this.__log("toHitModifiers", arguments);
                toHit = 0;
                if (!this.name || !Effect.CONDITIONS.hasOwnProperty(this.name)) {
                    return toHit;
                }
                condition = Effect.CONDITIONS[ this.name ];
                if (condition.attack) {
                    toHit = condition.attack;
                }
                else if (this.name === "modifier" && this.type === "attacks") {
                    toHit = this.amount;
                }
                // TODO: handle attackOther
                return toHit;
            };

            Effect.prototype.defenseModifier = function(defense, isMelee) {
                var mod, condition;
                mod = 0;
                this.__log("defenseModifier", arguments);
                if (!this.name || !Effect.CONDITIONS.hasOwnProperty(this.name)) {
                    return mod;
                }
                condition = Effect.CONDITIONS[ this.name ];
                if (condition.defenses) {
                    mod = condition.defenses;
                }
                else if (condition.rangedDefenses && !isMelee) {
                    mod = condition.rangedDefenses;
                }
                else if (this.name === "modifier" && this.type === defense) {
                    mod = this.amount;
                }
                return mod;
            };

            Effect.prototype.toString = function() {
                var name, i;
                name = this.name;
                if (this.children && this.children.length) {
                    name += " [ ";
                    for (i = 0; i < this.children.length; i++) {
                        if (i && i < this.children.length - 1) {
                            name += ", ";
                        }
                        else if (i === this.children.length - 1) {
                            name += " and ";
                        }
                        name += this.children[ i ].name;
                    }
                    name += " ]";
                }
                return name;
            };

            Effect.prototype.raw = function() {
                var target, attacker, r;
                target = this.target;
                this.target = this.target ? this.target.id : null;
                attacker = this.attacker;
                this.attacker = this.attacker ? this.attacker.id : null;

                r = Serializable.prototype.raw.call(this);

                this.target = target;
                this.attacker = attacker;

                return r;
            };

            Effect.DURATION_START_TARGET_NEXT = "startTargetNext";
            Effect.DURATION_END_TARGET_NEXT = "endTargetNext";
            Effect.DURATION_START_ATTACKER_NEXT = "startAttackerNext";
            Effect.DURATION_END_ATTACKER_NEXT = "endAttackerNext";
            Effect.DURATIONS = [
                Effect.DURATION_START_TARGET_NEXT,
                Effect.DURATION_END_TARGET_NEXT,
                Effect.DURATION_START_ATTACKER_NEXT,
                Effect.DURATION_END_ATTACKER_NEXT
            ];

            Effect.CONDITIONS = {
                blinded: { image: "../images/symbols/blinded.png", grantsCombatAdvantage: true, cantFlank: true, attack: -5, perception: -10 }, // "http://icons.iconarchive.com/icons/anatom5/people-disability/128/blind-icon.png",
                dazed: { image: "../images/symbols/dazed.jpg", grantsCombatAdvantage: true, cantFlank: true, cantDelay: true, actions: 1 }, // "http://1.bp.blogspot.com/_jJ7QNDTPcRI/TUs0RMuPz6I/AAAAAAAAAjo/YGnw2mI-aMo/s320/dizzy-smiley.jpg",
                deafened: { image: "../images/symbols/deafened.gif", perception: -10 }, // "http://joeclark.org/ear.gif",
                diseased: { image: "../images/symbols/diseased.jpg" }, // "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRnOrSXb8UHvwhgQ-loEdXZvQPTjuBylSfFNiK7Hxyq03IxgUKe",
                dominated: { image: "../images/symbols/dominated.png", grantsCombatAdvantage: true, cantFlank: true, actions: 0 }, // "http://fs02.androidpit.info/ali/x90/4186790-1324571166012.png",
                dying: { image: "../images/symbols/dying.png", grantsCombatAdvantage: true, cantFlank: true, actions: 0, defenses: -5 }, // "http://iconbug.com/data/61/256/170c6197a99434339f465fa8c9fa4018.png",
                dead: { image: "../images/symbols/dead.jpg", grantsCombatAdvantage: true, cantFlank: true, actions: 0, defenses: -5  }, // "http://t2.gstatic.com/images?q=tbn:ANd9GcTPA7scM15IRChKnwigvYnQUDWNGHLL1cemtAeKxxZKwBDj33MFCxzfyorp",
                grabbed: { image: "../images/symbols/grabbed.jpg", speed: 0 }, // "http://www.filipesabella.com/wp-content/uploads/2010/02/hand_grab.jpg",
                helpless: { image: "../images/symbols/helpless.png", grantsCombatAdvantage: true, cantFlank: true }, // "http://files.softicons.com/download/tv-movie-icons/dexter-icons-by-rich-d/png/128/Tied-Up%20Dexter.png",
                immobilized: { image: "../images/symbols/immobilized.gif", speed: 0 }, // "http://www.hscripts.com/freeimages/icons/traffic/regulatory-signs/no-pedestrian/no-pedestrian1.gif",
                marked: { image: "../images/symbols/marked.png", attackOther: -2 }, // "http://openclipart.org/image/800px/svg_to_png/30103/Target_icon.png",
                "ongoing damage": {
                    untyped: { image: "../images/symbols/ongoing_damage.jpg", color: "#FF0000" }, // "http://www.thelegendofreginaldburks.com/wp-content/uploads/2011/02/blood-spatter.jpg",
                    acid: { image: "../images/symbols/ongoing_acid.png", color: "#00FF00" }, // "http://en.xn--icne-wqa.com/images/icones/8/0/pictograms-aem-0002-hand-burn-from-chemical.png",
                    cold: { image: "../images/symbols/ongoing_cold.jpg", color: "#6666FF" }, // "http://www.psdgraphics.com/file/blue-snowflake-icon.jpg",
                    fire: { image: "../images/symbols/ongoing_fire.jpg", color: "#FF0000" }, // "http://bestclipartblog.com/clipart-pics/-fire-clipart-2.jpg",
                    lightning: { image: "../images/symbols/ongoing_lightning.png", color: "#CCCCFF" }, // "http://www.mricons.com/store/png/2499_3568_128_lightning_power_icon.png",
                    necrotic: { image: "../images/symbols/ongoing_necrotic.jpg", color: "purple" }, // "http://shell.lava.net/ohol_yaohushua/pentagram.jpg", // "http://www.soulwinners.com.au/images/Goat.jpg?942",
                    poison: { image: "../images/symbols/ongoing_poison.jpg", color: "#00FF00" }, // "http://ts3.mm.bing.net/th?id=H.4671950275020154&pid=1.7&w=138&h=142&c=7&rs=1",
                    psychic: { image: "../images/symbols/ongoing_psychic.jpg", color: "cyan" }, // "http://uniteunderfreedom.com/wp-content/uploads/2011/09/Brain-waves.jpg",
                    radiant: { image: "../images/symbols/ongoing_radiant.jpg", color: "#FFFFFF" } // "http://us.123rf.com/400wm/400/400/booblgum/booblgum1001/booblgum100100021/6174537-magic-radial-rainbow-light-with-white-stars.jpg",
                },
                modifier: {
                    unknown: { image: "../images/symbols/unknown.png", color: "#FF0000" },
                    attacks: { image: "../images/symbols/attack_penalty.jpg", color: "white" },
                    ac: { image: "../images/symbols/ac.png", color: "white" },
                    fort: { image: "../images/symbols/fort.png", color: "white" },
                    ref: { image: "../images/symbols/ref.png", color: "white" },
                    will: { image: "../images/symbols/will.png", color: "purple" }
                },
                petrified: { image: "../images/symbols/petrified.gif", grantsCombatAdvantage: true, cantFlank: true, actions: 0, damageResistance: 20 }, // "http://www.mythweb.com/encyc/images/media/medusas_head.gif",
                prone: { image: "../images/symbols/prone.png", grantsCombatAdvantage: "melee", speed: 1, attack: -2, rangedDefenses: 2 }, // "http://lessonpix.com/drawings/2079/100x100/Lying+Down.png",
                restrained: { image: "../images/symbols/restrained.jpg", grantsCombatAdvantage: true, speed: 0, attack: -2 }, // "http://p2.la-img.com/46/19428/6595678_1_l.jpg", // "http://ts3.mm.bing.net/th?id=H.4552318270046582&pid=1.9", // "http://us.123rf.com/400wm/400/400/robodread/robodread1109/robodread110901972/10664893-hands-tied.jpg",
                slowed: { image: "../images/symbols/slowed.jpg", speed: 2 }, // "http://glimages.graphicleftovers.com/18234/246508/246508_125.jpg",
                stunned: { image: "../images/symbols/stunned.jpg", grantsCombatAdvantage: true, cantFlank: true, actions: 0 }, // "http://images.all-free-download.com/images/graphicmedium/zap_74470.jpg",
                surprised: { image: "../images/symbols/surprised.jpg", grantsCombatAdvantage: true, cantFlank: true, actions: 0 }, // http://www.seo-chicks.com/wp-content/uploads/2012/09/2000px-Face-surprise.jpg
                unconscious: { image: "../images/symbols/unconscious.gif", grantsCombatAdvantage: true, cantFlank: true, actions: 0, defenses: -5 }, // "http://1.bp.blogspot.com/_ODwXXwIH70g/S1KHvp1iCHI/AAAAAAAACPo/o3QBUfcCT2M/s400/sm_zs.gif",
                unknown: { image: "../images/symbols/unknown.png", color: "#FF0000" },
                weakened: { image: "../images/symbols/weakened.png", damage: 0.5 } // "http://pictogram-free.com/material/003.png"
            };

            return Effect;
        },
        includeInNamespace: true,
        namespace: "DnD"
    });

})();
