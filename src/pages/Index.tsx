
import React, { useState, useEffect } from 'react';
import WebView from '@/components/WebView';
import YouTubeShorts from '@/components/YouTubeShorts';
import UserProfile from '@/components/UserProfile';
import TabNavigation from '@/components/TabNavigation';

const Index = () => {
  const [activeTab, setActiveTab] = useState('webview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula loading inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
      case 'profile':
        return <UserProfile />;
      default:
        return (
          <WebView 
            url="https://wine-locals.com" 
            title="Wine Locals"
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="mobile-app flex items-center justify-center bg-gradient-to-br from-burgundy-800 via-burgundy-900 to-red-900">
        <div className="text-center text-white">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-3xl font-bold text-burgundy-900">W</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Wine Locals</h1>
          <p className="text-burgundy-200 mb-6">Descubra o mundo dos vinhos</p>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-app">
      {renderContent()}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default Index;
