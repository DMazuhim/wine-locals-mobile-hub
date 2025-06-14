import React from 'react';
import { Home, Video, Map } from 'lucide-react';

// Defina estilos para os botões da tab navigation aqui
const tabButtonStyles = {
  base: "flex-1 p-3 flex flex-col items-center justify-center focus:outline-none",
  active: "text-primary font-bold",
  inactive: "text-neutral-500",
};

// Adicione o novo tab para Ver por região
const tabs = [
  {
    key: "webview",
    label: "Home",
    icon: Home,
  },
  {
    key: "youtube",
    label: "Trends",
    icon: Video,
  },
  {
    key: "regiao-map",
    label: "Ver por região",
    icon: Map,
  }
];

const TabNavigation = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (t: string) => void }) => {
  return (
    <nav className="tab-navigation flex justify-around items-center">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`tab-button ${tabButtonStyles.base} ${activeTab === tab.key ? tabButtonStyles.active : tabButtonStyles.inactive} `}
        >
          <tab.icon size={24} />
          <span className="text-xs mt-1">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default TabNavigation;
