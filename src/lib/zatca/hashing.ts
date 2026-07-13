import crypto from 'crypto';

export class ZatcaHasher {
  /**
   * Generates a SHA-256 hash of the provided XML string, encoded in Base64.
   * Note: For strict ZATCA compliance, the XML MUST be canonicalized (C14N11)
   * before hashing. This function assumes the XML string is already canonicalized
   * or formatted exactly as required.
   */
  public static hashXml(xmlString: string): string {
    // Basic SHA-256 hash
    const hash = crypto.createHash('sha256');
    hash.update(xmlString, 'utf8');
    return hash.digest('base64');
  }

  /**
   * Helper function to remove unnecessary whitespaces/newlines 
   * which can break the hash if not strictly canonicalized.
   */
  public static preCanonicalize(xmlString: string): string {
    return xmlString
      .replace(/>\s+</g, '><') // Remove spaces between tags
      .replace(/\r?\n|\r/g, '') // Remove newlines
      .trim();
  }
}
