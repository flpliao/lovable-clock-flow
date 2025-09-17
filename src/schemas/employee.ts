import { Gender } from '@/constants/gender';
import * as z from 'zod';

// 密碼驗證 schema
export const passwordSchema = z
  .object({
    password: z.string().min(1, '請輸入密碼').min(8, '密碼至少8碼').max(50, '密碼最多50個字元'),
    password_confirmation: z
      .string()
      .min(1, '請確認密碼')
      .min(8, '密碼至少8碼')
      .max(50, '密碼最多50個字元'),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: '密碼確認不一致',
    path: ['password_confirmation'],
  });

// 員工表單 schema（用於編輯，不包含密碼）
export const employeeFormSchema = z.object({
  no: z.string().min(1, '工號不能為空').max(50, '工號最多50個字元'),
  gender: z.nativeEnum(Gender, {
    required_error: '請選擇性別',
    invalid_type_error: '請選擇有效的性別',
  }),
  name: z.string().min(1, '姓名不能為空').max(50, '姓名最多50個字元'),
  email: z.string().email('請輸入有效的電子郵件').min(1, '電子郵件不能為空'),
  department_slug: z.string().min(1, '請選擇單位'),
  role_name: z.string().min(1, '請選擇權限'),
  direct_manager_slug: z.string().optional().or(z.literal('')),
  start_date: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
});

// 員工新增表單 schema（包含密碼）
export const createEmployeeFormSchema = employeeFormSchema.and(passwordSchema);

// 推斷型別
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
export type CreateEmployeeFormData = z.infer<typeof createEmployeeFormSchema>;
