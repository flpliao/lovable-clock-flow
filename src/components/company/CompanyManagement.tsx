
import React, { useState } from 'react';
import CompanyManagementHeader from './components/CompanyManagementHeader';
import CompanyInfoCard from './CompanyInfoCard';
import BranchTable from './BranchTable';
import { RLSSettingsCard } from './components/RLSSettingsCard';
import CheckInDistanceSettings from './components/CheckInDistanceSettings';
import { CompanyManagementProvider } from './CompanyManagementContext';

const CompanyManagement = () => {
  const [activeTab, setActiveTab] = useState('company');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return <CompanyInfoCard />;
      case 'branches':
        return <BranchTable />;
      case 'settings':
        return <RLSSettingsCard />;
      case 'checkin':
        return <CheckInDistanceSettings />;
      default:
        return <CompanyInfoCard />;
    }
  };

  return (
    <CompanyManagementProvider>
      <div className="space-y-6">
        <CompanyManagementHeader 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        {renderTabContent()}
      </div>
    </CompanyManagementProvider>
  );
};

export default CompanyManagement;
