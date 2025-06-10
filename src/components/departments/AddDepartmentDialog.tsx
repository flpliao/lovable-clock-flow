
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDepartmentManagementContext } from './DepartmentManagementContext';

const AddDepartmentDialog = () => {
  const { setIsAddDialogOpen } = useDepartmentManagementContext();

  return (
    <Button
      onClick={() => setIsAddDialogOpen(true)}
      className="bg-blue-500/80 hover:bg-blue-600/80 text-white border-0 rounded-xl shadow-lg backdrop-blur-xl"
    >
      <Plus className="mr-2 h-4 w-4" />
      新增部門
    </Button>
  );
};

export default AddDepartmentDialog;
