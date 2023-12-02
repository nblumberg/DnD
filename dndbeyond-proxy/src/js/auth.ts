// import { getCookiesPromised } from "chrome-cookies-secure";

let cookieHeaderValue: string = "";

const rawExpected = `Preferences=undefined; sublevel=MASTER; _rdt_uuid=1645144971396.a029f9ba-d5f9-4041-a988-382f0a910e6d; _fbp=fb.1.1645144971810.913246939; _pin_unauth=dWlkPVlUQTNObVJqTkRBdFlqa3lNUzAwTmpZMUxUbGtZVGt0TldGaU5USXpabVk0WkRJMg; LoginState=aa9acbf9-423d-4ae9-b21d-387c632711ff; G_ENABLED_IDPS=google; CobaltSession=eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..JKKv9_8DAsFU6S992qytqg.XhxIcNw72ddTari9asED3DhIL95eoffXuSKElv_q_JSc_BxjwOlffsWLJ2nikDKy.jflxBkQLaMDxQ2ZGHl1ZbQ; Preferences.Language=1; Preferences.TimeZoneID=1; Ratings=null; _tt_enable_cookie=1; _ttp=28f5febd-2eec-4610-ae03-695378034127; ddb.toast.magic-item.homebrew-create-copy.hide-toast=true; ddb.toast.magic-item.homebrew-create.hide-toast=true; ddb.toast.magic-item.homebrew-edit.hide-toast=true; _gsid=e92e573a322342da8da22617e7346db7; Geo={%22region%22:%22MA%22%2C%22country%22:%22US%22%2C%22continent%22:%22NA%22}; RequestVerificationToken=2d9439a0-3e07-4994-877d-60b7097e915a; pxcts=274d6392-4726-11ed-a59c-4c6e706f626f; Preferences=undefined; sublevel=ANON; ResponsiveSwitch.DesktopMode=1; _pxvid=b232af68-9053-11ec-9fbe-47724d506271; _ga_8P5GQ3C7YC=deleted; sailthru_hid=fac0765f20872ea06a315b8b79391d735f74c3bafa98e30180874e63a241879cbf67f148c85293b361ad78f7; marketplace_filter_show_owned=false; _pxhd=gWWGjxMyIm17mO3ejw93DIjStDG7HGn2/p2qA2ErqwGtNM2esD6jTlLn86wU2f5205a1UnjN3RkhC7ZzWxcBeQ==:A04Xi4gc9tzII67LbUqdN8f3yOR4-yNv8qOVEyfAmSV0Tq3ruHdexjyszvH6qvyLdJ8RwzFYEmFxKi-bulWCv1m/gZP5161LEU27Vfq/GT4=; ddb.toast.spell.homebrew-create-copy.hide-toast=true; ddb.toast.spell.homebrew-create.hide-toast=true; ddb.toast.spell.homebrew-edit.hide-toast=true; _gcl_au=1.1.489344827.1694195783; cookie-consent=granted; _hjid=d54170b9-b530-4b3c-b6c1-11be23df15ca; _hjSessionUser_3684473=eyJpZCI6Ijk5YmI2MDgxLTdhYjAtNWYwOS04YWJhLTBmMjVmZGZhNGY3MSIsImNyZWF0ZWQiOjE2OTY4ODUxODk2NTAsImV4aXN0aW5nIjp0cnVlfQ==; _gid=GA1.2.1688986072.1700449848; AWSELB=17A593B6CA59C3C4856B812F84CD401A582EF08335AE71D0834BC2696233572C85266F7FB284A9F525C1AA0DF220CB30AEE9DCF61FDA8AC34CAEEDCD68973D61B0E4C4D8; AWSELBCORS=17A593B6CA59C3C4856B812F84CD401A582EF08335AE71D0834BC2696233572C85266F7FB284A9F525C1AA0DF220CB30AEE9DCF61FDA8AC34CAEEDCD68973D61B0E4C4D8; _hjIncludedInSessionSample_3684473=0; _hjSession_3684473=eyJpZCI6IjdmYzNmODE4LTE5OTYtNGRlYi04NWRjLWMxMTY0NGZkNjg2ZiIsImNyZWF0ZWQiOjE3MDA2MzUyNzE2MjUsImluU2FtcGxlIjpmYWxzZSwic2Vzc2lvbml6ZXJCZXRhRW5hYmxlZCI6dHJ1ZX0=; _hjAbsoluteSessionInProgress=0; _clck=rmfe8w%7C2%7Cfgx%7C0%7C1242; WarningNotification.Lock=1; _gat_UA-26524418-48=1; _uetsid=67185cc0875211eeb8860711810b9b2a; _uetvid=337a0f409faf11eb9e552f992df43c49; _ga=GA1.1.104346499.1645144971; _derived_epik=dj0yJnU9My1IQW1rUkprRFR6MXhaZk1aSUZwUVlCbG5rVG1ZZG8mbj0weHFaRVBOTHFhNGhjVGJTUGJnN0FnJm09MSZ0PUFBQUFBR1ZkcVlrJnJtPTEmcnQ9QUFBQUFHVmRxWWsmc3A9Mg; _ga_8P5GQ3C7YC=GS1.1.1700635269.64.1.1700637066.58.0.0; _px2=eyJ1IjoiNGQyZjA0MDAtODkwNi0xMWVlLWFkZjEtZTdiZmFmNWI0NGVmIiwidiI6ImIyMzJhZjY4LTkwNTMtMTFlYy05ZmJlLWM5ZDNkMGM3N2Y3MyIsInQiOjE3MDA2MzczNzQyMjYsImgiOiIwNzk2NDJmMTJkYjUwNzE2OTRlYzI4YTNiMjA1OWM1YjljOTczZTJjZTc4YjUxNTk4ZjU0MzQ4MWM5MTNjOGNjIn0=`;
const expected: Record<string, string> = rawExpected
  .split(";")
  .reduce((prev, curr) => {
    const [key, value] = curr.split("=");
    return { ...prev, [key.trim()]: value.trim() };
  }, {});

export async function initAuth(): Promise<void> {
  // const cookie = await getCookiesPromised("https://www.dndbeyond.com/monsters");
  // for (const key in expected) {
  //   if (cookie[key] !== expected[key]) {
  //     console.error(`${key}:`, `${cookie[key]} !== ${expected[key]}`);
  //   }
  // }
  // cookieHeaderValue = "";
  // for (const key in cookie) {
  //   cookieHeaderValue += `${key}=${cookie[key]}; `;
  // }
  // console.log("Cookie", cookieHeaderValue);
  cookieHeaderValue = rawExpected;
}

export function addAuthHeader(
  headers: Record<string, string> = {}
): Record<string, string> {
  headers.Cookie = cookieHeaderValue;
  return headers;
}
