export type Role = 'Admin' | 'SiteManager' | 'Accountant' | 'Employee';

export const PERMISSIONS = {
  // User Management
  MANAGE_USERS: ['Admin', 'SiteManager'],
  MANAGE_SETTINGS: ['Admin', 'SiteManager'],
  MANAGE_FINANCIALS: ['Admin', 'SiteManager', 'Accountant'],
  MANAGE_INVENTORY: ['Admin', 'SiteManager'],

  // Invoices (Sales & Purchases)
  DELETE_INVOICE: ['Admin', 'SiteManager'],
  EDIT_INVOICE: ['Admin', 'SiteManager', 'Accountant'],
  CREATE_INVOICE: ['Admin', 'SiteManager', 'Accountant', 'Employee'],

  // Quotations
  DELETE_QUOTATION: ['Admin', 'SiteManager'],
  EDIT_QUOTATION: ['Admin', 'SiteManager', 'Accountant', 'Employee'],
  CREATE_QUOTATION: ['Admin', 'SiteManager', 'Accountant', 'Employee'],

  // Journal and Financial
  DELETE_JOURNAL: ['Admin', 'SiteManager', 'Accountant'],
  EDIT_JOURNAL: ['Admin', 'SiteManager', 'Accountant'],
  CREATE_JOURNAL: ['Admin', 'SiteManager', 'Accountant'],

  // Ledger and Accounts
  MANAGE_ACCOUNTS: ['Admin', 'SiteManager', 'Accountant'],

  // Inventory and Products
  MANAGE_PRODUCTS: ['Admin', 'SiteManager'],
  DELETE_PRODUCT: ['Admin', 'SiteManager'],
  
  // Contacts (Customers/Suppliers)
  MANAGE_CONTACTS: ['Admin', 'SiteManager', 'Accountant', 'Employee'],
  DELETE_CONTACT: ['Admin', 'SiteManager'],
};

export function hasPermission(userOrRole: string | { role: string; permissions?: string | null } | undefined | null, permission: keyof typeof PERMISSIONS): boolean {
  if (!userOrRole) return false;
  
  let role: string;
  let customPermissions: string | null = null;
  
  if (typeof userOrRole === 'string') {
    role = userOrRole;
  } else {
    role = userOrRole.role;
    customPermissions = userOrRole.permissions || null;
  }

  // Site Managers and Admins always have all permissions
  if (role === 'Admin' || role === 'SiteManager') return true;

  const allowedRoles = PERMISSIONS[permission] as string[];
  if (Array.isArray(allowedRoles) && allowedRoles.includes(role)) return true;

  if (customPermissions) {
    try {
      const perms = JSON.parse(customPermissions);
      if (Array.isArray(perms) && perms.includes(permission)) return true;
    } catch (e) {}
  }
  
  return false;
}

export const ROLE_NAMES = {
  Admin: { ar: 'المدير العام', en: 'General Manager' },
  SiteManager: { ar: 'مسؤول الموقع', en: 'Site Manager' },
  Accountant: { ar: 'محاسب', en: 'Accountant' },
  Employee: { ar: 'موظف', en: 'Employee' },
};
