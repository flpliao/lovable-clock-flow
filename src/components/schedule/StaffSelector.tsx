import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useCurrentUser, usePermissionChecker } from '@/hooks/useStores';
import React from 'react';
import { Control } from 'react-hook-form';
import { Staff } from '@/components/staff/types';

type FormValues = {
  userId: string;
  selectedYear: string;
  selectedMonth: string;
  selectedDates: string[];
  selectedTimeSlots: string[];
};

interface StaffSelectorProps {
  control: Control<FormValues>;
}

const StaffSelector = ({ control }: StaffSelectorProps) => {
  const { staffList } = useStaffManagementContext();
  const currentUser = useCurrentUser();
  const { hasPermission } = usePermissionChecker();

  // 根據權限過濾可選員工
  const getSelectableStaff = async () => {
    if (!currentUser) return [];

    // 有創建排班權限的用戶可以選擇所有員工
    if (await hasPermission('schedule:create')) {
      return staffList;
    }

    // 一般用戶只能選擇自己（雖然他們不應該看到這個表單）
    return staffList.filter(staff => staff.id === currentUser.id);
  };

  const [selectableStaff, setSelectableStaff] = React.useState<Staff[]>([]);

  React.useEffect(() => {
    const loadSelectableStaff = async () => {
      const staff = await getSelectableStaff();
      setSelectableStaff(staff);
    };
    loadSelectableStaff();
  }, [currentUser, staffList]);

  return (
    <FormField
      control={control}
      name="userId"
      rules={{ required: '請選擇員工' }}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-14 text-lg bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-black placeholder:text-black/50">
                <SelectValue placeholder="請選擇要排班的員工" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-2xl shadow-xl z-50">
                {selectableStaff.map(staffMember => (
                  <SelectItem
                    key={staffMember.id}
                    value={staffMember.id}
                    className="py-4 px-6 text-lg hover:bg-gray-50 rounded-xl text-black"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-black">{staffMember.name}</span>
                      <span className="text-sm text-gray-500">
                        {staffMember.position} - {staffMember.department}
                        {staffMember.id === currentUser?.id ? ' (自己)' : ''}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StaffSelector;
