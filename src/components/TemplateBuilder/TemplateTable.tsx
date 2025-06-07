
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  ContentCopy as ContentCopyIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AccessTime as AccessTimeIcon
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

interface TemplateTableProps {
  templates: TemplateData[];
  onView?: (template: TemplateData) => void;
  onEdit?: (template: TemplateData) => void;
  onCopy?: (template: TemplateData) => void;
  onToggleFavorite?: (template: TemplateData) => void;
}

const TemplateTable: React.FC<TemplateTableProps> = ({
  templates,
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

  const handleView = (template: TemplateData) => {
    console.log('View button clicked for template:', template);
    if (onView) {
      onView(template);
    }
  };

  const handleEdit = (template: TemplateData) => {
    console.log('Edit button clicked for template:', template);
    if (onEdit) {
      onEdit(template);
    }
  };

  const handleCopy = (template: TemplateData) => {
    console.log('Copy button clicked for template:', template);
    if (onCopy) {
      onCopy(template);
    }
  };

  const handleToggleFavorite = (template: TemplateData) => {
    console.log('Favorite button clicked for template:', template);
    if (onToggleFavorite) {
      onToggleFavorite(template);
    }
  };

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 600, color: bravoColors.primaryFlat }}>
              Template
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: bravoColors.primaryFlat }}>
              Type
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: bravoColors.primaryFlat }}>
              Specialty
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: bravoColors.primaryFlat }}>
              Sections
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: bravoColors.primaryFlat }}>
              Last Used
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: bravoColors.primaryFlat }}>
              Usage
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: bravoColors.primaryFlat }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {templates.map((template) => (
            <TableRow 
              key={template.id}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'grey.50'
                },
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleToggleFavorite(template)}
                    sx={{ p: 0.5 }}
                  >
                    {template.isFavorite ? (
                      <StarIcon sx={{ color: '#ffc107', fontSize: 18 }} />
                    ) : (
                      <StarBorderIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    )}
                  </IconButton>
                  <Box>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: bravoColors.primaryFlat,
                        lineHeight: 1.2
                      }}
                    >
                      {template.title}
                    </Typography>
                    {template.content && (
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {template.content.length > 50 
                          ? `${template.content.substring(0, 50)}...` 
                          : template.content}
                      </Typography>
                    )}
                    {template.tags && template.tags.length > 0 && (
                      <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {template.tags.slice(0, 2).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.65rem',
                              height: 20,
                              borderColor: bravoColors.primaryFlat,
                              color: bravoColors.primaryFlat
                            }}
                          />
                        ))}
                        {template.tags.length > 2 && (
                          <Typography variant="caption" color="text.secondary">
                            +{template.tags.length - 2}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
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
                </Box>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {template.specialty}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {template.fields?.length || 0} sections
                </Typography>
              </TableCell>
              
              <TableCell>
                {template.lastUsed && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {template.lastUsed}
                    </Typography>
                  </Box>
                )}
              </TableCell>
              
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {template.usageCount || 0} times
                </Typography>
              </TableCell>
              
              <TableCell align="center">
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                  <Tooltip title="View Template">
                    <IconButton
                      size="small"
                      onClick={() => handleView(template)}
                      sx={{
                        backgroundColor: bravoColors.secondary,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: bravoColors.primaryFlat
                        }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Edit Template">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(template)}
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
                  
                  <Tooltip title="Duplicate Template">
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(template)}
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
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TemplateTable;
