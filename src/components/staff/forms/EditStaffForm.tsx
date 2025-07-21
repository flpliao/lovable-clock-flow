import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { Staff } from '../types';
import { EditStaffBranchField } from './EditStaffBranchField';
import { EditStaffRoleField } from './EditStaffRoleField';
import { EditStaffSupervisorField } from './EditStaffSupervisorField';

interface EditStaffFormProps {
  currentStaff: Staff;
  setCurrentStaff: (staff: Staff) => void;
  potentialSupervisors: Staff[];
  onHireDateChange?: (hasHireDate: boolean, entitledDays?: number) => void;
}

const EditStaffForm: React.FC<EditStaffFormProps> = ({
  currentStaff,
  setCurrentStaff,
  potentialSupervisors,
  onHireDateChange,
}) => {
  // 入職日期 input 變動
  const handleHireDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentStaff({ ...currentStaff, hire_date: value });
    if (onHireDateChange) {
      if (value) {
        // 這裡可根據需要計算 entitledDays
        onHireDateChange(true);
      } else {
        onHireDateChange(false);
      }
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* 基本欄位 */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          姓名 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={currentStaff.name || ''}
          onChange={e => setCurrentStaff({ ...currentStaff, name: e.target.value })}
          className="col-span-3"
          placeholder="請輸入姓名"
        />
      </div>
      <EditStaffBranchField currentStaff={currentStaff} setCurrentStaff={setCurrentStaff} />
      <EditStaffRoleField currentStaff={currentStaff} setCurrentStaff={setCurrentStaff} />
      <EditStaffSupervisorField
        currentStaff={currentStaff}
        setCurrentStaff={setCurrentStaff}
        potentialSupervisors={potentialSupervisors}
      />
      {/* 入職日期欄位 */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="hire_date" className="text-right">
          入職日期
        </Label>
        <Input
          id="hire_date"
          type="date"
          value={
            currentStaff.hire_date
              ? new Date(currentStaff.hire_date).toISOString().slice(0, 10)
              : ''
          }
          onChange={handleHireDateChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          電子郵件 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={currentStaff.email || ''}
          onChange={e => setCurrentStaff({ ...currentStaff, email: e.target.value })}
          className="col-span-3"
          placeholder="請輸入電子郵件"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contact" className="text-right">
          聯絡電話
        </Label>
        <Input
          id="contact"
          value={currentStaff.contact || ''}
          onChange={e => setCurrentStaff({ ...currentStaff, contact: e.target.value })}
          className="col-span-3"
          placeholder="請輸入聯絡電話"
        />
      </div>
    </div>
  );
};

export default EditStaffForm;
