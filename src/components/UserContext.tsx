'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Module, Action, hasPermission, Permissions } from '@/lib/permissions';

interface UserContextType {
  user: any;
  canAccess: (module: Module, action?: Action) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, user }: { children: ReactNode; user: any }) {
  const canAccess = (module: Module, action: Action = 'view') => {
    if (!user) return false;
    if (user.role === 'Admin' || user.role === 'SuperAdmin') return true;
    
    // Pass the full user object to the central permission utility
    return hasPermission(user, module, action);
  };

  return (
    <UserContext.Provider value={{ user, canAccess }}>
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
