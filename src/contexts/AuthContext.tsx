
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  logout: () => Promise<void>;
  user: any;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const logout = async () => {
    // Mock logout functionality
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ logout, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
