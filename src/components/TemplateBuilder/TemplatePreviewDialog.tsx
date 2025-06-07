
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';

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

interface TemplatePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  template: Template | null;
}

const TemplatePreviewDialog: React.FC<TemplatePreviewDialogProps> = ({
  open,
  onClose,
  template
}) => {
  if (!template) return null;

  const getSectionTypeIcon = (type: string) => {
    switch (type) {
      case 'paragraph': return '📝';
      case 'bulleted_list': return '📋';
      case 'checklist': return '✅';
      case 'exam_list': return '🩺';
      case 'section_header': return '📖';
      case 'static_text': return '📄';
      default: return '📝';
    }
  };

  const getSectionTypeName = (type: string) => {
    switch (type) {
      case 'paragraph': return 'Paragraph';
      case 'bulleted_list': return 'Bulleted List';
      case 'checklist': return 'Checklist';
      case 'exam_list': return 'Exam List';
      case 'section_header': return 'Section Header';
      case 'static_text': return 'Static Text';
      default: return 'Section';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <Box sx={{ p: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <DialogTitle sx={{ p: 0, fontSize: '1.5rem', fontWeight: 700, color: bravoColors.primaryFlat }}>
              {template.name}
            </DialogTitle>
            {template.specialty && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {template.specialty}
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        {/* Template Info */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
            {template.visitTypes.map((visitType, index) => (
              <Chip
                key={index}
                label={visitType}
                size="small"
                sx={{
                  backgroundColor: bravoColors.secondary,
                  color: 'white',
                  fontWeight: 600
                }}
              />
            ))}
          </Stack>

          {template.description && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <DescriptionIcon sx={{ fontSize: '1rem', color: 'text.secondary', mt: 0.1 }} />
              <Typography variant="body2" color="text.secondary">
                {template.description}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AssignmentIcon sx={{ fontSize: '1rem' }} />
              <Typography variant="caption">
                {template.sections.length} sections
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ScheduleIcon sx={{ fontSize: '1rem' }} />
              <Typography variant="caption">
                Last modified {new Date(template.lastModified).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Template Sections */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: bravoColors.primaryFlat }}>
            Template Structure
          </Typography>

          {template.sections.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: 'grey.50' }}>
              <Typography variant="body2" color="text.secondary">
                No sections configured yet
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {template.sections.map((section, index) => (
                <Paper
                  key={section.id || index}
                  sx={{
                    p: 2.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    backgroundColor: 'background.paper'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Typography sx={{ fontSize: '1.5rem', mt: 0.5 }}>
                      {getSectionTypeIcon(section.type)}
                    </Typography>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: bravoColors.primaryFlat }}>
                          {section.name}
                        </Typography>
                        <Chip
                          label={getSectionTypeName(section.type)}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.7rem',
                            height: 22,
                            borderColor: bravoColors.primaryFlat,
                            color: bravoColors.primaryFlat
                          }}
                        />
                      </Box>
                      
                      {section.content && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {section.content}
                        </Typography>
                      )}
                      
                      {section.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          Instructions: {section.description}
                        </Typography>
                      )}

                      {/* Show additional details for specific section types */}
                      {section.items && section.items.length > 0 && (
                        <Box sx={{ mt: 1, pl: 2 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Items:
                          </Typography>
                          {section.items.slice(0, 3).map((item: any, itemIndex: number) => (
                            <Typography key={itemIndex} variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
                              • {item.content || item.name || item}
                            </Typography>
                          ))}
                          {section.items.length > 3 && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              ... and {section.items.length - 3} more items
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewDialog;
