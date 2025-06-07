
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
  alpha,
  Stack,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  ViewHeadline as ViewHeadlineIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Title as TitleIcon,
  Assignment as AssignmentIcon,
  TextSnippet as TextSnippetIcon,
  Checklist as ChecklistIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import SectionPlacementDialog from './SectionPlacementDialog';

interface SectionTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  type: string;
  icon: React.ReactNode;
}

interface AddSectionOverlayProps {
  open: boolean;
  onClose: () => void;
  onAddSection: (sectionTemplate: SectionTemplate, position: number) => void;
  existingSections: Array<{ id: string; name: string; type?: string; }>;
}

const AddSectionOverlay: React.FC<AddSectionOverlayProps> = ({
  open,
  onClose,
  onAddSection,
  existingSections = []
}) => {
  const theme = useTheme();
  const [selectedSection, setSelectedSection] = useState<SectionTemplate | null>(null);
  const [showPlacementDialog, setShowPlacementDialog] = useState(false);

  const sectionTemplates: SectionTemplate[] = [
    {
      id: 'paragraph',
      name: 'Paragraph',
      category: 'Basic',
      description: 'A.I. will write a descriptive block of text following the guidelines below.',
      type: 'paragraph',
      icon: <ViewHeadlineIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'bulleted-list',
      name: 'Bulleted List',
      category: 'Basic',
      description: 'A.I. will create a bulleted list based on the instructions provided.',
      type: 'bulleted-list',
      icon: <FormatListBulletedIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'section-header',
      name: 'Section Header',
      category: 'Formatting',
      description: 'Add a section header to organize your template.',
      type: 'section-header',
      icon: <TitleIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'exam-list',
      name: 'Exam List',
      category: 'Medical',
      description: 'A structured list for physical examination findings.',
      type: 'exam-list',
      icon: <AssignmentIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'static-text',
      name: 'Static Text',
      category: 'Basic',
      description: 'Add static text that will not be modified by A.I.',
      type: 'static-text',
      icon: <TextSnippetIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'checklist',
      name: 'Checklist',
      category: 'Interactive',
      description: 'Create a checklist with customizable items.',
      type: 'checklist',
      icon: <ChecklistIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    }
  ];

  const handleSectionClick = (section: SectionTemplate) => {
    setSelectedSection(section);
    setShowPlacementDialog(true);
  };

  const handlePlaceSection = (position: number) => {
    if (selectedSection) {
      onAddSection(selectedSection, position);
      setSelectedSection(null);
      setShowPlacementDialog(false);
      onClose();
    }
  };

  const handleClosePlacement = () => {
    setShowPlacementDialog(false);
    setSelectedSection(null);
  };

  const handleBackToSections = () => {
    setShowPlacementDialog(false);
    setSelectedSection(null);
    // Keep the main dialog open
  };

  return (
    <>
      {/* Main Add Section Dialog */}
      <Dialog
        open={open && !showPlacementDialog}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 4,
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                Add New Section
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose a section type to add to your template
              </Typography>
            </Box>
            <IconButton 
              onClick={onClose}
              sx={{
                backgroundColor: alpha(theme.palette.grey[500], 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.grey[500], 0.2)
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 3 }}>
          <Grid container spacing={3}>
            {sectionTemplates.map((section) => (
              <Grid xs={12} sm={6} md={4} key={section.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: `2px solid transparent`,
                    '&:hover': {
                      borderColor: bravoColors.primaryFlat,
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 25px ${alpha(bravoColors.primaryFlat, 0.15)}`
                    }
                  }}
                  onClick={() => handleSectionClick(section)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {section.icon}
                        <Chip
                          label={section.category}
                          size="small"
                          sx={{
                            backgroundColor: alpha(bravoColors.secondary, 0.15),
                            color: bravoColors.secondary,
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                      
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: bravoColors.primaryFlat,
                            mb: 1
                          }}
                        >
                          {section.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ lineHeight: 1.5 }}
                        >
                          {section.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Section Placement Dialog */}
      <SectionPlacementDialog
        open={showPlacementDialog}
        onClose={handleClosePlacement}
        onPlaceSection={handlePlaceSection}
        onBack={handleBackToSections}
        existingSections={existingSections}
      />
    </>
  );
};

export default AddSectionOverlay;
