import { RequestStatus } from '@/constants/requestStatus';

/**
 * 載入狀態類型
 * 用於追蹤不同狀態的資料是否已載入
 */
export type LoadStatus = Record<RequestStatus, boolean>;
