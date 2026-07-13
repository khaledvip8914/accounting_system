/**
 * ZATCA QR Code Generator
 * Generates Base64 encoded TLV (Tag-Length-Value) QR code string for ZATCA e-invoicing.
 */

export function generateZatcaQr(
  sellerName: string,
  vatRegistrationNumber: string,
  timestamp: string, // ISO 8601 format e.g. "2023-10-25T15:30:00Z"
  invoiceTotal: string,
  vatTotal: string,
  xmlHash?: string, // Tag 6 (Phase 2)
  ecdsaSignature?: string, // Tag 7 (Phase 2)
  ecdsaPublicKey?: string, // Tag 8 (Phase 2)
  ecdsaSignatureOfPublicKey?: string // Tag 9 (Phase 2)
): string {
  const tlvArray: Uint8Array[] = [];

  // Tag 1: Seller Name
  tlvArray.push(toTlv(1, sellerName));
  // Tag 2: VAT Registration Number
  tlvArray.push(toTlv(2, vatRegistrationNumber));
  // Tag 3: Time stamp
  tlvArray.push(toTlv(3, timestamp));
  // Tag 4: Invoice Total (with VAT)
  tlvArray.push(toTlv(4, invoiceTotal));
  // Tag 5: VAT Total
  tlvArray.push(toTlv(5, vatTotal));

  // Phase 2 Tags
  if (xmlHash) tlvArray.push(toTlv(6, xmlHash));
  if (ecdsaSignature) tlvArray.push(toTlv(7, ecdsaSignature));
  if (ecdsaPublicKey) tlvArray.push(toTlv(8, ecdsaPublicKey));
  if (ecdsaSignatureOfPublicKey) tlvArray.push(toTlv(9, ecdsaSignatureOfPublicKey));

  // Concat all Uint8Arrays
  const totalLength = tlvArray.reduce((acc, val) => acc + val.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of tlvArray) {
    result.set(arr, offset);
    offset += arr.length;
  }

  // Convert to base64
  let binary = '';
  for (let i = 0; i < result.length; i++) {
    binary += String.fromCharCode(result[i]);
  }
  
  if (typeof btoa !== 'undefined') {
    return btoa(binary);
  } else if (typeof Buffer !== 'undefined') {
    return Buffer.from(result).toString('base64');
  }
  return binary;
}

/**
 * Helper to convert Tag and Value to TLV Uint8Array
 */
function toTlv(tag: number, value: string): Uint8Array {
  const encoder = new TextEncoder();
  const valueBuffer = encoder.encode(value);
  
  const result = new Uint8Array(2 + valueBuffer.length);
  result[0] = tag;
  result[1] = valueBuffer.length;
  result.set(valueBuffer, 2);
  
  return result;
}
