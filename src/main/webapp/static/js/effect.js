(function() {
    "use strict";

    DnD.define(
        "Effect",
        [ "out", "Serializable", "History", "jQuery" ],
        function(out, Serializable, History, jQuery) {
            /**
             * @param params {Object | String} If a String, acts as params.name (below)
             * @param [params.name] {String} The name of the Effect, defaults to "Unknown effect"
             * @param [params.noId] {Boolean} Whether the Effect is a template and doesn't require an id or is an instance and should be assigned one
             * @param [params.id] {Number} The id of the Effect, used when loaded from stored data (otherwise the id is automatically assigned)
             * @param [params.otherId] {String} An id used by call-generated Effects to recognize their generated effects
             * @param [params.amount] {Number} The amount by which this Effect increases, penalizes, or damages something; defaults to 0
             * @param [params.type] {String} The type of damage inflicted by this effect; should be one or more properties of Effect.CONDITIONS[ "ongoing damage" ]
             * @param [params.duration] {String} How long the Effect lasts before destroying itself (Effect.DURATION_START_TARGET_NEXT | Effect.DURATION_END_TARGET_NEXT | Effect.DURATION_START_ATTACKER_NEXT | Effect.DURATION_END_ATTACKER_NEXT)
             * @param [params.isNextTurn] {Boolean} Whether the duration has passed into the target/attacker's next turn (only for Effect instances loaded from stored data)
             * @param [params.saveEnds] {Boolean} Indicates that a saving throw ends this Effect
             * @param [params.children] {Array of params} A list of child Effects
             * @param [params.afterEffects] {Array of params} A list of Effects that take effect after this one expires
             * @param [params.failedEffects] {Array of params} A list of Effects that take effect if the target fails a saving throw
             * @param [params.call] {Function} A Function of the form function(target, attacker, round) {...} to call to get the final Effect to apply rather than take this Effect at face value
             */
            function Effect(params) {
                var i, childParams;
                params = params || {};

                this.name = "Unknown effect";
                if (typeof params === "function") {
                    this.call = params;
                    this.name = "Factory effect";
                }
                else if (params instanceof Effect && typeof params.call === "function") {
                    this.call = params.call;
                }

                if (!params.noId) {
                    this.id = params.id || Effect.id++;
                }
                Effect.effects[ this.id ] = this;
                if (params.otherId) {
                    this.otherId = params.otherId;
                }
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
                // vvv Must access Actor via the global or else it introduces a circular dependency
                this.target = typeof(params.target) === "number" ? DnD.Actor.findActor(params.target, true) : params.target;
                this.attacker = typeof(params.attacker) === "number" ? DnD.Actor.findActor(params.attacker, true) : params.attacker;
                // ^^^ Must access Actor via the global or else it introduces a circular dependency
                this.startRound = params.round;
                if (this.target && !this.startRound) {
                    out.console.warn("Effect " + this.name + "[" + this.target.name + "] created without startRound");
                    this.startRound = History && History.central && History.central._round ? History.central._round : 1; // TODO: figure out why this is coming back null
                }

                this.children = [];
                for (i = 0; params.children && i < params.children.length; i++) {
                    childParams = typeof(params.children[ i ]) === "string" ? params.children[ i ] : jQuery.extend({}, params.children[ i ], { round: params.round, target: this.target, attacker: this.attacker });
                    this.children.push(new Effect(childParams));
                }

                this.afterEffects = [];
                for (i = 0; params.afterEffects && i < params.afterEffects.length; i++) {
                    childParams = typeof(params.afterEffects[ i ]) === "string" ? params.afterEffects[ i ] : jQuery.extend({}, params.afterEffects[ i ], { round: params.round, target: this.target, attacker: this.attacker });
                    this.afterEffects.push(new Effect(childParams));
                }

                this.failedEffects = [];
                for (i = 0; params.failedEffects && i < params.failedEffects.length; i++) {
                    childParams = typeof(params.failedEffects[ i ]) === "string" ? params.failedEffects[ i ] : jQuery.extend({}, params.failedEffects[ i ], { round: params.round, target: this.target, attacker: this.attacker });
                    this.failedEffects.push(new Effect(childParams));
                }
            }

            Effect.prototype = new Serializable();
            Effect.id = 1;
            Effect.effects = {};

            /**
             * Removes an Effect from its target and imposes any after effects
             * @returns {string} If the Effect imposes after effects, this method returns a message of the form ", suffers after effect X, Y, Z"
             */
            Effect.prototype.remove = function() {
                var i, msg;
                for (i = 0; this.children && i < this.children.length; i++) {
                    this.children[ i ].remove();
                }
                if (this.target) {
                    i = this.target.effects.indexOf(this);
                    if (i !== -1) {
                        this.target.effects.splice(i, 1);
                    }
                }
                if (this.attacker && this.attacker.imposedEffects) {
                    i = this.attacker.imposedEffects.indexOf(this);
                    if (i !== -1) {
                        this.attacker.imposedEffects.splice(i, 1);
                    }
                }
                msg = "";
                for (i = 0; i < this.afterEffects.length; i++) {
                    msg += ", " + (msg ? "" : "suffers after effect ") + this.afterEffects[ i ].toString();
                    this.target.addEffect(this.afterEffects[ i ], this.attacker);
                }
                return msg;
            };

            /**
             * Called (externally) when the target fails a saving throw against this Effect
             */
            Effect.prototype.failedSave = function () {
                var i, msg;
                msg = this.remove();
                for (i = 0; i < this.failedEffects.length; i++) {
                    msg += ", " + (msg ? "" : "suffers failed saving throw effect ") + this.failedEffects[ i ].toString();
                    this.target.addEffect(this.failedEffects[ i ], this.attacker);
                }
                return msg;
            };

            /**
             * Counts down a duration Effect until it expires
             * @param round {Number}
             * @param isTargetTurn {Boolean}
             * @param isTurnStart {Boolean}
             * @returns {boolean | string} Returns a truthy value if the Effect expired and was removed otherwise a falsy value, if removed and it imposed after effects it returns the message from Effect.remove()
             */
            Effect.prototype.countDown = function(round, isTargetTurn, isTurnStart) {
                var retVal = false;
                if (isTargetTurn && (this.duration === Effect.DURATION_START_TARGET_NEXT || this.duration === Effect.DURATION_END_TARGET_NEXT)) {
                    if (!this.isNextTurn && round > this.startRound) {
                        this.isNextTurn = true;
                    }
                    if (this.isNextTurn && ((isTurnStart && this.duration === Effect.DURATION_START_TARGET_NEXT) || (!isTurnStart && this.duration === Effect.DURATION_END_TARGET_NEXT))) {
                        retVal = this.remove();
                        return retVal || true;
                    }
                }
                else if (!isTargetTurn && (this.duration === Effect.DURATION_START_ATTACKER_NEXT || this.duration === Effect.DURATION_END_ATTACKER_NEXT)) {
                    if (!this.isNextTurn && round > this.startRound) {
                        this.isNextTurn = true;
                    }
                    if (this.isNextTurn && ((isTurnStart && this.duration === Effect.DURATION_START_ATTACKER_NEXT) || (!isTurnStart && this.duration === Effect.DURATION_END_ATTACKER_NEXT))) {
                        retVal = this.remove();
                        return retVal || true;
                    }
                }
                return retVal;
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

            Effect.prototype.breakdown = function () {
                let condition, title, amount;
                function type2Condition(type) {
                    if (!type) {
                        return;
                    }
                    if (type.constructor === Array) {
                        if (type.length === 1) {
                            condition = condition[ type[ 0 ] ];
                        }
                        else {
                            condition = { image: "../images/symbols/unknown.png" }; // TODO: how should we display multiple damage types?
                        }
                    }
                    else if (typeof type.toLowerCase === "function") {
                        condition = condition[ type.toLowerCase() || "untyped" ];
                    }
                }
                condition = Effect.CONDITIONS[ this.name.toLowerCase() ] || { image: "../images/symbols/unknown.png" }; // TODO: how should we display multiple damage types?
                amount = this.amount;
                switch (this.name.toLowerCase()) {
                    case "ongoing damage": {
                        type2Condition(this.type);
                        title = (condition && condition.type ? "Ongoing " + condition.type + " damage" : "Ongoing damage") + (this.attacker ? " (" + this.attacker + ")" : "");
                    }
                        break;
                    case "resistance": {
                        type2Condition(this.type);
                        title = (condition && condition.type ? condition.type + " damage resistance" : "Damage resistance") + (this.attacker ? " (" + this.attacker + ")" : "");
                        amount *= -1;
                    }
                        break;
                    case "vulnerable": {
                        type2Condition(this.type);
                        title = (condition && condition.type ? condition.type + " vulnerability" : "Vulnerable") + (this.attacker ? " (" + this.attacker + ")" : "");
                        amount *= -1;
                    }
                        break;
                    case "penalty": {
                        type2Condition(this.type);
                        title = (condition && condition.type ? "Penalty to " + condition.type : "Unknown penalty") + (this.attacker ? " (" + this.attacker + ")" : "");
                        amount *= -1;
                    }
                        break;
                    case "bonus": {
                        type2Condition(this.type);
                        title = (condition && condition.type ? "Bonus to " + condition.type : "Unknown bonus") + (this.attacker ? " (" + this.attacker + ")" : "");
                    }
                        break;
                    default: {
                        title = this.name + (this.attacker ? " (" + this.attacker + ")" : "");
                    }
                }
                return { condition: condition, amount: amount, title: title };
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

            Effect.CONDITIONS = {
                blinded: { image: "../images/symbols/blinded.png" }, // "http://icons.iconarchive.com/icons/anatom5/people-disability/128/blind-icon.png",
                dazed: { image: "../images/symbols/dazed.jpg" }, // "http://1.bp.blogspot.com/_jJ7QNDTPcRI/TUs0RMuPz6I/AAAAAAAAAjo/YGnw2mI-aMo/s320/dizzy-smiley.jpg",
                deafened: { image: "../images/symbols/deafened.gif" }, // "http://joeclark.org/ear.gif",
                diseased: { image: "../images/symbols/diseased.jpg" }, // "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRnOrSXb8UHvwhgQ-loEdXZvQPTjuBylSfFNiK7Hxyq03IxgUKe",
                dominated: { image: "../images/symbols/dominated.png" }, // "http://fs02.androidpit.info/ali/x90/4186790-1324571166012.png",
                dying: { image: "../images/symbols/dying.png" }, // "http://iconbug.com/data/61/256/170c6197a99434339f465fa8c9fa4018.png",
                dead: { image: "../images/symbols/dead.jpg" }, // "http://t2.gstatic.com/images?q=tbn:ANd9GcTPA7scM15IRChKnwigvYnQUDWNGHLL1cemtAeKxxZKwBDj33MFCxzfyorp",
                grabbed: { image: "../images/symbols/grabbed.jpg" }, // "http://www.filipesabella.com/wp-content/uploads/2010/02/hand_grab.jpg",
                helpless: { image: "../images/symbols/helpless.png" }, // "http://files.softicons.com/download/tv-movie-icons/dexter-icons-by-rich-d/png/128/Tied-Up%20Dexter.png",
                immobilized: { image: "../images/symbols/immobilized.gif" }, // "http://www.hscripts.com/freeimages/icons/traffic/regulatory-signs/no-pedestrian/no-pedestrian1.gif",
                marked: { image: "../images/symbols/marked.png" }, // "http://openclipart.org/image/800px/svg_to_png/30103/Target_icon.png",
                "ongoing damage": {
                    untyped: { image: "../images/symbols/ongoing_damage.jpg", color: "#FF0000" }, // "http://www.thelegendofreginaldburks.com/wp-content/uploads/2011/02/blood-spatter.jpg",
                    acid: { image: "../images/symbols/ongoing_acid.png", color: "#00FF00" }, // "http://en.xn--icne-wqa.com/images/icones/8/0/pictograms-aem-0002-hand-burn-from-chemical.png",
                    cold: { image: "../images/symbols/ongoing_cold.jpg", color: "#6666FF" }, // "http://www.psdgraphics.com/file/blue-snowflake-icon.jpg",
                    fire: { image: "../images/symbols/ongoing_fire.jpg", color: "#FF0000" }, // "http://bestclipartblog.com/clipart-pics/-fire-clipart-2.jpg",
                    lightning: { image: "../images/symbols/ongoing_lightning.png", color: "#CCCCFF" }, // "http://www.mricons.com/store/png/2499_3568_128_lightning_power_icon.png",
                    necrotic: { image: "../images/symbols/ongoing_necrotic.jpg", color: "purple" }, // "http://shell.lava.net/ohol_yaohushua/pentagram.jpg", // "http://www.soulwinners.com.au/images/Goat.jpg?942",
                    poison: { image: "../images/symbols/ongoing_poison.jpg", color: "#00FF00" }, // "http://ts3.mm.bing.net/th?id=H.4671950275020154&pid=1.7&w=138&h=142&c=7&rs=1",
                    psychic: { image: "../images/symbols/ongoing_psychic.jpg", color: "cyan" }, // "http://uniteunderfreedom.com/wp-content/uploads/2011/09/Brain-waves.jpg",
                    radiant: { image: "../images/symbols/ongoing_radiant.jpg", color: "#FFFFFF" }, // "http://us.123rf.com/400wm/400/400/booblgum/booblgum1001/booblgum100100021/6174537-magic-radial-rainbow-light-with-white-stars.jpg",
                    thunder: { image: "../images/symbols/ongoing_thunder.png", color: "#CCCCFF" } // https://cdn2.iconfinder.com/data/icons/mosaicon-11/512/interference-512.png
                },
                penalty: {
                    unknown: { image: "../images/symbols/unknown.png", color: "#FF0000" },
                    attacks: { image: "../images/symbols/attack_penalty.jpg", color: "white" },
                    ac: { image: "../images/symbols/ac.png", color: "red" },
                    fort: { image: "../images/symbols/fort.png", color: "white" },
                    ref: { image: "../images/symbols/ref.png", color: "white" },
                    will: { image: "../images/symbols/will.png", color: "purple" }
                },
                bonus: {
                    unknown: { image: "../images/symbols/unknown.png", color: "#FF0000" },
                    attacks: { image: "../images/symbols/attack_penalty.jpg", color: "white" },
                    ac: { image: "../images/symbols/ac.png", color: "white" },
                    fort: { image: "../images/symbols/fort.png", color: "white" },
                    ref: { image: "../images/symbols/ref.png", color: "white" },
                    will: { image: "../images/symbols/will.png", color: "purple" }
                },
                "resistance": {
                    untyped: { image: "../images/symbols/ac.png", color: "#FF0000" },
                    acid: { image: "../images/symbols/ongoing_acid.png", color: "#00FF00" }, // "http://en.xn--icne-wqa.com/images/icones/8/0/pictograms-aem-0002-hand-burn-from-chemical.png",
                    cold: { image: "../images/symbols/ongoing_cold.jpg", color: "#6666FF" }, // "http://www.psdgraphics.com/file/blue-snowflake-icon.jpg",
                    fire: { image: "../images/symbols/ongoing_fire.jpg", color: "#FF0000" }, // "http://bestclipartblog.com/clipart-pics/-fire-clipart-2.jpg",
                    lightning: { image: "../images/symbols/ongoing_lightning.png", color: "#CCCCFF" }, // "http://www.mricons.com/store/png/2499_3568_128_lightning_power_icon.png",
                    necrotic: { image: "../images/symbols/ongoing_necrotic.jpg", color: "purple" }, // "http://shell.lava.net/ohol_yaohushua/pentagram.jpg", // "http://www.soulwinners.com.au/images/Goat.jpg?942",
                    poison: { image: "../images/symbols/ongoing_poison.jpg", color: "#00FF00" }, // "http://ts3.mm.bing.net/th?id=H.4671950275020154&pid=1.7&w=138&h=142&c=7&rs=1",
                    psychic: { image: "../images/symbols/ongoing_psychic.jpg", color: "cyan" }, // "http://uniteunderfreedom.com/wp-content/uploads/2011/09/Brain-waves.jpg",
                    radiant: { image: "../images/symbols/ongoing_radiant.jpg", color: "#FFFFFF" }, // "http://us.123rf.com/400wm/400/400/booblgum/booblgum1001/booblgum100100021/6174537-magic-radial-rainbow-light-with-white-stars.jpg",
                    thunder: { image: "../images/symbols/ongoing_thunder.png", color: "#CCCCFF" } // https://cdn2.iconfinder.com/data/icons/mosaicon-11/512/interference-512.png
                },
                "vulnerable": {
                    untyped: { image: "../images/symbols/ac.png", color: "#FF0000" },
                    acid: { image: "../images/symbols/ongoing_acid.png", color: "#00FF00" }, // "http://en.xn--icne-wqa.com/images/icones/8/0/pictograms-aem-0002-hand-burn-from-chemical.png",
                    cold: { image: "../images/symbols/ongoing_cold.jpg", color: "#6666FF" }, // "http://www.psdgraphics.com/file/blue-snowflake-icon.jpg",
                    fire: { image: "../images/symbols/ongoing_fire.jpg", color: "#FF0000" }, // "http://bestclipartblog.com/clipart-pics/-fire-clipart-2.jpg",
                    lightning: { image: "../images/symbols/ongoing_lightning.png", color: "#CCCCFF" }, // "http://www.mricons.com/store/png/2499_3568_128_lightning_power_icon.png",
                    necrotic: { image: "../images/symbols/ongoing_necrotic.jpg", color: "purple" }, // "http://shell.lava.net/ohol_yaohushua/pentagram.jpg", // "http://www.soulwinners.com.au/images/Goat.jpg?942",
                    poison: { image: "../images/symbols/ongoing_poison.jpg", color: "#00FF00" }, // "http://ts3.mm.bing.net/th?id=H.4671950275020154&pid=1.7&w=138&h=142&c=7&rs=1",
                    psychic: { image: "../images/symbols/ongoing_psychic.jpg", color: "cyan" }, // "http://uniteunderfreedom.com/wp-content/uploads/2011/09/Brain-waves.jpg",
                    radiant: { image: "../images/symbols/ongoing_radiant.jpg", color: "#FFFFFF" }, // "http://us.123rf.com/400wm/400/400/booblgum/booblgum1001/booblgum100100021/6174537-magic-radial-rainbow-light-with-white-stars.jpg",
                    thunder: { image: "../images/symbols/ongoing_thunder.png", color: "#CCCCFF" } // https://cdn2.iconfinder.com/data/icons/mosaicon-11/512/interference-512.png
                },
                petrified: { image: "../images/symbols/petrified.gif" }, // "http://www.mythweb.com/encyc/images/media/medusas_head.gif",
                prone: { image: "../images/symbols/prone.png" }, // "http://lessonpix.com/drawings/2079/100x100/Lying+Down.png",
                restrained: { image: "../images/symbols/restrained.jpg" }, // "http://p2.la-img.com/46/19428/6595678_1_l.jpg", // "http://ts3.mm.bing.net/th?id=H.4552318270046582&pid=1.9", // "http://us.123rf.com/400wm/400/400/robodread/robodread1109/robodread110901972/10664893-hands-tied.jpg",
                slowed: { image: "../images/symbols/slowed.jpg" }, // "http://glimages.graphicleftovers.com/18234/246508/246508_125.jpg",
                stunned: { image: "../images/symbols/stunned.jpg" }, // "http://images.all-free-download.com/images/graphicmedium/zap_74470.jpg",
                unconscious: { image: "../images/symbols/unconscious.gif" }, // "http://1.bp.blogspot.com/_ODwXXwIH70g/S1KHvp1iCHI/AAAAAAAACPo/o3QBUfcCT2M/s400/sm_zs.gif",
                unknown: { image: "../images/symbols/unknown.png", color: "#FF0000" },
                weakened: { image: "../images/symbols/weakened.png" } // "http://pictogram-free.com/material/003.png"
            };

            return Effect;
        },
        true
    );
})();
