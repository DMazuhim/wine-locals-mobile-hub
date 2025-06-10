
import React from 'react';

interface WebViewProps {
  url: string;
  title: string;
}

const WebView: React.FC<WebViewProps> = ({ url, title }) => {
  return (
    <div className="webview-container">
      <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-900 p-4 text-white">
        <h1 className="text-lg font-semibold text-center">{title}</h1>
      </div>
      <iframe 
        src={url}
        className="webview-iframe"
        title={title}
        sandbox="allow-same-origin allow-scripts allow-navigation allow-forms"
        loading="lazy"
      />
    </div>
  );
};

export default WebView;
