(function domIIFE(DnD) {
    "use strict";

    DnD.define("dom", ["document"], (document) => {
        let parent = document.createElement("div");

        /**
         * Turns an HTML String into HTML elements
         * @param {String} htmlString An HTML String
         * @returns {Object} An object containing the rendered HTML elements of the form {{ elements: Node[], ids: { String: HTMLElement, ... }, classes: { String: HTMLElement[], ... }, text: String[] }}
         */
        function dom(htmlString) {
            function processNode(node) {
                if (node.nodeType === 3) {
                    // TEXT_NODE
                    result.text.push(node.textContent);
                } else if (node.nodeType === 1) {
                    // ELEMENT_NODE
                    if (node.id) {
                        result.ids[ node.id ] = node;
                    }
                    if (node.classList && node.classList.length) {
                        for (let value of node.classList.values()) {
                            if (!result.classes.hasOwnProperty(value)) {
                                result.classes[ value ] = [];
                            }
                            result.classes[ value ].push(node);
                        }
                    }
                    if (node.children && node.children.length) {
                        Array.prototype.slice.call(node.children, 0).forEach(processNode);
                    }
                }
            }
            let result = {
                elements: null,
                ids: {},
                classes: {},
                text: []
            };
            parent.innerHTML = htmlString;
            let nodes = Array.prototype.slice.call(parent.childNodes, 0);
            nodes.forEach(processNode);
            result.elements = Array.prototype.slice.call(parent.children, 0);
            return result;
        }
        return dom;
    }, false);
})(window.DnD);
