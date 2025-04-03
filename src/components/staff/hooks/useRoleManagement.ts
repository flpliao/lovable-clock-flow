
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { StaffRole, NewStaffRole, Staff, Permission } from '../types';
import { defaultSystemRoles, availablePermissions } from '../RoleConstants';

export const useRoleManagement = (staffList: Staff[]) => {
  const [roles, setRoles] = useState<StaffRole[]>([...defaultSystemRoles]);
  const { toast } = useToast();
  
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
  
  // Add a new role
  const addRole = async (newRole: NewStaffRole): Promise<boolean> => {
    if (!newRole.name) {
      toast({
        title: "資料不完整",
        description: "角色名稱為必填欄位",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if role name already exists
    if (roles.some(role => role.name === newRole.name)) {
      toast({
        title: "角色已存在",
        description: "已存在相同名稱的角色",
        variant: "destructive"
      });
      return false;
    }
    
    const roleToAdd: StaffRole = {
      id: `role_${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      is_system_role: false
    };
    
    setRoles([...roles, roleToAdd]);
    
    toast({
      title: "新增成功",
      description: `已成功新增 ${roleToAdd.name} 角色`
    });
    
    return true;
  };
  
  // Update an existing role
  const updateRole = async (updatedRole: StaffRole): Promise<boolean> => {
    // Check if trying to update system role
    const existingRole = roles.find(role => role.id === updatedRole.id);
    if (existingRole?.is_system_role) {
      toast({
        title: "無法修改",
        description: "系統預設角色無法修改",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if name already exists (excluding the current role)
    if (roles.some(role => role.name === updatedRole.name && role.id !== updatedRole.id)) {
      toast({
        title: "角色已存在",
        description: "已存在相同名稱的角色",
        variant: "destructive"
      });
      return false;
    }
    
    setRoles(roles.map(role => 
      role.id === updatedRole.id ? updatedRole : role
    ));
    
    toast({
      title: "編輯成功",
      description: `已成功更新 ${updatedRole.name} 角色`
    });
    
    return true;
  };
  
  // Delete a role
  const deleteRole = async (roleId: string): Promise<boolean> => {
    // Check if trying to delete system role
    const roleToDelete = roles.find(role => role.id === roleId);
    if (!roleToDelete) {
      toast({
        title: "角色不存在",
        description: "找不到要刪除的角色",
        variant: "destructive"
      });
      return false;
    }
    
    if (roleToDelete.is_system_role) {
      toast({
        title: "無法刪除",
        description: "系統預設角色無法刪除",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if any staff is using this role
    const staffUsingRole = staffList.filter(staff => staff.role_id === roleId);
    if (staffUsingRole.length > 0) {
      toast({
        title: "無法刪除",
        description: `有 ${staffUsingRole.length} 位員工正在使用此角色，請先變更這些員工的角色`,
        variant: "destructive"
      });
      return false;
    }
    
    setRoles(roles.filter(role => role.id !== roleId));
    
    toast({
      title: "刪除成功",
      description: "已成功刪除角色"
    });
    
    return true;
  };
  
  // Get a role by ID
  const getRole = (roleId?: string): StaffRole | undefined => {
    if (!roleId) return undefined;
    return roles.find(role => role.id === roleId);
  };
  
  // Check if a staff has a specific permission
  const hasPermission = (staffId: string, permissionCode: string): boolean => {
    const staff = staffList.find(s => s.id === staffId);
    if (!staff) return false;
    
    // Admin has all permissions
    if (staff.role === 'admin') return true;
    
    // Check direct permissions on staff
    if (staff.permissions?.includes(permissionCode)) return true;
    
    // Check role-based permissions
    if (staff.role_id) {
      const role = getRole(staff.role_id);
      if (role) {
        return role.permissions.some(p => p.code === permissionCode);
      }
    }
    
    // For backward compatibility - map old 'user' role to default permissions
    if (staff.role === 'user' && !staff.role_id) {
      const userRole = roles.find(r => r.id === 'user');
      if (userRole) {
        return userRole.permissions.some(p => p.code === permissionCode);
      }
    }
    
    return false;
  };
  
  // Assign a role to a staff member
  const assignRoleToStaff = async (staffId: string, roleId: string): Promise<boolean> => {
    // Implementation would update the staff's role_id in a real application
    // This is a mock implementation for demonstration
    console.log(`Assigned role ${roleId} to staff ${staffId}`);
    return true;
  };
  
  return {
    roles,
    addRole,
    updateRole,
    deleteRole,
    getRole,
    hasPermission,
    assignRoleToStaff
  };
};
