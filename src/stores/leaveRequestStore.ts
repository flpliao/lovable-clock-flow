import { RequestStatus } from '@/constants/requestStatus';
import { LeaveRequest } from '@/types/leaveRequest';
import { create } from 'zustand';

type LoadStatus = Record<RequestStatus, boolean>;
interface LeaveRequestsState {
  requestsBySlug: Record<string, LeaveRequest>;
  allSlugs: string[];
  mySlugs: string[];
  isLoaded: {
    all: LoadStatus;
    my: LoadStatus;
  };
  isLoading: boolean;

  addRequests: (requests: LeaveRequest[]) => void;
  addRequestsToMy: (requests: LeaveRequest[]) => void;
  addRequest: (request: LeaveRequest) => void;
  addRequestToMy: (request: LeaveRequest) => void;
  updateRequest: (slug: string, updates: Partial<LeaveRequest>) => void;
  removeRequest: (slug: string) => void;
  getRequestBySlug: (slug: string) => LeaveRequest | undefined;
  getRequestsByStatus: (statuses: RequestStatus[], forMy?: boolean) => LeaveRequest[];
  setLoading: (loading: boolean) => void;
  reset: () => void;
  getAllRequests: (forMy?: boolean) => LeaveRequest[];
  isAllLoaded: (statuses: RequestStatus[]) => boolean;
  isMyLoaded: (statuses: RequestStatus[]) => boolean;
  setMyLoaded: (statuses: RequestStatus[]) => void;
  setAllLoaded: (statuses: RequestStatus[]) => void;
}

const useLeaveRequestsStore = create<LeaveRequestsState>((set, get) => ({
  requestsBySlug: {},
  allSlugs: [],
  mySlugs: [],
  isLoaded: {
    all: Object.values(RequestStatus).reduce((acc, status) => {
      acc[status] = false;
      return acc;
    }, {} as LoadStatus),
    my: Object.values(RequestStatus).reduce((acc, status) => {
      acc[status] = false;
      return acc;
    }, {} as LoadStatus),
  },
  isLoading: false,

  addRequests: requests => {
    const { requestsBySlug, allSlugs } = get();
    const newRequestsBySlug = { ...requestsBySlug };
    const allSlugsSet = new Set(allSlugs);
    requests.forEach(r => {
      newRequestsBySlug[r.slug] = r;
      allSlugsSet.add(r.slug);
    });

    set({ requestsBySlug: newRequestsBySlug, allSlugs: Array.from(allSlugsSet) });
  },

  addRequest: request => {
    const { requestsBySlug, allSlugs } = get();
    if (requestsBySlug[request.slug]) return;

    const newRequestsBySlug = { ...requestsBySlug, [request.slug]: request };
    const newAllSlugs = [...allSlugs, request.slug];

    set({ requestsBySlug: newRequestsBySlug, allSlugs: newAllSlugs });
  },

  addRequestsToMy: requests => {
    const { mySlugs } = get();
    const newMySlugsSet = new Set(mySlugs);
    requests.forEach(r => newMySlugsSet.add(r.slug));

    set({ mySlugs: Array.from(newMySlugsSet) });
  },

  addRequestToMy: request => {
    const { mySlugs } = get();
    if (mySlugs.includes(request.slug)) return;

    const newMySlugs = [...mySlugs, request.slug];
    set({ mySlugs: newMySlugs });
  },

  updateRequest: (slug, updates) => {
    const { requestsBySlug } = get();
    if (!requestsBySlug[slug]) return;
    set({
      requestsBySlug: { ...requestsBySlug, [slug]: { ...requestsBySlug[slug], ...updates } },
    });
  },

  removeRequest: slug => {
    const { requestsBySlug, allSlugs, mySlugs } = get();
    const { [slug]: _removed, ...rest } = requestsBySlug;

    set({
      requestsBySlug: rest,
      allSlugs: allSlugs.filter(s => s !== slug),
      mySlugs: mySlugs.filter(s => s !== slug),
    });
  },

  getRequests: (forMy = false) => {
    const { requestsBySlug, allSlugs, mySlugs } = get();
    const slugs = forMy ? mySlugs : allSlugs;
    return slugs.map(slug => requestsBySlug[slug]).filter(r => r);
  },

  getRequestBySlug: slug => {
    const { requestsBySlug } = get();
    return requestsBySlug[slug];
  },

  getRequestsByStatus: (statuses, forMy = false) => {
    const { requestsBySlug, allSlugs, mySlugs } = get();
    const slugs = forMy ? mySlugs : allSlugs;
    return slugs.map(slug => requestsBySlug[slug]).filter(r => r && statuses.includes(r.status));
  },

  setLoading: loading => set({ isLoading: loading }),

  reset: () => {
    const resetStatus = Object.values(RequestStatus).reduce((acc, status) => {
      acc[status] = false;
      return acc;
    }, {} as LoadStatus);

    set({
      requestsBySlug: {},
      allSlugs: [],
      mySlugs: [],
      isLoaded: {
        all: resetStatus,
        my: resetStatus,
      },
      isLoading: false,
    });
  },

  getAllRequests: (forMy = false) => {
    const { requestsBySlug, allSlugs, mySlugs } = get();
    const slugs = forMy ? mySlugs : allSlugs;
    return slugs.map(slug => requestsBySlug[slug]);
  },

  isAllLoaded: (statuses: RequestStatus[]) => {
    const { isLoaded } = get();
    return statuses.every(status => isLoaded.all[status]);
  },

  isMyLoaded: (statuses: RequestStatus[]) => {
    const { isLoaded } = get();
    return statuses.every(status => isLoaded.my[status]);
  },

  setMyLoaded: (statuses: RequestStatus[]) => {
    const { isLoaded } = get();
    const newIsLoaded = { ...isLoaded };
    statuses.forEach(status => (newIsLoaded.my[status] = true));
    set({ isLoaded: newIsLoaded });
  },

  setAllLoaded: (statuses: RequestStatus[]) => {
    const { isLoaded } = get();
    const newIsLoaded = { ...isLoaded };
    statuses.forEach(status => (newIsLoaded.all[status] = true));
    set({ isLoaded: newIsLoaded });
  },
}));

export default useLeaveRequestsStore;
