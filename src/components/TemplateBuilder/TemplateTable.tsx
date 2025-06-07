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
  Stack,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  ContentCopy as ContentCopyIcon,
  Description as DescriptionIcon,
  LocalOffer as TagIcon
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
    const iconMap = {
      'SOAP Note': '📋',
      'Consultation': '🩺',
      'Progress Note': '📈',
      'Procedure Note': '⚕️',
      'Discharge Summary': '🏥',
      'H&P': '📝',
      'Follow-up': '🔄',
      'General': '📄'
    };
    return iconMap[type as keyof typeof iconMap] || '📄';
  };

  const handleView = (template: TemplateData) => {
    console.log('Preview button clicked for template:', template);
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

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ 
            backgroundColor: `${bravoColors.primaryFlat}08`,
            '& th': {
              borderBottom: `2px solid ${bravoColors.primaryFlat}20`
            }
          }}>
            <TableCell sx={{ 
              fontWeight: 700, 
              color: bravoColors.primaryFlat,
              fontSize: '0.95rem',
              py: 2.5,
              pl: 3
            }}>
              Template Details
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 700, 
              color: bravoColors.primaryFlat,
              fontSize: '0.95rem',
              py: 2.5,
              textAlign: 'center'
            }}>
              Type & Category
            </TableCell>
            <TableCell sx={{ 
              fontWeight: 700, 
              color: bravoColors.primaryFlat,
              fontSize: '0.95rem',
              py: 2.5,
              textAlign: 'center'
            }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {templates.map((template, index) => (
            <TableRow 
              key={template.id}
              sx={{ 
                '&:hover': { 
                  backgroundColor: `${bravoColors.primaryFlat}05`,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                },
                borderBottom: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.2s ease-in-out',
                '&:last-child': {
                  borderBottom: 'none'
                }
              }}
            >
              <TableCell sx={{ pl: 3, py: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${bravoColors.primaryFlat}15`,
                      color: bravoColors.primaryFlat,
                      width: 48,
                      height: 48,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      border: `2px solid ${bravoColors.primaryFlat}20`
                    }}
                  >
                    {template.title.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        color: bravoColors.primaryFlat,
                        lineHeight: 1.3,
                        mb: 0.5,
                        fontSize: '1.1rem'
                      }}
                    >
                      {template.title}
                    </Typography>
                    
                    {template.content && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <DescriptionIcon 
                          sx={{ 
                            fontSize: '1rem', 
                            color: 'text.secondary',
                            mt: 0.1,
                            flexShrink: 0
                          }} 
                        />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {template.content.length > 80 
                            ? `${template.content.substring(0, 80)}...` 
                            : template.content}
                        </Typography>
                      </Box>
                    )}
                    
                    {template.tags && template.tags.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <TagIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                        <Stack direction="row" spacing={0.5}>
                          {template.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Chip
                              key={tagIndex}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.7rem',
                                height: 22,
                                borderColor: `${bravoColors.primaryFlat}40`,
                                color: bravoColors.primaryFlat,
                                backgroundColor: `${bravoColors.primaryFlat}08`,
                                '&:hover': {
                                  backgroundColor: `${bravoColors.primaryFlat}15`
                                }
                              }}
                            />
                          ))}
                          {template.tags.length > 3 && (
                            <Chip
                              label={`+${template.tags.length - 3}`}
                              size="small"
                              sx={{
                                fontSize: '0.7rem',
                                height: 22,
                                backgroundColor: 'text.secondary',
                                color: 'white'
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Box>
              </TableCell>
              
              <TableCell align="center" sx={{ py: 2.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    backgroundColor: `${getSpecialtyColor(template.specialty)}15`,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    border: `1px solid ${getSpecialtyColor(template.specialty)}30`
                  }}>
                    <Typography sx={{ fontSize: '1.2rem' }}>
                      {getTypeIcon(template.type)}
                    </Typography>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          color: getSpecialtyColor(template.specialty),
                          fontSize: '0.85rem',
                          lineHeight: 1.2
                        }}
                      >
                        {template.type}
                      </Typography>
                      {template.specialty && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.7rem',
                            display: 'block'
                          }}
                        >
                          {template.specialty}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </TableCell>
              
              <TableCell align="center" sx={{ py: 2.5 }}>
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="Preview Template" placement="top">
                    <IconButton
                      size="medium"
                      onClick={() => handleView(template)}
                      sx={{
                        backgroundColor: `${bravoColors.secondary}15`,
                        color: bravoColors.secondary,
                        border: `1px solid ${bravoColors.secondary}30`,
                        '&:hover': {
                          backgroundColor: bravoColors.secondary,
                          color: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 12px ${bravoColors.secondary}40`
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Edit Template" placement="top">
                    <IconButton
                      size="medium"
                      onClick={() => handleEdit(template)}
                      sx={{
                        backgroundColor: `${bravoColors.primaryFlat}15`,
                        color: bravoColors.primaryFlat,
                        border: `1px solid ${bravoColors.primaryFlat}30`,
                        '&:hover': {
                          backgroundColor: bravoColors.primaryFlat,
                          color: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 12px ${bravoColors.primaryFlat}40`
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Duplicate Template" placement="top">
                    <IconButton
                      size="medium"
                      onClick={() => handleCopy(template)}
                      sx={{
                        backgroundColor: 'rgba(0,0,0,0.08)',
                        color: 'text.secondary',
                        border: '1px solid rgba(0,0,0,0.12)',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.15)',
                          color: 'text.primary',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TemplateTable;
