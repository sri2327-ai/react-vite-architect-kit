
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lightTheme, darkTheme } from '@/theme';
import { Layout } from '@/components/common';
import { ThemeContext, useThemeStorage } from '@/hooks/useTheme';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const themeMode = useThemeStorage();

  return (
    <ThemeContext.Provider value={themeMode}>
      <ThemeProvider theme={themeMode.isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={
              <Layout>
                <Index />
              </Layout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
