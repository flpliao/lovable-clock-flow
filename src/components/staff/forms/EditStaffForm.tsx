import React from 'react';
import { Staff } from '../types';
import { EditStaffBasicFields } from './EditStaffBasicFields';
import { EditStaffBranchField } from './EditStaffBranchField';
import { EditStaffRoleField } from './EditStaffRoleField';
import { EditStaffSupervisorField } from './EditStaffSupervisorField';

interface EditStaffFormProps {
  currentStaff: Staff;
  setCurrentStaff: (staff: Staff) => void;
  potentialSupervisors: Staff[];
  onHireDateChange?: (hasHireDate: boolean, entitledDays?: number) => void;
}

const EditStaffForm: React.FC<EditStaffFormProps> = ({
  currentStaff,
  setCurrentStaff,
  potentialSupervisors,
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

      <EditStaffRoleField currentStaff={currentStaff} setCurrentStaff={setCurrentStaff} />
    </div>
  );
};

export default EditStaffForm;
