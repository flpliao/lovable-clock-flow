import { LeaveRequest } from '@/types';
import { create } from 'zustand';

// 所有請假申請 Store (管理員視角)
interface AllLeaveRequestsState {
  requests: LeaveRequest[];
  isLoading: boolean;

  setRequests: (requests: LeaveRequest[]) => void;
  addRequest: (request: LeaveRequest) => void;
  updateRequest: (slug: string, updates: Partial<LeaveRequest>) => void;
  removeRequest: (slug: string) => void;
  getRequestBySlug: (slug: string) => LeaveRequest | undefined;
  getRequestsByStatus: (status: string) => LeaveRequest[];
  getRequestsByType: (leaveType: string) => LeaveRequest[];
  getRequestCounts: () => { total: number; byStatus: Record<string, number> };
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAllLeaveRequestsStore = create<AllLeaveRequestsState>((set, get) => ({
  requests: [],
  isLoading: false,

  setRequests: requests => set({ requests }),

  addRequest: request => {
    const { requests } = get();
    set({ requests: [...requests, request] });
  },

  updateRequest: (slug, updates) => {
    const { requests } = get();
    set({
      requests: requests.map(request =>
        request.slug === slug ? { ...request, ...updates } : request
      ),
    });
  },

  removeRequest: slug => {
    const { requests } = get();
    set({ requests: requests.filter(request => request.slug !== slug) });
  },

  getRequestBySlug: slug => {
    const { requests } = get();
    return requests.find(request => request.slug === slug);
  },

  getRequestsByStatus: status => {
    const { requests } = get();
    return requests.filter(request => request.status === status);
  },

  getRequestsByType: leaveTypeId => {
    const { requests } = get();
    return requests.filter(request => request.leave_type_id === leaveTypeId);
  },

  getRequestCounts: () => {
    const { requests } = get();
    const byStatus = requests.reduce(
      (acc, request) => {
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return { total: requests.length, byStatus };
  },

  setLoading: loading => set({ isLoading: loading }),

  reset: () => set({ requests: [], isLoading: false }),
}));

// 我的請假申請 Store (員工視角)
interface MyLeaveRequestsState {
  requests: LeaveRequest[];
  isLoading: boolean;

  setRequests: (requests: LeaveRequest[]) => void;
  addRequest: (request: LeaveRequest) => void;
  updateRequest: (slug: string, updates: Partial<LeaveRequest>) => void;
  removeRequest: (slug: string) => void;
  getRequestBySlug: (slug: string) => LeaveRequest | undefined;
  getRequestsByStatus: (status: string) => LeaveRequest[];
  getRequestCounts: () => { total: number; byStatus: Record<string, number> };
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useMyLeaveRequestsStore = create<MyLeaveRequestsState>((set, get) => ({
  requests: [],
  isLoading: false,

  setRequests: requests => set({ requests }),

  addRequest: request => {
    const { requests } = get();
    set({ requests: [...requests, request] });
  },

  updateRequest: (slug, updates) => {
    const { requests } = get();
    set({
      requests: requests.map(request =>
        request.slug === slug ? { ...request, ...updates } : request
      ),
    });
  },

  removeRequest: slug => {
    const { requests } = get();
    set({ requests: requests.filter(request => request.slug !== slug) });
  },

  getRequestBySlug: slug => {
    const { requests } = get();
    return requests.find(request => request.slug === slug);
  },

  getRequestsByStatus: status => {
    const { requests } = get();
    return requests.filter(request => request.status === status);
  },

  getRequestCounts: () => {
    const { requests } = get();
    const byStatus = requests.reduce(
      (acc, request) => {
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return { total: requests.length, byStatus };
  },

  setLoading: loading => set({ isLoading: loading }),

  reset: () => set({ requests: [], isLoading: false }),
}));

// 待審核請假申請 Store (主管視角)
interface PendingApprovalsState {
  requests: LeaveRequest[];
  isLoading: boolean;

  setRequests: (requests: LeaveRequest[]) => void;
  addRequest: (request: LeaveRequest) => void;
  updateRequest: (slug: string, updates: Partial<LeaveRequest>) => void;
  removeRequest: (slug: string) => void;
  getRequestBySlug: (slug: string) => LeaveRequest | undefined;
  getRequestCounts: () => { total: number; byStatus: Record<string, number> };
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const usePendingApprovalsStore = create<PendingApprovalsState>((set, get) => ({
  requests: [],
  isLoading: false,

  setRequests: requests => set({ requests }),

  addRequest: request => {
    const { requests } = get();
    set({ requests: [...requests, request] });
  },

  updateRequest: (slug, updates) => {
    const { requests } = get();
    set({
      requests: requests.map(request =>
        request.slug === slug ? { ...request, ...updates } : request
      ),
    });
  },

  removeRequest: slug => {
    const { requests } = get();
    set({ requests: requests.filter(request => request.slug !== slug) });
  },

  getRequestBySlug: slug => {
    const { requests } = get();
    return requests.find(request => request.slug === slug);
  },

  getRequestCounts: () => {
    const { requests } = get();
    const byStatus = requests.reduce(
      (acc, request) => {
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return { total: requests.length, byStatus };
  },

  setLoading: loading => set({ isLoading: loading }),

  reset: () => set({ requests: [], isLoading: false }),
}));
