// import { getCookiesPromised } from "chrome-cookies-secure";

let cookieHeaderValue: string = "";

const rawExpected = `Preferences=undefined; sublevel=MASTER; _rdt_uuid=1645144971396.a029f9ba-d5f9-4041-a988-382f0a910e6d; _fbp=fb.1.1645144971810.913246939; _pin_unauth=dWlkPVlUQTNObVJqTkRBdFlqa3lNUzAwTmpZMUxUbGtZVGt0TldGaU5USXpabVk0WkRJMg; LoginState=aa9acbf9-423d-4ae9-b21d-387c632711ff; G_ENABLED_IDPS=google; CobaltSession=eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..JKKv9_8DAsFU6S992qytqg.XhxIcNw72ddTari9asED3DhIL95eoffXuSKElv_q_JSc_BxjwOlffsWLJ2nikDKy.jflxBkQLaMDxQ2ZGHl1ZbQ; Preferences.Language=1; Preferences.TimeZoneID=1; Ratings=null; _tt_enable_cookie=1; _ttp=28f5febd-2eec-4610-ae03-695378034127; ddb.toast.magic-item.homebrew-create-copy.hide-toast=true; ddb.toast.magic-item.homebrew-create.hide-toast=true; ddb.toast.magic-item.homebrew-edit.hide-toast=true; _gsid=e92e573a322342da8da22617e7346db7; Geo={%22region%22:%22MA%22%2C%22country%22:%22US%22%2C%22continent%22:%22NA%22}; RequestVerificationToken=2d9439a0-3e07-4994-877d-60b7097e915a; pxcts=274d6392-4726-11ed-a59c-4c6e706f626f; Preferences=undefined; sublevel=ANON; ResponsiveSwitch.DesktopMode=1; _pxvid=b232af68-9053-11ec-9fbe-47724d506271; _ga_8P5GQ3C7YC=deleted; sailthru_hid=fac0765f20872ea06a315b8b79391d735f74c3bafa98e30180874e63a241879cbf67f148c85293b361ad78f7; marketplace_filter_show_owned=false; _pxhd=gWWGjxMyIm17mO3ejw93DIjStDG7HGn2/p2qA2ErqwGtNM2esD6jTlLn86wU2f5205a1UnjN3RkhC7ZzWxcBeQ==:A04Xi4gc9tzII67LbUqdN8f3yOR4-yNv8qOVEyfAmSV0Tq3ruHdexjyszvH6qvyLdJ8RwzFYEmFxKi-bulWCv1m/gZP5161LEU27Vfq/GT4=; ddb.toast.spell.homebrew-create-copy.hide-toast=true; ddb.toast.spell.homebrew-create.hide-toast=true; ddb.toast.spell.homebrew-edit.hide-toast=true; _gcl_au=1.1.489344827.1694195783; cookie-consent=granted; _hjid=d54170b9-b530-4b3c-b6c1-11be23df15ca; _hjSessionUser_3684473=eyJpZCI6Ijk5YmI2MDgxLTdhYjAtNWYwOS04YWJhLTBmMjVmZGZhNGY3MSIsImNyZWF0ZWQiOjE2OTY4ODUxODk2NTAsImV4aXN0aW5nIjp0cnVlfQ==; _gid=GA1.2.382179784.1699902912; _hjIncludedInSessionSample_3684473=0; _hjSession_3684473=eyJpZCI6IjY2NWU2ZjEyLTU5YTQtNGI4Yi05YjQ2LTMzODI5ZTBkN2VlNSIsImNyZWF0ZWQiOjE2OTk5MTEyOTk3ODcsImluU2FtcGxlIjpmYWxzZSwic2Vzc2lvbml6ZXJCZXRhRW5hYmxlZCI6dHJ1ZX0=; _hjAbsoluteSessionInProgress=0; AWSELB=17A593B6CA59C3C4856B812F84CD401A582EF083E14A2E133FB99235E1D3CC671549BC8DF3DD0A01DD4815C023F988F55E0E9527B680F5A93AEBF8E5ADAA49A8F75A9276; AWSELBCORS=17A593B6CA59C3C4856B812F84CD401A582EF083E14A2E133FB99235E1D3CC671549BC8DF3DD0A01DD4815C023F988F55E0E9527B680F5A93AEBF8E5ADAA49A8F75A9276; _clck=rmfe8w|2|fgp|0|1242; _clsk=1d3ofkt|1699923648108|3|1|p.clarity.ms/collect; _uetsid=f820ced0825811ee889d7f97fcc1fe48; _uetvid=337a0f409faf11eb9e552f992df43c49; _ga_8P5GQ3C7YC=GS1.1.1699921107.45.1.1699923736.59.0.0; _ga=GA1.1.104346499.1645144971; _derived_epik=dj0yJnU9WllKeEJmODJJZEF5U2J1NGdDUFVXUXdXSkR0NDhTTmUmbj1CeTdjdEdxOUJoVGlHaHNWX0xaaV9nJm09MSZ0PUFBQUFBR1ZTeHhnJnJtPTEmcnQ9QUFBQUFHVlN4eGcmc3A9NQ; _px2=eyJ1IjoiNzNkMzZiYjAtODI4OS0xMWVlLWJlMGYtYzc2OTMyMTA3ZTVmIiwidiI6ImIyMzJhZjY4LTkwNTMtMTFlYy05ZmJlLWM5ZDNkMGM3N2Y3MyIsInQiOjE2OTk5MjQwMzcwODAsImgiOiI4YWVjMDM0YWUyOWJlODJiZjNlMmY4NDllNjY4N2U0ZGIxMGRhY2IyYzc0Yzc1MTQ4N2YyMTAxYmEyMThiMWExIn0=`;
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
