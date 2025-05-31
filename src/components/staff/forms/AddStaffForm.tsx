
import React from 'react';
import { NewStaff } from '../types';
import StaffBasicFields from './StaffBasicFields';
import StaffBranchFields from './StaffBranchFields';
import StaffSupervisorFields from './StaffSupervisorFields';
import StaffRoleFields from './StaffRoleFields';

interface AddStaffFormProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ newStaff, setNewStaff }) => {
  return (
    <div className="grid gap-3 py-2">
      <StaffBasicFields newStaff={newStaff} setNewStaff={setNewStaff} />
      <StaffBranchFields newStaff={newStaff} setNewStaff={setNewStaff} />
      <StaffSupervisorFields newStaff={newStaff} setNewStaff={setNewStaff} />
      <StaffRoleFields newStaff={newStaff} setNewStaff={setNewStaff} />
    </div>
  );
};

export default AddStaffForm;
