
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  Stack,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Visibility as PreviewIcon,
  GetApp as ImportIcon,
  LocalHospital as SpecialtyIcon,
  Assignment as NoteTypeIcon,
  AccountTree as WorkflowIcon,
  Schedule as TimeIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import { alpha } from '@mui/material/styles';

interface LibraryTemplate {
  id: number;
  name: string;
  specialty: string;
  noteType: string;
  content?: string;
  estimatedTime?: string;
  complexity?: 'Simple' | 'Moderate' | 'Complex';
  usageCount?: number;
}

interface TemplateLibraryCardProps {
  template: LibraryTemplate;
  onPreview: (template: LibraryTemplate) => void;
  onImport: (template: LibraryTemplate) => void;
}

const TemplateLibraryCard: React.FC<TemplateLibraryCardProps> = ({
  template,
  onPreview,
  onImport
}) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return '#4CAF50';
      case 'Moderate': return '#FF9800';
      case 'Complex': return '#F44336';
      default: return bravoColors.secondary;
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    // Return appropriate icon based on specialty
    return <SpecialtyIcon />;
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: alpha(bravoColors.primaryFlat, 0.1),
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
          borderColor: bravoColors.primaryFlat
        }
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: bravoColors.primaryFlat,
                lineHeight: 1.3,
                flex: 1,
                mr: 1
              }}
            >
              {template.name}
            </Typography>
            {template.complexity && (
              <Chip 
                label={template.complexity}
                size="small"
                sx={{
                  backgroundColor: alpha(getComplexityColor(template.complexity), 0.1),
                  color: getComplexityColor(template.complexity),
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            )}
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Streamlined template for {template.specialty.toLowerCase()} documentation
          </Typography>
        </Box>

        {/* Specialty and Note Type */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Chip 
            icon={getSpecialtyIcon(template.specialty)}
            label={template.specialty}
            size="small"
            sx={{ 
              backgroundColor: alpha(bravoColors.primaryFlat, 0.1),
              color: bravoColors.primaryFlat,
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: bravoColors.primaryFlat
              }
            }}
          />
          <Chip 
            icon={<NoteTypeIcon />}
            label={template.noteType}
            size="small"
            sx={{ 
              backgroundColor: alpha(bravoColors.secondary, 0.1),
              color: bravoColors.secondary,
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: bravoColors.secondary
              }
            }}
          />
        </Stack>

        {/* Template Details */}
        <Box sx={{ mb: 3, flexGrow: 1 }}>
          <Stack spacing={1}>
            {template.estimatedTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Est. completion: {template.estimatedTime}
                </Typography>
              </Box>
            )}
            {template.usageCount && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkflowIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Used by {template.usageCount}+ clinicians
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Actions */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PreviewIcon />}
            onClick={() => onPreview(template)}
            sx={{
              flex: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: alpha(bravoColors.secondary, 0.5),
              color: bravoColors.secondary,
              '&:hover': {
                borderColor: bravoColors.secondary,
                backgroundColor: alpha(bravoColors.secondary, 0.05)
              }
            }}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<ImportIcon />}
            onClick={() => onImport(template)}
            sx={{
              flex: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: bravoColors.primaryFlat,
              '&:hover': {
                backgroundColor: bravoColors.primaryDark
              }
            }}
          >
            Add to Practice
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TemplateLibraryCard;
