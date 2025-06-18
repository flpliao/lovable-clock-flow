
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { StaffRole } from '../types';

interface EditRoleBasicInfoTabProps {
  editedRole: StaffRole;
  setEditedRole: (role: StaffRole) => void;
  isSystemRole: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onNext: () => void;
}

export const EditRoleBasicInfoTab: React.FC<EditRoleBasicInfoTabProps> = ({
  editedRole,
  setEditedRole,
  isSystemRole,
  isSubmitting,
  onCancel,
  onNext
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          角色名稱
        </Label>
        <Input
          id="name"
          value={editedRole.name}
          onChange={(e) => setEditedRole({...editedRole, name: e.target.value})}
          className="col-span-3"
          disabled={isSystemRole}
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right pt-2">
          描述
        </Label>
        <Textarea
          id="description"
          value={editedRole.description}
          onChange={(e) => setEditedRole({...editedRole, description: e.target.value})}
          className="col-span-3"
          rows={3}
          disabled={isSystemRole}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          取消
        </Button>
        <Button 
          onClick={onNext}
          disabled={isSubmitting}
        >
          下一步：設定權限
        </Button>
      </div>
    </div>
  );
};
