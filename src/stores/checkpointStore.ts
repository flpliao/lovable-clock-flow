import type { Checkpoint } from '@/services/checkpointService';
import { create } from 'zustand';

interface CheckpointState {
  checkpoints: Checkpoint[];
  setCheckpoints: (checkpoints: Checkpoint[]) => void;
  addCheckpoint: (checkpoint: Checkpoint) => void;
  updateCheckpoint: (id: number, checkpoint: Partial<Checkpoint>) => void;
  removeCheckpoint: (id: number) => void;
  clearCheckpoints: () => void;
}

export const useCheckpointStore = create<CheckpointState>()((set, get) => ({
  checkpoints: [],

  setCheckpoints: checkpoints => set({ checkpoints }),

  addCheckpoint: checkpoint => {
    const { checkpoints } = get();
    set({ checkpoints: [...checkpoints, checkpoint] });
  },

  updateCheckpoint: (id, checkpoint) => {
    const { checkpoints } = get();
    const newCheckpoints = checkpoints.map(cp => (cp.id === id ? { ...cp, ...checkpoint } : cp));
    set({ checkpoints: newCheckpoints });
  },

  removeCheckpoint: id => {
    const { checkpoints } = get();
    set({ checkpoints: checkpoints.filter(cp => cp.id !== id) });
  },

  clearCheckpoints: () => set({ checkpoints: [] }),
}));
