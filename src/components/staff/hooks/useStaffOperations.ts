
import { useState } from 'react';
import { Staff, NewStaff } from '../types';
import { useSupabaseStaffOperations } from './useSupabaseStaffOperations';

export const useStaffOperations = () => {
  const {
    staffList,
    loading,
    addStaff,
    updateStaff,
    deleteStaff
  } = useSupabaseStaffOperations();

  // Filter state (可以在這裡加入搜尋邏輯)
  const [searchFilter, setSearchFilter] = useState('');
  
  // Filtered staff list
  const filteredStaffList = staffList.filter(staff => 
    searchFilter === '' || 
    staff.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchFilter.toLowerCase()) ||
    staff.position.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleAddStaff = async (newStaff: NewStaff): Promise<boolean> => {
    return await addStaff(newStaff);
  };

  const handleEditStaff = async (staff: Staff): Promise<boolean> => {
    return await updateStaff(staff);
  };

  const handleDeleteStaff = async (id: string) => {
    await deleteStaff(id);
  };

  return {
    staffList,
    filteredStaffList,
    loading,
    searchFilter,
    setSearchFilter,
    handleAddStaff,
    handleEditStaff,
    handleDeleteStaff
  };
};
