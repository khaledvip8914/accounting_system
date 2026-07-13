const zatca = require("@talha7k/zatca");

async function testCSR() {
  const params = {
    organizationNameAr: "ط´ط±ظƒط© ط§ظ„ظ…طھطط¯ط©",
    organizationNameEn: "United Company",
    vatNumber: "311111111101113",
    crNumber: "1010010000",
    country: "SA",
    commonName: "127.0.0.1",
    invoiceType: "1100", // TSCZ
    businessCategory: "Software",
    location: {
        city: "Riyadh",
        district: "Olaya",
        street: "Main Street",
        buildingNumber: "1234",
        postalCode: "12222",
    },
    egsSerialNumber: "1-123|2-123|3-123",
  };

  try {
    const csrResult = zatca.generateCSR(params);
    console.log("CSR:", csrResult.csr);
    console.log("Private Key:", csrResult.privateKey);
  } catch (error) {
    console.error("Error generating CSR:", error);
  }
}

testCSR();
