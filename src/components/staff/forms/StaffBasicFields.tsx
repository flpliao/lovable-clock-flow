import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { NewStaff } from '../types';

interface StaffBasicFieldsProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
}

export const StaffBasicFields: React.FC<StaffBasicFieldsProps> = ({ newStaff, setNewStaff }) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          姓名 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={newStaff.name}
          onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
          className="col-span-3"
          placeholder="請輸入員工姓名"
          required
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contact" className="text-right">
          聯絡電話 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="contact"
          value={newStaff.contact}
          onChange={e => setNewStaff({ ...newStaff, contact: e.target.value })}
          className="col-span-3"
          placeholder="請輸入聯絡電話"
          required
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          電子郵件
        </Label>
        <Input
          id="email"
          type="email"
          value={newStaff.email || ''}
          onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
          className="col-span-3"
          placeholder="請輸入電子郵件"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="hire_date" className="text-right">
          入職日期
        </Label>
        <Input
          id="hire_date"
          type="date"
          value={newStaff.hire_date || ''}
          onChange={e => setNewStaff({ ...newStaff, hire_date: e.target.value })}
          className="col-span-3"
        />
      </div>
    </>
  );
};

// Default export for backward compatibility
export default StaffBasicFields;
