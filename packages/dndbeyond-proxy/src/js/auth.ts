// import { getCookiesPromised } from "chrome-cookies-secure";

const pastedHeaders = `:authority:
www.dndbeyond.com
:method:
GET
:path:
/equipment
:scheme:
https
accept:
text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
accept-encoding:
gzip, deflate, br, zstd
accept-language:
en-US,en;q=0.9,nb;q=0.8
cache-control:
no-cache
cookie:
Geo={%22region%22:%22MA%22%2C%22country%22:%22US%22%2C%22continent%22:%22NA%22}; _hjid=d54170b9-b530-4b3c-b6c1-11be23df15ca; _hjSessionUser_3684473=eyJpZCI6Ijk5YmI2MDgxLTdhYjAtNWYwOS04YWJhLTBmMjVmZGZhNGY3MSIsImNyZWF0ZWQiOjE2OTY4ODUxODk2NTAsImV4aXN0aW5nIjp0cnVlfQ==; sailthru_hid=fac0765f20872ea06a315b8b79391d735f74c3bafa98e30180874e63a241879cbf67f148c85293b361ad78f7; _gsid=2273f1350dd14dbb98b9557c8447fe4b; pxcts=62544752-dc10-11ee-a8ed-ec424afc34fb; _pxvid=61edcbee-dc10-11ee-9c27-4bb8ef39cc80; _fbp=fb.1.1709767342446.1164872982; _tt_enable_cookie=1; _ttp=jwYjOFLnvaIhHocFagul7VFXrL6; _pin_unauth=dWlkPVlUQTNObVJqTkRBdFlqa3lNUzAwTmpZMUxUbGtZVGt0TldGaU5USXpabVk0WkRJMg; LoginState=75a09094-3c4b-473b-ac55-d450aa74fe18; optimizelyEndUserId=oeu1709767349247r0.17871991470137694; g_state={"i_l":0}; CobaltSession=eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..og2RThhEwbyi9vUrcPWZlw.Mpe-Psv21l88rO1TwO2W8l1taPdyBLMkIT8kQVK7DIgtIEiZTLtCkcfIzB1-n2qJ.dG_hK-vALywSvJHrP-QyJA; User.ID=108294098; User.Username=Alaton; Preferences.Language=1; UserInfo={"UserId":108294098,"UserJoinDate":"2020-08-23","UserSessionId":"1ea5edbc-cc07-41b4-a30f-89606f4a630b"}; ResponsiveSwitch.DesktopMode=1; RequestVerificationToken=da0dcb76-dc23-4c11-8016-655841ea38ab; Preferences=undefined; sublevel=MASTER; Preferences.TimeZoneID=1; _gcl_au=1.1.1517842918.1717956821; cookie-consent=granted; _swb=b537e70e-fc77-49f6-8032-321c923c1e7d; _hjSessionUser_3684473=eyJpZCI6Ijk5YmI2MDgxLTdhYjAtNWYwOS04YWJhLTBmMjVmZGZhNGY3MSIsImNyZWF0ZWQiOjE2OTY4ODUxODk2NTAsImV4aXN0aW5nIjp0cnVlfQ==; _ketch_consent_v1_=eyJlc3NlbnRpYWxfc2VydmljZXMiOnsic3RhdHVzIjoiZ3JhbnRlZCIsImNhbm9uaWNhbFB1cnBvc2VzIjpbImVzc2VudGlhbF9zZXJ2aWNlcyJdfX0%3D; _clck=11fhisf%7C2%7Cfom%7C0%7C1526; _pxhd=puyPCMfe4DcWnDWV31Q5Wq3bp-3f8Lcy715aHrDhlFYE9qmsyjfL/Mo9yILtZGQclfDZ95jwfzdQb90-Uw69bA==:Ammw9UbeFgmwd4X2v5Q2zpfnaqlZvAmLeWt/2mK/PVZq3L-obHxnEA/Q4YI2MylJK9wE9OUew79lxpvoYM9rhc5xevmQobW2kGzzOEWX3as=; _gid=GA1.2.1901546178.1724557129; _hjSession_3684473=eyJpZCI6ImM2NDc1OGNmLTllZmEtNDc1Yi05MDYxLTVmNDA5MTRmODM3NCIsImMiOjE3MjQ2MDIyMDQ1MjIsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; AWSELB=B3991D2C147FD3F475AE9FEC34FABA547296B52718ED7831FBC44D1E501C8311221B991A1B7FA2E9034B08C42331B62E1A296603DE839471A201B912E1E7783FBB00BE09; AWSELBCORS=B3991D2C147FD3F475AE9FEC34FABA547296B52718ED7831FBC44D1E501C8311221B991A1B7FA2E9034B08C42331B62E1A296603DE839471A201B912E1E7783FBB00BE09; _rdt_uuid=1709767342609.49cb8376-99c7-438f-bdcc-4ee20a99c3bf; _swb_consent_=eyJjb2xsZWN0ZWRBdCI6MTcyNDYwODE1MCwiZW52aXJvbm1lbnRDb2RlIjoicHJvZHVjdGlvbiIsImlkZW50aXRpZXMiOnsic3diX2RuZCI6ImI1MzdlNzBlLWZjNzctNDlmNi04MDMyLTMyMWM5MjNjMWU3ZCJ9LCJqdXJpc2RpY3Rpb25Db2RlIjoiZGVmYXVsdCIsInByb3BlcnR5Q29kZSI6ImRuZCIsInB1cnBvc2VzIjp7ImVzc2VudGlhbF9zZXJ2aWNlcyI6eyJhbGxvd2VkIjoidHJ1ZSIsImxlZ2FsQmFzaXNDb2RlIjoiZGlzY2xvc3VyZSJ9fX0%3D; sailthru_pageviews=11; _derived_epik=dj0yJnU9S1FyR2dMZmFLbEJOUXNlU2p4ek4xTGE2Y3dmX1liSnUmbj01N0JTcUtvQUFKUVNObTB0bHFKQm9RJm09ZiZ0PUFBQUFBR2JMYnBZJnJtPWYmcnQ9QUFBQUFHYkxicFkmc3A9NQ; sailthru_content=cde1c19837b8f503270999b2ddeb15b4f40e72d71d4a852f1737ed07e0e127568fec0e33262f6c699bfafa9675acb35e074745d6873e1adeea5e50f469d8a7b9cc1ebb52b360fe1933f7d422b10bccdc4e6522d6bdbc35c608763d0a1492e59ab813669c1a41ca0eb032b43b7e4e1ef73c4ae0faf14192b33acc2e15035516fe924a23945e4da686d03af0c6930ccd736ce3eb88a43449a84ba0924d57e5e25b6929a5c99055e0daae441eb7ae448b96304ae25f404c65944dc4824c9c7da442993738c851ab73c9f1f27c2e5babceed67968070396d26f6ee65cd4538f0ee4bd154088d827e099022f49a0809f92b4e440e766ed48188b91760d191456ab792; sailthru_visitor=92ef399b-c7b4-4741-aac1-81c0ce6fc302; _clsk=1g7xxzm%7C1724609153782%7C20%7C0%7Ct.clarity.ms%2Fcollect; _px2=eyJ1IjoiNTRmZjYwNjAtNjMwYS0xMWVmLTk5NzMtYTlhOTU5OWU4NmZkIiwidiI6IjYxZWRjYmVlLWRjMTAtMTFlZS05YzI3LTRiYjhlZjM5Y2M4MCIsInQiOjE3MjQ2MDk0NjAzNjAsImgiOiI0MjM5MjYxYzZjNzFkODY3NWU5NWYyZTc1MTVmZjk4MTA0ZTllMjU1Mjc1MmM3ZmJiYTY0YTlmOGQ2Mzk1M2JlIn0=; WarningNotification.Lock=1; _gat_UA-26524418-48=1; _ga=GA1.1.1086428650.1709767343; _ga_NDTHXCE7HT=GS1.1.1724605580.97.1.1724609164.50.0.0; _ga_8P5GQ3C7YC=GS1.1.1724605580.96.1.1724609164.50.0.0; _uetsid=8a53c660629311ef894c97b660959b67; _uetvid=337a0f409faf11eb9e552f992df43c49
pragma:
no-cache
priority:
u=0, i
referer:
https://www.dndbeyond.com/equipment
sec-ch-ua:
"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"
sec-ch-ua-mobile:
?0
sec-ch-ua-platform:
"macOS"
sec-fetch-dest:
document
sec-fetch-mode:
navigate
sec-fetch-site:
same-origin
sec-fetch-user:
?1
upgrade-insecure-requests:
1
user-agent:
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36`;

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
