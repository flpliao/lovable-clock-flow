
import { useState, useEffect } from 'react';
import { StaffRole } from '../types';
import { defaultSystemRoles } from '../RoleConstants';

export const useRolePersistence = () => {
  const [roles, setRoles] = useState<StaffRole[]>([...defaultSystemRoles]);
  
  // Load roles from localStorage on component mount
  useEffect(() => {
    const savedRoles = localStorage.getItem('staffRoles');
    if (savedRoles) {
      try {
        const parsedRoles = JSON.parse(savedRoles);
        // Merge saved roles with system roles (in case we added new system roles)
        const mergedRoles = [
          ...defaultSystemRoles,
          ...parsedRoles.filter((role: StaffRole) => 
            !defaultSystemRoles.some(defaultRole => defaultRole.id === role.id)
          )
        ];
        setRoles(mergedRoles);
      } catch (error) {
        console.error('Failed to parse saved roles:', error);
      }
    }
  }, []);
  
  // Save roles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('staffRoles', JSON.stringify(roles));
  }, [roles]);

  return { roles, setRoles };
};
