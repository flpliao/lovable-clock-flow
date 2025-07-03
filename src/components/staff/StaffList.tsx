import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ROLE_ID_MAP } from './constants/roleIdMap';
import { Staff, StaffRole } from './types';

interface StaffListProps {
  staffList: Staff[];
  loading: boolean;
  onEditStaff: (staff: Staff) => void;
  onDeleteStaff: (id: string) => Promise<void>;
  roles: StaffRole[];
}

export const StaffList: React.FC<StaffListProps> = ({
  staffList,
  loading,
  onEditStaff,
  onDeleteStaff,
  roles
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  if (staffList.length === 0) {
    return (
      <Card className="bg-white/60 border-white/40">
        <CardContent className="py-8 text-center">
          <div className="text-gray-500">暫無員工資料</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {staffList.map((staff) => (
        <Card key={staff.id} className="bg-white/60 border-white/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{staff.name || '未設定姓名'}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>部門: {staff.department || '未設定'}</div>
                  <div>職位: {staff.position || '未設定'}</div>
                  <div>Email: {staff.email || '未設定'}</div>
                  <div>角色: {ROLE_ID_MAP[staff.role_id || ''] || '未設定'}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditStaff(staff)}
                  className="bg-white/60 border-white/40 hover:bg-white/80 text-gray-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteStaff(staff.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
