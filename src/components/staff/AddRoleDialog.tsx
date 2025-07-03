import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useToast } from '@/hooks/use-toast';
import { roleService } from '@/services/roleService';
import React, { useEffect, useState } from 'react';
import { NewStaffRole, Permission } from './types';

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddRoleDialog = ({ open, onOpenChange }: AddRoleDialogProps) => {
  const { addRole } = useStaffManagementContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('基本資料');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [permissionsByCategory, setPermissionsByCategory] = useState<Record<string, Permission[]>>(
    {}
  );
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  const [newRole, setNewRole] = useState<NewStaffRole>({
    name: '',
    description: '',
    permissions: [],
  });

  // 載入所有可用權限
  useEffect(() => {
    const loadPermissions = async () => {
      if (!open) return;

      try {
        setLoadingPermissions(true);
        console.log('🔄 載入所有可用權限用於新增角色...');

        const permissions = await roleService.loadAllPermissions();
        console.log('✅ 載入權限成功:', permissions.length, '個權限');

        setAllPermissions(permissions);

        // 按分類組織權限
        const categorized = permissions.reduce(
          (acc, permission) => {
            const category = permission.category || 'general';
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(permission);
            return acc;
          },
          {} as Record<string, Permission[]>
        );

        // 按分類內的權限名稱排序
        Object.keys(categorized).forEach(category => {
          categorized[category].sort((a, b) => a.name.localeCompare(b.name));
        });

        setPermissionsByCategory(categorized);
        console.log('📊 權限分類:', Object.keys(categorized));
      } catch (error) {
        console.error('❌ 載入權限失敗:', error);
      } finally {
        setLoadingPermissions(false);
      }
    };

    loadPermissions();
  }, [open]);

  const handleSubmit = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('🔄 開始建立新角色:', newRole.name, '權限數量:', newRole.permissions.length);
    console.log(
      '📋 選擇的權限:',
      newRole.permissions.map(p => ({ id: p.id, name: p.name }))
    );

    // 驗證必填欄位
    if (!newRole.name.trim()) {
      toast({
        title: '建立失敗',
        description: '請輸入角色名稱',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 確保權限資料格式正確
      const roleToCreate = {
        ...newRole,
        name: newRole.name.trim(),
        description: newRole.description.trim(),
        permissions: newRole.permissions.map(permission => ({
          id: permission.id,
          name: permission.name,
          code: permission.code || permission.id,
          description: permission.description || '',
          category: permission.category || 'general',
        })),
      };

      console.log('💾 準備建立的角色資料:', roleToCreate);

      const success = await addRole(roleToCreate);
      console.log('💾 角色建立結果:', success);

      if (success) {
        console.log('✅ 角色建立成功，關閉對話框');
        toast({
          title: '建立成功',
          description: `已成功建立角色「${newRole.name}」`,
        });

        // 重置表單
        setNewRole({
          name: '',
          description: '',
          permissions: [],
        });
        setActiveTab('基本資料');
        onOpenChange(false);
      } else {
        console.error('❌ 角色建立失敗');
        toast({
          title: '建立失敗',
          description: '角色建立過程中發生錯誤，請重試',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ 建立角色時發生錯誤:', error);
      let errorMessage = '角色建立過程中發生系統錯誤';

      if (error instanceof Error) {
        if (error.message.includes('foreign key constraint')) {
          errorMessage = '權限設定錯誤：部分權限不存在於系統中';
        } else if (error.message.includes('violates')) {
          errorMessage = '資料驗證錯誤：請檢查輸入的資料格式';
        }
      }

      toast({
        title: '建立失敗',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePermission = (permission: Permission) => {
    console.log('🔄 切換權限選擇:', permission.name);
    setNewRole(prev => {
      const hasPermission = prev.permissions.some(p => p.id === permission.id);

      if (hasPermission) {
        const newPermissions = prev.permissions.filter(p => p.id !== permission.id);
        console.log('➖ 移除權限:', permission.name, '剩餘權限數量:', newPermissions.length);
        return {
          ...prev,
          permissions: newPermissions,
        };
      } else {
        const newPermissions = [...prev.permissions, permission];
        console.log('➕ 新增權限:', permission.name, '總權限數量:', newPermissions.length);
        return {
          ...prev,
          permissions: newPermissions,
        };
      }
    });
  };

  const isPermissionSelected = (permissionId: string) => {
    return newRole.permissions.some(p => p.id === permissionId);
  };

  const handleCancel = () => {
    console.log('❌ 取消建立角色，重置表單');
    setNewRole({
      name: '',
      description: '',
      permissions: [],
    });
    setActiveTab('基本資料');
    onOpenChange(false);
  };

  // 定義分類顯示順序和中文名稱
  const categoryDisplayConfig = {
    system: { name: '系統管理', order: 1 },
    staff: { name: '人員管理', order: 2 },
    attendance: { name: '出勤管理', order: 3 },
    leave: { name: '請假管理', order: 4 },
    leave_type: { name: '假別管理', order: 5 },
    overtime: { name: '加班管理', order: 6 },
    schedule: { name: '排班管理', order: 7 },
    announcement: { name: '公告管理', order: 8 },
    holiday: { name: '假日管理', order: 9 },
    department: { name: '部門管理', order: 10 },
    hr: { name: 'HR管理', order: 11 },
    general: { name: '一般權限', order: 99 },
  };

  const permissionCategories = Object.keys(permissionsByCategory).sort((a, b) => {
    const orderA = categoryDisplayConfig[a as keyof typeof categoryDisplayConfig]?.order || 99;
    const orderB = categoryDisplayConfig[b as keyof typeof categoryDisplayConfig]?.order || 99;
    return orderA - orderB;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>新增角色</DialogTitle>
          <DialogDescription>新增系統角色並設定權限</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="基本資料">基本資料</TabsTrigger>
            <TabsTrigger value="權限設定">權限設定</TabsTrigger>
          </TabsList>

          <TabsContent value="基本資料" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                角色名稱
              </Label>
              <Input
                id="name"
                value={newRole.name}
                onChange={e => setNewRole({ ...newRole, name: e.target.value })}
                className="col-span-3"
                placeholder="例如：門市經理、行銷人員"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                描述
              </Label>
              <Textarea
                id="description"
                value={newRole.description}
                onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                className="col-span-3"
                placeholder="描述此角色的權限範圍與用途"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                type="button"
              >
                取消
              </Button>
              <Button
                onClick={() => setActiveTab('權限設定')}
                disabled={isSubmitting}
                type="button"
              >
                下一步：設定權限
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="權限設定" className="py-4 flex-1 flex flex-col">
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                目前已選擇 <span className="font-bold">{newRole.permissions.length}</span> 個權限
                （共 {allPermissions.length} 個可用權限）
              </p>
            </div>

            {loadingPermissions ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-sm text-gray-500">載入權限設定中...</div>
              </div>
            ) : (
              <ScrollArea className="h-[400px] w-full rounded-md border p-4 flex-1">
                <div className="space-y-6">
                  {permissionCategories.map(category => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-700 border-b pb-1 sticky top-0 bg-white z-10">
                        {categoryDisplayConfig[category as keyof typeof categoryDisplayConfig]
                          ?.name || category}
                        ({permissionsByCategory[category].length} 個權限)
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {permissionsByCategory[category].map(permission => (
                          <div
                            key={permission.id}
                            className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50"
                          >
                            <Checkbox
                              id={`add-${permission.id}`}
                              checked={isPermissionSelected(permission.id)}
                              onCheckedChange={() => togglePermission(permission)}
                              disabled={isSubmitting}
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={`add-${permission.id}`}
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
            )}

            <DialogFooter className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setActiveTab('基本資料')}
                disabled={isSubmitting}
                type="button"
              >
                上一步
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !newRole.name.trim() || loadingPermissions}
                type="button"
              >
                {isSubmitting ? '建立中...' : '建立角色'}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleDialog;
