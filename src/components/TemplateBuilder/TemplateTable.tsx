
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
  Avatar,
  useTheme,
  useMediaQuery
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down(480));

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
        borderRadius: { xs: 2, sm: 3 },
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%'
      }}
    >
      <Box sx={{ 
        overflowX: 'auto',
        width: '100%',
        '&::-webkit-scrollbar': {
          height: { xs: 4, sm: 6 },
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(0,0,0,0.1)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: bravoColors.primaryFlat,
          borderRadius: 3,
        },
      }}>
        <Table sx={{ 
          minWidth: { xs: 280, sm: 450, md: 650 },
          width: '100%'
        }}>
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
                fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                py: { xs: 1, sm: 1.5, md: 2 },
                pl: { xs: 1, sm: 1.5, md: 2 },
                pr: { xs: 0.5, sm: 1, md: 1.5 },
                minWidth: { xs: 180, sm: 220, md: 280 }
              }}>
                Template Details
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                color: bravoColors.primaryFlat,
                fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                py: { xs: 1, sm: 1.5, md: 2 },
                px: { xs: 0.25, sm: 0.5, md: 1 },
                textAlign: 'center',
                minWidth: { xs: 80, sm: 100, md: 120 }
              }}>
                {isExtraSmall ? 'Type' : isMobile ? 'Type' : 'Type & Category'}
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                color: bravoColors.primaryFlat,
                fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                py: { xs: 1, sm: 1.5, md: 2 },
                px: { xs: 0.25, sm: 0.5, md: 1 },
                textAlign: 'center',
                minWidth: { xs: 80, sm: 100, md: 120 }
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
                    transform: { xs: 'none', md: 'translateY(-1px)' },
                    boxShadow: { xs: 'none', md: '0 2px 8px rgba(0,0,0,0.1)' }
                  },
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease-in-out',
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }}
              >
                <TableCell sx={{ 
                  pl: { xs: 1, sm: 1.5, md: 2 }, 
                  pr: { xs: 0.5, sm: 1, md: 1.5 },
                  py: { xs: 1, sm: 1.5, md: 2 }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: isExtraSmall ? 'center' : 'flex-start', 
                    gap: { xs: 0.75, sm: 1, md: 1.5 },
                    flexDirection: isExtraSmall ? 'column' : 'row'
                  }}>
                    <Avatar
                      sx={{
                        bgcolor: `${bravoColors.primaryFlat}15`,
                        color: bravoColors.primaryFlat,
                        width: { xs: 28, sm: 36, md: 44 },
                        height: { xs: 28, sm: 36, md: 44 },
                        fontSize: { xs: '0.8rem', sm: '1rem', md: '1.1rem' },
                        fontWeight: 600,
                        border: `2px solid ${bravoColors.primaryFlat}20`,
                        flexShrink: 0
                      }}
                    >
                      {template.title.charAt(0).toUpperCase()}
                    </Avatar>
                    
                    <Box sx={{ 
                      flex: 1, 
                      minWidth: 0, 
                      width: '100%',
                      textAlign: isExtraSmall ? 'center' : 'left'
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          color: bravoColors.primaryFlat,
                          lineHeight: { xs: 1.2, sm: 1.3 },
                          mb: { xs: 0.25, sm: 0.5 },
                          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                          wordBreak: 'break-word',
                          display: '-webkit-box',
                          WebkitLineClamp: { xs: 2, sm: 2, md: 1 },
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {template.title}
                      </Typography>
                      
                      {template.content && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: { xs: 0.25, sm: 0.5, md: 0.75 }, 
                          mb: { xs: 0.25, sm: 0.5, md: 0.75 },
                          flexDirection: isExtraSmall ? 'column' : 'row'
                        }}>
                          <DescriptionIcon 
                            sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' }, 
                              color: 'text.secondary',
                              mt: { xs: 0, sm: 0.1 },
                              flexShrink: 0,
                              display: isExtraSmall ? 'none' : 'block'
                            }} 
                          />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
                              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                              display: '-webkit-box',
                              WebkitLineClamp: { xs: 1, sm: 1, md: 2 },
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              wordBreak: 'break-word'
                            }}
                          >
                            {isExtraSmall && template.content.length > 25 
                              ? `${template.content.substring(0, 25)}...` 
                              : isSmallMobile && template.content.length > 40
                              ? `${template.content.substring(0, 40)}...`
                              : isMobile && template.content.length > 60
                              ? `${template.content.substring(0, 60)}...`
                              : template.content.length > 80 
                              ? `${template.content.substring(0, 80)}...` 
                              : template.content}
                          </Typography>
                        </Box>
                      )}
                      
                      {template.tags && template.tags.length > 0 && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: { xs: 0.25, sm: 0.5, md: 0.75 }, 
                          flexWrap: 'wrap',
                          justifyContent: isExtraSmall ? 'center' : 'flex-start'
                        }}>
                          <TagIcon sx={{ 
                            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, 
                            color: 'text.secondary',
                            display: isExtraSmall ? 'none' : 'block'
                          }} />
                          <Stack 
                            direction="row" 
                            spacing={0.25} 
                            sx={{ 
                              flexWrap: 'wrap', 
                              gap: { xs: 0.25, sm: 0.5 },
                              justifyContent: isExtraSmall ? 'center' : 'flex-start'
                            }}
                          >
                            {template.tags.slice(0, isExtraSmall ? 1 : isSmallMobile ? 2 : isMobile ? 2 : 3).map((tag, tagIndex) => (
                              <Chip
                                key={tagIndex}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem' },
                                  height: { xs: 16, sm: 18, md: 20 },
                                  borderColor: `${bravoColors.primaryFlat}40`,
                                  color: bravoColors.primaryFlat,
                                  backgroundColor: `${bravoColors.primaryFlat}08`,
                                  '&:hover': {
                                    backgroundColor: `${bravoColors.primaryFlat}15`
                                  },
                                  '& .MuiChip-label': {
                                    px: { xs: 0.25, sm: 0.5, md: 0.75 }
                                  }
                                }}
                              />
                            ))}
                            {template.tags.length > (isExtraSmall ? 1 : isSmallMobile ? 2 : isMobile ? 2 : 3) && (
                              <Chip
                                label={`+${template.tags.length - (isExtraSmall ? 1 : isSmallMobile ? 2 : isMobile ? 2 : 3)}`}
                                size="small"
                                sx={{
                                  fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem' },
                                  height: { xs: 16, sm: 18, md: 20 },
                                  backgroundColor: 'text.secondary',
                                  color: 'white',
                                  '& .MuiChip-label': {
                                    px: { xs: 0.25, sm: 0.5, md: 0.75 }
                                  }
                                }}
                              />
                            )}
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell align="center" sx={{ 
                  py: { xs: 1, sm: 1.5, md: 2 },
                  px: { xs: 0.25, sm: 0.5, md: 1 }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: { xs: 0.25, sm: 0.5, md: 1 }
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: { xs: 0.25, sm: 0.5, md: 0.75 },
                      backgroundColor: `${getSpecialtyColor(template.specialty)}15`,
                      borderRadius: { xs: 1, sm: 1.5, md: 2 },
                      px: { xs: 0.5, sm: 1, md: 1.5 },
                      py: { xs: 0.25, sm: 0.5, md: 0.75 },
                      border: `1px solid ${getSpecialtyColor(template.specialty)}30`,
                      flexDirection: { xs: 'column', sm: 'row' },
                      minWidth: 0,
                      maxWidth: { xs: 70, sm: 90, md: 'none' }
                    }}>
                      <Typography sx={{ 
                        fontSize: { xs: '0.8rem', sm: '1rem', md: '1.1rem' }
                      }}>
                        {getTypeIcon(template.type)}
                      </Typography>
                      <Box sx={{ textAlign: 'center', minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color: getSpecialtyColor(template.specialty),
                            fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
                            lineHeight: 1.1,
                            wordBreak: 'break-word',
                            display: '-webkit-box',
                            WebkitLineClamp: { xs: 2, sm: 1 },
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {template.type}
                        </Typography>
                        {template.specialty && !isExtraSmall && !isSmallMobile && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem' },
                              display: 'block',
                              wordBreak: 'break-word',
                              lineHeight: 1.1,
                              mt: 0.25
                            }}
                          >
                            {template.specialty.length > 12 
                              ? `${template.specialty.substring(0, 12)}...` 
                              : template.specialty}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell align="center" sx={{ 
                  py: { xs: 1, sm: 1.5, md: 2 },
                  px: { xs: 0.25, sm: 0.5, md: 1 }
                }}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={{ xs: 0.25, sm: 0.5, md: 0.75 }} 
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Tooltip title="Preview Template" placement="top">
                      <IconButton
                        size="small"
                        onClick={() => handleView(template)}
                        sx={{
                          backgroundColor: `${bravoColors.secondary}15`,
                          color: bravoColors.secondary,
                          border: `1px solid ${bravoColors.secondary}30`,
                          width: { xs: 28, sm: 32, md: 36 },
                          height: { xs: 28, sm: 32, md: 36 },
                          '&:hover': {
                            backgroundColor: bravoColors.secondary,
                            color: 'white',
                            transform: { xs: 'none', md: 'translateY(-2px)' },
                            boxShadow: { xs: 'none', md: `0 4px 12px ${bravoColors.secondary}40` }
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <VisibilityIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }} />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Edit Template" placement="top">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(template)}
                        sx={{
                          backgroundColor: `${bravoColors.primaryFlat}15`,
                          color: bravoColors.primaryFlat,
                          border: `1px solid ${bravoColors.primaryFlat}30`,
                          width: { xs: 28, sm: 32, md: 36 },
                          height: { xs: 28, sm: 32, md: 36 },
                          '&:hover': {
                            backgroundColor: bravoColors.primaryFlat,
                            color: 'white',
                            transform: { xs: 'none', md: 'translateY(-2px)' },
                            boxShadow: { xs: 'none', md: `0 4px 12px ${bravoColors.primaryFlat}40` }
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <EditIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }} />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Duplicate Template" placement="top">
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(template)}
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.08)',
                          color: 'text.secondary',
                          border: '1px solid rgba(0,0,0,0.12)',
                          width: { xs: 28, sm: 32, md: 36 },
                          height: { xs: 28, sm: 32, md: 36 },
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.15)',
                            color: 'text.primary',
                            transform: { xs: 'none', md: 'translateY(-2px)' },
                            boxShadow: { xs: 'none', md: '0 4px 12px rgba(0,0,0,0.2)' }
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ContentCopyIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </TableContainer>
  );
};

export default TemplateTable;
