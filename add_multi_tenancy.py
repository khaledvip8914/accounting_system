import re

with open('prisma/schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Company already exists to prevent duplicate runs
if 'model Company {' in content:
    print("Company model already exists.")
    exit(0)

models = re.findall(r'model\s+(\w+)\s+\{', content)

# Models that represent specific items inside a document (like InvoiceItem) don't strictly need companyId 
# because they inherit it from their parent (Invoice), but adding it to main models is required.
skip_models = [
    'WarehouseStock', 'InvoiceItem', 'PurchaseItem', 'StockTransferItem', 
    'CostCenterItem', 'ProductionOrderItem', 'EmployeeFinancialMove', 
    'SalaryPayment', 'QuotationItem', 'JournalEntry', 'PurchaseOrderItem'
]

target_models = [m for m in models if m not in skip_models]

company_model = """
model Company {
  id                 String    @id @default("default")
  name               String
  nameAr             String?
  subscriptionStatus String    @default("Active") // Active, Suspended, Expired
  subscriptionEndsAt DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  // Relations
"""
for m in target_models:
    # pluralize naively by adding 's', or 'es' if ends in 'y'
    attr_name = m[:1].lower() + m[1:]
    if attr_name.endswith('y'):
        attr_name = attr_name[:-1] + 'ies'
    else:
        attr_name += 's'
    
    # special cases
    if m == 'InventoryLog': attr_name = 'inventoryLogs'
    if m == 'CompanyProfile': attr_name = 'companyProfiles'
    
    company_model += f"  {attr_name} {m}[]\n"

company_model += "}\n\n"

# Insert Company model after datasource
content = re.sub(r'(datasource db \{[^}]+\}\n)', r'\1\n' + company_model, content)

# Insert companyId into target models
for m in target_models:
    pattern = r'(model\s+' + m + r'\s+\{)'
    replacement = r'\1\n  companyId String @default("default")\n  company Company @relation(fields: [companyId], references: [id])'
    content = re.sub(pattern, replacement, content)

with open('prisma/schema.prisma', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated schema.prisma with Multi-Tenancy (Company) support.")
