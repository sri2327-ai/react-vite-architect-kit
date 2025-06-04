
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Template {
  id: string;
  name: string;
  description: string;
  sections: any[];
  visitTypes: string[];
  specialty: string;
  lastModified: string;
  isActive: boolean;
}

interface TemplateFilters {
  specialty: string;
  visitType: string;
  searchTerm: string;
}

export const useTemplateData = (useApi: boolean = false) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TemplateFilters>({
    specialty: '',
    visitType: '',
    searchTerm: ''
  });

  useEffect(() => {
    if (useApi) {
      fetchTemplates();
    }
  }, [useApi, filters]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.visitType) params.append('visitType', filters.visitType);
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      
      const data = await apiService.get<Template[]>(`/templates?${params.toString()}`);
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch templates');
      console.error('Templates fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData: Omit<Template, 'id' | 'lastModified'>) => {
    if (useApi) {
      try {
        setLoading(true);
        const newTemplate = await apiService.post<Template>('/templates', templateData);
        setTemplates(prev => [newTemplate, ...prev]);
        return newTemplate;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create template');
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      const newTemplate: Template = {
        ...templateData,
        id: `template-${Date.now()}`,
        lastModified: new Date().toISOString()
      };
      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<Template>) => {
    if (useApi) {
      try {
        setLoading(true);
        const updatedTemplate = await apiService.put<Template>(`/templates/${id}`, updates);
        setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
        return updatedTemplate;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update template');
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      const updatedTemplate = { ...templates.find(t => t.id === id)!, ...updates, lastModified: new Date().toISOString() };
      setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
      return updatedTemplate;
    }
  };

  const deleteTemplate = async (id: string) => {
    if (useApi) {
      try {
        setLoading(true);
        await apiService.delete(`/templates/${id}`);
        setTemplates(prev => prev.filter(t => t.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete template');
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  return {
    templates,
    loading,
    error,
    filters,
    setFilters,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates
  };
};
