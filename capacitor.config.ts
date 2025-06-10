
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.37714475ac6f4fec9ee6d56ab14dccf4',
  appName: 'Wine Locals',
  webDir: 'dist',
  server: {
    url: 'https://37714475-ac6f-4fec-9ee6-d56ab14dccf4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#7c2d12',
      showSpinner: false
    }
  }
};

export default config;
