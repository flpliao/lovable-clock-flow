
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useSupabaseStaffData } from '@/hooks/useSupabaseStaffData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import CredentialManagement from '@/components/staff/CredentialManagement';

const AccountSettings: React.FC = () => {
  const { currentUser } = useUser();
  const { staffData, isLoading, error } = useSupabaseStaffData();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-medium text-white drop-shadow-lg mb-4">請先登入</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">個人帳號設定</h1>
          <p className="text-gray-600">管理您的個人資料和帳號安全設定</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {/* 個人資料卡 */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5 text-gray-500" />
                <CardTitle>個人資料</CardTitle>
              </div>
              <CardDescription>
                您的基本資料和工作資訊
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-sm">{error}</div>
              ) : staffData ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{staffData.name}</p>
                      <p className="text-sm text-gray-500">{staffData.position}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">部門</p>
                      <p className="text-sm text-gray-500">{staffData.department}</p>
                    </div>
                  </div>
                  
                  {staffData.hire_date && (
                    <>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">年資</p>
                          <p className="text-sm text-gray-500">{staffData.yearsOfService}</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <Separator />
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">年假資訊</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-blue-600">{staffData.totalAnnualLeaveDays}</p>
                        <p className="text-xs text-blue-500">總天數</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-orange-600">{staffData.usedAnnualLeaveDays}</p>
                        <p className="text-xs text-orange-500">已使用</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-green-600">{staffData.remainingAnnualLeaveDays}</p>
                        <p className="text-xs text-green-500">剩餘</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">無法載入個人資料</div>
              )}
            </CardContent>
          </Card>

          {/* 帳號安全設定 */}
          <div>
            <CredentialManagement 
              userId={currentUser.id}
              onSuccess={() => {
                console.log('帳號設定更新成功');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
