
import { useState } from 'react';
import { Department } from '../types';

export const useDepartmentState = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  return {
    loading,
    setLoading,
    departments,
    setDepartments
  };
};
