import { MissedCheckInRequest } from '@/types/missedCheckInRequest';
import { create } from 'zustand';

interface MissedCheckInRequestsState {
  requests: MissedCheckInRequest[];
  isLoading: boolean;

  setRequests: (requests: MissedCheckInRequest[]) => void;
  mergeRequests: (requests: MissedCheckInRequest[]) => void;
  addRequest: (request: MissedCheckInRequest) => void;
  updateRequest: (id: string, updates: Partial<MissedCheckInRequest>) => void;
  removeRequest: (id: string) => void;
  getRequestById: (id: string) => MissedCheckInRequest | undefined;
  getRequestsByStatus: (status: string | string[]) => MissedCheckInRequest[];
  getRequestsByType: (missedType: string) => MissedCheckInRequest[];
  getRequestCounts: () => { total: number; byStatus: Record<string, number> };
  setLoading: (loading: boolean) => void;
  reset: () => void;
  getMyRequests: (employeeSlug: string) => MissedCheckInRequest[];
  getMyRequestsByStatus: (
    employeeSlug: string,
    status: string | string[]
  ) => MissedCheckInRequest[];
  getAllRequests: () => MissedCheckInRequest[];
}

const useMissedCheckInRequestsStore = create<MissedCheckInRequestsState>((set, get) => ({
  requests: [],
  isLoading: false,

  // 直接覆蓋整個 requests
  setRequests: requests => set({ requests }),

  // 合併資料：若 id 已存在則更新，不存在則新增
  mergeRequests: newRequests => {
    const { requests } = get();
    const map = new Map(requests.map(r => [r.id, r]));

    newRequests.forEach(r => {
      map.set(r.id, { ...map.get(r.id), ...r }); // update 或新增
    });

    set({ requests: Array.from(map.values()) });
  },

  addRequest: request => {
    const { requests } = get();
    if (!requests.some(r => r.id === request.id)) {
      set({ requests: [...requests, request] });
    }
  },

  updateRequest: (id, updates) => {
    const { requests } = get();
    set({
      requests: requests.map(r => (r.id === id ? { ...r, ...updates } : r)),
    });
  },

  removeRequest: id => {
    const { requests } = get();
    set({ requests: requests.filter(r => r.id !== id) });
  },

  getRequestById: id => {
    const { requests } = get();
    return requests.find(r => r.id === id);
  },

  getRequestsByStatus: status => {
    const { requests } = get();
    if (Array.isArray(status)) {
      return requests.filter(r => status.includes(r.status));
    }
    return requests.filter(r => r.status === status);
  },

  getRequestsByType: requestType => {
    const { requests } = get();
    return requests.filter(r => r.request_type === requestType);
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

  setLoading: loading => set({ isLoading: loading }),

  reset: () => set({ requests: [], isLoading: false }),

  getMyRequests: (employeeId: string) => {
    const { requests } = get();
    return requests.filter(r => r.employee_id === employeeId);
  },

  getMyRequestsByStatus: (employeeId: string, status: string | string[]) => {
    const { requests } = get();
    return requests.filter(r => r.employee_id === employeeId && status.includes(r.status));
  },

  getAllRequests: () => {
    const { requests } = get();
    return requests;
  },
}));

export default useMissedCheckInRequestsStore;
