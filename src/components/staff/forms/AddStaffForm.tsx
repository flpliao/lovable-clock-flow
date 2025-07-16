import React from 'react';
import { NewStaff, StaffRole } from '../types';
import { StaffBasicFields } from './StaffBasicFields';
import StaffBranchFields from './StaffBranchFields';
import StaffRoleFields from './StaffRoleFields';
import StaffSupervisorFields from './StaffSupervisorFields';

interface AddStaffFormProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
  roles: StaffRole[];
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ newStaff, setNewStaff, roles }) => {
  return (
    <div className="grid gap-3 py-2">
      <StaffBasicFields newStaff={newStaff} setNewStaff={setNewStaff} />
      {/* <StaffDepartmentFields newStaff={newStaff} setNewStaff={setNewStaff} /> */}
      <StaffBranchFields newStaff={newStaff} setNewStaff={setNewStaff} />
      <StaffSupervisorFields newStaff={newStaff} setNewStaff={setNewStaff} />
      <StaffRoleFields newStaff={newStaff} setNewStaff={setNewStaff} roles={roles} />
    </div>
  );
};

export default AddStaffForm;
