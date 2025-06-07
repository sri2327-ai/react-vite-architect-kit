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
import TemplatePreviewDialog from './TemplatePreviewDialog';
import { useResponsive } from '@/hooks/useResponsive';
import TemplateBuilderHeader from './TemplateBuilderHeader';

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
  const { isMobile, isTablet, isDesktop, isMobileView } = useResponsive();
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
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

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
      setPreviewTemplate(template);
      setIsPreviewDialogOpen(true);
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

  const handleSaveTemplate = (sections: any[]) => {
    console.log('MyTemplatesTab: handleSaveTemplate called with sections:', sections);
    
    if (selectedTemplate) {
      const updatedTemplate = {
        ...selectedTemplate,
        sections: sections, // sections is already an array of template items
        lastModified: new Date().toISOString()
      };
      
      console.log('MyTemplatesTab: Updating template with sections:', updatedTemplate);
      
      try {
        updateTemplate(selectedTemplate.id, updatedTemplate);
        setSelectedTemplate(updatedTemplate);
        console.log('MyTemplatesTab: Template saved successfully:', updatedTemplate);
      } catch (error) {
        console.error('MyTemplatesTab: Error saving template:', error);
      }
    } else {
      console.error('MyTemplatesTab: No selected template to save');
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
      <Container 
        maxWidth={false} 
        sx={{ 
          py: 0,
          px: 0,
          height: '100vh',
          width: '100%',
          maxWidth: '100vw'
        }}
      >
        <TemplateBuilderHeader
          title={`Edit Template: ${selectedTemplate.name}`}
          onBack={handleCloseEditor}
          showBackButton={true}
        />
        
        <Box sx={{ 
          height: { 
            xs: 'calc(100vh - 64px)', 
            sm: 'calc(100vh - 72px)', 
            md: 'calc(100vh - 80px)' 
          },
          width: '100%',
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1, sm: 2 }
        }}>
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
      <Container 
        maxWidth={false} 
        sx={{ 
          py: 0,
          px: 0,
          width: '100%',
          maxWidth: '100vw'
        }}
      >
        <TemplateBuilderHeader
          title="My Templates"
        />
        
        <Box sx={{ 
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1, sm: 2 }
        }}>
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <MyTemplatesNavBar
              currentStep="visit-types"
              onCreateTemplate={() => {}}
              onCreateVisitType={() => setIsCreateVisitTypeDialogOpen(true)}
            />
          </Box>
          
          <VisitTypeManager 
            onVisitTypeSelect={handleVisitTypeSelect}
            isCreateDialogOpen={isCreateVisitTypeDialogOpen}
            onCloseCreateDialog={() => setIsCreateVisitTypeDialogOpen(false)}
          />
        </Box>
      </Container>
    );
  }

  // Show Templates for selected Visit Type
  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        py: 0,
        px: 0,
        width: '100%',
        maxWidth: '100vw'
      }}
    >
      <TemplateBuilderHeader
        title="My Templates"
        onBack={handleBackToVisitTypes}
        showBackButton={true}
      />

      <Box sx={{ 
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 }
      }}>
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <MyTemplatesNavBar
            currentStep="templates"
            selectedVisitType={selectedVisitType?.name}
            onCreateTemplate={() => setIsCreateDialogOpen(true)}
            onBackToVisitTypes={handleBackToVisitTypes}
            templateCount={filteredTemplates.length}
          />
        </Box>

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

        <Box sx={{ 
          width: '100%',
          overflowX: 'auto',
          '& .MuiDataGrid-root': {
            minWidth: { xs: '320px', sm: '100%' }
          }
        }}>
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
        </Box>

        {filteredTemplates.length === 0 && (
          <Box sx={{
            textAlign: 'center',
            py: { xs: 3, sm: 4, md: 6, lg: 8 },
            px: { xs: 1.5, sm: 2, md: 3 },
            color: 'text.secondary',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: '200px', sm: '250px', md: '300px' },
            maxWidth: { xs: '100%', sm: '600px' },
            mx: 'auto'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                fontWeight: 600,
                lineHeight: 1.3,
                textAlign: 'center',
                wordBreak: 'break-word'
              }}
            >
              No templates found for {selectedVisitType?.name}
            </Typography>
            <Typography 
              variant="body2"
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                lineHeight: { xs: 1.4, sm: 1.5 },
                textAlign: 'center',
                maxWidth: '100%',
                wordBreak: 'break-word',
                color: 'text.secondary'
              }}
            >
              {filters.specialty
                ? 'Try adjusting your filters to see more templates.'
                : `Create your first template for ${selectedVisitType?.name} to get started.`}
            </Typography>
          </Box>
        )}
      </Box>

      <ImprovedTemplateCreationDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateTemplate={handleCreateTemplate}
      />

      <TemplatePreviewDialog
        open={isPreviewDialogOpen}
        onClose={() => {
          setIsPreviewDialogOpen(false);
          setPreviewTemplate(null);
        }}
        template={previewTemplate}
      />
    </Container>
  );
};

export default MyTemplatesTab;
