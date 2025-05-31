
import { useEffect } from 'react';
import { Department, NewDepartment } from '../types';
import { useDepartmentState } from './useDepartmentState';
import { useDepartmentFetch } from './useDepartmentFetch';
import { useDepartmentCreate } from './useDepartmentCreate';
import { useDepartmentUpdate } from './useDepartmentUpdate';
import { useDepartmentDelete } from './useDepartmentDelete';
import { useDepartmentStaffCount } from './useDepartmentStaffCount';

export const useSupabaseDepartmentOperations = () => {
  const { loading, setLoading, departments, setDepartments } = useDepartmentState();
  const { fetchDepartments: baseFetchDepartments } = useDepartmentFetch();
  const { addDepartment: baseAddDepartment } = useDepartmentCreate();
  const { updateDepartment: baseUpdateDepartment } = useDepartmentUpdate();
  const { deleteDepartment: baseDeleteDepartment } = useDepartmentDelete();
  const { updateStaffCount } = useDepartmentStaffCount();

  const fetchDepartments = async (): Promise<Department[]> => {
    try {
      setLoading(true);
      const transformedData = await baseFetchDepartments();
      setDepartments(transformedData);
      return transformedData;
    } finally {
      setLoading(false);
    }
  };

  const refreshDepartments = async (): Promise<void> => {
    await fetchDepartments();
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const addDepartment = async (newDepartment: NewDepartment): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await baseAddDepartment(newDepartment);
      if (success) {
        await refreshDepartments();
      }
      return success;
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (department: Department): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await baseUpdateDepartment(department);
      if (success) {
        await refreshDepartments();
      }
      return success;
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await baseDeleteDepartment(id);
      if (success) {
        await refreshDepartments();
      }
      return success;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    departments,
    fetchDepartments,
    refreshDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    updateStaffCount
  };
};
