import useEmployeeStore from '@/stores/employeeStore';
import React from 'react';
import EmailManagementCard from './credentials/EmailManagementCard';
import PasswordManagementCard from './credentials/PasswordManagementCard';

const CredentialManagement: React.FC = () => {
  const { employee, setEmail } = useEmployeeStore();

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  return (
    <div className="space-y-6">
      <EmailManagementCard currentEmail={employee?.email || ''} onEmailChange={handleEmailChange} />
      <PasswordManagementCard />
    </div>
  );
};

export default CredentialManagement;
