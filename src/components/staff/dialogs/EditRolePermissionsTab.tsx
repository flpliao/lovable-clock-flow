
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StaffRole, Permission } from '../types';
import { RoleApiService } from '../services/roleApiService';

interface EditRolePermissionsTabProps {
  editedRole: StaffRole;
  setEditedRole: (role: StaffRole | ((prev: StaffRole) => StaffRole)) => void;
  isSubmitting: boolean;
}

export const EditRolePermissionsTab: React.FC<EditRolePermissionsTabProps> = ({
  editedRole,
  setEditedRole,
  isSubmitting
}) => {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [permissionsByCategory, setPermissionsByCategory] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);

  // 載入所有可用權限
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setLoading(true);
        console.log('🔄 載入所有可用權限用於編輯角色...');
        
        const permissions = await RoleApiService.loadAllPermissions();
        console.log('✅ 載入權限成功:', permissions.length, '個權限');
        
        setAllPermissions(permissions);
        
        // 按分類組織權限，並確保分類順序
        const categorized = permissions.reduce((acc, permission) => {
          const category = permission.category || 'general';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(permission);
          return acc;
        }, {} as Record<string, Permission[]>);
        
        // 按分類內的權限名稱排序
        Object.keys(categorized).forEach(category => {
          categorized[category].sort((a, b) => a.name.localeCompare(b.name));
        });
        
        setPermissionsByCategory(categorized);
        console.log('📊 權限分類:', Object.keys(categorized));
        
      } catch (error) {
        console.error('❌ 載入權限失敗:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPermissions();
  }, []);

  // 確保角色權限與後台同步
  useEffect(() => {
    console.log('🔍 檢查角色權限同步狀態:', {
      roleName: editedRole.name,
      currentPermissions: editedRole.permissions.length,
      permissionDetails: editedRole.permissions.map(p => ({ id: p.id, name: p.name }))
    });
  }, [editedRole.permissions]);
  
  const togglePermission = (permission: Permission) => {
    console.log('🔄 切換權限:', permission.name, '角色:', editedRole.name);
    setEditedRole(prev => {
      const hasPermission = prev.permissions.some(p => p.id === permission.id);
      
      if (hasPermission) {
        const newPermissions = prev.permissions.filter(p => p.id !== permission.id);
        console.log('➖ 移除權限:', permission.name, '剩餘權限數量:', newPermissions.length);
        return {
          ...prev,
          permissions: newPermissions
        };
      } else {
        const newPermissions = [...prev.permissions, permission];
        console.log('➕ 新增權限:', permission.name, '總權限數量:', newPermissions.length);
        return {
          ...prev,
          permissions: newPermissions
        };
      }
    });
  };
  
  const isPermissionSelected = (permissionId: string) => {
    return editedRole.permissions.some(p => p.id === permissionId);
  };

  // 定義分類顯示順序和中文名稱
  const categoryDisplayConfig = {
    'system': { name: '系統管理', order: 1 },
    'staff': { name: '人員管理', order: 2 },
    'attendance': { name: '出勤管理', order: 3 },
    'leave': { name: '請假管理', order: 4 },
    'leave_type': { name: '假別管理', order: 5 },
    'overtime': { name: '加班管理', order: 6 },
    'schedule': { name: '排班管理', order: 7 },
    'announcement': { name: '公告管理', order: 8 },
    'holiday': { name: '假日管理', order: 9 },
    'department': { name: '部門管理', order: 10 },
    'hr': { name: 'HR管理', order: 11 },
    'general': { name: '一般權限', order: 99 }
  };

  const permissionCategories = Object.keys(permissionsByCategory).sort((a, b) => {
    const orderA = categoryDisplayConfig[a as keyof typeof categoryDisplayConfig]?.order || 99;
    const orderB = categoryDisplayConfig[b as keyof typeof categoryDisplayConfig]?.order || 99;
    return orderA - orderB;
  });

  if (loading) {
    return (
      <div className="py-4">
        <div className="flex items-center justify-center h-32">
          <div className="text-sm text-gray-500">載入權限設定中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          目前已選擇 <span className="font-bold">{editedRole.permissions.length}</span> 個權限
          （共 {allPermissions.length} 個可用權限）
        </p>
      </div>
      
      <ScrollArea className="h-[500px] w-full rounded-md border p-4">
        <div className="space-y-6">
          {permissionCategories.map(category => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-1 sticky top-0 bg-white z-10">
                {categoryDisplayConfig[category as keyof typeof categoryDisplayConfig]?.name || category} 
                ({permissionsByCategory[category].length} 個權限)
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {permissionsByCategory[category].map(permission => (
                  <div key={permission.id} className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50">
                    <Checkbox 
                      id={`edit-${permission.id}`} 
                      checked={isPermissionSelected(permission.id)}
                      onCheckedChange={() => togglePermission(permission)}
                      disabled={isSubmitting}
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`edit-${permission.id}`} 
                        className="font-medium cursor-pointer"
                      >
                        {permission.name}
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        {permission.description}
                        <span className="ml-2 text-xs text-gray-400">
                          (代碼: {permission.code})
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
