import { DefaultLeaveType } from '@/types/leaveType';
import { getDefaultLeaveTypes } from '@/services/leaveTypeService';
import { create } from 'zustand';

interface DefaultLeaveTypeState {
  defaultLeaveTypes: DefaultLeaveType[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;

  // 基本操作
  setDefaultLeaveTypes: (defaultLeaveTypes: DefaultLeaveType[]) => void;
  fetchDefaultLeaveTypes: () => Promise<void>;

  // 載入狀態管理
  setLoading: (loading: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  setError: (error: string | null) => void;

  // 查詢方法
  getDefaultLeaveTypeByCode: (code: string) => DefaultLeaveType | undefined;
  getDefaultLeaveTypeById: (id: number) => DefaultLeaveType | undefined;

  // 重置
  reset: () => void;
}

const useDefaultLeaveTypeStore = create<DefaultLeaveTypeState>()((set, get) => ({
  defaultLeaveTypes: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  // 基本操作
  setDefaultLeaveTypes: (defaultLeaveTypes: DefaultLeaveType[]) =>
    set({ defaultLeaveTypes, isLoaded: true, error: null }),

  fetchDefaultLeaveTypes: async () => {
    const { isLoading, isLoaded } = get();

    // 防止重複呼叫
    if (isLoading || isLoaded) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const data = await getDefaultLeaveTypes();
      set({
        defaultLeaveTypes: data,
        isLoaded: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入預設假別類型失敗';
      set({
        error: errorMessage,
        isLoading: false,
        isLoaded: false,
      });
      throw error;
    }
  },

  // 載入狀態管理
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setLoaded: (isLoaded: boolean) => set({ isLoaded }),
  setError: (error: string | null) => set({ error }),

  // 查詢方法
  getDefaultLeaveTypeByCode: (code: string) => {
    const { defaultLeaveTypes } = get();
    return defaultLeaveTypes.find(type => type.code === code);
  },

  getDefaultLeaveTypeById: (id: number) => {
    const { defaultLeaveTypes } = get();
    return defaultLeaveTypes.find(type => type.id === id);
  },

  // 重置
  reset: () =>
    set({
      defaultLeaveTypes: [],
      isLoading: false,
      isLoaded: false,
      error: null,
    }),
}));

export default useDefaultLeaveTypeStore;
