
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActionArea
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';

interface AddSectionOverlayProps {
  open: boolean;
  onClose: () => void;
  onSectionSelect?: (sectionType: string, sectionName: string) => void;
  onAddSection?: (section: any) => void;
}

const AddSectionOverlay: React.FC<AddSectionOverlayProps> = ({
  open,
  onClose,
  onSectionSelect,
  onAddSection
}) => {
  const handleSectionClick = (type: string, name: string) => {
    if (onSectionSelect) {
      onSectionSelect(type, name);
    }
    if (onAddSection) {
      onAddSection({ id: type, name, type, description: getDescription(type) });
    }
  };

  const getDescription = (type: string) => {
    const descriptions = {
      'paragraph': 'A.I. will write a descriptive block of text following the guidelines below.',
      'bulleted_list': 'A.I. will create a bulleted list based on the instructions provided',
      'numbered_list': 'A.I. will create a numbered list based on the instructions provided',
      'exam_list': 'Structured exam sections with normal limits behavior and customizable subsections',
      'checklist': 'Manual buttons that insert predefined text when clicked - not AI generated',
      'heading': 'A simple heading or title for organizing your template',
      'divider': 'A visual separator to organize sections in your template'
    };
    return descriptions[type as keyof typeof descriptions] || 'Section description';
  };

  const sectionTypes = [
    {
      type: 'paragraph',
      name: 'Paragraph',
      description: 'A.I. will write a descriptive block of text following the guidelines below.',
      icon: '📝',
      color: '#1976d2'
    },
    {
      type: 'bulleted_list',
      name: 'Bulleted List',
      description: 'A.I. will create a bulleted list based on the instructions provided',
      icon: '•',
      color: '#388e3c'
    },
    {
      type: 'numbered_list', 
      name: 'Numbered List',
      description: 'A.I. will create a numbered list based on the instructions provided',
      icon: '1.',
      color: '#f57c00'
    },
    {
      type: 'exam_list',
      name: 'Exam List',
      description: 'Structured exam sections with normal limits behavior and customizable subsections',
      icon: '🩺',
      color: '#7b1fa2'
    },
    {
      type: 'checklist',
      name: 'Checklist',
      description: 'Manual buttons that insert predefined text when clicked - not AI generated',
      icon: '☑️',
      color: '#d32f2f'
    },
    {
      type: 'heading',
      name: 'Heading',
      description: 'A simple heading or title for organizing your template',
      icon: 'H',
      color: '#455a64'
    },
    {
      type: 'divider',
      name: 'Divider',
      description: 'A visual separator to organize sections in your template',
      icon: '―',
      color: '#757575'
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, minHeight: '500px' }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" sx={{ fontWeight: 600, color: bravoColors.primaryFlat }}>
            Add Section
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Choose the type of section you want to add to your template
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        <Grid container spacing={2}>
          {sectionTypes.map((section) => (
            <Grid item xs={12} sm={6} key={section.type}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  borderRadius: 2,
                  border: '2px solid transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    borderColor: section.color
                  }
                }}
                onClick={() => handleSectionClick(section.type, section.name)}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        backgroundColor: section.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        fontSize: '1.5rem',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {section.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: section.color }}>
                      {section.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1, lineHeight: 1.5 }}>
                    {section.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AddSectionOverlay;
