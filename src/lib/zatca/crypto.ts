import * as crypto from 'crypto';

/**
 * Generates an ECDSA secp256k1 key pair for ZATCA Integration.
 */
export function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256k1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'sec1',
      format: 'pem',
    },
  });

  return { publicKey, privateKey };
}

/**
 * Hashes a string or buffer using SHA-256 and returns Base64 representation.
 * Used for generating Invoice Hash.
 */
export function generateSha256Hash(data: string | Buffer): string {
  return crypto.createHash('sha256').update(data).digest('base64');
}

/**
 * Signs data using the given ECDSA private key (secp256k1) and SHA-256.
 * Used for generating the Cryptographic Stamp.
 */
export function signData(data: string | Buffer, privateKeyPem: string): string {
  const sign = crypto.createSign('SHA256');
  sign.update(data);
  sign.end();
  // ZATCA expects signature in base64
  return sign.sign(privateKeyPem, 'base64');
}
