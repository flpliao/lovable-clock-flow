export interface Department {
  id: string;
  name: string;
  type: 'headquarters' | 'branch' | 'store' | 'department';
  location?: string;
  manager_name?: string;
  manager_contact?: string;
  staff_count: number;
  latitude?: number;
  longitude?: number;
  address_verified?: boolean;
  check_in_radius?: number;
  created_at?: string;
  updated_at?: string;
}

export interface NewDepartment {
  name: string;
  type: 'headquarters' | 'branch' | 'store' | 'department';
  location?: string;
  manager_name?: string;
  manager_contact?: string;
  latitude?: number;
  longitude?: number;
  address_verified?: boolean;
  check_in_radius?: number;
}

export interface DepartmentManagementContextType {
  departments: Department[];
  filteredDepartments: Department[];
  loading: boolean;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  currentDepartment: Department | null;
  setCurrentDepartment: (department: Department | null) => void;
  newDepartment: NewDepartment;
  setNewDepartment: (department: NewDepartment) => void;
  handleAddDepartment: () => Promise<boolean>;
  handleEditDepartment: () => Promise<boolean>;
  handleDeleteDepartment: (id: string) => void;
  openEditDialog: (department: Department) => void;
  refreshDepartments: () => Promise<void>;
  performFullSync: () => Promise<any>;
  canManage: boolean;
  currentUser: any;
  convertAddressToGPS: (departmentId: string, address: string) => Promise<boolean>;
}
