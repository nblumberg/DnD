(function controlsIIFE(DnD) {
    "use strict";

    DnD.define("controls", [ "document", "Floor", "Math", "window" ], (document, Floor, Math, window) => {
        class Controls {
            /**
             * Represents the control panel for the map
             * @param {Object} params
             * @param {HTMLElement} params.parent The element to insert the canvas layers into
             * @param {Function} params.parent The element to insert the canvas layers into
             */
            constructor(params) {
                this.parent = document.createElement("nav");
                this.parent.id = "Controls";
                this.parent.className = "controls";
                params.parent.appendChild(this.parent);

                this.header = document.createElement("h3");
                this.header.innerText = "Floors";
                this.parent.appendChild(this.header);

                this.enabledFloors = document.createElement("select");
                this.enabledFloors.multiple = true;
                this.enabledFloors.size = 10;
                this.parent.appendChild(this.enabledFloors);
                this.enabledFloors.onchange = this.enableFloors.bind(this);
            }

            setFloors(floors) {
                this.floors = floors;
                this.enabledFloors.innerHTML = "";
                this.enabledFloors.size = Math.min(10, this.enabledFloors.length);
                floors.forEach((floor, i) => {
                    let option = document.createElement("option");
                    option.value = option.innerText = floor.index;
                    option.selected = true;
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
                    selectedIndices.push(window.parseInt(option.value, 10));
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
        }
        return Controls;
    }, false);
})(window.DnD);