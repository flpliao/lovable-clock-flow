
import { AnnualLeaveBalance } from '@/types';

export interface User {
  id: string;
  name: string;
  position: string;
  department: string;
  onboard_date: string;
  hire_date?: string;
  supervisor_id?: string;
  role: string;
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
  canManageUser: (userId: string) => boolean;
  isUserLoaded: boolean;
  userError: string | null;
  clearUserError: () => void;
  resetUserState: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  setUserError: (error: string | null) => void;
}
