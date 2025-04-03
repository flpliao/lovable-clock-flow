
export interface Department {
  id: string;
  name: string;
  type: 'department' | 'store';
  location?: string;
  managerName?: string;
  managerContact?: string;
  staffCount: number;
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
