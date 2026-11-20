import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rtot42.ciberkids',
  appName: 'CiberKids',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
  },
};

export default config;
