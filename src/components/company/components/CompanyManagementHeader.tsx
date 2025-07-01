import React from 'react';
import { Building2, Users, Settings, MapPin } from 'lucide-react';

interface CompanyManagementHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CompanyManagementHeader: React.FC<CompanyManagementHeaderProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs = [
    {
      id: 'company',
      label: '公司資訊',
      icon: Building2,
      description: '管理公司基本資訊'
    },
    {
      id: 'branches',
      label: '分店管理',
      icon: Users,
      description: '管理分店與分部'
    },
    {
      id: 'checkin',
      label: '打卡設定',
      icon: MapPin,
      description: 'GPS打卡距離設定'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">公司管理</h1>
          <p className="text-gray-600 mt-1">管理公司資訊、分店和打卡設定</p>
        </div>
      </div>
      
      <div className="mt-6">
        <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default CompanyManagementHeader;
