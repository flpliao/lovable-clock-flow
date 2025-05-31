import { useState } from 'react';
import { Position, NewPosition } from '../types';
import { toast } from '@/hooks/use-toast';

export const usePositionManagement = () => {
  const [positions, setPositions] = useState<Position[]>([
    { id: '1', name: '主管', level: 10, is_active: true },
    { id: '2', name: '工程師', level: 5, is_active: true },
    { id: '3', name: '設計師', level: 5, is_active: true },
    { id: '4', name: '專員', level: 3, is_active: true },
    { id: '5', name: '資深工程師', level: 7, is_active: true },
    { id: '6', name: '行銷專員', level: 3, is_active: true },
    { id: '7', name: '客服專員', level: 3, is_active: true },
    { id: '8', name: '門市經理', level: 8, is_active: true },
    { id: '9', name: '門市人員', level: 2, is_active: true },
  ]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [newPosition, setNewPosition] = useState<NewPosition>({
    name: '',
    description: '',
    level: 1
  });
  
  // 新增篩選和排序狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'level'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 篩選和排序邏輯
  const filteredPositions = positions
    .filter(p => p.is_active)
    .filter(p => 
      searchTerm === '' || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else {
        aValue = a.level;
        bValue = b.level;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleAddPosition = async (): Promise<boolean> => {
    if (!newPosition.name.trim()) {
      toast({
        title: "驗證錯誤",
        description: "職位名稱為必填欄位",
        variant: "destructive",
      });
      return false;
    }

    // 檢查是否重複
    if (positions.some(p => p.name === newPosition.name && p.is_active)) {
      toast({
        title: "驗證錯誤",
        description: "職位名稱已存在",
        variant: "destructive",
      });
      return false;
    }

    const position: Position = {
      id: Date.now().toString(),
      ...newPosition,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setPositions(prev => [...prev, position]);
    setNewPosition({ name: '', description: '', level: 1 });
    setIsAddDialogOpen(false);
    
    toast({
      title: "新增成功",
      description: `職位「${position.name}」已新增`,
    });

    return true;
  };

  const handleEditPosition = async (): Promise<boolean> => {
    if (!currentPosition) return false;

    if (!currentPosition.name.trim()) {
      toast({
        title: "驗證錯誤",
        description: "職位名稱為必填欄位",
        variant: "destructive",
      });
      return false;
    }

    // 檢查是否重複（排除自己）
    if (positions.some(p => p.name === currentPosition.name && p.id !== currentPosition.id && p.is_active)) {
      toast({
        title: "驗證錯誤",
        description: "職位名稱已存在",
        variant: "destructive",
      });
      return false;
    }

    setPositions(prev => prev.map(p => 
      p.id === currentPosition.id 
        ? { ...currentPosition, updated_at: new Date().toISOString() }
        : p
    ));

    setIsEditDialogOpen(false);
    setCurrentPosition(null);
    
    toast({
      title: "編輯成功",
      description: `職位「${currentPosition.name}」已更新`,
    });

    return true;
  };

  const handleDeletePosition = async (id: string): Promise<boolean> => {
    const position = positions.find(p => p.id === id);
    if (!position) return false;

    setPositions(prev => prev.map(p => 
      p.id === id ? { ...p, is_active: false } : p
    ));
    
    toast({
      title: "刪除成功",
      description: `職位「${position.name}」已刪除`,
    });

    return true;
  };

  const openEditDialog = (position: Position) => {
    setCurrentPosition(position);
    setIsEditDialogOpen(true);
  };

  const refreshPositions = async () => {
    // Mock refresh
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  return {
    positions: filteredPositions,
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
    // 新增篩選和排序相關功能
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder
  };
};
