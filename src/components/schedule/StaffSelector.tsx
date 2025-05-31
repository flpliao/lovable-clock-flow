
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { Control } from 'react-hook-form';

interface StaffSelectorProps {
  control: Control<any>;
}

const StaffSelector = ({ control }: StaffSelectorProps) => {
  const { staffList, getSubordinates } = useStaffManagementContext();
  const { currentUser } = useUser();

  // 獲取可排班的員工列表（包含自己和下屬）
  const getAvailableStaff = () => {
    if (!currentUser) return [];
    
    const availableStaff = [];
    
    // 自己可以為自己排班
    const selfStaff = staffList.find(staff => staff.id === currentUser.id);
    if (selfStaff) {
      availableStaff.push(selfStaff);
    }
    
    // 如果是主管，可以為下屬排班
    if (currentUser.role === 'admin' || currentUser.role === 'manager') {
      const subordinates = getSubordinates(currentUser.id);
      availableStaff.push(...subordinates);
    }
    
    // 去重並排序
    const uniqueStaff = availableStaff.filter((staff, index, self) => 
      index === self.findIndex(s => s.id === staff.id)
    );
    
    return uniqueStaff.sort((a, b) => {
      // 自己排在最前面
      if (a.id === currentUser.id) return -1;
      if (b.id === currentUser.id) return 1;
      return a.name.localeCompare(b.name);
    });
  };

  const getStaffRelation = (staffId: string) => {
    if (staffId === currentUser?.id) return '（自己）';
    if (getSubordinates(currentUser?.id || '').some(s => s.id === staffId)) return '（下屬）';
    return '';
  };

  const availableStaff = getAvailableStaff();

  return (
    <FormField
      control={control}
      name="userId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>選擇員工</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="選擇員工" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {availableStaff.length > 0 ? (
                availableStaff.map(staff => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name} - {staff.department} ({staff.position}) {getStaffRelation(staff.id)}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-staff" disabled>
                  暫無可排班員工
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StaffSelector;
