import React from 'react';
interface WebViewProps {
  url: string;
  title: string;
}
const WebView: React.FC<WebViewProps> = ({
  url,
  title
}) => {
  return <div className="webview-container">
      
      <iframe src={url} className="webview-iframe" title={title} sandbox="allow-same-origin allow-scripts allow-navigation allow-forms" loading="lazy" />
    </div>;
};
export default WebView;