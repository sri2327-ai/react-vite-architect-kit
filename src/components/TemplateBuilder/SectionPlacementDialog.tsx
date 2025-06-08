

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Paper,
  Chip,
  Stack,
  Fade,
  useTheme,
  Zoom
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Close as CloseIcon,
  Add as AddIcon,
  DragIndicator as DragIndicatorIcon,
  ArrowDownward as ArrowDownwardIcon,
  ViewHeadline as ViewHeadlineIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Title as TitleIcon,
  Assignment as AssignmentIcon,
  TextSnippet as TextSnippetIcon,
  Checklist as ChecklistIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  VerticalAlignTop as VerticalAlignTopIcon,
  VerticalAlignBottom as VerticalAlignBottomIcon,
  VerticalAlignCenter as VerticalAlignCenterIcon
} from '@mui/icons-material';
import { useResponsive } from '../../hooks/useResponsive';

interface SectionPlacementDialogProps {
  open: boolean;
  onClose: () => void;
  onPlaceSection: (position: number) => void;
  onBack?: () => void;
  existingSections: Array<{ id: string; name: string; type?: string; }>;
  pendingSection?: any;
}

const SectionPlacementDialog: React.FC<SectionPlacementDialogProps> = ({
  open,
  onClose,
  onPlaceSection,
  onBack,
  existingSections,
  pendingSection
}) => {
  const theme = useTheme();
  const { isMobile, isTablet, isMobileView } = useResponsive();
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);

  const handlePlacement = () => {
    if (selectedPosition !== null) {
      console.log('SectionPlacementDialog: Placing section at position:', selectedPosition);
      console.log('SectionPlacementDialog: Pending section data:', pendingSection);
      
      onPlaceSection(selectedPosition);
      setSelectedPosition(null);
      onClose();
    }
  };

  const handleBackClick = () => {
    onClose();
    if (onBack) {
      onBack();
    }
  };

  const getTypeIcon = (type?: string) => {
    const iconProps = { 
      fontSize: 'small' as const, 
      sx: { 
        color: theme.palette.primary.main,
        fontSize: { xs: 16, sm: 18, md: 20 }
      } 
    };
    switch (type) {
      case 'paragraph': return <ViewHeadlineIcon {...iconProps} />;
      case 'bulleted-list': return <FormatListBulletedIcon {...iconProps} />;
      case 'section-header': return <TitleIcon {...iconProps} />;
      case 'exam-list': return <AssignmentIcon {...iconProps} />;
      case 'checklist': return <ChecklistIcon {...iconProps} />;
      case 'static-text': return <TextSnippetIcon {...iconProps} />;
      default: return <TextSnippetIcon {...iconProps} />;
    }
  };

  const getTypeLabel = (type?: string) => {
    const labels = {
      'paragraph': 'Paragraph',
      'bulleted-list': 'Bulleted List', 
      'section-header': 'Section Header',
      'exam-list': 'Exam List',
      'checklist': 'Checklist',
      'static-text': 'Static Text'
    };
    return labels[type as keyof typeof labels] || 'Section';
  };

  const PlacementZone = ({ 
    position, 
    label, 
    description,
    icon: IconComponent = ArrowDownwardIcon,
    isSpecial = false 
  }: { 
    position: number; 
    label: string; 
    description: string;
    icon?: React.ElementType;
    isSpecial?: boolean;
  }) => {
    const isSelected = selectedPosition === position;
    const isHovered = hoveredPosition === position;
    const isActive = isSelected || isHovered;

    return (
      <Paper
        elevation={isActive ? 8 : 2}
        onMouseEnter={() => setHoveredPosition(position)}
        onMouseLeave={() => setHoveredPosition(null)}
        onClick={() => {
          console.log('SectionPlacementDialog: Position selected:', position);
          setSelectedPosition(position);
        }}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          mb: { xs: 1.5, sm: 2, md: 2.5 },
          cursor: 'pointer',
          borderRadius: { xs: 2, sm: 2.5, md: 3 },
          border: `2px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
          backgroundColor: isSelected 
            ? alpha(theme.palette.primary.main, 0.08)
            : isHovered 
              ? alpha(theme.palette.primary.main, 0.04)
              : 'white',
          transition: 'all 0.2s ease',
          transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
          boxShadow: isActive 
            ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`
            : `0 1px 3px ${alpha(theme.palette.grey[500], 0.12)}`,
          minHeight: { xs: 72, sm: 80, md: 88 },
          '&:hover': {
            '& .placement-icon': {
              transform: 'scale(1.05)',
              color: theme.palette.primary.main
            }
          }
        }}
      >
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
          sx={{ height: '100%' }}
        >
          <Box
            className="placement-icon"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 40, sm: 44, md: 48 },
              height: { xs: 40, sm: 44, md: 48 },
              borderRadius: { xs: 2, sm: 2.5, md: 3 },
              backgroundColor: isSelected 
                ? theme.palette.primary.main
                : alpha(theme.palette.primary.main, 0.1),
              color: isSelected ? 'white' : theme.palette.primary.main,
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <IconComponent sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />
          </Box>
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600,
                color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                mb: { xs: 0.25, sm: 0.5 },
                transition: 'color 0.2s ease',
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
              }}
            >
              {label}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 }
              }}
            >
              {description}
            </Typography>
          </Box>

          {isSelected && (
            <CheckCircleIcon 
              sx={{ 
                color: theme.palette.success.main,
                fontSize: { xs: 24, sm: 26, md: 28 },
                flexShrink: 0
              }} 
            />
          )}
        </Stack>
      </Paper>
    );
  };

  const ExistingSection = ({ section, index }: { section: { id: string; name: string; type?: string }; index: number }) => (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        mb: { xs: 1.5, sm: 2, md: 2.5 },
        borderRadius: { xs: 2, sm: 2.5, md: 3 },
        backgroundColor: alpha(theme.palette.grey[100], 0.5),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        minHeight: { xs: 68, sm: 76, md: 84 }
      }}
    >
      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
        sx={{ height: '100%' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: 36, sm: 40, md: 44 },
            height: { xs: 36, sm: 40, md: 44 },
            borderRadius: { xs: 1.5, sm: 2, md: 2.5 },
            backgroundColor: alpha(theme.palette.grey[400], 0.15),
            color: theme.palette.grey[600],
            flexShrink: 0
          }}
        >
          <DragIndicatorIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={{ xs: 1, sm: 1.5 }} 
            sx={{ mb: { xs: 0.5, sm: 0.75 } }}
            flexWrap="wrap"
          >
            {getTypeIcon(section.type)}
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                lineHeight: { xs: 1.2, sm: 1.3 }
              }}
            >
              {section.name}
            </Typography>
            <Chip
              label={getTypeLabel(section.type)}
              size="small"
              sx={{
                height: { xs: 22, sm: 24, md: 26 },
                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                fontWeight: 600,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                '& .MuiChip-label': {
                  px: { xs: 1, sm: 1.5 }
                }
              }}
            />
          </Stack>
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' }
            }}
          >
            Position {index + 1}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );

  // Generate placement options dynamically
  const renderPlacementOptions = () => {
    const options = [];
    
    // Add "Place at Beginning" option
    options.push(
      <PlacementZone 
        key="beginning"
        position={0} 
        label="Place at Beginning"
        description={existingSections.length === 0 
          ? "This will be your first section"
          : "Place before all existing sections"
        }
        icon={VerticalAlignTopIcon}
        isSpecial={true}
      />
    );

    // Add existing sections with placement options between them
    existingSections.forEach((section, index) => {
      // Add the existing section
      options.push(
        <ExistingSection key={section.id} section={section} index={index} />
      );
      
      // Add placement option after this section
      const nextPosition = index + 1;
      const isLast = index === existingSections.length - 1;
      
      options.push(
        <PlacementZone 
          key={`after-${index}`}
          position={nextPosition} 
          label={isLast ? "Place at End" : `Place After "${section.name}"`}
          description={isLast 
            ? "Place after all existing sections"
            : `Insert after "${section.name}"`
          }
          icon={isLast ? VerticalAlignBottomIcon : VerticalAlignCenterIcon}
          isSpecial={isLast}
        />
      );
    });

    return options;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: { 
          borderRadius: { xs: 0, sm: 3, md: 4 },
          maxHeight: { xs: '100vh', sm: '90vh', md: '85vh' },
          m: { xs: 0, sm: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: { xs: 1, sm: 1.5, md: 2 }, 
        px: { xs: 2, sm: 3, md: 4 }, 
        pt: { xs: 2, sm: 2.5, md: 3 },
        position: { xs: 'sticky', sm: 'static' },
        top: 0,
        zIndex: 10,
        backgroundColor: 'background.paper',
        borderBottom: { xs: '1px solid', sm: 'none' },
        borderColor: { xs: 'divider', sm: 'transparent' },
        flexShrink: 0
      }}>
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between"
          minHeight={{ xs: 44, sm: 48, md: 52 }}
        >
          <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5, md: 2 }}>
            {onBack && (
              <IconButton 
                onClick={handleBackClick}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.grey[500], 0.1),
                  minWidth: { xs: 40, sm: 44, md: 48 },
                  minHeight: { xs: 40, sm: 44, md: 48 },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.grey[500], 0.2)
                  }
                }}
              >
                <ArrowBackIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />
              </IconButton>
            )}
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                  color: theme.palette.primary.main,
                  lineHeight: { xs: 1.2, sm: 1.3 }
                }}
              >
                Choose Placement
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                  mt: { xs: 0.25, sm: 0.5 }
                }}
              >
                Select where to place your section
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{
              color: theme.palette.text.secondary,
              minWidth: { xs: 40, sm: 44, md: 48 },
              minHeight: { xs: 40, sm: 44, md: 48 },
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main
              }
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        px: { xs: 2, sm: 3, md: 4 }, 
        py: { xs: 2, sm: 2.5, md: 3 },
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {pendingSection && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              mb: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: { xs: 2, sm: 2.5, md: 3 },
              background: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              flexShrink: 0
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: theme.palette.info.main, 
                fontWeight: 600, 
                mb: { xs: 0.5, sm: 0.75 },
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
              }}
            >
              📍 Section to Place: {pendingSection.name}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.info.main, 
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                opacity: 0.8,
                lineHeight: { xs: 1.3, sm: 1.4 }
              }}
            >
              {pendingSection.description}
            </Typography>
          </Paper>
        )}

        <Box sx={{ 
          flex: 1,
          overflowY: 'auto', 
          pr: { xs: 0.5, sm: 1, md: 1.5 },
          mr: { xs: -0.5, sm: -1, md: -1.5 }
        }}>
          {existingSections.length === 0 ? (
            <Box>
              <PlacementZone 
                position={0} 
                label="Place as First Section"
                description="This will be your first template section"
                icon={VerticalAlignTopIcon}
                isSpecial={true}
              />
              <Paper
                elevation={0}
                sx={{
                  textAlign: 'center',
                  py: { xs: 3, sm: 4, md: 5 },
                  px: { xs: 2, sm: 3 },
                  borderRadius: { xs: 2, sm: 2.5, md: 3 },
                  border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                  backgroundColor: alpha(theme.palette.primary.main, 0.02)
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: theme.palette.text.secondary, 
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    lineHeight: { xs: 1.4, sm: 1.5 }
                  }}
                >
                  🎉 Your template is empty - this will be the first section!
                </Typography>
              </Paper>
            </Box>
          ) : (
            renderPlacementOptions()
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ 
        p: { xs: 2, sm: 3, md: 4 }, 
        gap: { xs: 1, sm: 1.5, md: 2 },
        flexDirection: { xs: 'column', sm: 'row' },
        position: { xs: 'sticky', sm: 'static' },
        bottom: 0,
        backgroundColor: 'background.paper',
        borderTop: { xs: '1px solid', sm: 'none' },
        borderColor: { xs: 'divider', sm: 'transparent' },
        flexShrink: 0
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          size="medium"
          fullWidth={isMobile}
          sx={{
            borderRadius: { xs: 2, sm: 2.5, md: 3 },
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 3, sm: 4, md: 5 },
            py: { xs: 1.5, sm: 1.75, md: 2 },
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            minHeight: { xs: 48, sm: 52, md: 56 }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handlePlacement}
          variant="contained"
          size="medium"
          disabled={selectedPosition === null}
          fullWidth={isMobile}
          sx={{
            borderRadius: { xs: 2, sm: 2.5, md: 3 },
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 4, sm: 5, md: 6 },
            py: { xs: 1.5, sm: 1.75, md: 2 },
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            minHeight: { xs: 48, sm: 52, md: 56 },
            background: selectedPosition !== null 
              ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              : undefined,
            '&:disabled': {
              background: theme.palette.action.disabledBackground
            }
          }}
        >
          {selectedPosition !== null ? '✨ Place Here' : 'Select Position'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionPlacementDialog;

