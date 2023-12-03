const urlSearchParams = new URLSearchParams(window.location.search);
export function getUrlParam(name) {
    return urlSearchParams.get(name);
}
//# sourceMappingURL=getUrlParam.js.map