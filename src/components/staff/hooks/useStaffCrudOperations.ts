
import { Staff, NewStaff } from '../types';
import { useStaffAddOperation } from './useStaffAddOperation';
import { useStaffUpdateOperation } from './useStaffUpdateOperation';
import { useStaffDeleteOperation } from './useStaffDeleteOperation';

export const useStaffCrudOperations = (
  staffList: Staff[],
  setStaffList: (staffList: Staff[]) => void
) => {
  const { addStaff } = useStaffAddOperation(staffList, setStaffList);
  const { updateStaff } = useStaffUpdateOperation(staffList, setStaffList);
  const { deleteStaff } = useStaffDeleteOperation(staffList, setStaffList);

  return {
    addStaff,
    updateStaff,
    deleteStaff
  };
};
