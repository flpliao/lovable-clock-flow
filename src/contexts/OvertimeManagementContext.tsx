
import React, { createContext, useContext, ReactNode } from 'react';
import { useOvertimeManagement } from '@/hooks/useOvertimeManagement';
import { OvertimeRequest } from '@/types/overtime';

interface OvertimeManagementContextType {
  overtimeRequests: OvertimeRequest[];
  currentOvertimeRequest: OvertimeRequest | null;
  getOvertimeHistory: () => OvertimeRequest[];
  getPendingApprovals: () => OvertimeRequest[];
  createOvertimeRequest: (newRequest: OvertimeRequest) => void;
  updateOvertimeRequest: (updatedRequest: OvertimeRequest) => void;
  getOvertimeRequestById: (id: string) => OvertimeRequest | undefined;
  isApproverForRequest: (request: OvertimeRequest) => boolean;
}

const OvertimeManagementContext = createContext<OvertimeManagementContextType | undefined>(undefined);

export const useOvertimeManagementContext = () => {
  const context = useContext(OvertimeManagementContext);
  if (!context) {
    throw new Error('useOvertimeManagementContext must be used within an OvertimeManagementProvider');
  }
  return context;
};

interface OvertimeManagementProviderProps {
  children: ReactNode;
}

export const OvertimeManagementProvider: React.FC<OvertimeManagementProviderProps> = ({ children }) => {
  const overtimeManagement = useOvertimeManagement();

  return (
    <OvertimeManagementContext.Provider value={overtimeManagement}>
      {children}
    </OvertimeManagementContext.Provider>
  );
};
