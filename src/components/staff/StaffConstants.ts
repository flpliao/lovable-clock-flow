
export const departments = [
  '人資部', 
  '技術部', 
  '設計部', 
  '行銷部', 
  '客服部', 
  '總部人資部', 
  '信義區門市', 
  '西門門市'
];

// 職位現在從職位管理系統動態獲取，保留此處僅作為備用
export const positions = [
  '主管', 
  '工程師', 
  '設計師', 
  '專員', 
  '資深工程師', 
  '行銷專員', 
  '客服專員', 
  '門市經理', 
  '門市人員'
];

// Explicitly type the roles array to ensure compatibility with Staff type
export const roles: { value: 'user' | 'admin'; label: string }[] = [
  { value: 'user', label: '一般使用者' },
  { value: 'admin', label: '管理員' }
];
