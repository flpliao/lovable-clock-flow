
import { useState, useEffect } from 'react';

interface Branch {
  value: string;
  label: string;
}

export const useBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    // 模擬分店資料，實際應從API獲取
    setBranches([
      { value: '1', label: '總公司' },
      { value: '2', label: '台北分店' },
      { value: '3', label: '台中分店' },
      { value: '4', label: '高雄分店' },
      { value: '5', label: '桃園分店' }
    ]);
  }, []);

  const getBranchOptions = () => branches;

  return {
    branches,
    getBranchOptions
  };
};
