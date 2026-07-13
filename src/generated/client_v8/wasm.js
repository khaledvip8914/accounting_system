
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.4.1
 * Query Engine version: a9055b89e58b4b5bfb59600785423b1db3d0e75d
 */
Prisma.prismaVersion = {
  client: "6.4.1",
  engine: "a9055b89e58b4b5bfb59600785423b1db3d0e75d"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.CompanyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  nameAr: 'nameAr',
  phone: 'phone',
  email: 'email',
  subscriptionStatus: 'subscriptionStatus',
  subscriptionEndsAt: 'subscriptionEndsAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CustomerScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  code: 'code',
  name: 'name',
  nameAr: 'nameAr',
  email: 'email',
  phone: 'phone',
  address: 'address',
  streetName: 'streetName',
  buildingNumber: 'buildingNumber',
  city: 'city',
  district: 'district',
  postalCode: 'postalCode',
  taxNumber: 'taxNumber',
  commercialRegistry: 'commercialRegistry',
  balance: 'balance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SupplierScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  code: 'code',
  name: 'name',
  nameAr: 'nameAr',
  email: 'email',
  phone: 'phone',
  address: 'address',
  taxNumber: 'taxNumber',
  commercialRegistry: 'commercialRegistry',
  balance: 'balance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WarehouseScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  code: 'code',
  name: 'name',
  nameAr: 'nameAr',
  location: 'location',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WarehouseStockScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  warehouseId: 'warehouseId',
  productId: 'productId',
  quantity: 'quantity'
};

exports.Prisma.ProductScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  sku: 'sku',
  name: 'name',
  nameAr: 'nameAr',
  description: 'description',
  category: 'category',
  categoryId: 'categoryId',
  classification: 'classification',
  unit: 'unit',
  unitId: 'unitId',
  taxCategory: 'taxCategory',
  costPrice: 'costPrice',
  salePrice: 'salePrice',
  stockQuantity: 'stockQuantity',
  reorderPoint: 'reorderPoint',
  caloriesPer100g: 'caloriesPer100g',
  expiryDate: 'expiryDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  unitQuantity: 'unitQuantity',
  subUnitId: 'subUnitId',
  supplierId: 'supplierId'
};

exports.Prisma.CategoryScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  name: 'name',
  nameAr: 'nameAr',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SalesInvoiceScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  invoiceNumber: 'invoiceNumber',
  date: 'date',
  customerId: 'customerId',
  warehouseId: 'warehouseId',
  totalAmount: 'totalAmount',
  taxAmount: 'taxAmount',
  discount: 'discount',
  netAmount: 'netAmount',
  status: 'status',
  isTaxInclusive: 'isTaxInclusive',
  journalVoucherId: 'journalVoucherId',
  invoiceType: 'invoiceType',
  referenceId: 'referenceId',
  zatcaUuid: 'zatcaUuid',
  zatcaInvoiceHash: 'zatcaInvoiceHash',
  zatcaPreviousHash: 'zatcaPreviousHash',
  zatcaCryptographicStamp: 'zatcaCryptographicStamp',
  zatcaQrCode: 'zatcaQrCode',
  zatcaStatus: 'zatcaStatus',
  zatcaXml: 'zatcaXml',
  zatcaErrorLogs: 'zatcaErrorLogs',
  zatcaReportedAt: 'zatcaReportedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PurchaseInvoiceScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  invoiceNumber: 'invoiceNumber',
  date: 'date',
  supplierId: 'supplierId',
  warehouseId: 'warehouseId',
  totalAmount: 'totalAmount',
  taxAmount: 'taxAmount',
  discount: 'discount',
  netAmount: 'netAmount',
  status: 'status',
  isTaxInclusive: 'isTaxInclusive',
  journalVoucherId: 'journalVoucherId',
  attachmentUrl: 'attachmentUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceItemScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  productId: 'productId',
  unitId: 'unitId',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  total: 'total'
};

exports.Prisma.PurchaseItemScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  productId: 'productId',
  unitId: 'unitId',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  total: 'total'
};

