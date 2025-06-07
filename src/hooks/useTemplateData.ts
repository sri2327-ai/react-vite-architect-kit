
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { templateBuilderService } from '../services/templateBuilderService';

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

  // Get visit types from templateBuilderService
  const visitTypes = templateBuilderService.getAllVisitTypeNames();

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
    console.log('useTemplateData: createTemplate called with:', templateData);
    console.log('useTemplateData: useApi flag is:', useApi);
    
    if (useApi) {
      try {
        setLoading(true);
        console.log('useTemplateData: Making API call to create template');
        const newTemplate = await apiService.post<Template>('/templates', templateData);
        console.log('useTemplateData: API response:', newTemplate);
        setTemplates(prev => [newTemplate, ...prev]);
        return newTemplate;
      } catch (err) {
        console.error('useTemplateData: API error:', err);
        setError(err instanceof Error ? err.message : 'Failed to create template');
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      console.log('useTemplateData: Creating template locally (no API)');
      const newTemplate: Template = {
        ...templateData,
        id: `template-${Date.now()}`,
        lastModified: new Date().toISOString()
      };
      console.log('useTemplateData: New template created:', newTemplate);
      setTemplates(prev => {
        const updated = [newTemplate, ...prev];
        console.log('useTemplateData: Updated templates list:', updated);
        return updated;
      });
      return newTemplate;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<Template>) => {
    console.log('useTemplateData: updateTemplate called with id:', id, 'updates:', updates);
    
    if (useApi) {
      try {
        setLoading(true);
        const updatedTemplate = await apiService.put<Template>(`/templates/${id}`, updates);
        setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
        console.log('useTemplateData: Template updated via API:', updatedTemplate);
        return updatedTemplate;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update template');
        console.error('useTemplateData: Update error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      const existingTemplate = templates.find(t => t.id === id);
      if (!existingTemplate) {
        console.error('useTemplateData: Template not found for update:', id);
        return null;
      }
      
      const updatedTemplate = { 
        ...existingTemplate, 
        ...updates, 
        lastModified: new Date().toISOString() 
      };
      
      setTemplates(prev => {
        const updated = prev.map(t => t.id === id ? updatedTemplate : t);
        console.log('useTemplateData: Template updated locally:', updatedTemplate);
        console.log('useTemplateData: Updated templates list:', updated);
        return updated;
      });
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
    visitTypes,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates
  };
};
