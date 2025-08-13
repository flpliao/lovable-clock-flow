import { MissedCheckInRequest } from '@/types/missedCheckInRequest';
import { create } from 'zustand';

// 所有忘記打卡申請 Store (管理員視角)
interface AllMissedCheckInRequestsState {
  requests: MissedCheckInRequest[];
  isLoading: boolean;
  error: string | null;

  setRequests: (requests: MissedCheckInRequest[]) => void;
  addRequest: (request: MissedCheckInRequest) => void;
  updateRequest: (id: string, updates: Partial<MissedCheckInRequest>) => void;
  removeRequest: (id: string) => void;
  getRequestById: (id: string) => MissedCheckInRequest | undefined;
  getRequestsByStatus: (status: string | string[]) => MissedCheckInRequest[];
  getRequestsByType: (missedType: string) => MissedCheckInRequest[];
  getRequestCounts: () => { total: number; byStatus: Record<string, number> };
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAllMissedCheckInRequestsStore = create<AllMissedCheckInRequestsState>(
  (set, get) => ({
    requests: [],
    isLoading: false,
    error: null,

    setRequests: requests => set({ requests }),

    addRequest: request => {
      const { requests } = get();
      set({ requests: [...requests, request] });
    },

    updateRequest: (id, updates) => {
      const { requests } = get();
      set({
        requests: requests.map(request =>
          request.id === id ? { ...request, ...updates } : request
        ),
      });
    },

    removeRequest: id => {
      const { requests } = get();
      set({ requests: requests.filter(request => request.id !== id) });
    },

    getRequestById: id => {
      const { requests } = get();
      return requests.find(request => request.id === id);
    },

    getRequestsByStatus: status => {
      const { requests } = get();
      if (Array.isArray(status)) {
        return requests.filter(request => status.includes(request.status));
      }
      return requests.filter(request => request.status === status);
    },

    getRequestsByType: requestType => {
      const { requests } = get();
      return requests.filter(request => request.request_type === requestType);
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

    setError: error => set({ error }),

    reset: () => set({ requests: [], isLoading: false, error: null }),
  })
);

// 我的忘記打卡申請 Store (員工視角)
interface MyMissedCheckInRequestsState {
  requests: MissedCheckInRequest[];
  isLoading: boolean;
  error: string | null;

  setRequests: (requests: MissedCheckInRequest[]) => void;
  addRequest: (request: MissedCheckInRequest) => void;
  updateRequest: (id: string, updates: Partial<MissedCheckInRequest>) => void;
  removeRequest: (id: string) => void;
  getRequestById: (id: string) => MissedCheckInRequest | undefined;
  getRequestsByStatus: (status: string | string[]) => MissedCheckInRequest[];
  getRequestCounts: () => { total: number; byStatus: Record<string, number> };
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useMyMissedCheckInRequestsStore = create<MyMissedCheckInRequestsState>((set, get) => ({
  requests: [],
  isLoading: false,
  error: null,

  setRequests: requests => set({ requests }),

  addRequest: request => {
    const { requests } = get();
    set({ requests: [...requests, request] });
  },

  updateRequest: (id, updates) => {
    const { requests } = get();
    set({
      requests: requests.map(request => (request.id === id ? { ...request, ...updates } : request)),
    });
  },

  removeRequest: id => {
    const { requests } = get();
    set({ requests: requests.filter(request => request.id !== id) });
  },

  getRequestById: id => {
    const { requests } = get();
    return requests.find(request => request.id === id);
  },

  getRequestsByStatus: status => {
    const { requests } = get();
    if (Array.isArray(status)) {
      return requests.filter(request => status.includes(request.status));
    }
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

  setError: error => set({ error }),

  reset: () => set({ requests: [], isLoading: false, error: null }),
}));
