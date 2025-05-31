
import { useState, useEffect } from 'react';
import { positionApiService } from '@/components/positions/services/positionApiService';

interface Position {
  id: string;
  name: string;
  description?: string;
  level: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useSupabasePositions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPositions = async () => {
      try {
        console.log('📋 員工管理：載入職位資料...');
        const data = await positionApiService.getPositions();
        setPositions(data);
        console.log('✅ 員工管理：職位資料載入成功');
      } catch (error) {
        console.error('❌ 員工管理：載入職位資料失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPositions();
  }, []);

  // 獲取活躍職位列表
  const getActivePositions = () => {
    return positions
      .filter(p => p.is_active)
      .sort((a, b) => b.level - a.level); // 按職級由高到低排序
  };

  // 獲取職位名稱列表（用於現有的 Select 組件）
  const getPositionNames = () => {
    return getActivePositions().map(p => p.name);
  };

  // 根據名稱獲取職位
  const getPositionByName = (name: string) => {
    return positions.find(p => p.name === name);
  };

  // 根據ID獲取職位
  const getPositionById = (id: string) => {
    return positions.find(p => p.id === id);
  };

  return {
    positions: getActivePositions(),
    loading,
    getActivePositions,
    getPositionNames,
    getPositionByName,
    getPositionById
  };
};
