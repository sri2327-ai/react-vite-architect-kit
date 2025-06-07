
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  useTheme,
  useMediaQuery,
  Container,
  Divider
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import TemplateCard from './TemplateCard';
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

const MyTemplatesTab: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { useApiData } = useApiContext();
  const { templates, visitTypes, createTemplate, updateTemplate, deleteTemplate } = useTemplateData(useApiData);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [filters, setFilters] = useState({
    visitType: '',
    specialty: '',
    searchTerm: ''
  });

  const handleCreateTemplate = (templateData: any) => {
    // Convert the templateData to match our Template interface
    const newTemplateData = {
      name: templateData.name,
      description: templateData.description || '',
      sections: templateData.sections || [],
      visitTypes: templateData.visitTypes || [],
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

  const filteredTemplates = templates.filter((template: Template) => {
    const matchesVisitType = !filters.visitType || template.visitTypes.includes(filters.visitType);
    const matchesSpecialty = !filters.specialty || template.specialty === filters.specialty;
    const matchesSearch = !filters.searchTerm || 
      template.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesVisitType && matchesSpecialty && matchesSearch;
  });

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Visit Type Management Section */}
      <VisitTypeManager />
      
      <Divider sx={{ my: 4, borderColor: `${bravoColors.primary}20` }} />
      
      {/* Templates Section */}
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: bravoColors.primaryFlat, 
              fontWeight: 700,
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            My Templates
          </Typography>
          
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
          selectedType={filters.visitType}
          onTypeChange={(value: string) => setFilters(prev => ({ ...prev, visitType: value }))}
          selectedTags={[]}
          onTagsChange={() => {}}
          sortBy="recent"
          onSortChange={() => {}}
          viewMode="all"
          onViewModeChange={() => {}}
          onClearFilters={() => setFilters({ visitType: '', specialty: '', searchTerm: '' })}
          hasActiveFilters={!!(filters.visitType || filters.specialty || filters.searchTerm)}
        />
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {filteredTemplates.map((template: Template) => (
          <Grid key={template.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <TemplateCard
              template={{
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
              }}
              onView={() => handleEditTemplate(template)}
              onEdit={() => handleEditTemplate(template)}
              onCopy={() => handleDuplicateTemplate(template)}
              onToggleFavorite={() => {}}
            />
          </Grid>
        ))}
      </Grid>

      {filteredTemplates.length === 0 && (
        <Box sx={{
          textAlign: 'center',
          py: 8,
          color: 'text.secondary'
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No templates found
          </Typography>
          <Typography variant="body2">
            {filters.visitType || filters.specialty || filters.searchTerm
              ? 'Try adjusting your filters to see more templates.'
              : 'Create your first template to get started.'}
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
