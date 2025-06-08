
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
  const { isMobile } = useResponsive();
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
    const iconProps = { fontSize: 'small' as const, sx: { color: theme.palette.primary.main } };
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
          p: { xs: 1.5, sm: 2 },
          mb: { xs: 1, sm: 1.5 },
          cursor: 'pointer',
          borderRadius: 2,
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
          '&:hover': {
            '& .placement-icon': {
              transform: 'scale(1.05)',
              color: theme.palette.primary.main
            }
          }
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            className="placement-icon"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: 2,
              backgroundColor: isSelected 
                ? theme.palette.primary.main
                : alpha(theme.palette.primary.main, 0.1),
              color: isSelected ? 'white' : theme.palette.primary.main,
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <IconComponent sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </Box>
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600,
                color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                mb: 0.25,
                transition: 'color 0.2s ease'
              }}
            >
              {label}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                lineHeight: 1.3
              }}
            >
              {description}
            </Typography>
          </Box>

          {isSelected && (
            <CheckCircleIcon 
              sx={{ 
                color: theme.palette.success.main,
                fontSize: { xs: 20, sm: 24 }
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
        p: { xs: 1.5, sm: 2 },
        mb: { xs: 1, sm: 1.5 },
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.grey[100], 0.5),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: 32, sm: 36 },
            height: { xs: 32, sm: 36 },
            borderRadius: 1.5,
            backgroundColor: alpha(theme.palette.grey[400], 0.15),
            color: theme.palette.grey[600],
            flexShrink: 0
          }}
        >
          <DragIndicatorIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            {getTypeIcon(section.type)}
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: { xs: '0.8rem', sm: '0.85rem' }
              }}
            >
              {section.name}
            </Typography>
            <Chip
              label={getTypeLabel(section.type)}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 600,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main
              }}
            />
          </Stack>
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.7rem', sm: '0.75rem' }
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
      PaperProps={{
        sx: { 
          borderRadius: 3,
          maxHeight: '80vh',
          m: { xs: 1, sm: 2 }
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, px: 3, pt: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {onBack && (
              <IconButton 
                onClick={handleBackClick}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.grey[500], 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.grey[500], 0.2)
                  }
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            )}
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  color: theme.palette.primary.main
                }}
              >
                Choose Placement
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.85rem' }
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
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {pendingSection && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              background: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: theme.palette.info.main, 
                fontWeight: 600, 
                mb: 0.5,
                fontSize: '0.85rem'
              }}
            >
              📍 Section to Place: {pendingSection.name}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.info.main, 
                fontSize: '0.75rem',
                opacity: 0.8
              }}
            >
              {pendingSection.description}
            </Typography>
          </Paper>
        )}

        <Box sx={{ maxHeight: '50vh', overflowY: 'auto', pr: 1 }}>
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
                  py: 4,
                  borderRadius: 2,
                  border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                  backgroundColor: alpha(theme.palette.primary.main, 0.02)
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: theme.palette.text.secondary, 
                    fontWeight: 500,
                    fontSize: '0.9rem'
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

      <DialogActions sx={{ p: 3, gap: 1.5 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          size="medium"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handlePlacement}
          variant="contained"
          size="medium"
          disabled={selectedPosition === null}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
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
