
import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Divider,
  Stack,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Save as SaveIcon,
  Preview as PreviewIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import DraggableTemplateEditor from './DraggableTemplateEditor';

interface TemplateItem {
  id: string;
  name: string;
  type: string;
  content: string;
  description?: string;
  paste_template?: string;
  is_editing?: boolean;
  is_editing_template?: boolean;
  temp_description?: string;
  temp_template?: string;
  items?: Array<{
    content: string;
    name?: string;
  }>;
}

interface TemplateEditorProps {
  initialItems?: TemplateItem[];
  onSave?: (items: TemplateItem[]) => void;
  onAddSection?: (section: any) => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  initialItems = [], 
  onSave,
  onAddSection 
}) => {
  const [currentItems, setCurrentItems] = useState<TemplateItem[]>(
    initialItems.length > 0 ? initialItems : [
      {
        id: '1',
        name: 'Chief Complaint',
        type: 'paragraph',
        content: 'Document the primary reason for the patient visit',
        description: 'A.I. will write a descriptive block of text following the guidelines below.'
      },
      {
        id: '2', 
        name: 'History of Present Illness',
        type: 'bulleted_list',
        content: 'Document the current illness details',
        description: 'A.I. will create a bulleted list based on the instructions provided',
        items: [
          { content: 'Onset and duration of symptoms' },
          { content: 'Associated symptoms' },
          { content: 'Previous treatments attempted' }
        ]
      }
    ]
  );
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleItemsChange = useCallback((items: TemplateItem[]) => {
    setCurrentItems(items);
    setHasUnsavedChanges(true);
  }, []);

  const handleSave = useCallback((items: TemplateItem[]) => {
    setCurrentItems(items);
    setHasUnsavedChanges(false);
    setSaveSuccess(true);
    
    if (onSave) {
      onSave(items);
    }
    
    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
    
    console.log('Template saved:', items);
  }, [onSave]);

  const handleAddSectionToTemplate = useCallback((section: any) => {
    const newItem: TemplateItem = {
      id: Date.now().toString(),
      name: section.name || section.label || 'New Section',
      type: section.type || 'paragraph',
      content: section.content || section.description || 'AI will generate content based on the instructions below.',
      description: 'A.I. will write content following the guidelines below.'
    };
    
    const updatedItems = [...currentItems, newItem];
    setCurrentItems(updatedItems);
    setHasUnsavedChanges(true);
    
    console.log('Section added to template:', newItem);
  }, [currentItems]);

  const generatePreview = () => {
    return currentItems.map(item => {
      let content = `${item.name}:\n`;
      if (item.items && item.items.length > 0) {
        content += item.items.map(subItem => `• ${subItem.content}`).join('\n');
      } else {
        content += item.content || '[Content to be filled]';
      }
      return content;
    }).join('\n\n');
  };

  // Expose the addSection function to parent components
  React.useEffect(() => {
    if (onAddSection) {
      onAddSection(handleAddSectionToTemplate);
    }
  }, [onAddSection, handleAddSectionToTemplate]);

  return (
    <Box>
      {/* Enhanced Header with Actions */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              color: bravoColors.primaryFlat,
              mb: 1 
            }}>
              Template Editor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drag and drop sections to customize your template
            </Typography>
          </Box>
          
          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            <Tooltip title="Generate with AI">
              <IconButton 
                sx={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  '&:hover': { 
                    backgroundColor: alpha(bravoColors.secondary, 0.1),
                    borderColor: bravoColors.secondary
                  }
                }}
              >
                <AutoAwesomeIcon sx={{ color: bravoColors.secondary }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Undo">
              <IconButton 
                sx={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <UndoIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Redo">
              <IconButton 
                sx={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <RedoIcon />
              </IconButton>
            </Tooltip>
            
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              sx={{
                borderColor: bravoColors.primaryFlat,
                color: bravoColors.primaryFlat,
                '&:hover': {
                  borderColor: bravoColors.secondary,
                  backgroundColor: alpha(bravoColors.primaryFlat, 0.05)
                }
              }}
            >
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => handleSave(currentItems)}
              disabled={!hasUnsavedChanges}
              sx={{
                backgroundColor: bravoColors.primaryFlat,
                '&:hover': {
                  backgroundColor: bravoColors.secondary,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(56, 126, 137, 0.4)'
                },
                '&:disabled': {
                  backgroundColor: '#ccc'
                }
              }}
            >
              Save Template
            </Button>
          </Stack>
        </Box>

        {/* Status Indicators */}
        <Box display="flex" alignItems="center" gap={2}>
          {hasUnsavedChanges && (
            <Alert severity="warning" sx={{ py: 0.5, px: 2 }}>
              <Typography variant="body2">
                You have unsaved changes
              </Typography>
            </Alert>
          )}
          
          {saveSuccess && (
            <Alert severity="success" sx={{ py: 0.5, px: 2 }}>
              <Typography variant="body2">
                Template saved successfully!
              </Typography>
            </Alert>
          )}
          
          <Typography variant="body2" color="text.secondary">
            {currentItems.length} section{currentItems.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Paper>

      {/* Editor Content */}
      <Box sx={{ minHeight: 600 }}>
        {isPreviewMode ? (
          <Paper 
            elevation={1} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef'
            }}
          >
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              mb: 3,
              color: bravoColors.primaryFlat 
            }}>
              Template Preview
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography 
              variant="body1" 
              sx={{ 
                whiteSpace: 'pre-line', 
                lineHeight: 1.8,
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}
            >
              {generatePreview()}
            </Typography>
          </Paper>
        ) : (
          <DraggableTemplateEditor 
            initialItems={currentItems}
            onSave={handleSave}
            onChange={handleItemsChange}
          />
        )}
      </Box>
    </Box>
  );
};

export default TemplateEditor;
