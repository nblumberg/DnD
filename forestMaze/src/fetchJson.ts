export function getJson(url: string): Promise<any> {
  return fetch(url).then(response => response.json());
}

export function postJson(url: string, toJson: object): Promise<Response> {
  return fetch(
    url,
    {
      method: 'POST',
      body: JSON.stringify(toJson),
      headers: { "Content-Type": "application/json" },
    });
}
