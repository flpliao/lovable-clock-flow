// 登入請求參數
export interface LoginRequest {
  email: string;
  password: string;
  company_slug: string;
}

// 登入回應
export interface LoginResponse {
  accessToken: string;
}

// 使用者資訊
export interface Employee {
  slug: string;
  name: string;
  email: string;
  company_id: string;
  role: string;
  created_at: string;
  updated_at: string;
}
