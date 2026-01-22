
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AdBlocker } from './utils/adBlocker';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

AdBlocker.initialize();
AdBlocker.injectCSS();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log ad blocker stats every 30 seconds (optional monitoring)
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const stats = AdBlocker.getStats();
    if (stats.blockedCount > 0) {
      console.log(`📊 [AdBlocker Stats] Total blocked: ${stats.blockedCount} requests`);
    }
  }, 30000);
}