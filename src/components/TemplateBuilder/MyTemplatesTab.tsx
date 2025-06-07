
import React, { useState } from 'react';
import { Box, Grid, Button, useTheme, useMediaQuery, Paper } from '@mui/material';
import { Plus } from 'lucide-react';
import TemplateCard from './TemplateCard';
import TemplateFilters from './TemplateFilters';
import TemplateCreationDialog from './TemplateCreationDialog';
import ImprovedTemplateCreationDialog from './ImprovedTemplateCreationDialog';
import { useTemplateData } from '@/hooks/useTemplateData';
import { useApiContext } from '@/contexts/ApiContext';

const MyTemplatesTab: React.FC = () => {
  const [creationDialogOpen, setCreationDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [useImprovedDialog, setUseImprovedDialog] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { useApiData } = useApiContext();
  const { templates, categories, createTemplate, deleteTemplate, updateTemplate } = useTemplateData(useApiData);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateTemplate = (templateData: any) => {
    createTemplate(templateData);
    setCreationDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: {
          xs: 2,
          sm: 3,
          md: 4
        },
        flexDirection: {
          xs: 'column',
          sm: 'row'
        },
        gap: {
          xs: 2,
          sm: 0
        }
      }}>
        <TemplateFilters
          categories={categories}
          selectedCategory={filterCategory}
          onCategoryChange={setFilterCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalCount={filteredTemplates.length}
        />
        
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setCreationDialogOpen(true)}
          sx={{
            backgroundColor: theme.palette.success.main,
            color: 'white',
            borderRadius: 3,
            px: {
              xs: 3,
              sm: 4
            },
            py: 1.5,
            fontSize: {
              xs: '0.875rem',
              sm: '1rem'
            },
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
            '&:hover': {
              backgroundColor: theme.palette.success.dark,
              boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            alignSelf: {
              xs: 'stretch',
              sm: 'auto'
            }
          }}
        >
          Create Template
        </Button>
      </Box>

      {/* Templates Grid */}
      <Paper elevation={0} sx={{
        borderRadius: {
          xs: 2,
          sm: 3,
          md: 4
        },
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        p: {
          xs: 2,
          sm: 3,
          md: 4
        }
      }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {filteredTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
              <TemplateCard
                template={template}
                onEdit={(template) => console.log('Edit template:', template)}
                onDelete={deleteTemplate}
                onDuplicate={(template) => console.log('Duplicate template:', template)}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Template Creation Dialog */}
      {useImprovedDialog ? (
        <ImprovedTemplateCreationDialog
          open={creationDialogOpen}
          onClose={() => setCreationDialogOpen(false)}
          onCreate={handleCreateTemplate}
        />
      ) : (
        <TemplateCreationDialog
          open={creationDialogOpen}
          onClose={() => setCreationDialogOpen(false)}
          onCreate={handleCreateTemplate}
        />
      )}
    </Box>
  );
};

export default MyTemplatesTab;