exports.Prisma.StockTransferScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  transferNumber: 'transferNumber',
  date: 'date',
  fromWarehouseId: 'fromWarehouseId',
  toWarehouseId: 'toWarehouseId',
  status: 'status',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.StockTransferItemScalarFieldEnum = {
  id: 'id',
  transferId: 'transferId',
  productId: 'productId',
  quantity: 'quantity'
};

exports.Prisma.InventoryLogScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  productId: 'productId',
  warehouseId: 'warehouseId',
  unitId: 'unitId',
  unitName: 'unitName',
  date: 'date',
  type: 'type',
  quantity: 'quantity',
  referenceId: 'referenceId',
  description: 'description'
};

exports.Prisma.AccountScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  code: 'code',
  name: 'name',
  nameAr: 'nameAr',
  type: 'type',
  nature: 'nature',
  description: 'description',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JournalVoucherScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  reference: 'reference',
  date: 'date',
  description: 'description',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.JournalEntryScalarFieldEnum = {
  id: 'id',
  date: 'date',
  description: 'description',
  accountId: 'accountId',
  debit: 'debit',
  credit: 'credit',
  reference: 'reference',
  journalVoucherId: 'journalVoucherId',
  createdAt: 'createdAt'
};

exports.Prisma.TransactionVoucherScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  voucherNumber: 'voucherNumber',
  type: 'type',
  date: 'date',
  amount: 'amount',
  description: 'description',
  primaryAccountId: 'primaryAccountId',
  relatedAccountId: 'relatedAccountId',
  journalVoucherId: 'journalVoucherId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CompanyProfileScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  name: 'name',
  nameAr: 'nameAr',
  email: 'email',
  phone: 'phone',
  logo: 'logo',
  currency: 'currency',
  taxNumber: 'taxNumber',
  streetName: 'streetName',
  buildingNumber: 'buildingNumber',
  city: 'city',
  district: 'district',
  postalCode: 'postalCode',
  country: 'country',
  taxSupplyDateType: 'taxSupplyDateType',
  separateTaxAccounts: 'separateTaxAccounts',
  zatcaEnvironment: 'zatcaEnvironment',
  zatcaPrivateKey: 'zatcaPrivateKey',
  zatcaPublicKey: 'zatcaPublicKey',
  zatcaCsid: 'zatcaCsid',
  zatcaSecret: 'zatcaSecret',
  zatcaComplianceStatus: 'zatcaComplianceStatus',
  apiToken: 'apiToken',
  updatedAt: 'updatedAt'
};

exports.Prisma.SalesQuotationScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  quotationNumber: 'quotationNumber',
  date: 'date',
  validUntil: 'validUntil',
  customerId: 'customerId',
  warehouseId: 'warehouseId',
  totalAmount: 'totalAmount',
  taxAmount: 'taxAmount',
  discount: 'discount',
  netAmount: 'netAmount',
  status: 'status',
  isTaxInclusive: 'isTaxInclusive',
  convertedToInvoiceId: 'convertedToInvoiceId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuotationItemScalarFieldEnum = {
  id: 'id',
  quotationId: 'quotationId',
  productId: 'productId',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  total: 'total'
};

exports.Prisma.UnitOfMeasureScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  name: 'name',
  nameAr: 'nameAr',
  parentUnitId: 'parentUnitId',
  conversionFactor: 'conversionFactor'
};

exports.Prisma.CostCenterScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  code: 'code',
  name: 'name',
  nameAr: 'nameAr',
  description: 'description',
  productId: 'productId',
  quantityUsed: 'quantityUsed',
  yieldWeight: 'yieldWeight',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CostCenterItemScalarFieldEnum = {
  id: 'id',
  costCenterId: 'costCenterId',
  productId: 'productId',
  unitId: 'unitId',
  quantity: 'quantity',
  costPrice: 'costPrice',
  ratio: 'ratio'
};

exports.Prisma.ProductionOrderScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  orderNumber: 'orderNumber',
  date: 'date',
  productId: 'productId',
  quantity: 'quantity',
  warehouseId: 'warehouseId',
  status: 'status',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductionOrderItemScalarFieldEnum = {
  id: 'id',
  productionOrderId: 'productionOrderId',
  productId: 'productId',
  unitId: 'unitId',
  quantity: 'quantity',
  ratio: 'ratio',
  costPrice: 'costPrice'
};

