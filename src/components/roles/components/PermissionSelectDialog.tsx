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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Permission } from '@/services/permissionService';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PermissionSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: Permission[];
  selectedPermissions: Set<string>;
  onConfirm: (selected: Set<string>) => void;
  isLoading?: boolean;
}

const PermissionSelectDialog = ({
  isOpen,
  onClose,
  permissions,
  selectedPermissions: initialSelected,
  onConfirm,
  isLoading = false,
}: PermissionSelectDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Set<string>>(initialSelected);

  // 每次 dialog 打開或外部選擇變更時，更新內部狀態
  useEffect(() => {
    if (isOpen) {
      setSelected(new Set(initialSelected));
    }
  }, [isOpen, initialSelected]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const newSelected = new Set(selected);
    if (checked) {
      newSelected.add(permissionId);
    } else {
      newSelected.delete(permissionId);
    }
    setSelected(newSelected);
  };

  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  const filteredPermissions = permissions.filter(
    permission =>
      searchTerm === '' ||
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permission.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">選擇權限</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              已選擇 {selected.size} / {permissions.length} 個權限
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (selected.size === permissions.length) {
                  setSelected(new Set());
                } else {
                  setSelected(new Set(permissions.map(p => p.id)));
                }
              }}
            >
              {selected.size === permissions.length ? '取消全選' : '全選'}
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="搜尋權限..."
              className="pl-9"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[400px] border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>權限名稱</TableHead>
                  <TableHead>說明</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.map(permission => (
                  <TableRow
                    key={permission.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50"
                    onClick={() =>
                      handlePermissionChange(permission.id, !selected.has(permission.id))
                    }
                  >
                    <TableCell className="relative" onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(permission.id)}
                        onCheckedChange={checked =>
                          handlePermissionChange(permission.id, checked as boolean)
                        }
                        disabled={isLoading}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{permission.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {permission.description || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            確定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionSelectDialog;
