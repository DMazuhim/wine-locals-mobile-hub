
import React, { useState, useEffect } from 'react';
import WebView from '@/components/WebView';
import YouTubeShorts from '@/components/YouTubeShorts';
import TabNavigation from '@/components/TabNavigation';
import Login from '@/components/Login';

const STORAGE_KEY = "wine-locals-user-session";

const Index = () => {
  const [activeTab, setActiveTab] = useState('webview');
  const [jwt, setJwt] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Carrega sessão ao inicializar
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const session = JSON.parse(data);
        if (session.jwt && session.user) {
          setJwt(session.jwt);
          setUser(session.user);
        }
      } catch { /* ignore parse errors */ }
    }
    setCheckingSession(false);
  }, []);

  // Manipula sucesso do login
  const handleLoginSuccess = (userData: any, jwtToken: string) => {
    setUser(userData);
    setJwt(jwtToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, jwt: jwtToken }));
  };

  // Logout para testes (opcional)
  const handleLogout = () => {
    setJwt(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Mostra login até ter usuário autenticado e jwt
  if (checkingSession) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  if (!jwt || !user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Monta a URL autenticada para a WebView, passando jwt (query string)
  const wineLocalsUrl = `https://wine-locals.com?jwt=${encodeURIComponent(jwt)}`;

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
      {/* Botão de logout só para debug/teste; remova na produção */}
      {/* <button onClick={handleLogout}>Sair</button> */}
      {renderContent()}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default Index;

