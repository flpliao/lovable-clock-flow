import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRoles } from '@/hooks/useRoles';
import { useIsAdmin } from '@/hooks/useStores';
import { useToast } from '@/hooks/useToast';
import { permissionService } from '@/services/permissionService';
import { NewRole } from '@/types/role';
import React, { useState } from 'react';
import PermissionSelect from './components/PermissionSelect';

interface AddRoleDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onRoleAdded?: () => void;
}

const AddRoleDialog = ({ open, onOpenChange, onRoleAdded }: AddRoleDialogProps) => {
  const isAdmin = useIsAdmin();
  const { toast } = useToast();
  const { addRole } = useRoles();
  const [isOpen, setIsOpen] = useState(false);
  const dialogOpen = open !== undefined ? open : isOpen;
  const handleOpenChange = onOpenChange || setIsOpen;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [newRole, setNewRole] = useState<NewRole>({
    id: '',
    name: '',
    description: '',
    is_system_role: false,
  });

  if (!isAdmin) return null;

  const resetForm = () => {
    setNewRole({
      id: '',
      name: '',
      description: '',
      is_system_role: false,
    });
    setSelectedPermissions(new Set());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRole.id.trim()) {
      toast({
        title: '驗證錯誤',
        description: '職位代碼為必填欄位',
        variant: 'destructive',
      });
      return;
    }

    if (!newRole.name.trim()) {
      toast({
        title: '驗證錯誤',
        description: '職位名稱為必填欄位',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      // 先建立職位
      const created = await addRole(newRole);

      if (selectedPermissions.size > 0) {
        await permissionService.updateRolePermissions(created.id, Array.from(selectedPermissions));
      }

      toast({
        title: '新增成功',
        description: `職位「${newRole.name}」已新增`,
      });

      resetForm();
      setIsOpen(false);
      onRoleAdded?.();
    } catch (error) {
      console.error('❌ 新增職位失敗:', error);
      let errorMessage = '無法新增職位，請稍後再試';

      if (error && typeof error === 'object' && 'message' in error) {
        const errorMsg = error.message as string;
        if (errorMsg.includes('row-level security')) {
          errorMessage = '權限不足，請確認您有新增職位的權限';
        } else if (errorMsg.includes('duplicate')) {
          errorMessage = '職位代碼或名稱已存在，請使用其他值';
        }
      }

      toast({
        title: '新增失敗',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-white/90 border border-white/40 shadow-xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">新增職位</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id" className="text-sm font-medium text-gray-900">
                職位代碼 *
              </Label>
              <Input
                id="id"
                placeholder="請輸入職位代碼（如：admin, manager, user）"
                value={newRole.id}
                onChange={e => setNewRole({ ...newRole, id: e.target.value })}
                className="bg-white/70 border-white/50 text-gray-900 focus:bg-white focus:border-orange-500/50"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                職位名稱 *
              </Label>
              <Input
                id="name"
                placeholder="請輸入職位名稱（如：系統管理員）"
                value={newRole.name}
                onChange={e => setNewRole({ ...newRole, name: e.target.value })}
                className="bg-white/70 border-white/50 text-gray-900 focus:bg-white focus:border-orange-500/50"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                說明
              </Label>
              <Textarea
                id="description"
                placeholder="請輸入職位說明（選填）"
                value={newRole.description || ''}
                onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                className="bg-white/70 border-white/50 text-gray-900 focus:bg-white focus:border-orange-500/50 min-h-[80px]"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_system_role"
                checked={newRole.is_system_role}
                onCheckedChange={checked => setNewRole({ ...newRole, is_system_role: !!checked })}
                disabled={isLoading}
              />
              <Label htmlFor="is_system_role" className="text-sm font-medium text-gray-900">
                系統角色
              </Label>
            </div>

            <PermissionSelect
              selectedPermissions={selectedPermissions}
              onPermissionsChange={setSelectedPermissions}
              isLoading={isLoading}
            />
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="bg-white/70 border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400"
              disabled={isLoading}
            >
              取消
            </Button>
            <Button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? '新增中...' : '新增'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleDialog;
