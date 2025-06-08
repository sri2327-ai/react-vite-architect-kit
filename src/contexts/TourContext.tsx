
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector or data-tour-id
  placement?: 'top' | 'bottom' | 'left' | 'right';
  disableBeacon?: boolean;
  spotlightClicks?: boolean;
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  steps: TourStep[];
  autoStart?: boolean;
  showProgress?: boolean;
  allowSkip?: boolean;
}

interface TourState {
  activeTour: Tour | null;
  currentStepIndex: number;
  isRunning: boolean;
  completedTours: string[];
}

interface TourContextValue {
  state: TourState;
  startTour: (tour: Tour) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  endTour: () => void;
  resetTour: () => void;
  isTourCompleted: (tourId: string) => boolean;
  markTourCompleted: (tourId: string) => void;
}

const TourContext = createContext<TourContextValue | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within TourProvider');
  }
  return context;
};

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedTours, setCompletedTours] = useLocalStorage<string[]>('tour-completed', []);
  
  const [state, setState] = useState<TourState>({
    activeTour: null,
    currentStepIndex: 0,
    isRunning: false,
    completedTours
  });

  const startTour = useCallback((tour: Tour) => {
    setState(prev => ({
      ...prev,
      activeTour: tour,
      currentStepIndex: 0,
      isRunning: true
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => {
      if (!prev.activeTour) return prev;
      
      const nextIndex = prev.currentStepIndex + 1;
      if (nextIndex >= prev.activeTour.steps.length) {
        // Tour completed
        const tourId = prev.activeTour.id;
        setCompletedTours(prev => [...prev.filter(id => id !== tourId), tourId]);
        return {
          ...prev,
          activeTour: null,
          currentStepIndex: 0,
          isRunning: false,
          completedTours: [...prev.completedTours.filter(id => id !== tourId), tourId]
        };
      }
      
      return {
        ...prev,
        currentStepIndex: nextIndex
      };
    });
  }, [setCompletedTours]);

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStepIndex: Math.max(0, prev.currentStepIndex - 1)
    }));
  }, []);

  const skipTour = useCallback(() => {
    setState(prev => {
      if (!prev.activeTour) return prev;
      
      const tourId = prev.activeTour.id;
      setCompletedTours(prev => [...prev.filter(id => id !== tourId), tourId]);
      
      return {
        ...prev,
        activeTour: null,
        currentStepIndex: 0,
        isRunning: false,
        completedTours: [...prev.completedTours.filter(id => id !== tourId), tourId]
      };
    });
  }, [setCompletedTours]);

  const endTour = useCallback(() => {
    setState(prev => ({
      ...prev,
      activeTour: null,
      currentStepIndex: 0,
      isRunning: false
    }));
  }, []);

  const resetTour = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStepIndex: 0
    }));
  }, []);

  const isTourCompleted = useCallback((tourId: string) => {
    return state.completedTours.includes(tourId);
  }, [state.completedTours]);

  const markTourCompleted = useCallback((tourId: string) => {
    setCompletedTours(prev => [...prev.filter(id => id !== tourId), tourId]);
    setState(prev => ({
      ...prev,
      completedTours: [...prev.completedTours.filter(id => id !== tourId), tourId]
    }));
  }, [setCompletedTours]);

  const value: TourContextValue = {
    state,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    endTour,
    resetTour,
    isTourCompleted,
    markTourCompleted
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};
