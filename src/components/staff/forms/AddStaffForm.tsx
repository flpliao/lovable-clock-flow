import React from 'react';
import { NewStaff } from '../types';
import { StaffBasicFields } from './StaffBasicFields';
import StaffBranchFields from './StaffBranchFields';
import StaffRoleFields from './StaffRoleFields';
import StaffSupervisorFields from './StaffSupervisorFields';

interface AddStaffFormProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ newStaff, setNewStaff }) => {
  return (
    <div className="grid gap-4 py-4">
      <StaffBasicFields newStaff={newStaff} setNewStaff={setNewStaff} />
      {/* <StaffDepartmentFields newStaff={newStaff} setNewStaff={setNewStaff} /> */}
      <StaffBranchFields newStaff={newStaff} setNewStaff={setNewStaff} />
      <StaffSupervisorFields newStaff={newStaff} setNewStaff={setNewStaff} />
      <StaffRoleFields newStaff={newStaff} setNewStaff={setNewStaff} />
    </div>
  );
};

export default AddStaffForm;
