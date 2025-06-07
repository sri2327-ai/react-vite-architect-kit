
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import TemplateCard from './TemplateCard';
import TemplateFilters from './TemplateFilters';
import ImprovedTemplateCreationDialog from './ImprovedTemplateCreationDialog';
import DraggableTemplateEditor from './DraggableTemplateEditor';
import { useTemplateData } from '@/hooks/useTemplateData';
import { useApiContext } from '@/contexts/ApiContext';

interface Template {
  id: string;
  name: string;
  visitType: string;
  specialty: string;
  tags: string[];
  sections: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
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
    createTemplate(templateData);
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
      ...template,
      name: `${template.name} (Copy)`,
      id: undefined
    };
    createTemplate(duplicatedTemplate);
  };

  const filteredTemplates = templates.filter((template: Template) => {
    const matchesVisitType = !filters.visitType || template.visitType === filters.visitType;
    const matchesSpecialty = !filters.specialty || template.specialty === filters.specialty;
    const matchesSearch = !filters.searchTerm || 
      template.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    
    return matchesVisitType && matchesSpecialty && matchesSearch;
  });

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
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
          filters={filters}
          onFiltersChange={setFilters}
          visitTypes={visitTypes}
        />
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {filteredTemplates.map((template: Template) => (
          <Grid item xs={12} sm={6} lg={4} key={template.id}>
            <TemplateCard
              template={template}
              onEdit={() => handleEditTemplate(template)}
              onDelete={() => handleDeleteTemplate(template.id)}
              onDuplicate={() => handleDuplicateTemplate(template)}
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
        onSave={handleCreateTemplate}
        visitTypes={visitTypes}
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
            template={selectedTemplate}
            onSave={handleSaveTemplate}
            onClose={() => setIsEditorOpen(false)}
            visitTypes={visitTypes}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default MyTemplatesTab;
