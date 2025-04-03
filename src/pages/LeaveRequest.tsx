import React from 'react';
import Header from '@/components/Header';
import LeaveRequestForm from '@/components/LeaveRequestForm';
import LeaveBalance from '@/components/LeaveBalance';
import LeaveHistory from '@/components/LeaveHistory';
import ShiftReminder from '@/components/ShiftReminder';

const LeaveRequest = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <Header />
        
        {/* Add the ShiftReminder component here */}
        <ShiftReminder />
        
        <LeaveBalance />
        <LeaveRequestForm />
        <LeaveHistory />
      </div>
    </div>
  );
};

export default LeaveRequest;
