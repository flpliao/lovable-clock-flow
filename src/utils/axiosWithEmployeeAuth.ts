import { isAuthError } from '@/constants/errorCodes';
import useEmployeeStore from '@/stores/employeeStore';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// 創建全域的 axios 實例
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// 全域響應攔截器 - 處理驗證失敗
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // 檢查是否為驗證相關的錯誤
    if (isAuthError(error.response?.status)) {
      // 將用戶狀態設為未驗證，這樣 ProtectedRoute 會自動跳轉
      useEmployeeStore.getState().reset();
    }

    return Promise.reject(error);
  }
);

// 請求攔截器 - 自動添加 token
axiosInstance.interceptors.request.use(
  config => {
    const token = useEmployeeStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const axiosWithEmployeeAuth = (token = null) => {
  // 如果提供了特定 token，創建一個臨時實例
  if (token) {
    const tempInstance = axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 為臨時實例添加相同的響應攔截器
    tempInstance.interceptors.response.use(
      response => response,
      error => {
        if (isAuthError(error.response?.status)) {
          useEmployeeStore.getState().reset();
        }
        return Promise.reject(error);
      }
    );

    return tempInstance;
  }

  // 否則返回全域實例
  return axiosInstance;
};
