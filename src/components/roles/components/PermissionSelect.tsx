import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { permissionService } from '@/services/permissionService';
import { usePermissionStore } from '@/stores/permissionStore';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import PermissionSelectDialog from './PermissionSelectDialog';

/**
 * 權限選擇組件
 * 使用 usePermissionStore 來管理所有權限資料的快取
 * 包含自動載入、錯誤處理和快取機制
 */
interface PermissionSelectProps {
  selectedPermissions: Set<string>;
  onPermissionsChange: (permissions: Set<string>) => void;
  isLoading?: boolean;
}

const PermissionSelect = ({ selectedPermissions, onPermissionsChange }: PermissionSelectProps) => {
  const { toast } = useToast();
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const { permissions } = usePermissionStore();

  // 載入權限列表
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingPermissions(true);
      try {
        await permissionService.loadAllPermissions();
      } catch (error) {
        console.error('載入權限資料失敗:', error);
        toast({
          title: '載入失敗',
          description: error instanceof Error ? error.message : '無法載入權限資料，請稍後再試',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingPermissions(false);
      }
    };

    loadData();
  }, [toast]);

  const handleRemovePermission = (permissionId: string) => {
    const newSelectedPermissions = new Set(selectedPermissions);
    newSelectedPermissions.delete(permissionId);
    onPermissionsChange(newSelectedPermissions);
  };

  const getSelectedPermissionList = () => {
    return permissions.filter(p => selectedPermissions.has(p.id));
  };

  const effectiveIsLoading = isLoadingPermissions;

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-900">權限設定</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPermissionDialogOpen(true)}
            disabled={effectiveIsLoading}
          >
            選擇權限
          </Button>
        </div>

        {selectedPermissions.size > 0 ? (
          <ScrollArea className="h-[120px] w-full rounded-md border border-gray-200 p-2">
            <div className="flex flex-wrap gap-2">
              {getSelectedPermissionList().map(permission => (
                <div
                  key={permission.id}
                  className="group flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                >
                  <span>{permission.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePermission(permission.id)}
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-gray-300"
                    disabled={effectiveIsLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="rounded-md border border-dashed border-gray-200 p-4">
            <p className="text-center text-sm text-gray-500">尚未選擇任何權限</p>
          </div>
        )}
      </div>

      <PermissionSelectDialog
        isOpen={isPermissionDialogOpen}
        onClose={() => setIsPermissionDialogOpen(false)}
        permissions={permissions}
        selectedPermissions={selectedPermissions}
        onConfirm={onPermissionsChange}
        isLoading={effectiveIsLoading}
      />
    </>
  );
};

export default PermissionSelect;
