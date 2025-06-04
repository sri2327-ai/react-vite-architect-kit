
import React, { createContext, useContext, useState } from 'react';

interface ApiContextType {
  useApiData: boolean;
  setUseApiData: (value: boolean) => void;
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
};

interface ApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [useApiData, setUseApiData] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api');

  return (
    <ApiContext.Provider value={{
      useApiData,
      setUseApiData,
      apiBaseUrl,
      setApiBaseUrl
    }}>
      {children}
    </ApiContext.Provider>
  );
};
