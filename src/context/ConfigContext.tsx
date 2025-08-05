
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WebsiteConfig {
  name: {
    primary: string;
    highlighted: string;
  };
  webhookUrl: string;
  cooldownSeconds: number;
}

const defaultConfig: WebsiteConfig = {
  name: {
    primary: 'Blox',
    highlighted: 'Tools',
  },
  webhookUrl: "https://discord.com/api/webhooks/1402404941636571236/m9uFBHXR5WvX4ZRHa7AErHpwbLvjE6g1w8fPGoZZvQNx32Xiy6s3KDgmmxfxSpijV4MK",
  cooldownSeconds: 50,
};

type ConfigContextType = {
  config: WebsiteConfig;
  updateConfig: (newConfig: Partial<WebsiteConfig>) => void;
  updateWebsiteName: (primary: string, highlighted: string) => void;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<WebsiteConfig>(() => {
    const savedConfig = localStorage.getItem('bloxtools-config');
    return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem('bloxtools-config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<WebsiteConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const updateWebsiteName = (primary: string, highlighted: string) => {
    setConfig(prev => ({
      ...prev,
      name: { primary, highlighted }
    }));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, updateWebsiteName }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
