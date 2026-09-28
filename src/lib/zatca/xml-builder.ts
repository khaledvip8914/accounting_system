export class ZatcaXmlBuilder {
  private invoice: any;
  private company: any;
  private customer: any;
  private items: any[];

  constructor(invoice: any, companyProfile: any, customer: any, items: any[]) {
    this.invoice = invoice;
    this.company = companyProfile;
    this.customer = customer;
    this.items = items;
  }

  public buildInvoiceXml(): string {
    const isB2B = this.customer.taxNumber && this.customer.taxNumber.length > 0;
    const invoiceTypeCode = isB2B ? "0100000" : "0200000"; // 0100000 for Standard, 0200000 for Simplified
    // Note: ZATCA requires exactly 7 characters for subtype (e.g. 0100000, 0200000, 0110000 for credit note...)
    
    // UUID should be dynamically generated for each invoice, assuming it's in this.invoice.zatcaUuid
    const uuid = this.invoice.zatcaUuid || this.generateUuid();
    const issueDate = new Date(this.invoice.date).toISOString().split('T')[0];
    const issueTime = new Date(this.invoice.date).toISOString().split('T')[1].substring(0, 8);
    const previousHash = this.invoice.zatcaPreviousHash || "NWZlY2ViNjZmZmM4NmYzOGQ5NTI3ODZjNmQ2OTZjNzljMmRiYzIzOWRkNGU5MWI0NjcyOWQ3M2EyN2ZiNTdlOQ==";
    const icv = parseInt(this.invoice.invoiceNumber.replace(/[^0-9]/g, ''), 10) || 1;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
         xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">
    <ext:UBLExtensions>
        <ext:UBLExtension>
            <ext:ExtensionURI>urn:oasis:names:specification:ubl:dsig:enveloped:xades</ext:ExtensionURI>
            <ext:ExtensionContent>
                <!-- Cryptographic Stamp (Signature) will be injected here during the signing process -->
                <sig:UBLDocumentSignatures xmlns:sig="urn:oasis:names:specification:ubl:schema:xsd:CommonSignatureComponents-2" xmlns:sac="urn:oasis:names:specification:ubl:schema:xsd:SignatureAggregateComponents-2" xmlns:sbc="urn:oasis:names:specification:ubl:schema:xsd:SignatureBasicComponents-2">
                    <sac:SignatureInformation>
                        <cbc:ID>urn:oasis:names:specification:ubl:signature:1</cbc:ID>
                        <sbc:ReferencedSignatureID>urn:oasis:names:specification:ubl:signature:Invoice</sbc:ReferencedSignatureID>
                    </sac:SignatureInformation>
                </sig:UBLDocumentSignatures>
            </ext:ExtensionContent>
        </ext:UBLExtension>
    </ext:UBLExtensions>
    
    <cbc:ProfileID>reporting:1.0</cbc:ProfileID>
    <cbc:ID>${this.invoice.invoiceNumber}</cbc:ID>
    <cbc:UUID>${uuid}</cbc:UUID>
    <cbc:IssueDate>${issueDate}</cbc:IssueDate>
    <cbc:IssueTime>${issueTime}</cbc:IssueTime>
    <cbc:InvoiceTypeCode name="${invoiceTypeCode}">${this.invoice.invoiceType || '388'}</cbc:InvoiceTypeCode>
    <cbc:DocumentCurrencyCode>${this.company.currency || 'SAR'}</cbc:DocumentCurrencyCode>
    <cbc:TaxCurrencyCode>SAR</cbc:TaxCurrencyCode>
    
    <cac:AdditionalDocumentReference>
        <cbc:ID>ICV</cbc:ID>
        <cbc:UUID>${icv}</cbc:UUID>
    </cac:AdditionalDocumentReference>
    
    <cac:AdditionalDocumentReference>
        <cbc:ID>PIH</cbc:ID>
        <cac:Attachment>
            <cbc:EmbeddedDocumentBinaryObject mimeCode="text/plain">${previousHash}</cbc:EmbeddedDocumentBinaryObject>
        </cac:Attachment>
    </cac:AdditionalDocumentReference>
    
    <cac:Signature>
        <cbc:ID>urn:oasis:names:specification:ubl:signature:Invoice</cbc:ID>
        <cbc:SignatureMethod>urn:oasis:names:specification:ubl:dsig:enveloped:xades</cbc:SignatureMethod>
    </cac:Signature>

    ${this.buildSupplierParty()}
    ${this.buildCustomerParty(isB2B)}
    ${this.buildDelivery()}
    ${this.buildTaxTotal()}
    ${this.buildLegalMonetaryTotal()}
    ${this.buildInvoiceLines()}
</Invoice>`;

    return xml;
  }

  private buildSupplierParty(): string {
    // Saudi defaults
    const street = this.company.streetName || "Street";
    const building = this.company.buildingNumber || "1234";
    const city = this.company.city || "Riyadh";
    const district = this.company.district || "District";
    const postal = this.company.postalCode || "12345";
    const country = this.company.country || "SA";
    const taxNum = this.company.taxNumber || "300000000000003";

    return `
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyIdentification>
                <cbc:ID schemeID="CR">1234567890</cbc:ID>
            </cac:PartyIdentification>
            <cac:PostalAddress>
                <cbc:StreetName>${street}</cbc:StreetName>
                <cbc:BuildingNumber>${building}</cbc:BuildingNumber>
                <cbc:CitySubdivisionName>${district}</cbc:CitySubdivisionName>
                <cbc:CityName>${city}</cbc:CityName>
                <cbc:PostalZone>${postal}</cbc:PostalZone>
                <cac:Country>
                    <cbc:IdentificationCode>${country}</cbc:IdentificationCode>
                </cac:Country>
            </cac:PostalAddress>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>${taxNum}</cbc:CompanyID>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
            <cac:PartyLegalEntity>
                <cbc:RegistrationName>${this.company.name}</cbc:RegistrationName>
            </cac:PartyLegalEntity>
        </cac:Party>
    </cac:AccountingSupplierParty>`;
  }

  private buildCustomerParty(isB2B: boolean): string {
    const taxNum = this.customer.taxNumber;
    let customerParty = `
    <cac:AccountingCustomerParty>
        <cac:Party>
            <cac:PostalAddress>
                <cbc:StreetName>${this.customer.streetName || "Street"}</cbc:StreetName>
                <cbc:BuildingNumber>${this.customer.buildingNumber || "1234"}</cbc:BuildingNumber>
                <cbc:CitySubdivisionName>${this.customer.district || "District"}</cbc:CitySubdivisionName>
                <cbc:CityName>${this.customer.city || "Riyadh"}</cbc:CityName>
                <cbc:PostalZone>${this.customer.postalCode || "12345"}</cbc:PostalZone>
                <cac:Country>
                    <cbc:IdentificationCode>SA</cbc:IdentificationCode>
                </cac:Country>
            </cac:PostalAddress>
            <cac:PartyTaxScheme>
                ${taxNum ? `<cbc:CompanyID>${taxNum}</cbc:CompanyID>` : ''}
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
            <cac:PartyLegalEntity>
                <cbc:RegistrationName>${this.customer.name}</cbc:RegistrationName>
            </cac:PartyLegalEntity>
        </cac:Party>
    </cac:AccountingCustomerParty>`;
    return customerParty;
  }

  private buildDelivery(): string {
    // Delivery date defaults to invoice date
    const deliveryDate = new Date(this.invoice.date).toISOString().split('T')[0];
    return `
    <cac:Delivery>
        <cbc:ActualDeliveryDate>${deliveryDate}</cbc:ActualDeliveryDate>
    </cac:Delivery>`;
  }

  private buildTaxTotal(): string {
    let totalTaxable = 0;
    let totalTax = 0;
    this.items.forEach(item => {
      const lineTotal = item.quantity * item.unitPrice;
      const taxCategory = item.product?.taxCategory || 'S';
      const taxPercent = taxCategory === 'S' ? 15 : 0;
      totalTaxable += lineTotal;
      totalTax += lineTotal * (taxPercent / 100);
    });

    const taxAmount = totalTax.toFixed(2);
    const taxableAmount = totalTaxable.toFixed(2);
    // Assuming Standard Rate 15%
    return `
    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="SAR">${taxAmount}</cbc:TaxAmount>
        <cac:TaxSubtotal>
            <cbc:TaxableAmount currencyID="SAR">${taxableAmount}</cbc:TaxableAmount>
            <cbc:TaxAmount currencyID="SAR">${taxAmount}</cbc:TaxAmount>
            <cac:TaxCategory>
                <cbc:ID>S</cbc:ID>
                <cbc:Percent>15.00</cbc:Percent>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:TaxCategory>
        </cac:TaxSubtotal>
    </cac:TaxTotal>`;
  }

  private buildLegalMonetaryTotal(): string {
    let totalTaxable = 0;
    let totalTax = 0;
    this.items.forEach(item => {
      const lineTotal = item.quantity * item.unitPrice;
      const taxCategory = item.product?.taxCategory || 'S';
      const taxPercent = taxCategory === 'S' ? 15 : 0;
      totalTaxable += lineTotal;
      totalTax += lineTotal * (taxPercent / 100);
    });
    
    const lineExtensionAmount = totalTaxable.toFixed(2);
    const taxExclusiveAmount = totalTaxable.toFixed(2);
    const taxInclusiveAmount = (totalTaxable + totalTax).toFixed(2);
    const payableAmount = taxInclusiveAmount;
    // ZATCA requires no rounding errors between lines and total
    return `
    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="SAR">${lineExtensionAmount}</cbc:LineExtensionAmount>
        <cbc:TaxExclusiveAmount currencyID="SAR">${taxExclusiveAmount}</cbc:TaxExclusiveAmount>
        <cbc:TaxInclusiveAmount currencyID="SAR">${taxInclusiveAmount}</cbc:TaxInclusiveAmount>
        <cbc:AllowanceTotalAmount currencyID="SAR">0.00</cbc:AllowanceTotalAmount>
        <cbc:PayableAmount currencyID="SAR">${payableAmount}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>`;
  }

  private buildInvoiceLines(): string {
    let lines = '';
    this.items.forEach((item, index) => {
      const lineId = index + 1;
      const quantity = item.quantity;
      const unitPrice = item.unitPrice;
      const taxCategory = item.product?.taxCategory || 'S'; // Standard
      const taxPercent = taxCategory === 'S' ? 15 : 0;
      
      const lineExtensionAmount = (quantity * unitPrice).toFixed(2);
      const taxAmount = ((quantity * unitPrice) * (taxPercent / 100)).toFixed(2);
      const roundingAmount = parseFloat(lineExtensionAmount) + parseFloat(taxAmount);

      lines += `
    <cac:InvoiceLine>
        <cbc:ID>${lineId}</cbc:ID>
        <cbc:InvoicedQuantity unitCode="PCE">${quantity.toFixed(2)}</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount currencyID="SAR">${lineExtensionAmount}</cbc:LineExtensionAmount>
        <cac:TaxTotal>
            <cbc:TaxAmount currencyID="SAR">${taxAmount}</cbc:TaxAmount>
            <cbc:RoundingAmount currencyID="SAR">${roundingAmount.toFixed(2)}</cbc:RoundingAmount>
        </cac:TaxTotal>
        <cac:Item>
            <cbc:Name>${item.product?.name || 'Item'}</cbc:Name>
            <cac:ClassifiedTaxCategory>
                <cbc:ID>${taxCategory}</cbc:ID>
                <cbc:Percent>${taxPercent.toFixed(2)}</cbc:Percent>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:ClassifiedTaxCategory>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="SAR">${unitPrice.toFixed(2)}</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>`;
    });
    return lines;
  }

  private generateUuid(): string {
    // Generate UUID v4 for the invoice
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
