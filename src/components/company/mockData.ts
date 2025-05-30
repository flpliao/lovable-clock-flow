
import { Company, Branch } from '@/types/company';

// 保留基本公司資料作為範本，但可以修改為正式資料
export const mockCompany: Company = {
  id: '1',
  name: '請輸入公司名稱',
  registration_number: '請輸入統一編號',
  address: '請輸入公司地址',
  phone: '請輸入聯絡電話',
  email: 'info@company.com',
  website: 'https://company.com',
  established_date: '2020-01-15',
  capital: 10000000,
  business_type: '請輸入營業項目',
  legal_representative: '請輸入負責人姓名',
  created_at: '2020-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z'
};

// 清空營業處資料，準備輸入正式資料
export const mockBranches: Branch[] = [];
