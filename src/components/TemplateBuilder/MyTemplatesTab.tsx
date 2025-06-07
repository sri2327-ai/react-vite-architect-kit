
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  useTheme,
  useMediaQuery,
  Container,
  IconButton
} from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import TemplateTable from './TemplateTable';
import TemplateFilters from './TemplateFilters';
import ImprovedTemplateCreationDialog from './ImprovedTemplateCreationDialog';
import DraggableTemplateEditor from './DraggableTemplateEditor';
import VisitTypeManager from './VisitTypeManager';
import { useTemplateData } from '@/hooks/useTemplateData';
import { useApiContext } from '@/contexts/ApiContext';

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

interface VisitType {
  id: string;
  name: string;
  description?: string;
}

const MyTemplatesTab: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { useApiData } = useApiContext();
  const { templates, visitTypes, createTemplate, updateTemplate, deleteTemplate } = useTemplateData(useApiData);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedVisitType, setSelectedVisitType] = useState<VisitType | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [filters, setFilters] = useState({
    visitType: '',
    specialty: '',
    searchTerm: ''
  });

  const handleCreateTemplate = (templateData: any) => {
    const newTemplateData = {
      name: templateData.name,
      description: templateData.description || '',
      sections: templateData.sections || [],
      visitTypes: selectedVisitType ? [selectedVisitType.name] : [],
      specialty: templateData.specialty || '',
      isActive: true
    };
    createTemplate(newTemplateData);
    setIsCreateDialogOpen(false);
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditorOpen(true);
  };

  const handleSaveTemplate = (templateData: any) => {
    if (selectedTemplate) {
      updateTemplate(selectedTemplate.id, templateData);
      setIsEditorOpen(false);
      setSelectedTemplate(null);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId);
  };

  const handleDuplicateTemplate = (template: Template) => {
    const duplicatedTemplate = {
      name: `${template.name} (Copy)`,
      description: template.description,
      sections: template.sections,
      visitTypes: template.visitTypes,
      specialty: template.specialty,
      isActive: template.isActive
    };
    createTemplate(duplicatedTemplate);
  };

  const handleVisitTypeSelect = (visitType: VisitType) => {
    setSelectedVisitType(visitType);
    setFilters(prev => ({ ...prev, visitType: visitType.name }));
  };

  const handleBackToVisitTypes = () => {
    setSelectedVisitType(null);
    setFilters(prev => ({ ...prev, visitType: '' }));
  };

  const filteredTemplates = templates.filter((template: Template) => {
    if (selectedVisitType) {
      const matchesVisitType = template.visitTypes.includes(selectedVisitType.name);
      const matchesSpecialty = !filters.specialty || template.specialty === filters.specialty;
      const matchesSearch = !filters.searchTerm || 
        template.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesVisitType && matchesSpecialty && matchesSearch;
    }
    return false;
  });

  // Show Visit Type selection screen
  if (!selectedVisitType) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: bravoColors.primaryFlat, 
            fontWeight: 700,
            mb: 4,
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Select Visit Type
        </Typography>
        
        <VisitTypeManager onVisitTypeSelect={handleVisitTypeSelect} />
      </Container>
    );
  }

  // Show Templates for selected Visit Type
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          gap: 2
        }}>
          <IconButton 
            onClick={handleBackToVisitTypes}
            sx={{ 
              color: bravoColors.primaryFlat,
              '&:hover': {
                backgroundColor: `${bravoColors.primaryFlat}10`
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: bravoColors.primaryFlat, 
                fontWeight: 700
              }}
            >
              {selectedVisitType.name} Templates
            </Typography>
            {selectedVisitType.description && (
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {selectedVisitType.description}
              </Typography>
            )}
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
            sx={{
              backgroundColor: bravoColors.primaryFlat,
              borderRadius: 3,
              px: { xs: 3, md: 4 },
              py: { xs: 1.5, md: 2 },
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', md: '1rem' },
              boxShadow: `0 4px 20px ${bravoColors.primaryFlat}40`,
              '&:hover': {
                backgroundColor: bravoColors.secondary,
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 25px ${bravoColors.secondary}50`
              },
              transition: 'all 0.3s ease',
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Create New Template
          </Button>
        </Box>

        <TemplateFilters
          searchTerm={filters.searchTerm}
          onSearchChange={(value: string) => setFilters(prev => ({ ...prev, searchTerm: value }))}
          selectedSpecialty={filters.specialty}
          onSpecialtyChange={(value: string) => setFilters(prev => ({ ...prev, specialty: value }))}
          selectedType=""
          onTypeChange={() => {}}
          selectedTags={[]}
          onTagsChange={() => {}}
          sortBy="recent"
          onSortChange={() => {}}
          viewMode="all"
          onViewModeChange={() => {}}
          onClearFilters={() => setFilters(prev => ({ ...prev, specialty: '', searchTerm: '' }))}
          hasActiveFilters={!!(filters.specialty || filters.searchTerm)}
        />
      </Box>

      <TemplateTable
        templates={filteredTemplates.map((template: Template) => ({
          id: parseInt(template.id) || 0,
          title: template.name,
          specialty: template.specialty,
          type: template.visitTypes[0] || 'General',
          fields: template.sections || [],
          content: template.description,
          lastUsed: template.lastModified,
          usageCount: 0,
          isFavorite: false,
          createdBy: 'You',
          tags: template.visitTypes
        }))}
        onView={(templateData) => {
          const template = filteredTemplates.find(t => parseInt(t.id) === templateData.id);
          if (template) handleEditTemplate(template);
        }}
        onEdit={(templateData) => {
          const template = filteredTemplates.find(t => parseInt(t.id) === templateData.id);
          if (template) handleEditTemplate(template);
        }}
        onCopy={(templateData) => {
          const template = filteredTemplates.find(t => parseInt(t.id) === templateData.id);
          if (template) handleDuplicateTemplate(template);
        }}
        onToggleFavorite={() => {}}
      />

      {filteredTemplates.length === 0 && (
        <Box sx={{
          textAlign: 'center',
          py: 8,
          color: 'text.secondary'
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No templates found for {selectedVisitType.name}
          </Typography>
          <Typography variant="body2">
            {filters.specialty || filters.searchTerm
              ? 'Try adjusting your filters to see more templates.'
              : `Create your first template for ${selectedVisitType.name} to get started.`}
          </Typography>
        </Box>
      )}

      <ImprovedTemplateCreationDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateTemplate={handleCreateTemplate}
      />

      <Dialog
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        maxWidth="xl"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            height: isMobile ? '100vh' : '90vh',
            borderRadius: isMobile ? 0 : 3
          }
        }}
      >
        {selectedTemplate && (
          <DraggableTemplateEditor
            initialItems={selectedTemplate.sections || []}
            onSave={handleSaveTemplate}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default MyTemplatesTab;
