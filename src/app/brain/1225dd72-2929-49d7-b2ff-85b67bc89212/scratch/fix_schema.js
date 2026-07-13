const fs = require('fs');
const path = require('path');

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const modelsToUpdate = [
  { model: 'Customer', field: 'code' },
  { model: 'Supplier', field: 'code' },
  { model: 'Warehouse', field: 'code' },
  { model: 'Product', field: 'sku' },
  { model: 'Category', field: 'name' },
  { model: 'SalesInvoice', field: 'invoiceNumber' },
  { model: 'PurchaseInvoice', field: 'invoiceNumber' },
  { model: 'StockTransfer', field: 'transferNumber' },
  { model: 'Account', field: 'code' },
  { model: 'JournalVoucher', field: 'reference' },
  { model: 'TransactionVoucher', field: 'voucherNumber' },
  { model: 'SalesQuotation', field: 'quotationNumber' },
  { model: 'UnitOfMeasure', field: 'name' },
  { model: 'CostCenter', field: 'code' },
  { model: 'ProductionOrder', field: 'orderNumber' },
  { model: 'Role', field: 'name' },
  { model: 'Employee', field: 'code' },
  { model: 'DisposalVoucher', field: 'voucherNumber' },
  { model: 'PurchaseOrder', field: 'orderNumber' }
];

for (const { model, field } of modelsToUpdate) {
  // Regex to find the model block
  const modelRegex = new RegExp(`model ${model} \\{[^\\}]+\\}`, 'g');
  
  schema = schema.replace(modelRegex, (match) => {
    // Remove @unique from the specific field
    const fieldRegex = new RegExp(`(\\s+${field}\\s+String\\s+)@unique`, 'g');
    let updatedBlock = match.replace(fieldRegex, '$1');
    
    // Add @@unique([companyId, field]) before the closing brace
    if (!updatedBlock.includes(`@@unique([companyId, ${field}])`)) {
      updatedBlock = updatedBlock.replace(/(\n})$/, `\n  @@unique([companyId, ${field}])$1`);
    }
    return updatedBlock;
  });
}

fs.writeFileSync(schemaPath, schema);
console.log('Schema updated successfully.');
