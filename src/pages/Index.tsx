import React, { useState } from 'react';
import WebView from '@/components/WebView';
import YouTubeShorts from '@/components/YouTubeShorts';
import TabNavigation from '@/components/TabNavigation';
import RegiaoMapPage from "./RegiaoMapPage";

// Não precisamos mais do Login nem persistência de sessão

const Index = () => {
  const [activeTab, setActiveTab] = useState('webview');

  // URLs simples para navegação fluida
  const wineLocalsUrl = "https://wine-locals.com";

  const renderContent = () => {
    switch (activeTab) {
      case 'webview':
        return (
          <WebView 
            url={wineLocalsUrl}
            title="Wine Locals"
          />
        );
      case 'youtube':
        return <YouTubeShorts />;
      case 'regiao-map':
        return <RegiaoMapPage />;
      default:
        return (
          <WebView 
            url={wineLocalsUrl}
            title="Wine Locals"
          />
        );
    }
  };

  return (
    <div className="mobile-app bg-white">
      {/* Exibe navegação e conteúdo diretamente */}
      {renderContent()}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default Index;
