export type Action = 'view' | 'create' | 'edit' | 'delete';
export type Module = 
  | 'quotations' 
  | 'invoices' 
  | 'production' 
  | 'inventory' 
  | 'purchases' 
  | 'accounting' 
  | 'hr' 
  | 'settings' 
  | 'reports' 
  | 'contacts'
  | 'users';

export interface Permissions {
  [key: string]: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export const ALL_MODULES: Module[] = [
  'quotations', 
  'invoices', 
  'production', 
  'inventory', 
  'purchases', 
  'accounting', 
  'hr', 
  'settings', 
  'reports', 
  'contacts',
  'users'
];

export const MODULES = ALL_MODULES;
export const ACTIONS: Action[] = ['view', 'create', 'edit', 'delete'];

export interface PermissionGroup {
  name: string;
  nameAr: string;
  modules: Module[];
}

export const MODULE_GROUPS: PermissionGroup[] = [
  {
    name: 'Sales & Production',
    nameAr: 'المبيعات والإنتاج',
    modules: ['quotations', 'invoices', 'production']
  },
  {
    name: 'Purchases & Inventory',
    nameAr: 'المشتريات والمخزون',
    modules: ['purchases', 'inventory']
  },
  {
    name: 'Financial & HR',
    nameAr: 'المالية والموارد البشرية',
    modules: ['accounting', 'hr', 'contacts']
  },
  {
    name: 'System & Reports',
    nameAr: 'النظام والتقارير',
    modules: ['settings', 'reports', 'users']
  }
];

export const DEFAULT_PERMISSIONS: Permissions = {
  quotations: { view: false, create: false, edit: false, delete: false },
  invoices: { view: false, create: false, edit: false, delete: false },
  production: { view: false, create: false, edit: false, delete: false },
  inventory: { view: false, create: false, edit: false, delete: false },
  purchases: { view: false, create: false, edit: false, delete: false },
  accounting: { view: false, create: false, edit: false, delete: false },
  hr: { view: false, create: false, edit: false, delete: false },
  settings: { view: false, create: false, edit: false, delete: false },
  reports: { view: false, create: false, edit: false, delete: false },
  contacts: { view: false, create: false, edit: false, delete: false },
  users: { view: false, create: false, edit: false, delete: false },
};

export function hasPermission(
  userPermissions: any | string | null,
  module: Module,
  action: Action
): boolean {
  if (!userPermissions) return false;

  let perms: any;
  if (typeof userPermissions === 'string') {
    try {
      perms = JSON.parse(userPermissions);
    } catch (e) {
      console.error('Failed to parse user permissions', e);
      return false;
    }
  } else {
    perms = userPermissions;
  }

  const modulePerms = perms[module];
  if (!modulePerms) return false;

  if (Array.isArray(modulePerms)) {
    return modulePerms.includes(action);
  }
  
  return modulePerms[action] || false;
}

export function getRolePermissions(rolePermissionsStr: string | null): Permissions {
  if (!rolePermissionsStr) return DEFAULT_PERMISSIONS;
  try {
    const parsed = JSON.parse(rolePermissionsStr);
    return { ...DEFAULT_PERMISSIONS, ...parsed };
  } catch (e) {
    return DEFAULT_PERMISSIONS;
  }
}
