
import React from 'react';
import { Globe, Youtube, User } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'webview', icon: Globe, label: 'Wine Locals' },
    { id: 'youtube', icon: Youtube, label: 'Shorts' },
    { id: 'profile', icon: User, label: 'Perfil' }
  ];

  return (
    <div className="tab-navigation bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
      <div className="flex h-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`tab-button flex-1 flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                isActive ? 'text-purple-200' : 'text-purple-300 hover:text-purple-200'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <div className="w-8 h-0.5 bg-purple-200 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
