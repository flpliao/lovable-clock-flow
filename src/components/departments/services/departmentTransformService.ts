
import { Department, NewDepartment } from '../types';

// 將 Supabase 資料格式轉換為前端格式
export const transformDepartmentData = (dbData: any): Department => ({
  id: dbData.id,
  name: dbData.name,
  type: dbData.type,
  location: dbData.location,
  manager_name: dbData.manager_name,
  manager_contact: dbData.manager_contact,
  staff_count: dbData.staff_count,
  created_at: dbData.created_at,
  updated_at: dbData.updated_at
});

// 將前端格式轉換為 Supabase 資料格式
export const transformToDbFormat = (frontendData: NewDepartment) => ({
  name: frontendData.name,
  type: frontendData.type,
  location: frontendData.location,
  manager_name: frontendData.manager_name,
  manager_contact: frontendData.manager_contact
});
