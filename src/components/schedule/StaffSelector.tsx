
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { Control } from 'react-hook-form';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';

interface StaffSelectorProps {
  control: Control<any>;
}

const StaffSelector = ({ control }: StaffSelectorProps) => {
  const { staffList } = useStaffManagementContext();

  return (
    <FormField
      control={control}
      name="userId"
      rules={{ required: '請選擇員工' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center space-x-2 text-sm sm:text-base font-medium mb-2 sm:mb-3">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span>選擇員工</span>
          </FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-11 sm:h-12 text-sm sm:text-base border-2 border-gray-200 rounded-lg">
                <SelectValue placeholder="請選擇要排班的員工" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
                {staffList.map((staffMember) => (
                  <SelectItem 
                    key={staffMember.id} 
                    value={staffMember.id}
                    className="py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base hover:bg-gray-50"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{staffMember.name}</span>
                      <span className="text-xs sm:text-sm text-gray-500">{staffMember.position}</span>
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
