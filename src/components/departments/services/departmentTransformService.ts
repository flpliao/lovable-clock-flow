
import { Department, NewDepartment } from '../types';

// 將 Supabase 資料格式轉換為前端格式
export const transformDepartmentData = (dbData: any): Department => ({
  id: dbData.id,
  name: dbData.name,
  type: dbData.type,
  location: dbData.location,
  managerName: dbData.manager_name,
  managerContact: dbData.manager_contact,
  staffCount: dbData.staff_count,
  created_at: dbData.created_at,
  updated_at: dbData.updated_at
});

// 將前端格式轉換為 Supabase 資料格式
export const transformToDbFormat = (frontendData: NewDepartment) => ({
  name: frontendData.name,
  type: frontendData.type,
  location: frontendData.location,
  manager_name: frontendData.managerName,
  manager_contact: frontendData.managerContact
});
