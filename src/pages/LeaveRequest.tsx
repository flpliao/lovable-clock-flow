
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import LeaveRequestForm from '@/components/LeaveRequestForm';
import { Button } from '@/components/ui/button';

const LeaveRequest: React.FC = () => {
  const navigate = useNavigate();
  
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
        </div>
        
        <LeaveRequestForm />
      </div>
    </div>
  );
};

export default LeaveRequest;
