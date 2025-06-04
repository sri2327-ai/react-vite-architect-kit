
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
  useTheme
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
  ArrowBack as ArrowBackIcon
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
      <Fade in={true} timeout={200}>
        <Paper
          elevation={isActive ? 8 : 2}
          onMouseEnter={() => setHoveredPosition(position)}
          onMouseLeave={() => setHoveredPosition(null)}
          onClick={() => setSelectedPosition(position)}
          sx={{
            p: 2.5,
            mb: 2,
            cursor: 'pointer',
            borderRadius: 3,
            border: `2px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
            backgroundColor: isSelected 
              ? alpha(theme.palette.primary.main, 0.08)
              : isHovered 
                ? alpha(theme.palette.primary.main, 0.04)
                : 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isActive ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
            boxShadow: isActive 
              ? `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`
              : `0 2px 8px ${alpha(theme.palette.grey[500], 0.15)}`,
            '&:hover': {
              '& .placement-icon': {
                transform: 'scale(1.1)',
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
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: isSelected 
                  ? theme.palette.primary.main
                  : alpha(theme.palette.primary.main, 0.1),
                color: isSelected ? 'white' : theme.palette.primary.main,
                transition: 'all 0.3s ease',
                border: `2px solid ${isSelected ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              {isFirst ? (
                <AddIcon sx={{ fontSize: 24 }} />
              ) : (
                <ArrowDownwardIcon sx={{ fontSize: 24 }} />
              )}
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                  fontSize: '1.1rem',
                  mb: 0.5,
                  transition: 'color 0.2s ease'
                }}
              >
                {label}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '0.875rem'
                }}
              >
                {isFirst ? 'Your new section will appear at the very top' : 'Your new section will be placed here'}
              </Typography>
            </Box>

            {isSelected && (
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.success.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'white'
                  }}
                />
              </Box>
            )}
          </Stack>
        </Paper>
      </Fade>
    );
  };

  const ExistingSection = ({ section, index }: { section: { id: string; name: string; type?: string }; index: number }) => (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.grey[50], 0.8),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.grey[400], 0.1),
            color: theme.palette.grey[600]
          }}
        >
          <DragIndicatorIcon fontSize="small" />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
            {getTypeIcon(section.type)}
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: '1rem'
              }}
            >
              {section.name}
            </Typography>
            <Chip
              label={getTypeLabel(section.type)}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 500,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main
              }}
            />
          </Stack>
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontStyle: 'italic'
            }}
          >
            Position {index + 1} • Existing section
          </Typography>
        </Box>
      </Stack>
    </Paper>
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
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {onBack && (
              <IconButton 
                onClick={onBack}
                sx={{
                  backgroundColor: alpha(theme.palette.grey[500], 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.grey[500], 0.2)
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                Choose Section Placement
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select where you'd like to place your new section in the template
              </Typography>
            </Box>
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

      <DialogContent sx={{ px: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.info.main, fontWeight: 500 }}>
              💡 Click on any placement zone below to position your new section. The selected position will be highlighted.
            </Typography>
          </Paper>
        </Box>

        <Box>
          {/* First placement option */}
          <PlacementZone 
            position={0} 
            label="Place at Beginning" 
            isFirst={true}
          />

          {/* Existing sections with placement options */}
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
                py: 6,
                borderRadius: 3,
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                backgroundColor: alpha(theme.palette.primary.main, 0.02)
              }}
            >
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                This will be your first section
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Click "Place at Beginning" above to add your first template section
              </Typography>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          size="large"
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
          size="large"
          disabled={selectedPosition === null}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            boxShadow: selectedPosition !== null ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
            '&:hover': {
              boxShadow: selectedPosition !== null ? '0 6px 20px rgba(0,0,0,0.2)' : 'none',
              transform: selectedPosition !== null ? 'translateY(-1px)' : 'none'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {selectedPosition !== null ? 'Place Section Here' : 'Select Position'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionPlacementDialog;
