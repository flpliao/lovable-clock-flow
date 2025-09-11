import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = false, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3 pointer-events-auto', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-2xl font-medium text-gray-800 drop-shadow-sm',
        caption_dropdowns: 'flex justify-center gap-1',
        dropdown_month:
          'relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500',
        dropdown_year:
          'relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100 border-none text-gray-800'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1 w-full',
        head_row: 'flex w-full justify-between mt-4',
        head_cell: 'text-gray-800 font-semibold rounded-md w-20 text-[0.9rem] drop-shadow-sm',
        row: 'flex w-full mt-3 justify-between',
        cell: 'relative p-0 text-center text-sm rounded-full h-10 w-20 focus-within:relative focus-within:z-20',
        day: cn(
          'h-10 w-10 p-0 font-normal rounded-full transition-colors hover:bg-gray-100 text-gray-800 font-medium'
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-[#0091D0] text-white hover:bg-[#0091D0] hover:text-white focus:bg-[#0091D0] focus:text-white',
        day_today: 'bg-gray-200 text-gray-900 font-semibold',
        day_outside: 'day-outside text-gray-500 opacity-60',
        day_disabled: 'text-gray-400 opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-6 w-6 text-gray-800" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-6 w-6 text-gray-800" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
