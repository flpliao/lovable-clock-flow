
import { useToast } from '@/components/ui/use-toast';
import { StaffRole, NewStaffRole, Staff } from '../types';

export const useRoleOperations = (
  roles: StaffRole[], 
  setRoles: React.Dispatch<React.SetStateAction<StaffRole[]>>,
  staffList: Staff[]
) => {
  const { toast } = useToast();
  
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
    // For system roles, only allow updating permissions
    const existingRole = roles.find(role => role.id === updatedRole.id);
    if (!existingRole) {
      toast({
        title: "角色不存在",
        description: "找不到要更新的角色",
        variant: "destructive"
      });
      return false;
    }
    
    let roleToUpdate = { ...updatedRole };
    
    // For system roles, preserve the original name and description
    if (existingRole.is_system_role) {
      roleToUpdate = {
        ...roleToUpdate,
        name: existingRole.name,
        description: existingRole.description,
        is_system_role: true
      };
    } else {
      // For custom roles, check if name already exists (excluding the current role)
      if (roles.some(role => role.name === updatedRole.name && role.id !== updatedRole.id)) {
        toast({
          title: "角色已存在",
          description: "已存在相同名稱的角色",
          variant: "destructive"
        });
        return false;
      }
    }
    
    setRoles(roles.map(role => 
      role.id === roleToUpdate.id ? roleToUpdate : role
    ));
    
    toast({
      title: "編輯成功",
      description: `已成功更新 ${roleToUpdate.name} 角色權限`
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

  return { addRole, updateRole, deleteRole };
};
