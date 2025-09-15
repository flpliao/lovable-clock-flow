import type { CheckInPoint } from '@/types/checkIn';
import { create } from 'zustand';

interface CheckInPointState {
  checkInPoints: CheckInPoint[];
  currentPos: { latitude: number; longitude: number } | null;
  setCheckInPoints: (checkInPoints: CheckInPoint[]) => void;
  addCheckInPoint: (checkInPoint: CheckInPoint) => void;
  setCheckInPoint: (id: string, checkInPoint: Partial<CheckInPoint>) => void;
  removeCheckInPoint: (id: string) => void;
  clearCheckInPoints: () => void;
  setCurrentPos: (pos: { latitude: number; longitude: number } | null) => void;
}

export const useCheckInPointStore = create<CheckInPointState>()((set, get) => ({
  checkInPoints: [],
  currentPos: null,

  setCheckInPoints: checkInPoints => set({ checkInPoints }),

  setCurrentPos: pos => set({ currentPos: pos }),

  addCheckInPoint: checkInPoint => {
    const { checkInPoints } = get();
    set({ checkInPoints: [...checkInPoints, checkInPoint] });
  },

  setCheckInPoint: (id, checkInPoint) => {
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
