
import React from 'react';
import { Button } from '@/components/ui/button';

interface ManageAccountPromptProps {
  onSwitchTab: () => void;
}

const ManageAccountPrompt: React.FC<ManageAccountPromptProps> = ({ onSwitchTab }) => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-600">請先登入以管理您的帳號設定</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onSwitchTab}
      >
        返回登入頁面
      </Button>
    </div>
  );
};

export default ManageAccountPrompt;
