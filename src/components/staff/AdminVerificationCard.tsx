
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, User, CheckCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useStaffInitializer } from './hooks/useStaffInitializer';

const AdminVerificationCard = () => {
  const { currentUser, isAdmin } = useUser();
  const { verifyAdminAccess } = useStaffInitializer();

  const handleVerifyAdmin = () => {
    verifyAdminAccess();
  };

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          管理者身份確認
        </CardTitle>
        <CardDescription>
          當前登入用戶的管理者權限狀態
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">用戶姓名:</span>
              <span>{currentUser?.name || '未知'}</span>
            </div>
            {isAdmin() && (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                管理者
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="font-medium">權限級別:</span>
              <span>{currentUser?.role || '未設定'}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium">部門:</span>
              <span>{currentUser?.department || '未設定'}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={handleVerifyAdmin}
              variant="outline"
              size="sm"
              className="w-full"
            >
              重新驗證管理者權限
            </Button>
          </div>
          
          {isAdmin() && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                ✅ 已確認：您具有系統管理者權限，可以管理所有員工和系統設定
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminVerificationCard;
