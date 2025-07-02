import { AnnualLeaveBalance } from '@/types';

export interface User {
  id: string;
  name: string;
  position: string;
  department: string;
  onboard_date: string;
  hire_date?: string;
  supervisor_id?: string;
  role_id: string;
  email?: string;
}

export interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  annualLeaveBalance: AnnualLeaveBalance | null;
  setAnnualLeaveBalance: (balance: AnnualLeaveBalance | null) => void;
  isAdmin: () => boolean;
  isManager: () => boolean;
  hasPermission: (permission: string) => Promise<boolean>;
  canManageUser: (targetUserId: string) => boolean;
  isUserLoaded: boolean;
  resetUserState: () => Promise<void>;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}
