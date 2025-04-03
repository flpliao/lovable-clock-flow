
export interface Staff {
  id: string;
  name: string;
  position: string;
  department: string;
  contact: string;
  role: 'user' | 'admin';
  supervisor_id?: string; // Added supervisor relationship
}

export interface NewStaff {
  name: string;
  position: string;
  department: string;
  contact: string;
  role: 'user' | 'admin';
  supervisor_id?: string; // Added supervisor relationship
}

export interface StaffManagementContextType {
  staffList: Staff[];
  filteredStaffList: Staff[];
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  currentStaff: Staff | null;
  setCurrentStaff: (staff: Staff | null) => void;
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
  handleAddStaff: () => void;
  handleEditStaff: () => void;
  handleDeleteStaff: (id: string) => void;
  openEditDialog: (staff: Staff) => void;
  getSupervisorName: (supervisorId?: string) => string;
  getSubordinates: (staffId: string) => Staff[];
}
