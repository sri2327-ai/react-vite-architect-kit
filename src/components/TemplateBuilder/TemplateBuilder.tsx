
import React, { useState } from 'react';
import { Box, Tab, Tabs, Paper } from '@mui/material';
import { bravoColors } from '@/theme/colors';
import TemplateLibraryTab from './TemplateLibraryTab';
import TemplateEditor from './TemplateEditor';
import TemplateDisplay from './TemplateDisplay';

interface TemplateData {
  id: number;
  name: string;
  specialty: string;
  type: string;
  content?: string;
  description?: string;
  lastUsed?: string;
  usageCount?: number;
  isFavorite?: boolean;
  createdBy?: string;
  tags?: string[];
}

const TemplateBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue !== 2) {
      setSelectedTemplate(null);
      setIsEditing(false);
    }
  };

  const handleSelectTemplate = (template: TemplateData) => {
    setSelectedTemplate(template);
    setActiveTab(2);
    setIsEditing(false);
  };

  const handleEditTemplate = () => {
    setIsEditing(true);
  };

  const handleCloseTemplate = () => {
    setSelectedTemplate(null);
    setIsEditing(false);
    setActiveTab(0);
  };

  const renderTabContent = () => {
    if (activeTab === 2 && selectedTemplate) {
      if (isEditing) {
        return (
          <TemplateEditor
            initialItems={[]}
            onSave={(items) => {
              console.log('Template items saved:', items);
              setIsEditing(false);
            }}
          />
        );
      } else {
        // Convert TemplateData to format expected by TemplateDisplay
        const displayTemplate = {
          id: selectedTemplate.id,
          title: selectedTemplate.name,
          specialty: selectedTemplate.specialty,
          type: selectedTemplate.type,
          content: selectedTemplate.content || selectedTemplate.description || 'No content available',
          lastUsed: selectedTemplate.lastUsed,
          usageCount: selectedTemplate.usageCount,
          isFavorite: selectedTemplate.isFavorite,
          createdBy: selectedTemplate.createdBy,
          tags: selectedTemplate.tags
        };

        return (
          <TemplateDisplay
            template={displayTemplate}
            onEdit={handleEditTemplate}
            onClose={handleCloseTemplate}
          />
        );
      }
    }

    switch (activeTab) {
      case 0:
        return <TemplateLibraryTab onSelectTemplate={handleSelectTemplate} />;
      case 1:
        return <TemplateEditor />;
      default:
        return <TemplateLibraryTab onSelectTemplate={handleSelectTemplate} />;
    }
  };

  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: 'transparent'
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              minWidth: 120,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: bravoColors.primaryFlat,
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: bravoColors.primaryFlat,
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          <Tab label="Template Library" />
          <Tab label="Create Template" />
          {selectedTemplate && (
            <Tab 
              label={isEditing ? 'Edit Template' : 'Template Details'} 
            />
          )}
        </Tabs>
      </Paper>

      <Box sx={{ mt: 3 }}>
        {renderTabContent()}
      </Box>
    </Box>
  );
};

export default TemplateBuilder;
