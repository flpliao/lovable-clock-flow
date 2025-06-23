
import React from 'react';
import Header from '@/components/Header';
import LocationCheckIn from '@/components/LocationCheckIn';
import { DepartmentManagementProvider } from '@/components/departments/DepartmentManagementContext';

const CheckIn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600">
      <Header />
      <div className="pt-20">
        <DepartmentManagementProvider>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LocationCheckIn />
          </div>
        </DepartmentManagementProvider>
      </div>
    </div>
  );
};

export default CheckIn;
