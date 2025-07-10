import { toast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { positionApiService } from '../services/positionApiService';
import { NewPosition, Position } from '../types';

export const useSupabasePositionOperations = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [newPosition, setNewPosition] = useState<NewPosition>({
    name: '',
    description: '',
  });

  // 篩選和排序狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 載入職位資料
  const loadPositions = async () => {
    try {
      setLoading(true);
      console.log('🔄 開始載入職位資料...');
      const data = await positionApiService.getPositions();
      setPositions(data);
      console.log('✅ 職位資料載入完成，共', data.length, '筆');
    } catch (error) {
      console.error('❌ 載入職位資料失敗:', error);
      toast({
        title: '載入失敗',
        description: '無法載入職位資料，請稍後再試',
        variant: 'destructive',
      });
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始載入
  useEffect(() => {
    console.log('🚀 useSupabasePositionOperations: 初始化載入職位資料...');
    loadPositions();
  }, []);

  // 篩選和排序邏輯
  const filteredPositions = positions
    .filter(
      p =>
        searchTerm === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a.name;
      const bValue = b.name;

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleAddPosition = async (): Promise<boolean> => {
    if (!newPosition.name.trim()) {
      toast({
        title: '驗證錯誤',
        description: '職位名稱為必填欄位',
        variant: 'destructive',
      });
      return false;
    }

    // 檢查是否重複
    if (positions.some(p => p.name === newPosition.name)) {
      toast({
        title: '驗證錯誤',
        description: '職位名稱已存在',
        variant: 'destructive',
      });
      return false;
    }

    try {
      console.log('🔄 開始新增職位:', newPosition);
      await positionApiService.addPosition(newPosition);
      await loadPositions(); // 重新載入資料
      setNewPosition({ name: '', description: '' });
      setIsAddDialogOpen(false);

      toast({
        title: '新增成功',
        description: `職位「${newPosition.name}」已新增`,
      });

      console.log('✅ 職位新增流程完成');
      return true;
    } catch (error) {
      console.error('❌ 新增職位失敗:', error);
      let errorMessage = '無法新增職位，請稍後再試';

      // 檢查特定錯誤類型
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMsg = error.message as string;
        if (errorMsg.includes('row-level security')) {
          errorMessage = '權限不足，請確認您有新增職位的權限';
        } else if (errorMsg.includes('duplicate')) {
          errorMessage = '職位名稱已存在，請使用其他名稱';
        }
      }

      toast({
        title: '新增失敗',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleEditPosition = async (): Promise<boolean> => {
    if (!currentPosition) return false;

    if (!currentPosition.name.trim()) {
      toast({
        title: '驗證錯誤',
        description: '職位名稱為必填欄位',
        variant: 'destructive',
      });
      return false;
    }

    // 檢查是否重複（排除自己）
    if (positions.some(p => p.name === currentPosition.name && p.id !== currentPosition.id)) {
      toast({
        title: '驗證錯誤',
        description: '職位名稱已存在',
        variant: 'destructive',
      });
      return false;
    }

    try {
      console.log('🔄 開始更新職位:', currentPosition);
      await positionApiService.updatePosition(currentPosition);
      await loadPositions(); // 重新載入資料
      setIsEditDialogOpen(false);
      setCurrentPosition(null);

      toast({
        title: '編輯成功',
        description: `職位「${currentPosition.name}」已更新`,
      });

      console.log('✅ 職位更新流程完成');
      return true;
    } catch (error) {
      console.error('❌ 更新職位失敗:', error);
      toast({
        title: '編輯失敗',
        description: '無法更新職位，請稍後再試',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleDeletePosition = async (id: string): Promise<boolean> => {
    const position = positions.find(p => p.id === id);
    if (!position) return false;

    try {
      console.log('🔄 開始刪除職位:', position);
      await positionApiService.deletePosition(id);
      await loadPositions(); // 重新載入資料

      toast({
        title: '刪除成功',
        description: `職位「${position.name}」已刪除`,
      });

      console.log('✅ 職位刪除流程完成');
      return true;
    } catch (error) {
      console.error('❌ 刪除職位失敗:', error);
      toast({
        title: '刪除失敗',
        description: '無法刪除職位，請稍後再試',
        variant: 'destructive',
      });
      return false;
    }
  };

  const openEditDialog = (position: Position) => {
    setCurrentPosition(position);
    setIsEditDialogOpen(true);
  };

  const refreshPositions = async () => {
    await loadPositions();
  };

  return {
    positions,
    filteredPositions,
    loading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentPosition,
    setCurrentPosition,
    newPosition,
    setNewPosition,
    handleAddPosition,
    handleEditPosition,
    handleDeletePosition,
    openEditDialog,
    refreshPositions,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };
};
