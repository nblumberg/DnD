// import { getCookiesPromised } from "chrome-cookies-secure";

const pastedHeaders = `:authority:
www.dndbeyond.com
:method:
GET
:path:
/spells
:scheme:
https
Accept:
text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Accept-Encoding:
gzip, deflate, br
Accept-Language:
en-US,en;q=0.9,nb;q=0.8
Cache-Control:
no-cache
Cookie:
Preferences=undefined; _fbp=fb.1.1645144971810.913246939; _pin_unauth=dWlkPVlUQTNObVJqTkRBdFlqa3lNUzAwTmpZMUxUbGtZVGt0TldGaU5USXpabVk0WkRJMg; LoginState=aa9acbf9-423d-4ae9-b21d-387c632711ff; G_ENABLED_IDPS=google; CobaltSession=eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..JKKv9_8DAsFU6S992qytqg.XhxIcNw72ddTari9asED3DhIL95eoffXuSKElv_q_JSc_BxjwOlffsWLJ2nikDKy.jflxBkQLaMDxQ2ZGHl1ZbQ; Preferences.TimeZoneID=1; _tt_enable_cookie=1; _ttp=28f5febd-2eec-4610-ae03-695378034127; ddb.toast.magic-item.homebrew-create-copy.hide-toast=true; ddb.toast.magic-item.homebrew-create.hide-toast=true; ddb.toast.magic-item.homebrew-edit.hide-toast=true; _gsid=e92e573a322342da8da22617e7346db7; Geo={%22region%22:%22MA%22%2C%22country%22:%22US%22%2C%22continent%22:%22NA%22}; RequestVerificationToken=2d9439a0-3e07-4994-877d-60b7097e915a; pxcts=274d6392-4726-11ed-a59c-4c6e706f626f; Preferences=undefined; sublevel=ANON; ResponsiveSwitch.DesktopMode=1; _pxvid=b232af68-9053-11ec-9fbe-47724d506271; _ga_8P5GQ3C7YC=deleted; sailthru_hid=fac0765f20872ea06a315b8b79391d735f74c3bafa98e30180874e63a241879cbf67f148c85293b361ad78f7; marketplace_filter_show_owned=false; ddb.toast.spell.homebrew-create-copy.hide-toast=true; ddb.toast.spell.homebrew-create.hide-toast=true; ddb.toast.spell.homebrew-edit.hide-toast=true; _hjid=d54170b9-b530-4b3c-b6c1-11be23df15ca; _hjSessionUser_3684473=eyJpZCI6Ijk5YmI2MDgxLTdhYjAtNWYwOS04YWJhLTBmMjVmZGZhNGY3MSIsImNyZWF0ZWQiOjE2OTY4ODUxODk2NTAsImV4aXN0aW5nIjp0cnVlfQ==; _gcl_au=1.1.1075224365.1701994049; cookie-consent=granted; _pxhd=5clG6bji/CpaRL6O-jPV36IpZEiJryOC4EMq9nyZz-CvM4z3Z3O1JXRZVMrsMvFsZNPNgMkiRGatt/LDREEYWg==:nla797u3V1nfuT0wiD-IlerKpUD8kTtnisLeg-kCCW90sFzmXDje-X1d7nDdj2i3kwyDxlynMZx2xaNNkkR2N5H05kxE3EcI-9loR5P3m4U=; _gid=GA1.2.930668427.1706226401; _clck=rmfe8w%7C2%7Cfiq%7C0%7C1242; _hjSession_3684473=eyJpZCI6ImU5YzBkNjNkLTFmODQtNDA2MS1hNjY0LTg5NTA2NTg5NzQxYSIsImMiOjE3MDYzMDM4MzMxMDAsInMiOjAsInIiOjAsInNiIjoxLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; _clsk=vqjax5%7C1706303842686%7C3%7C1%7Cp.clarity.ms%2Fcollect; _ga_8P5GQ3C7YC=GS1.1.1706303839.154.1.1706306828.60.0.0; _ga=GA1.1.104346499.1645144971; _uetsid=fd0894d0bbdb11ee9adb6bd89a34b160; _uetvid=337a0f409faf11eb9e552f992df43c49; _derived_epik=dj0yJnU9ZjYydTB6TGs2M1VFTFNOeDhlTk5TRGUwN0tVM05hVEkmbj1WYzlZTVI1U1gwRUl0Z1paZUZNVmpRJm09MSZ0PUFBQUFBR1cwTFF3JnJtPTEmcnQ9QUFBQUFHVzBMUXcmc3A9NQ; _rdt_uuid=1645144971396.a029f9ba-d5f9-4041-a988-382f0a910e6d; _px2=eyJ1IjoiM2Y1NTFjMTAtYmM5Ny0xMWVlLThhZjAtZGIxNWZhN2IzODI2IiwidiI6ImIyMzJhZjY4LTkwNTMtMTFlYy05ZmJlLWM5ZDNkMGM3N2Y3MyIsInQiOjE1Mjk5NzEyMDAwMDAsImgiOiI0ZjNlYTFhY2ZmMjU2NGFhOGI5ZTRiY2JlN2FjYWRiMTZhZGUyZWEzMjJkYzFkMmYwMGYyYzBlNmZhNzkzYTMxIn0=; AWSELB=B3991D2C147FD3F475AE9FEC34FABA547296B5276C0A8A99A26199985E921EA81A6BED9C1B7FA2E9034B08C42331B62E1A2966034329AEAB3AB43C8090D767F39B5737FA; AWSELBCORS=B3991D2C147FD3F475AE9FEC34FABA547296B5276C0A8A99A26199985E921EA81A6BED9C1B7FA2E9034B08C42331B62E1A2966034329AEAB3AB43C8090D767F39B5737FA
Pragma:
no-cache
Sec-Ch-Ua:
"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"
Sec-Ch-Ua-Mobile:
?0
Sec-Ch-Ua-Platform:
"macOS"
Sec-Fetch-Dest:
document
Sec-Fetch-Mode:
navigate
Sec-Fetch-Site:
none
Sec-Fetch-User:
?1
Upgrade-Insecure-Requests:
1
User-Agent:
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`;

