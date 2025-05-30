
export interface Department {
  id: string;
  name: string;
  type: 'department' | 'store';
  location?: string;
  managerName?: string;
  managerContact?: string;
  staffCount: number;
  created_at?: string;
  updated_at?: string;
}

export interface NewDepartment {
  name: string;
  type: 'department' | 'store';
  location?: string;
  managerName?: string;
  managerContact?: string;
}

export interface DepartmentManagementContextType {
  departments: Department[];
  filteredDepartments: Department[];
  loading: boolean;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  currentDepartment: Department | null;
  setCurrentDepartment: (department: Department | null) => void;
  newDepartment: NewDepartment;
  setNewDepartment: (department: NewDepartment) => void;
  handleAddDepartment: () => void;
  handleEditDepartment: () => void;
  handleDeleteDepartment: (id: string) => void;
  openEditDialog: (department: Department) => void;
}
