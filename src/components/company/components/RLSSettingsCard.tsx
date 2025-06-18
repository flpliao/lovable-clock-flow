
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Settings, Check, X, ChevronDown, Database, Lock, Unlock } from 'lucide-react';
import { useRLSSettings } from '../hooks/useRLSSettings';

export const RLSSettingsCard: React.FC = () => {
  const { 
    isGlobalRLSEnabled, 
    toggleGlobalRLS,
    tableRLSStatus,
    toggleTableRLS,
    loading 
  } = useRLSSettings();

  return (
    <Card className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-lg">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="flex items-center text-lg text-gray-900 drop-shadow-sm">
          <div className="p-2 bg-blue-500/90 rounded-lg shadow-md mr-3">
            <Shield className="h-5 w-5 text-white" />
          </div>
          資料庫安全政策 (RLS)
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 px-4 pb-4">
        {/* 全域設定 */}
        <div className="flex items-center justify-between py-4 px-4 border-b border-white/20">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500/90 rounded-lg shadow-md mr-3">
              {isGlobalRLSEnabled ? (
                <Lock className="h-4 w-4 text-white" />
              ) : (
                <Unlock className="h-4 w-4 text-white" />
              )}
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900 drop-shadow-sm">全域安全政策</span>
              <div className="flex items-center mt-1">
                {isGlobalRLSEnabled ? (
                  <div className="flex items-center">
                    <Check className="h-3 w-3 mr-1 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">已啟用</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <X className="h-3 w-3 mr-1 text-red-500" />
                    <span className="text-xs text-red-600 font-medium">已停用</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Switch
            checked={isGlobalRLSEnabled}
            onCheckedChange={toggleGlobalRLS}
            disabled={loading}
          />
        </div>

        {/* 表格設定 - 使用 Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="table-settings" className="border border-white/30 rounded-lg">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold text-gray-900 drop-shadow-sm hover:no-underline hover:bg-white/10 rounded-t-lg">
              <div className="flex items-center">
                <div className="p-2 bg-teal-500/90 rounded-lg shadow-md mr-3">
                  <Database className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div>表格級別設定</div>
                  <div className="text-xs text-gray-600 font-normal mt-1">
                    ({tableRLSStatus.filter(t => t.enabled).length}/{tableRLSStatus.length} 已啟用)
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                {tableRLSStatus.map((table) => (
                  <div key={table.tableName} className="flex items-center justify-between p-3 bg-white/20 border border-white/30 rounded-lg text-sm hover:bg-white/25 transition-colors duration-200">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="p-1.5 bg-gray-500/90 rounded-md shadow-sm mr-3">
                        <Database className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <span className="truncate font-medium text-gray-900 drop-shadow-sm">{table.displayName}</span>
                        <div className="flex items-center mt-1">
                          {table.enabled ? (
                            <div className="flex items-center">
                              <Check className="h-3 w-3 mr-1 text-green-600" />
                              <span className="text-xs text-green-700 font-medium">安全</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <X className="h-3 w-3 mr-1 text-gray-400" />
                              <span className="text-xs text-gray-500 font-medium">開放</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={table.enabled}
                      onCheckedChange={() => toggleTableRLS(table.tableName)}
                      disabled={loading}
                      className="ml-3 flex-shrink-0"
                    />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* 狀態提示 */}
        {!isGlobalRLSEnabled && (
          <Alert className="bg-orange-100/60 border border-orange-200/60 backdrop-blur-sm">
            <div className="p-1.5 bg-orange-500/90 rounded-md shadow-sm">
              <X className="h-3 w-3 text-white" />
            </div>
            <AlertDescription className="text-sm text-orange-800 font-medium ml-2">
              開發模式：資料庫安全政策已關閉，請在生產環境中啟用
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
