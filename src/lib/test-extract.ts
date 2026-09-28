import * as zatca from '@talha7k/zatca';

const orig = "TUlJQ0ZEQ0NBYm1nQXdJQkFnSUdBWjUvUW51OHF0SUw4d0l3TDBWdDhhUUxNbUF3Q2dZ\n" +
"SUtvWkl6ajBFQXdJd1h6RUxNQWtHQTFVRUJoTUNVMEV4RURBT0JnTlZCQWdUQjB0VFRW\n" +
"SXhFVEFQQmdOVkJBY1RDRXRsZEdodmJtRXhGVEFUQmdOVkJBb1RERXh2WTJGc1kyOXZh\n" +
"RzFwYm1jWk1SMHdHd1lEVlFRREV4UkhjbVZpYVdGdVlTQkRZWEpwWTJGMGFXOXVJRU5C\n" +
"TUI0WERUSTBNRGN4TkRBME1UVXdNRm9YRFRJMU1EY3hOREEwTVRVd01Gb3dnWm94Q3pB\n" +
"SkJnTlZCQVlUQWxOQk1SNHdIQVlEVlFRS0V4VlNZV2x1SUVKMWMyaGhiRkpsYm1SallW\n" +
"cFdVMVEwTFRJMU9ERXhPREV4TURFM01EZzFOalF3TFRJNE16Z3dNRGd3TVRjek1UZ3dO\n" +
"RGc1TURFd05EVXdOeTB3T0RFNE9USXpOelExTXpJd09ESTRNaTB3TURBd01EQXdNREF3\n" +
"TURBNE1RNHdEQVlEVlFRTEV3VkdVMlZ6TVE4d0RRWURWUVFERXdaSlRWRkRVa1V3V1RB\n" +
"VEJnY3Foa2pPUFFJQkJnZ3Foa2pPUFFNQkJ3TkNBQVNIVk1lUExmZE12NWlmbG9mQ1Zt\n" +
"QzF0QWVUOFdJOUUzUzhTUU54RllvWlhtMDFZOFcxYmtMTUN0SmhFMTBqY1BPRlhPVEtM\n" +
"M1pnMWJ6Znh2NWZOTnlubzRHRk1JR0NNQk1HQTFVZEpRUU1NQW9HQ0NzR0FRVUZCd01D\n" +
"TUI4R0ExVWRJd1FZTUJhQUZDTHBqREo3Szh3b1NEMVlkV2o1bkQrdTBMcHdNQkVHQTFV\n" +
"ZEVBUUtiQUFBd0NRWURWUjBUQkFJd0FEQWRCZ05WSFE0RUZnUVVPb3dITnEwdWdZejNW\n" +
"NnpHSHBRN3o1TWQ1OUV3Q2dZSUtvWkl6ajBFQXdJRFNBQXdSUUloQUtKMFV5VVRrSTdF\n" +
"NEhTUGl2ZkhOa3ZkZFF1Qnd2TWh0a0FSU29ySmx1TWpBaUJlRmY4SkwwYndKOTk1RGRV\n" +
"aEd6SUt5NG8vaDJ0U1NldkZZekFqNll1OWo4ZEE9PQ==";

let certPem = orig.replace(/\\s+/g, '');
while (certPem.startsWith('TUl')) {
  certPem = Buffer.from(certPem, 'base64').toString('utf8');
}

if (!certPem.includes('BEGIN CERTIFICATE')) {
  certPem = `-----BEGIN CERTIFICATE-----\n${certPem.replace(/\\s+/g, '').match(/.{1,64}/g)?.join('\n')}\n-----END CERTIFICATE-----`;
}

console.log("certPem start:", certPem.substring(0, 50));
try {
  const sig = zatca.extractCertificateSignature(certPem);
  console.log("Success! Sig:", sig);
} catch (e: any) {
  console.log("Error:", e.message);
  const der = Buffer.from(certPem.replace(/-----BEGIN CERTIFICATE-----/g, '').replace(/-----END CERTIFICATE-----/g, '').replace(/\\s/g, ''), 'base64');
  console.log("der length:", der.length);
  console.log("der[0]:", der[0]);
}
