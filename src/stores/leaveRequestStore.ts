import { LeaveRequest } from '@/types';
import { create } from 'zustand';

interface LeaveRequestsState {
  requests: LeaveRequest[];
  isLoading: boolean;

  setRequests: (requests: LeaveRequest[]) => void;
  mergeRequests: (requests: LeaveRequest[]) => void;
  addRequest: (request: LeaveRequest) => void;
  updateRequest: (slug: string, updates: Partial<LeaveRequest>) => void;
  removeRequest: (slug: string) => void;
  getRequestBySlug: (slug: string) => LeaveRequest | undefined;
  getRequestsByStatus: (status: string | string[]) => LeaveRequest[];
  getRequestCounts: () => { total: number; byStatus: Record<string, number> };
  setLoading: (loading: boolean) => void;
  reset: () => void;
  getAllRequests: () => LeaveRequest[];
}

const useLeaveRequestsStore = create<LeaveRequestsState>((set, get) => ({
  requests: [],
  isLoading: false,

  // 直接覆蓋整個 requests
  setRequests: requests => set({ requests }),

  // 合併資料：若 slug 已存在則更新，不存在則新增
  mergeRequests: newRequests => {
    const { requests } = get();
    const map = new Map(requests.map(r => [r.slug, r]));

    newRequests.forEach(r => {
      map.set(r.slug, { ...map.get(r.slug), ...r }); // update 或新增
    });

    set({ requests: Array.from(map.values()) });
  },

  addRequest: request => {
    const { requests } = get();
    if (!requests.some(r => r.slug === request.slug)) {
      set({ requests: [...requests, request] });
    }
  },

  updateRequest: (slug, updates) => {
    const { requests } = get();
    set({
      requests: requests.map(r => (r.slug === slug ? { ...r, ...updates } : r)),
    });
  },

  removeRequest: slug => {
    const { requests } = get();
    set({ requests: requests.filter(r => r.slug !== slug) });
  },

  setLoading: loading => set({ isLoading: loading }),

  reset: () => set({ requests: [], isLoading: false }),

  getRequestBySlug: slug => {
    const { requests } = get();
    return requests.find(r => r.slug === slug);
  },

  getRequestsByStatus: status => {
    const { requests } = get();

    if (Array.isArray(status)) {
      return requests.filter(r => status.includes(r.status));
    }
    return requests.filter(r => r.status === status);
  },

  getRequestCounts: () => {
    const { requests } = get();
    const byStatus = requests.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return { total: requests.length, byStatus };
  },

  getAllRequests: () => {
    const { requests } = get();
    return requests;
  },
}));

export default useLeaveRequestsStore;
