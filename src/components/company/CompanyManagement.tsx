
import React, { useState } from 'react';
import CompanyManagementHeader from './components/CompanyManagementHeader';
import CompanyInfoCard from './CompanyInfoCard';
import BranchTable from './BranchTable';
import RLSSettingsCard from './components/RLSSettingsCard';
import CheckInDistanceSettings from './components/CheckInDistanceSettings';
import { useCompanyManagement } from './useCompanyManagement';

const CompanyManagement = () => {
  const [activeTab, setActiveTab] = useState('company');
  const companyData = useCompanyManagement();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return <CompanyInfoCard {...companyData} />;
      case 'branches':
        return <BranchTable {...companyData} />;
      case 'settings':
        return <RLSSettingsCard />;
      case 'checkin':
        return <CheckInDistanceSettings />;
      default:
        return <CompanyInfoCard {...companyData} />;
    }
  };

  return (
    <div className="space-y-6">
      <CompanyManagementHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      {renderTabContent()}
    </div>
  );
};

export default CompanyManagement;
