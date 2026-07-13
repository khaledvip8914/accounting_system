const zatca = require("zatca-xml-js");
const fs = require("fs");

async function testCSR() {
  const egsData = {
    vatNumber: "311111111101113",
    crn: "1010010000",
    branchName: "Riyadh Branch",
    branchIndustry: "Software Development",
    building: "1234",
    street: "Main St",
    city: "Riyadh",
    citySubdivision: "Olaya",
    district: "Olaya",
    plot: "1234",
    postal: "12222",
  };

  try {
    const csrResult = await zatca.generateCSR(egsData, true);
    console.log("CSR:", csrResult.csr);
    console.log("Private Key:", csrResult.privateKey);
  } catch (error) {
    console.error("Error generating CSR:", error);
  }
}

testCSR();
