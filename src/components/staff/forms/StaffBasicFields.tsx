
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { NewStaff } from '../types';

interface StaffBasicFieldsProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
}

export const StaffBasicFields: React.FC<StaffBasicFieldsProps> = ({ newStaff, setNewStaff }) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-3">
        <Label htmlFor="name" className="text-right text-xs">
          姓名 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={newStaff.name}
          onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
          className="col-span-3 h-8 text-xs"
          placeholder="請輸入員工姓名"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-3">
        <Label htmlFor="position" className="text-right text-xs">
          職位 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="position"
          value={newStaff.position}
          onChange={(e) => setNewStaff({...newStaff, position: e.target.value})}
          className="col-span-3 h-8 text-xs"
          placeholder="請輸入職位"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-3">
        <Label htmlFor="department" className="text-right text-xs">
          部門 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="department"
          value={newStaff.department}
          onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
          className="col-span-3 h-8 text-xs"
          placeholder="請輸入部門"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-3">
        <Label htmlFor="contact" className="text-right text-xs">
          聯絡電話 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="contact"
          value={newStaff.contact}
          onChange={(e) => setNewStaff({...newStaff, contact: e.target.value})}
          className="col-span-3 h-8 text-xs"
          placeholder="請輸入聯絡電話"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-3">
        <Label htmlFor="email" className="text-right text-xs">
          電子郵件
        </Label>
        <Input
          id="email"
          type="email"
          value={newStaff.email || ''}
          onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
          className="col-span-3 h-8 text-xs"
          placeholder="請輸入電子郵件"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-3">
        <Label htmlFor="username" className="text-right text-xs">
          使用者名稱
        </Label>
        <Input
          id="username"
          value={newStaff.username || ''}
          onChange={(e) => setNewStaff({...newStaff, username: e.target.value})}
          className="col-span-3 h-8 text-xs"
          placeholder="請輸入使用者名稱"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-3">
        <Label htmlFor="hire_date" className="text-right text-xs">
          入職日期
        </Label>
        <Input
          id="hire_date"
          type="date"
          value={newStaff.hire_date || ''}
          onChange={(e) => setNewStaff({...newStaff, hire_date: e.target.value})}
          className="col-span-3 h-8 text-xs"
        />
      </div>
    </>
  );
};

// Default export for backward compatibility
export default StaffBasicFields;
