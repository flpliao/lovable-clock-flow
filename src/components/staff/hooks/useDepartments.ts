
import { useState, useEffect } from 'react';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    // 模擬部門資料，實際應從API獲取
    setDepartments([
      '人事部',
      '財務部',
      '業務部',
      '技術部',
      '行銷部',
      '客服部',
      '總務部'
    ]);
  }, []);

  const getDepartmentNames = () => departments;

  return {
    departments,
    getDepartmentNames
  };
};
