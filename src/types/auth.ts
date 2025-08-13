import { EmployeeRole } from '@/constants/employee';
import React from 'react';

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

// 路由接口定義
export interface RouteConfig {
  path: string;
  name: string;
  component: React.ComponentType;
  icon?: string;
  roles?: EmployeeRole[]; // 可訪問的角色列表
  children?: RouteConfig[]; // 支援子路由
}

// 角色守衛組件接口定義
export interface RoleGuardProps {
  requiredRoles: EmployeeRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean; // true: 需要所有角色, false: 需要任一角色
}
