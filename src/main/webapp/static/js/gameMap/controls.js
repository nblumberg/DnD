(function controlsIIFE(DnD) {
    "use strict";

    let template =
        `<nav id="controls" class="controls">
            <table>
                <thead>
                    <th>Floors</th>
                    <th>Characters</th>
                </thead>
                <tbody>
                    <tr>
                        <td class="align-top">
                            <select id="floors" multiple size="10"></select>
                        </td>
                        <td class="align-top">
                            <select id="characters" size="10"></select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </nav>`;

    DnD.define("controls", [ "dom", "Floor", "Math", "parseInt" ], (dom, Floor, Math, parseInt) => {
        class Controls {
            /**
             * Represents the control panel for the map
             * @param {Object} params
             * @param {HTMLElement} params.parent The element to insert the canvas layers into
             */
            constructor(params) {
                let result = dom(template);

                params.parent.appendChild(result.ids.controls);

                this.enabledFloors = result.ids.floors;
                this.selectedActor = result.ids.characters;

                this.enabledFloors.onchange = this.enableFloors.bind(this);
                this.selectedActor.onchange = this.selectActor.bind(this);
            }

            setActors(actors) {
                this.actors = actors;
                this.selectedActor.innerHTML = "";
                this.selectedActor.size = Math.min(10, this.actors.length);
                actors.forEach((actor, i) => {
                    this.selectedActor.appendChild(dom(`<option value="${i}">${actor.name}</option>`).elements[ 0 ]);
                });
            }

            setFloors(floors) {
                this.floors = floors;
                this.enabledFloors.innerHTML = "";
                this.enabledFloors.size = Math.min(10, this.floors.length);
                floors.forEach((floor, i) => {
                    let option = dom(`<option selected value="${floor.index}">${floor.index}</option>`).elements[ 0 ];
                    if (!i) {
                        this.enabledFloors.appendChild(option);
                    } else {
                        this.enabledFloors.insertBefore(option, this.enabledFloors.childNodes[ 0 ]);
                    }
                });
            }
            
            enableFloors() {
                let selectedIndices = [];
                for (let option of this.enabledFloors.selectedOptions) {
                    selectedIndices.push(parseInt(option.value));
                }
                selectedIndices.sort();
                this.floors.forEach((floor, i) => {
                    if (selectedIndices.includes(i)) {
                        floor.show();
                    } else {
                        floor.hide();
                    }
                });
                Floor.current = selectedIndices.pop();
            }

            selectActor() {
                let index = parseInt(this.selectedActor.options[ this.selectedActor.selectedIndex ].value);
                this.actors.forEach((actor, i) => {
                    if (index === i) {
                        actor.select(true);
                    } else {
                        actor.select(false);
                    }
                });
            }
        }

        return Controls;
    }, false);
})(window.DnD);