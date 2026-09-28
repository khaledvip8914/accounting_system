'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Module, Action, hasPermission, Permissions } from '@/lib/permissions';

interface UserContextType {
  user: any;
  subscriptionPlan: any;
  canAccess: (module: Module, action?: Action) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, user, subscriptionPlan }: { children: ReactNode; user: any; subscriptionPlan?: any }) {
  const canAccess = (module: Module, action: Action = 'view') => {
    if (!user) return false;
    const roleName = user.role || user.roleRef?.name;
    if (roleName === 'Admin' || roleName === 'SuperAdmin' || roleName === 'مدير النظام (Admin)') return true;
    
    // Pass the full user object to the central permission utility
    return hasPermission(user, module, action);
  };

  return (
    <UserContext.Provider value={{ user, subscriptionPlan, canAccess }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
