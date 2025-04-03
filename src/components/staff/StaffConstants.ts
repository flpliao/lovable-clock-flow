
export const departments = ['人資部', '技術部', '設計部', '行銷部', '客服部'];
export const positions = ['主管', '工程師', '設計師', '專員', '資深工程師', '行銷專員', '客服專員'];

// Explicitly type the roles array to ensure compatibility with Staff type
export const roles: { value: 'user' | 'admin'; label: string }[] = [
  { value: 'user', label: '一般使用者' },
  { value: 'admin', label: '管理員' }
];