exports.Prisma.UserScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  username: 'username',
  email: 'email',
  emailVerified: 'emailVerified',
  verificationToken: 'verificationToken',
  resetToken: 'resetToken',
  resetTokenExpiry: 'resetTokenExpiry',
  password: 'password',
  name: 'name',
  role: 'role',
  roleId: 'roleId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  permissions: 'permissions'
};

exports.Prisma.RoleScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  name: 'name',
  permissions: 'permissions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmployeeScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  code: 'code',
  name: 'name',
  nameAr: 'nameAr',
  jobTitle: 'jobTitle',
  jobTitleAr: 'jobTitleAr',
  department: 'department',
  basicSalary: 'basicSalary',
  idNumber: 'idNumber',
  idExpiry: 'idExpiry',
  joinDate: 'joinDate',
  status: 'status',
  phone: 'phone',
  email: 'email',
  address: 'address',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmployeeFinancialMoveScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  employeeId: 'employeeId',
  type: 'type',
  amount: 'amount',
  date: 'date',
  reason: 'reason',
  status: 'status',
  journalVoucherId: 'journalVoucherId',
  createdAt: 'createdAt'
};

exports.Prisma.SalaryPaymentScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  employeeId: 'employeeId',
  month: 'month',
  year: 'year',
  basicSalary: 'basicSalary',
  allowances: 'allowances',
  rewards: 'rewards',
  advances: 'advances',
  penalties: 'penalties',
  netSalary: 'netSalary',
  status: 'status',
  journalVoucherId: 'journalVoucherId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DisposalVoucherScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  voucherNumber: 'voucherNumber',
  date: 'date',
  productId: 'productId',
  warehouseId: 'warehouseId',
  unitId: 'unitId',
  quantity: 'quantity',
  reason: 'reason',
  notes: 'notes',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PurchaseOrderScalarFieldEnum = {
  companyId: 'companyId',
  id: 'id',
  orderNumber: 'orderNumber',
  date: 'date',
  supplierId: 'supplierId',
  warehouseId: 'warehouseId',
  totalAmount: 'totalAmount',
  taxAmount: 'taxAmount',
  discount: 'discount',
  netAmount: 'netAmount',
  status: 'status',
  isTaxInclusive: 'isTaxInclusive',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PurchaseOrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  unitId: 'unitId',
  supplierId: 'supplierId',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  total: 'total'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Company: 'Company',
  Customer: 'Customer',
  Supplier: 'Supplier',
  Warehouse: 'Warehouse',
  WarehouseStock: 'WarehouseStock',
  Product: 'Product',
  Category: 'Category',
  SalesInvoice: 'SalesInvoice',
  PurchaseInvoice: 'PurchaseInvoice',
  InvoiceItem: 'InvoiceItem',
  PurchaseItem: 'PurchaseItem',
  StockTransfer: 'StockTransfer',
  StockTransferItem: 'StockTransferItem',
  InventoryLog: 'InventoryLog',
  Account: 'Account',
  JournalVoucher: 'JournalVoucher',
  JournalEntry: 'JournalEntry',
  TransactionVoucher: 'TransactionVoucher',
  CompanyProfile: 'CompanyProfile',
  SalesQuotation: 'SalesQuotation',
  QuotationItem: 'QuotationItem',
  UnitOfMeasure: 'UnitOfMeasure',
  CostCenter: 'CostCenter',
  CostCenterItem: 'CostCenterItem',
  ProductionOrder: 'ProductionOrder',
  ProductionOrderItem: 'ProductionOrderItem',
  User: 'User',
  Role: 'Role',
  Employee: 'Employee',
  EmployeeFinancialMove: 'EmployeeFinancialMove',
  SalaryPayment: 'SalaryPayment',
  DisposalVoucher: 'DisposalVoucher',
  PurchaseOrder: 'PurchaseOrder',
  PurchaseOrderItem: 'PurchaseOrderItem'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
