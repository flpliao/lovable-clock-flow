
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import LeaveRequestForm from '@/components/LeaveRequestForm';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

const LeaveRequest: React.FC = () => {
  const navigate = useNavigate();
  const { annualLeaveBalance } = useUser();
  
  const availableHours = annualLeaveBalance 
    ? (annualLeaveBalance.total_days - annualLeaveBalance.used_days) * 8 
    : 0;
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container px-4 py-6 max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 text-gray-500 hover:text-gray-700"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">請假申請</h1>
          <p className="text-gray-500">填寫以下表單申請請假</p>
          {annualLeaveBalance && (
            <div className="mt-2 text-sm">
              <span className="text-gray-600">特休假剩餘：</span>
              <span className="font-medium text-blue-600">
                {annualLeaveBalance.total_days - annualLeaveBalance.used_days} 天
                ({availableHours} 小時)
              </span>
            </div>
          )}
        </div>
        
        <LeaveRequestForm />
      </div>
    </div>
  );
};

export default LeaveRequest;
