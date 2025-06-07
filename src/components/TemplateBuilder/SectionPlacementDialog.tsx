
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
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface SectionPlacementDialogProps {
  open: boolean;
  onClose: () => void;
  onPlaceSection: (position: number) => void;
  onBack?: () => void;
  existingSections: Array<{ id: string; name: string; type?: string; }>;
}

const SectionPlacementDialog: React.FC<SectionPlacementDialogProps> = ({
  open,
  onClose,
  onPlaceSection,
  onBack,
  existingSections
}) => {
  const theme = useTheme();
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);

  const handlePlacement = () => {
    if (selectedPosition !== null) {
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

  const PlacementZone = ({ position, label, isFirst = false }: { position: number; label: string; isFirst?: boolean }) => {
    const isSelected = selectedPosition === position;
    const isHovered = hoveredPosition === position;
    const isActive = isSelected || isHovered;

    return (
      <Zoom in={true} timeout={300} style={{ transitionDelay: `${position * 50}ms` }}>
        <Paper
          elevation={isActive ? 12 : 3}
          onMouseEnter={() => setHoveredPosition(position)}
          onMouseLeave={() => setHoveredPosition(null)}
          onClick={() => setSelectedPosition(position)}
          sx={{
            p: 3,
            mb: 3,
            cursor: 'pointer',
            borderRadius: 4,
            border: `3px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
            backgroundColor: isSelected 
              ? alpha(theme.palette.primary.main, 0.12)
              : isHovered 
                ? alpha(theme.palette.primary.main, 0.06)
                : 'white',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isActive ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
            boxShadow: isActive 
              ? `0 12px 40px ${alpha(theme.palette.primary.main, 0.3)}`
              : `0 4px 12px ${alpha(theme.palette.grey[500], 0.15)}`,
            '&:hover': {
              '& .placement-icon': {
                transform: 'scale(1.15) rotate(5deg)',
                color: theme.palette.primary.main
              },
              '& .placement-arrow': {
                animation: 'bounce 1s infinite'
              }
            },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: isSelected ? theme.palette.primary.main : 'transparent',
              transition: 'all 0.3s ease'
            }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={3}>
            <Box
              className="placement-icon"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: isSelected 
                  ? theme.palette.primary.main
                  : alpha(theme.palette.primary.main, 0.12),
                color: isSelected ? 'white' : theme.palette.primary.main,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                border: `3px solid ${isSelected ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3)}`,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -4,
                  borderRadius: '50%',
                  padding: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'xor',
                  opacity: isSelected ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }
              }}
            >
              {isFirst ? (
                <AddIcon sx={{ fontSize: 28 }} />
              ) : (
                <ArrowDownwardIcon className="placement-arrow" sx={{ fontSize: 28 }} />
              )}
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                  fontSize: '1.2rem',
                  mb: 0.5,
                  transition: 'color 0.3s ease'
                }}
              >
                {label}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                {isFirst ? 'Your new section will appear at the very top' : 'Your new section will be placed here'}
              </Typography>
            </Box>

            {isSelected && (
              <Zoom in={true} timeout={200}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.success.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`
                  }}
                >
                  <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
              </Zoom>
            )}
          </Stack>
        </Paper>
      </Zoom>
    );
  };

  const ExistingSection = ({ section, index }: { section: { id: string; name: string; type?: string }; index: number }) => (
    <Fade in={true} timeout={400} style={{ transitionDelay: `${index * 100}ms` }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.grey[50], 0.8),
          border: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.grey[100], 0.8),
            transform: 'translateY(-1px)',
            boxShadow: `0 6px 20px ${alpha(theme.palette.grey[500], 0.15)}`
          }
        }}
      >
        <Stack direction="row" alignItems="center" spacing={3}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.grey[400], 0.15),
              color: theme.palette.grey[600],
              border: `2px solid ${alpha(theme.palette.grey[400], 0.2)}`
            }}
          >
            <DragIndicatorIcon />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
              {getTypeIcon(section.type)}
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontSize: '1.1rem'
                }}
              >
                {section.name}
              </Typography>
              <Chip
                label={getTypeLabel(section.type)}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              />
            </Stack>
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontStyle: 'italic',
                fontSize: '0.8rem'
              }}
            >
              Position {index + 1} • Existing section
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Fade>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 4,
          maxHeight: '85vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            {onBack && (
              <IconButton 
                onClick={handleBackClick}
                sx={{
                  backgroundColor: alpha(theme.palette.grey[500], 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.grey[500], 0.2),
                    transform: 'translateX(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                Choose Section Placement
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Select where you'd like to place your new section in the template
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={onClose}
            sx={{
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.2),
                transform: 'rotate(90deg)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              border: `2px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}
          >
            <Typography variant="h6" sx={{ color: theme.palette.info.main, fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              💡 Quick Tip
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.info.main, fontWeight: 500, lineHeight: 1.6 }}>
              Click on any placement zone below to position your new section. The selected position will be highlighted with a checkmark.
            </Typography>
          </Paper>
        </Box>

        <Box>
          <PlacementZone 
            position={0} 
            label="Place at Beginning" 
            isFirst={true}
          />

          {existingSections.map((section, index) => (
            <Box key={section.id}>
              <ExistingSection section={section} index={index} />
              <PlacementZone 
                position={index + 1} 
                label={`Place After "${section.name}"`}
              />
            </Box>
          ))}

          {existingSections.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                py: 8,
                borderRadius: 4,
                border: `3px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                backgroundColor: alpha(theme.palette.primary.main, 0.02)
              }}
            >
              <Typography variant="h5" sx={{ color: theme.palette.text.secondary, mb: 2, fontWeight: 600 }}>
                This will be your first section
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Click "Place at Beginning" above to add your first template section
              </Typography>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          size="large"
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handlePlacement}
          variant="contained"
          size="large"
          disabled={selectedPosition === null}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 700,
            px: 5,
            py: 1.5,
            fontSize: '1rem',
            background: selectedPosition !== null 
              ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              : theme.palette.action.disabledBackground,
            boxShadow: selectedPosition !== null ? '0 6px 20px rgba(0,0,0,0.15)' : 'none',
            '&:hover': {
              boxShadow: selectedPosition !== null ? '0 8px 25px rgba(0,0,0,0.25)' : 'none',
              transform: selectedPosition !== null ? 'translateY(-2px) scale(1.02)' : 'none'
            },
            '&:disabled': {
              boxShadow: 'none',
              background: theme.palette.action.disabledBackground
            },
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {selectedPosition !== null ? '✨ Place Section Here' : 'Select Position First'}
        </Button>
      </DialogActions>

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}
      </style>
    </Dialog>
  );
};

export default SectionPlacementDialog;
