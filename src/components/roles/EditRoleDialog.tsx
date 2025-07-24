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
import { useToast } from '@/hooks/useToast';
import { permissionService } from '@/services/permissionService';
import { Role } from '@/types/role';
import React, { useEffect, useState } from 'react';
import PermissionSelect from './components/PermissionSelect';

interface EditRoleDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleUpdated?: () => void;
}

const EditRoleDialog = ({ role, open, onOpenChange, onRoleUpdated }: EditRoleDialogProps) => {
  const { toast } = useToast();
  const { updateRole } = useRoles();
  const [isLoading, setIsLoading] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(role);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(role?.permissions?.map(p => p.id) ?? [])
  );

  // 當 role 或其 permissions 變動時，更新本地權限狀態
  useEffect(() => {
    setEditingRole(role);
    setSelectedPermissions(new Set(role?.permissions?.map(p => p.id) ?? []));
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingRole) return;

    if (!editingRole.name.trim()) {
      toast({
        title: '驗證錯誤',
        description: '職位名稱為必填欄位',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      // 更新職位基本資訊
      await updateRole(editingRole);
      await permissionService.updateRolePermissions(
        editingRole.id,
        Array.from(selectedPermissions)
      );

      toast({
        title: '編輯成功',
        description: `職位「${editingRole.name}」已更新`,
      });

      onOpenChange(false);
      onRoleUpdated?.();
    } catch (error) {
      console.error('❌ 更新職位失敗:', error);
      toast({
        title: '編輯失敗',
        description: '無法更新職位，請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!editingRole) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-white/90 border border-white/40 shadow-xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">編輯職位</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-id" className="text-sm font-medium text-gray-900">
                職位代碼
              </Label>
              <Input
                id="edit-id"
                value={editingRole.id}
                className="bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                disabled
                readOnly
              />
              <p className="text-xs text-gray-500">職位代碼無法修改</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-medium text-gray-900">
                職位名稱 *
              </Label>
              <Input
                id="edit-name"
                placeholder="請輸入職位名稱"
                value={editingRole.name}
                onChange={e => setEditingRole({ ...editingRole, name: e.target.value })}
                className="bg-white/70 border-white/50 text-gray-900 focus:bg-white focus:border-orange-500/50"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-sm font-medium text-gray-900">
                說明
              </Label>
              <Textarea
                id="edit-description"
                placeholder="請輸入職位說明（選填）"
                value={editingRole.description || ''}
                onChange={e => setEditingRole({ ...editingRole, description: e.target.value })}
                className="bg-white/70 border-white/50 text-gray-900 focus:bg-white focus:border-orange-500/50 min-h-[80px]"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-is_system_role"
                checked={editingRole.is_system_role}
                onCheckedChange={checked =>
                  setEditingRole({ ...editingRole, is_system_role: !!checked })
                }
                disabled={isLoading}
              />
              <Label htmlFor="edit-is_system_role" className="text-sm font-medium text-gray-900">
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
              onClick={() => onOpenChange(false)}
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
              {isLoading ? '儲存中...' : '儲存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleDialog;
