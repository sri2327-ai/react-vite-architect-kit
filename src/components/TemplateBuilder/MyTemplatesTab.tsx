import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
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
import MyTemplatesNavBar from './MyTemplatesNavBar';
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

interface TemplateData {
  id: number;
  title: string;
  specialty: string;
  type: string;
  fields: any[];
  content?: string;
  lastUsed?: string;
  usageCount?: number;
  isFavorite?: boolean;
  createdBy?: string;
  tags?: string[];
}

const MyTemplatesTab: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { useApiData } = useApiContext();
  const { templates, visitTypes, createTemplate, updateTemplate, deleteTemplate } = useTemplateData(useApiData);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedVisitType, setSelectedVisitType] = useState<VisitType | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreateVisitTypeDialogOpen, setIsCreateVisitTypeDialogOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [filters, setFilters] = useState({
    visitType: '',
    specialty: ''
  });

  const handleCreateTemplate = (templateData: any) => {
    console.log('MyTemplatesTab: handleCreateTemplate called with data:', templateData);
    
    const newTemplateData = {
      name: templateData.name,
      description: templateData.description || '',
      sections: templateData.sections || [],
      visitTypes: selectedVisitType ? [selectedVisitType.name] : [],
      specialty: templateData.specialty || '',
      isActive: true
    };
    
    console.log('MyTemplatesTab: Formatted template data:', newTemplateData);
    
    try {
      const result = createTemplate(newTemplateData);
      console.log('MyTemplatesTab: Template creation result:', result);
      setIsCreateDialogOpen(false);
      console.log('MyTemplatesTab: Dialog closed successfully');
    } catch (error) {
      console.error('MyTemplatesTab: Error creating template:', error);
    }
  };

  const handleEditTemplate = (template: Template) => {
    console.log('Opening template editor for:', template);
    setSelectedTemplate(template);
    setIsEditorOpen(true);
  };

  const handleViewTemplate = (templateData: TemplateData) => {
    console.log('Viewing template:', templateData);
    const template = filteredTemplates.find(t => 
      t.name === templateData.title && t.visitTypes.includes(templateData.type)
    );
    if (template) {
      handleEditTemplate(template);
    } else {
      console.error('Template not found for viewing:', templateData);
    }
  };

  const handleEditFromTable = (templateData: TemplateData) => {
    console.log('Editing template from table:', templateData);
    const template = filteredTemplates.find(t => 
      t.name === templateData.title && t.visitTypes.includes(templateData.type)
    );
    if (template) {
      handleEditTemplate(template);
    } else {
      console.error('Template not found for editing:', templateData);
    }
  };

  const handleSaveTemplate = (templateData: any) => {
    if (selectedTemplate) {
      const updatedTemplate = {
        ...selectedTemplate,
        sections: templateData,
        lastModified: new Date().toISOString()
      };
      updateTemplate(selectedTemplate.id, updatedTemplate);
      setSelectedTemplate(updatedTemplate);
      console.log('Template saved successfully:', updatedTemplate);
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedTemplate(null);
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

  const handleCopyFromTable = (templateData: TemplateData) => {
    console.log('Copying template from table:', templateData);
    const template = filteredTemplates.find(t => 
      t.name === templateData.title && t.visitTypes.includes(templateData.type)
    );
    if (template) {
      handleDuplicateTemplate(template);
    } else {
      console.error('Template not found for copying:', templateData);
    }
  };

  const handleToggleFavorite = (templateData: TemplateData) => {
    console.log('Toggling favorite for template:', templateData);
    // Implement favorite toggle logic here if needed
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
      
      return matchesVisitType && matchesSpecialty;
    }
    return false;
  });

  // Show Template Editor as separate screen
  if (isEditorOpen && selectedTemplate) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2, md: 3 }, height: '100vh' }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={handleCloseEditor}
            sx={{ 
              color: bravoColors.primaryFlat,
              '&:hover': {
                backgroundColor: `${bravoColors.primaryFlat}10`
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h4" 
            sx={{ 
              color: bravoColors.primaryFlat, 
              fontWeight: 700
            }}
          >
            Edit Template: {selectedTemplate.name}
          </Typography>
        </Box>
        
        <Box sx={{ height: 'calc(100vh - 120px)' }}>
          <DraggableTemplateEditor
            initialItems={selectedTemplate.sections || []}
            onSave={handleSaveTemplate}
          />
        </Box>
      </Container>
    );
  }

  // Show Visit Type selection screen
  if (!selectedVisitType) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: bravoColors.primaryFlat, 
            fontWeight: 700,
            mb: 2,
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          My Templates
        </Typography>
        
        <MyTemplatesNavBar
          currentStep="visit-types"
          onCreateTemplate={() => {}}
          onCreateVisitType={() => setIsCreateVisitTypeDialogOpen(true)}
        />
        
        <VisitTypeManager 
          onVisitTypeSelect={handleVisitTypeSelect}
          isCreateDialogOpen={isCreateVisitTypeDialogOpen}
          onCloseCreateDialog={() => setIsCreateVisitTypeDialogOpen(false)}
        />
      </Container>
    );
  }

  // Show Templates for selected Visit Type
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
      <Typography 
        variant="h4" 
        sx={{ 
          color: bravoColors.primaryFlat, 
          fontWeight: 700,
          mb: 2,
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        My Templates
      </Typography>

      <MyTemplatesNavBar
        currentStep="templates"
        selectedVisitType={selectedVisitType?.name}
        onCreateTemplate={() => setIsCreateDialogOpen(true)}
        onBackToVisitTypes={handleBackToVisitTypes}
        templateCount={filteredTemplates.length}
      />

      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <TemplateFilters
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
          onClearFilters={() => setFilters(prev => ({ ...prev, specialty: '' }))}
          hasActiveFilters={!!filters.specialty}
        />
      </Box>

      <TemplateTable
        templates={filteredTemplates.map((template: Template) => ({
          id: parseInt(template.id.replace('template-', '')) || Math.random(),
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
        onView={handleViewTemplate}
        onEdit={handleEditFromTable}
        onCopy={handleCopyFromTable}
        onToggleFavorite={handleToggleFavorite}
      />

      {filteredTemplates.length === 0 && (
        <Box sx={{
          textAlign: 'center',
          py: 8,
          color: 'text.secondary'
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No templates found for {selectedVisitType?.name}
          </Typography>
          <Typography variant="body2">
            {filters.specialty
              ? 'Try adjusting your filters to see more templates.'
              : `Create your first template for ${selectedVisitType?.name} to get started.`}
          </Typography>
        </Box>
      )}

      <ImprovedTemplateCreationDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateTemplate={handleCreateTemplate}
      />
    </Container>
  );
};

export default MyTemplatesTab;
