import { Role } from '@/types/role';
import React from 'react';
import { Staff } from '../types';
import { EditStaffBasicFields } from './EditStaffBasicFields';
import { EditStaffBranchField } from './EditStaffBranchField';
import { EditStaffRoleField } from './EditStaffRoleField';
import { EditStaffSupervisorField } from './EditStaffSupervisorField';

interface EditStaffFormContentProps {
  currentStaff: Staff;
  setCurrentStaff: (staff: Staff) => void;
  potentialSupervisors: Staff[];
  roles: Role[];
  onHireDateChange?: (hasHireDate: boolean, entitledDays?: number) => void;
}

export const EditStaffFormContent: React.FC<EditStaffFormContentProps> = ({
  currentStaff,
  setCurrentStaff,
  potentialSupervisors,
  roles,
  onHireDateChange,
}) => {
  return (
    <div className="grid gap-4 py-4">
      <EditStaffBasicFields
        currentStaff={currentStaff}
        setCurrentStaff={setCurrentStaff}
        onHireDateChange={onHireDateChange}
      />

      {/* <EditStaffDepartmentField 
        currentStaff={currentStaff}
        setCurrentStaff={setCurrentStaff}
      /> */}

      <EditStaffBranchField currentStaff={currentStaff} setCurrentStaff={setCurrentStaff} />

      <EditStaffSupervisorField
        currentStaff={currentStaff}
        setCurrentStaff={setCurrentStaff}
        potentialSupervisors={potentialSupervisors}
      />

      <EditStaffRoleField
        currentStaff={currentStaff}
        setCurrentStaff={setCurrentStaff}
        roles={roles}
      />
    </div>
  );
};
