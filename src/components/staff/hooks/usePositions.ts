
import { useState, useEffect } from 'react';
import { Position } from '@/components/positions/types';
import { getGlobalPositions } from '@/components/positions/hooks/usePositionManagement';

export const usePositions = () => {
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    // 從全局職位狀態獲取職位列表
    const globalPositions = getGlobalPositions();
    setPositions(globalPositions);
  }, []);

  // 獲取活躍職位列表
  const getActivePositions = () => {
    const globalPositions = getGlobalPositions();
    return globalPositions
      .filter(p => p.is_active)
      .sort((a, b) => b.level - a.level); // 按職級由高到低排序
  };

  // 獲取職位名稱列表（用於現有的 Select 組件）
  const getPositionNames = () => {
    return getActivePositions().map(p => p.name);
  };

  return {
    positions: getActivePositions(),
    setPositions,
    getActivePositions,
    getPositionNames
  };
};
