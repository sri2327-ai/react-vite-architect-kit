
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GuideState {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  userMode: 'ehr' | 'standalone';
  completedSteps: string[];
  canProceed: boolean;
  hasCompletedGuide: boolean;
}

interface GuideContextType {
  guideState: GuideState;
  startGuide: (mode: 'ehr' | 'standalone') => void;
  nextStep: () => void;
  prevStep: () => void;
  completeStep: (stepId: string) => void;
  skipGuide: () => void;
  resetGuide: () => void;
  setCanProceed: (canProceed: boolean) => void;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

export const useGuide = () => {
  const context = useContext(GuideContext);
  if (!context) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
};

interface GuideProviderProps {
  children: React.ReactNode;
}

export const GuideProvider: React.FC<GuideProviderProps> = ({ children }) => {
  const [guideState, setGuideState] = useState<GuideState>(() => {
    const saved = localStorage.getItem('implementation-guide-state');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      isActive: false,
      currentStep: 0,
      totalSteps: 0,
      userMode: 'standalone',
      completedSteps: [],
      canProceed: true,
      hasCompletedGuide: false
    };
  });

  useEffect(() => {
    localStorage.setItem('implementation-guide-state', JSON.stringify(guideState));
  }, [guideState]);

  const startGuide = (mode: 'ehr' | 'standalone') => {
    const totalSteps = mode === 'ehr' ? 6 : 4; // EHR: Welcome, Templates, Workflows, Import, Config, Complete | Standalone: Welcome, Templates, Complete
    setGuideState(prev => ({
      ...prev,
      isActive: true,
      currentStep: 0,
      totalSteps,
      userMode: mode,
      completedSteps: [],
      canProceed: true,
      hasCompletedGuide: false
    }));
  };

  const nextStep = () => {
    setGuideState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps - 1),
      canProceed: true
    }));
  };

  const prevStep = () => {
    setGuideState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      canProceed: true
    }));
  };

  const completeStep = (stepId: string) => {
    setGuideState(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps.filter(id => id !== stepId), stepId]
    }));
  };

  const skipGuide = () => {
    setGuideState(prev => ({
      ...prev,
      isActive: false,
      hasCompletedGuide: true
    }));
  };

  const resetGuide = () => {
    setGuideState({
      isActive: false,
      currentStep: 0,
      totalSteps: 0,
      userMode: 'standalone',
      completedSteps: [],
      canProceed: true,
      hasCompletedGuide: false
    });
    localStorage.removeItem('implementation-guide-state');
  };

  const setCanProceed = (canProceed: boolean) => {
    setGuideState(prev => ({ ...prev, canProceed }));
  };

  return (
    <GuideContext.Provider
      value={{
        guideState,
        startGuide,
        nextStep,
        prevStep,
        completeStep,
        skipGuide,
        resetGuide,
        setCanProceed
      }}
    >
      {children}
    </GuideContext.Provider>
  );
};
