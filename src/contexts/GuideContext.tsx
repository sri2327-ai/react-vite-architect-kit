
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface GuideState {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  userMode: 'ehr' | 'standalone';
  completedSteps: string[];
  canProceed: boolean;
  isSkipped: boolean;
}

interface GuideContextType {
  guideState: GuideState;
  startGuide: (mode: 'ehr' | 'standalone') => void;
  nextStep: () => void;
  prevStep: () => void;
  skipGuide: () => void;
  completeStep: (stepId: string) => void;
  setCanProceed: (canProceed: boolean) => void;
  resetGuide: () => void;
  closeGuide: () => void;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

interface GuideProviderProps {
  children: ReactNode;
}

export const GuideProvider: React.FC<GuideProviderProps> = ({ children }) => {
  const [guideProgress, setGuideProgress] = useLocalStorage('implementation-guide-state', {
    hasCompletedGuide: false,
    hasSkippedGuide: false,
    completedSteps: []
  });

  const [guideState, setGuideState] = useState<GuideState>({
    isActive: false,
    currentStep: 0,
    totalSteps: 6,
    userMode: 'standalone',
    completedSteps: guideProgress.completedSteps || [],
    canProceed: true,
    isSkipped: false
  });

  const startGuide = useCallback((mode: 'ehr' | 'standalone') => {
    const totalSteps = mode === 'ehr' ? 6 : 4; // EHR mode has more steps
    setGuideState(prev => ({
      ...prev,
      isActive: true,
      currentStep: 0,
      userMode: mode,
      totalSteps,
      canProceed: true,
      isSkipped: false
    }));
  }, []);

  const nextStep = useCallback(() => {
    setGuideState(prev => {
      if (prev.currentStep < prev.totalSteps - 1) {
        return { ...prev, currentStep: prev.currentStep + 1, canProceed: true };
      }
      // If it's the last step, complete the guide
      setGuideProgress({
        hasCompletedGuide: true,
        hasSkippedGuide: false,
        completedSteps: prev.completedSteps
      });
      return { ...prev, isActive: false };
    });
  }, [setGuideProgress]);

  const prevStep = useCallback(() => {
    setGuideState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
      canProceed: true
    }));
  }, []);

  const skipGuide = useCallback(() => {
    setGuideProgress({
      hasCompletedGuide: false,
      hasSkippedGuide: true,
      completedSteps: guideState.completedSteps
    });
    setGuideState(prev => ({ ...prev, isActive: false, isSkipped: true }));
  }, [guideState.completedSteps, setGuideProgress]);

  const completeStep = useCallback((stepId: string) => {
    setGuideState(prev => {
      const newCompletedSteps = [...prev.completedSteps];
      if (!newCompletedSteps.includes(stepId)) {
        newCompletedSteps.push(stepId);
      }
      return { ...prev, completedSteps: newCompletedSteps };
    });
  }, []);

  const setCanProceed = useCallback((canProceed: boolean) => {
    setGuideState(prev => ({ ...prev, canProceed }));
  }, []);

  const resetGuide = useCallback(() => {
    setGuideProgress({
      hasCompletedGuide: false,
      hasSkippedGuide: false,
      completedSteps: []
    });
    setGuideState(prev => ({
      ...prev,
      isActive: false,
      currentStep: 0,
      completedSteps: [],
      canProceed: true,
      isSkipped: false
    }));
  }, [setGuideProgress]);

  const closeGuide = useCallback(() => {
    setGuideState(prev => ({ ...prev, isActive: false }));
  }, []);

  const value: GuideContextType = {
    guideState,
    startGuide,
    nextStep,
    prevStep,
    skipGuide,
    completeStep,
    setCanProceed,
    resetGuide,
    closeGuide
  };

  return (
    <GuideContext.Provider value={value}>
      {children}
    </GuideContext.Provider>
  );
};

export const useGuide = (): GuideContextType => {
  const context = useContext(GuideContext);
  if (!context) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
};
