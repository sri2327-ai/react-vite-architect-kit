
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Workflow {
  id: string;
  name: string;
  description: string;
  ehrSystem: string;
  status: 'draft' | 'active' | 'paused';
  blocks: any[];
  availableVisitTypes: string[];
  visitTypeMappings: any[];
  lastModified?: string;
  isConfigured?: boolean;
}

interface WorkflowLibraryItem {
  id: string;
  name: string;
  description: string;
  ehrSystem: string;
  blocks: any[];
  tags: string[];
  isPopular?: boolean;
}

export const useWorkflowData = (useApi: boolean = false) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [libraryWorkflows, setLibraryWorkflows] = useState<WorkflowLibraryItem[]>([
    {
      id: 'lib-1',
      name: 'Daily Clinical Notes',
      description: 'Streamlined workflow for routine patient documentation',
      ehrSystem: 'Epic',
      blocks: [],
      tags: ['Clinical', 'Documentation', 'Daily'],
      isPopular: true
    },
    {
      id: 'lib-2',
      name: 'Pre-Visit Planning',
      description: 'Efficient pre-visit preparation and chart review',
      ehrSystem: 'Cerner',
      blocks: [],
      tags: ['Planning', 'Preparation', 'Chart Review']
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (useApi) {
      fetchWorkflows();
      fetchLibraryWorkflows();
    }
  }, [useApi]);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.get<Workflow[]>('/workflows');
      setWorkflows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows');
      console.error('Workflows fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLibraryWorkflows = async () => {
    try {
      const data = await apiService.get<WorkflowLibraryItem[]>('/workflows/library');
      setLibraryWorkflows(data);
    } catch (err) {
      console.error('Library workflows fetch error:', err);
    }
  };

  const createWorkflow = async (workflowData: Omit<Workflow, 'id' | 'lastModified'>) => {
    if (useApi) {
      try {
        setLoading(true);
        const newWorkflow = await apiService.post<Workflow>('/workflows', workflowData);
        setWorkflows(prev => [newWorkflow, ...prev]);
        return newWorkflow;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create workflow');
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      const newWorkflow: Workflow = {
        ...workflowData,
        id: `workflow-${Date.now()}`,
        lastModified: new Date().toISOString()
      };
      setWorkflows(prev => [newWorkflow, ...prev]);
      return newWorkflow;
    }
  };

  const updateWorkflow = async (id: string, updates: Partial<Workflow>) => {
    if (useApi) {
      try {
        setLoading(true);
        const updatedWorkflow = await apiService.put<Workflow>(`/workflows/${id}`, updates);
        setWorkflows(prev => prev.map(w => w.id === id ? updatedWorkflow : w));
        return updatedWorkflow;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update workflow');
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      const updatedWorkflow = { 
        ...workflows.find(w => w.id === id)!, 
        ...updates, 
        lastModified: new Date().toISOString() 
      };
      setWorkflows(prev => prev.map(w => w.id === id ? updatedWorkflow : w));
      return updatedWorkflow;
    }
  };

  const deleteWorkflow = async (id: string) => {
    if (useApi) {
      try {
        setLoading(true);
        await apiService.delete(`/workflows/${id}`);
        setWorkflows(prev => prev.filter(w => w.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete workflow');
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      setWorkflows(prev => prev.filter(w => w.id !== id));
    }
  };

  const importWorkflow = async (libraryWorkflow: WorkflowLibraryItem) => {
    const importedWorkflow: Workflow = {
      id: `imported-${Date.now()}`,
      name: libraryWorkflow.name,
      description: libraryWorkflow.description,
      ehrSystem: libraryWorkflow.ehrSystem,
      status: 'draft',
      blocks: libraryWorkflow.blocks,
      availableVisitTypes: [],
      visitTypeMappings: []
    };

    return createWorkflow(importedWorkflow);
  };

  return {
    workflows,
    libraryWorkflows,
    loading,
    error,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    importWorkflow,
    refetch: fetchWorkflows
  };
};
