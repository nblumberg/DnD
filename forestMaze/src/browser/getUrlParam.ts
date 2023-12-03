const urlSearchParams = new URLSearchParams(window.location.search);

export function getUrlParam(name: string) {
  return urlSearchParams.get(name);
}
