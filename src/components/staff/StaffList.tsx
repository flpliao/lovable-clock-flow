import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import React from 'react';
import { ROLE_ID_MAP } from './constants/roleIdMap';
import { Staff } from './types';

interface StaffListProps {
  staffList: Staff[];
  loading: boolean;
  onEditStaff: () => void;
  onDeleteStaff: () => Promise<void>;
}

export const StaffList: React.FC<StaffListProps> = ({
  staffList,
  loading,
  onEditStaff,
  onDeleteStaff,
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
      <div className="bg-white/60 rounded-lg border border-white/40 p-8 text-center">
        <div className="text-gray-500">暫無員工資料</div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 rounded-lg border border-white/40">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>部門</TableHead>
            <TableHead>職位</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>角色</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffList.map(staff => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">{staff.name || '未設定姓名'}</TableCell>
              <TableCell>{staff.department || '未設定'}</TableCell>
              <TableCell>{staff.position || '未設定'}</TableCell>
              <TableCell>{staff.email || '未設定'}</TableCell>
              <TableCell>{ROLE_ID_MAP[staff.role_id || ''] || '未設定'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditStaff(staff)}
                    className="bg-white/60 border-white/40 hover:bg-white/80 text-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDeleteStaff(staff.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
