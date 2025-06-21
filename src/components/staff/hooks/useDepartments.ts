
import { useState, useEffect } from 'react';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    // 擴展部門資料，包含更多實際使用的部門
    setDepartments([
      '人事部',
      '財務部', 
      '業務部',
      '技術部',
      '行銷部',
      '客服部',
      '總務部',
      '醫美診所-台南', // 根據截圖中看到的部門
      '資訊'
    ]);
  }, []);

  const getDepartmentNames = () => departments;

  return {
    departments,
    getDepartmentNames
  };
};
