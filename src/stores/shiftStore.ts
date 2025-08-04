import { Shift } from '@/types/shift';
import { create } from 'zustand';

interface ShiftState {
  shifts: Shift[];
  setShifts: (shifts: Shift[]) => void;
  addShift: (shift: Shift) => void;
  setShift: (slug: string, shiftData: Partial<Shift>) => void;
  removeShift: (slug: string) => void;
  getShiftBySlug: (slug: string) => Shift | undefined;
}

export const useShiftStore = create<ShiftState>()((set, get) => ({
  shifts: [],

  setShifts: (shifts: Shift[]) => set({ shifts }),

  addShift: (shift: Shift) => {
    const { shifts } = get();
    set({ shifts: [shift, ...shifts] });
  },

  setShift: (slug: string, shiftData: Partial<Shift>) => {
    const { shifts } = get();
    const updatedShifts = shifts.map(shift =>
      shift.slug === slug ? { ...shift, ...shiftData } : shift
    );
    set({ shifts: updatedShifts });
  },

  removeShift: (slug: string) => {
    const { shifts } = get();
    const filteredShifts = shifts.filter(shift => shift.slug !== slug);
    set({ shifts: filteredShifts });
  },

  getShiftBySlug: (slug: string) => {
    const { shifts } = get();
    return shifts.find(shift => shift.slug === slug);
  },
}));
