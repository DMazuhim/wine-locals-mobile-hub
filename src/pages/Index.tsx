
import React, { useState } from 'react';
import WebView from '@/components/WebView';
import YouTubeShorts from '@/components/YouTubeShorts';
import TabNavigation from '@/components/TabNavigation';

const Index = () => {
  const [activeTab, setActiveTab] = useState('webview');

  const renderContent = () => {
    switch (activeTab) {
      case 'webview':
        return (
          <WebView 
            url="https://wine-locals.com" 
            title="Wine Locals"
          />
        );
      case 'youtube':
        return <YouTubeShorts />;
      default:
        return (
          <WebView 
            url="https://wine-locals.com" 
            title="Wine Locals"
          />
        );
    }
  };

  return (
    <div className="mobile-app bg-white">
      {renderContent()}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default Index;
