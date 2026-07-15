/**
 * ZATCA API Client
 * Handles communication with ZATCA APIs for Onboarding, Reporting, and Clearance.
 */

// Environments
const ENV_URLS = {
  Sandbox: 'https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal',
  Simulation: 'https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation',
  Production: 'https://gw-fatoora.zatca.gov.sa/e-invoicing/core',
};

export class ZatcaApiClient {
  private baseUrl: string;

  constructor(env: 'Sandbox' | 'Simulation' | 'Production') {
    this.baseUrl = ENV_URLS[env];
  }

  /**
   * 1. Issue Compliance CSID (Onboarding)
   * Needs OTP generated from Fatoora portal and the CSR (Certificate Signing Request).
   */
  async issueComplianceCsid(otp: string, csr: string) {
    const url = `${this.baseUrl}/compliance`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept-Version': 'V2',
        'OTP': otp,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ csr }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`ZATCA Onboarding Failed: ${err}`);
    }

    return response.json(); // Returns Compliance CSID, Secret, etc.
  }

  /**
   * 2. Report a B2C Invoice
   * Requires Compliance/Production CSID as Basic Auth.
   */
  async reportInvoice(
    csid: string,
    secret: string,
    invoiceHash: string,
    uuid: string,
    invoiceXmlBase64: string
  ) {
    const url = `${this.baseUrl}/invoices/reporting/single`;
    const auth = Buffer.from(`${csid}:${secret}`).toString('base64');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept-Version': 'V2',
        'Authorization': `Basic ${auth}`,
        'Clearance-Status': '0',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceHash,
        uuid,
        invoice: invoiceXmlBase64,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`ZATCA Reporting Failed: ${err}`);
    }

    return response.json();
  }

  /**
   * 3. Clear a B2B Invoice
   * Requires Compliance/Production CSID as Basic Auth.
   */
  async clearInvoice(
    csid: string,
    secret: string,
    invoiceHash: string,
    uuid: string,
    invoiceXmlBase64: string
  ) {
    const url = `${this.baseUrl}/invoices/clearance/single`;
    const auth = Buffer.from(`${csid}:${secret}`).toString('base64');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept-Version': 'V2',
        'Authorization': `Basic ${auth}`,
        'Clearance-Status': '1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceHash,
        uuid,
        invoice: invoiceXmlBase64,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`ZATCA Clearance Failed: ${err}`);
    }

    return response.json();
  }
}
