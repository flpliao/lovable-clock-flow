
export interface Position {
  id: string;
  name: string;
  description?: string;
  level: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NewPosition {
  name: string;
  description?: string;
  level: number;
}

export interface PositionManagementContextType {
  positions: Position[];
  filteredPositions: Position[];
  loading: boolean;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  currentPosition: Position | null;
  setCurrentPosition: (position: Position | null) => void;
  newPosition: NewPosition;
  setNewPosition: (position: NewPosition) => void;
  handleAddPosition: () => Promise<boolean>;
  handleEditPosition: () => Promise<boolean>;
  handleDeletePosition: (id: string) => Promise<boolean>;
  openEditDialog: (position: Position) => void;
  refreshPositions: () => Promise<void>;
  // 新增篩選和排序相關類型
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'name' | 'level';
  setSortBy: (sort: 'name' | 'level') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
}
