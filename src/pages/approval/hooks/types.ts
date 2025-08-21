
import { LeaveRequest } from '@/types';

export interface LeaveRequestWithApplicant extends LeaveRequest {
  applicant_name?: string;
  approvals?: any[];
}

export interface UseLeaveRequestsDataProps {
  currentUser: any;
  toast: any;
  setPendingRequests: React.Dispatch<React.SetStateAction<LeaveRequestWithApplicant[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UseLeaveRequestsActionsProps {
  currentUser: any;
  toast: any;
  setPendingRequests: React.Dispatch<React.SetStateAction<LeaveRequestWithApplicant[]>>;
}