const entries = pastedHeaders.split(/:?\s*\n\s*/g);
const defaultHeaders: Record<string, string> = {};
for (let i = 0; i < entries.length; i += 2) {
  if (entries[i].trim().startsWith(":")) {
    continue;
  }
  defaultHeaders[entries[i].trim()] = entries[i + 1];
}

// let cookieHeaderValue: string = "";

// const rawExpected = `Preferences=undefined; _fbp=fb.1.1645144971810.913246939; _pin_unauth=dWlkPVlUQTNObVJqTkRBdFlqa3lNUzAwTmpZMUxUbGtZVGt0TldGaU5USXpabVk0WkRJMg; LoginState=aa9acbf9-423d-4ae9-b21d-387c632711ff; G_ENABLED_IDPS=google; CobaltSession=eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..JKKv9_8DAsFU6S992qytqg.XhxIcNw72ddTari9asED3DhIL95eoffXuSKElv_q_JSc_BxjwOlffsWLJ2nikDKy.jflxBkQLaMDxQ2ZGHl1ZbQ; Preferences.TimeZoneID=1; _tt_enable_cookie=1; _ttp=28f5febd-2eec-4610-ae03-695378034127; ddb.toast.magic-item.homebrew-create-copy.hide-toast=true; ddb.toast.magic-item.homebrew-create.hide-toast=true; ddb.toast.magic-item.homebrew-edit.hide-toast=true; _gsid=e92e573a322342da8da22617e7346db7; Geo={%22region%22:%22MA%22%2C%22country%22:%22US%22%2C%22continent%22:%22NA%22}; RequestVerificationToken=2d9439a0-3e07-4994-877d-60b7097e915a; pxcts=274d6392-4726-11ed-a59c-4c6e706f626f; Preferences=undefined; sublevel=ANON; ResponsiveSwitch.DesktopMode=1; _pxvid=b232af68-9053-11ec-9fbe-47724d506271; _ga_8P5GQ3C7YC=deleted; sailthru_hid=fac0765f20872ea06a315b8b79391d735f74c3bafa98e30180874e63a241879cbf67f148c85293b361ad78f7; marketplace_filter_show_owned=false; ddb.toast.spell.homebrew-create-copy.hide-toast=true; ddb.toast.spell.homebrew-create.hide-toast=true; ddb.toast.spell.homebrew-edit.hide-toast=true; _hjid=d54170b9-b530-4b3c-b6c1-11be23df15ca; _hjSessionUser_3684473=eyJpZCI6Ijk5YmI2MDgxLTdhYjAtNWYwOS04YWJhLTBmMjVmZGZhNGY3MSIsImNyZWF0ZWQiOjE2OTY4ODUxODk2NTAsImV4aXN0aW5nIjp0cnVlfQ==; _gcl_au=1.1.1075224365.1701994049; cookie-consent=granted; _pxhd=5clG6bji/CpaRL6O-jPV36IpZEiJryOC4EMq9nyZz-CvM4z3Z3O1JXRZVMrsMvFsZNPNgMkiRGatt/LDREEYWg==:nla797u3V1nfuT0wiD-IlerKpUD8kTtnisLeg-kCCW90sFzmXDje-X1d7nDdj2i3kwyDxlynMZx2xaNNkkR2N5H05kxE3EcI-9loR5P3m4U=; _gid=GA1.2.930668427.1706226401; _clck=rmfe8w%7C2%7Cfiq%7C0%7C1242; _hjSession_3684473=eyJpZCI6ImU5YzBkNjNkLTFmODQtNDA2MS1hNjY0LTg5NTA2NTg5NzQxYSIsImMiOjE3MDYzMDM4MzMxMDAsInMiOjAsInIiOjAsInNiIjoxLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; _clsk=vqjax5%7C1706303842686%7C3%7C1%7Cp.clarity.ms%2Fcollect; _ga_8P5GQ3C7YC=GS1.1.1706303839.154.1.1706306828.60.0.0; _ga=GA1.1.104346499.1645144971; _uetsid=fd0894d0bbdb11ee9adb6bd89a34b160; _uetvid=337a0f409faf11eb9e552f992df43c49; _derived_epik=dj0yJnU9ZjYydTB6TGs2M1VFTFNOeDhlTk5TRGUwN0tVM05hVEkmbj1WYzlZTVI1U1gwRUl0Z1paZUZNVmpRJm09MSZ0PUFBQUFBR1cwTFF3JnJtPTEmcnQ9QUFBQUFHVzBMUXcmc3A9NQ; _rdt_uuid=1645144971396.a029f9ba-d5f9-4041-a988-382f0a910e6d; _px2=eyJ1IjoiM2Y1NTFjMTAtYmM5Ny0xMWVlLThhZjAtZGIxNWZhN2IzODI2IiwidiI6ImIyMzJhZjY4LTkwNTMtMTFlYy05ZmJlLWM5ZDNkMGM3N2Y3MyIsInQiOjE1Mjk5NzEyMDAwMDAsImgiOiI0ZjNlYTFhY2ZmMjU2NGFhOGI5ZTRiY2JlN2FjYWRiMTZhZGUyZWEzMjJkYzFkMmYwMGYyYzBlNmZhNzkzYTMxIn0=; AWSELB=B3991D2C147FD3F475AE9FEC34FABA547296B5276C0A8A99A26199985E921EA81A6BED9C1B7FA2E9034B08C42331B62E1A2966034329AEAB3AB43C8090D767F39B5737FA; AWSELBCORS=B3991D2C147FD3F475AE9FEC34FABA547296B5276C0A8A99A26199985E921EA81A6BED9C1B7FA2E9034B08C42331B62E1A2966034329AEAB3AB43C8090D767F39B5737FA`;
// const expected: Record<string, string> = rawExpected
//   .split(";")
//   .reduce((prev, curr) => {
//     const [key, value] = curr.split("=");
//     return { ...prev, [key.trim()]: value.trim() };
//   }, {});

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
  // cookieHeaderValue = rawExpected;
}

export function addAuthHeader(
  headers: Record<string, string> = {}
): Record<string, string> {
  return { ...defaultHeaders, ...headers };
}
