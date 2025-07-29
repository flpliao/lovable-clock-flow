import type { CheckInPoint } from '@/types/checkIn';
import { create } from 'zustand';

interface CheckInPointState {
  checkInPoints: CheckInPoint[];
  setCheckInPoints: (checkInPoints: CheckInPoint[]) => void;
  addCheckInPoint: (checkInPoint: CheckInPoint) => void;
  updateCheckInPoint: (id: string, checkInPoint: Partial<CheckInPoint>) => void;
  removeCheckInPoint: (id: string) => void;
  clearCheckInPoints: () => void;
}

export const useCheckInPointStore = create<CheckInPointState>()((set, get) => ({
  checkInPoints: [],

  setCheckInPoints: checkInPoints => set({ checkInPoints }),

  addCheckInPoint: checkInPoint => {
    const { checkInPoints } = get();
    set({ checkInPoints: [...checkInPoints, checkInPoint] });
  },

  updateCheckInPoint: (id, checkInPoint) => {
    const { checkInPoints } = get();
    const newCheckInPoints = checkInPoints.map(cp =>
      cp.id === id ? { ...cp, ...checkInPoint } : cp
    );
    set({ checkInPoints: newCheckInPoints });
  },

  removeCheckInPoint: id => {
    const { checkInPoints } = get();
    set({ checkInPoints: checkInPoints.filter(cp => cp.id !== id) });
  },

  clearCheckInPoints: () => set({ checkInPoints: [] }),
}));
