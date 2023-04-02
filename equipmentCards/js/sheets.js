const BASE_URL = 'https://sheets.googleapis.com';
const SPREADSHEET_ID = '1_hdP7gpZlM_bXFuO-J0T4lufLTfJt0lWPLPD6IXoCRQ';
const GET_SHEET = `${BASE_URL}/v4/spreadsheets/${SPREADSHEET_ID}`;

// fetch(
//   GET_SHEET,
//   {
//     method: 'GET',
//     headers: {
//       cookie: 'SID=KwjAg8xpFNlPrgPHXSDp7wIqo6T0L3coNP1d3c90J3spZiA3OVWv4zMLJ6BvxZ4T1qeSLg.; __Secure-1PSID=KwjAg8xpFNlPrgPHXSDp7wIqo6T0L3coNP1d3c90J3spZiA3RSF49o1_oacBmZql-f19mQ.; __Secure-3PSID=KwjAg8xpFNlPrgPHXSDp7wIqo6T0L3coNP1d3c90J3spZiA3Gvoq6XvxSE6rZ99HMvg9yQ.; HSID=AqCYm0ubj7Xas1uHg; SSID=A2JVbHgxsmI0JQ9Tq; APISID=eLNjEc_ejQMKvE88/AKUK-S9bcxL0ePVpe; SAPISID=JKaFwesfwXSvvBxR/AmQXDLZwLvxsKQpdV; __Secure-1PAPISID=JKaFwesfwXSvvBxR/AmQXDLZwLvxsKQpdV; __Secure-3PAPISID=JKaFwesfwXSvvBxR/AmQXDLZwLvxsKQpdV; SEARCH_SAMESITE=CgQIzZUB; OTZ=6561960_72_76_104100_72_446760; AEC=AakniGMNxSYClEQTWAUn6S-vQDlyE__Puh24QoV4SpFzv2r5_BuzOolkEQ; 1P_JAR=2022-07-02-15; NID=511=t8yYQ1jhuwZQe5a-_0ZEGNdRu8NxT_lmeqTs7YtJ5a-PL3pP2bITjYa-kNX8_KetDEVtOtn7lz1sjZSasVP_kckyODmL97yHgn90kkRJjwYKucFxzApa9ncBzdS1y1wZMUKvaFIjohEzhqiWlWDAthKCctiwwixdTBtoLNZ-9frljM5AONwbTMux-wpMe9ceIiBwAMgFv5OM4fte5cwZdKHuRLboSvqkE0fSPiE79rFDYE9Y_SDIm7MPYTPknSFyguOftLJTY85rdJXfbAv1; GFE_RTT=238; SIDCC=AJi4QfGO_AIY0CSx9I_dgfvMPh3omwEAn7nCDff6ntoKn6rU2zcwrXBg23Fqrh59s-PZ3mttr4U; __Secure-1PSIDCC=AJi4QfEnsBAjmvJOXnY6rpIqN6cVAf7yhrrDBlQCOLMoy7bEox6tx9UFeEnieRvaF82OpNIVTqi_; __Secure-3PSIDCC=AJi4QfHsfpa0NXHWPo02G3kNvIdQzZCT8Gizmt-CY4GUwj_xUJHbNg3l3MU20L_liXBdq0qNDJ6b',
//     },
//   }
// ).then((...args) => {
//   console.log(...args);
// }).catch((error) => {
//   console.error(error);
// });
