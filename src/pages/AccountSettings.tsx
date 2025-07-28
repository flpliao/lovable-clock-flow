import CredentialManagement from '@/components/staff/CredentialManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import useEmployeeStore from '@/stores/employeeStore';
import { Calendar, MapPin, User } from 'lucide-react';
import React from 'react';

const AccountSettings: React.FC = () => {
  const { employee } = useEmployeeStore();

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
              <CardDescription>您的基本資料和工作資訊</CardDescription>
            </CardHeader>
            <CardContent>
              {!employee ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                      {employee.position && (
                        <p className="text-sm text-gray-500">{employee.position}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">部門</p>
                      {employee.department && (
                        <p className="text-sm text-gray-500">{employee.department}</p>
                      )}
                    </div>
                  </div>

                  {employee.start_date && (
                    <>
                      <Separator />
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">到職日</p>
                          <p className="text-sm text-gray-500">{employee.start_date}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* 年假資訊可根據 employee 結構調整顯示 */}
                  {/* {employee.totalAnnualLeaveDays !== undefined && (
                    <>
                      <Separator />
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">年假資訊</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-lg font-semibold text-blue-600">
                              {employee.totalAnnualLeaveDays}
                            </p>
                            <p className="text-xs text-blue-500">總天數</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-orange-600">
                              {employee.usedAnnualLeaveDays ?? '-'}
                            </p>
                            <p className="text-xs text-orange-500">已使用</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-green-600">
                              {employee.remainingAnnualLeaveDays ?? '-'}
                            </p>
                            <p className="text-xs text-green-500">剩餘</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )} */}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 帳號安全設定 */}
          <div>{employee && <CredentialManagement />}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
