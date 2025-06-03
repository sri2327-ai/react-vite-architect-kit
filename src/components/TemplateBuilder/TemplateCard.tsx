
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Avatar,
  Tooltip,
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  ContentCopy as ContentCopyIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';

interface TemplateData {
  id: number;
  title: string;
  specialty: string;
  type: string;
  fields: any[];
  content?: string;
  lastUsed?: string;
  usageCount?: number;
  isFavorite?: boolean;
  createdBy?: string;
  tags?: string[];
}

interface TemplateCardProps {
  template: TemplateData;
  onView: (template: TemplateData) => void;
  onEdit: (template: TemplateData) => void;
  onCopy?: (template: TemplateData) => void;
  onToggleFavorite?: (template: TemplateData) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onView,
  onEdit,
  onCopy,
  onToggleFavorite
}) => {
  const getSpecialtyColor = (specialty: string) => {
    const colors = {
      'General Medicine': bravoColors.secondary,
      'Cardiology': '#e91e63',
      'Neurology': '#9c27b0',
      'Dermatology': '#ff9800',
      'Psychiatry': '#4caf50',
      'Emergency': '#f44336'
    };
    return colors[specialty as keyof typeof colors] || bravoColors.primaryFlat;
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'soap': return '📋';
      case 'consultation': return '🩺';
      case 'progress': return '📈';
      case 'procedure': return '⚕️';
      case 'discharge': return '🏥';
      default: return '📝';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          borderColor: bravoColors.primaryFlat,
          boxShadow: '0 8px 25px rgba(20, 49, 81, 0.15)',
          transform: 'translateY(-4px)',
          '& .action-buttons': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
      onClick={() => onView(template)}
    >
      {/* Favorite Star */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2
        }}
      >
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(template);
          }}
          sx={{
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: 'white',
              transform: 'scale(1.1)'
            }
          }}
        >
          {template.isFavorite ? (
            <StarIcon sx={{ color: '#ffc107', fontSize: 18 }} />
          ) : (
            <StarBorderIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
          )}
        </IconButton>
      </Box>

      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="h3" sx={{ fontSize: '1.5rem' }}>
              {getTypeIcon(template.type)}
            </Typography>
            <Chip
              label={template.type}
              size="small"
              sx={{
                backgroundColor: getSpecialtyColor(template.specialty),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}
            />
          </Stack>
          
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: bravoColors.primaryFlat,
              fontSize: '1.1rem',
              lineHeight: 1.3,
              mb: 0.5
            }}
          >
            {template.title}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}
          >
            {template.specialty}
          </Typography>
        </Box>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {template.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.7rem',
                    height: 24,
                    borderColor: bravoColors.primaryFlat,
                    color: bravoColors.primaryFlat
                  }}
                />
              ))}
              {template.tags.length > 3 && (
                <Chip
                  label={`+${template.tags.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.7rem',
                    height: 24,
                    borderColor: 'text.secondary',
                    color: 'text.secondary'
                  }}
                />
              )}
            </Stack>
          </Box>
        )}

        {/* Stats */}
        <Box sx={{ mb: 2, flex: 1 }}>
          <Stack direction="row" spacing={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <AssignmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {template.fields?.length || 0} sections
              </Typography>
            </Box>
            {template.usageCount !== undefined && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Used {template.usageCount} times
                </Typography>
              </Box>
            )}
          </Stack>
          
          {template.lastUsed && (
            <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Last used {template.lastUsed}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Action Buttons */}
        <Box
          className="action-buttons"
          sx={{
            opacity: 0,
            transform: 'translateY(8px)',
            transition: 'all 0.3s ease',
            display: 'flex',
            gap: 1,
            mt: 'auto'
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onView(template);
            }}
            sx={{
              flex: 1,
              backgroundColor: bravoColors.secondary,
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: bravoColors.primaryFlat
              }
            }}
          >
            View
          </Button>
          
          <Tooltip title="Edit Template">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(template);
              }}
              sx={{
                backgroundColor: bravoColors.primaryFlat,
                color: 'white',
                '&:hover': {
                  backgroundColor: bravoColors.primaryDark
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {onCopy && (
            <Tooltip title="Duplicate Template">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(template);
                }}
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.2)'
                  }
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
