
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import CompanyManagementRedesigned from '../CompanyManagementRedesigned';

export const CompanyBranchTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className={`grid w-full grid-cols-1 ${isMobile ? 'mb-3' : 'mb-4'}`}>
        <TabsTrigger value="overview" className={isMobile ? 'text-sm py-2' : ''}>
          管理
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-0">
        <CompanyManagementRedesigned />
      </TabsContent>
    </Tabs>
  );
};
