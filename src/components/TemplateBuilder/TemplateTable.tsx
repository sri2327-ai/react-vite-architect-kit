
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
          minWidth: { xs: 320, sm: 500, md: 650 },
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
                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.95rem' },
                py: { xs: 1.5, sm: 2, md: 2.5 },
                pl: { xs: 1.5, sm: 2, md: 3 },
                pr: { xs: 1, sm: 1.5, md: 2 },
                minWidth: { xs: 200, sm: 250, md: 300 }
              }}>
                Template Details
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                color: bravoColors.primaryFlat,
                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.95rem' },
                py: { xs: 1.5, sm: 2, md: 2.5 },
                px: { xs: 0.5, sm: 1, md: 1.5 },
                textAlign: 'center',
                minWidth: { xs: 100, sm: 120, md: 140 }
              }}>
                {isMobile ? 'Type' : 'Type & Category'}
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 700, 
                color: bravoColors.primaryFlat,
                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.95rem' },
                py: { xs: 1.5, sm: 2, md: 2.5 },
                px: { xs: 0.5, sm: 1, md: 1.5 },
                textAlign: 'center',
                minWidth: { xs: 100, sm: 120, md: 140 }
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
                  pl: { xs: 1.5, sm: 2, md: 3 }, 
                  pr: { xs: 1, sm: 1.5, md: 2 },
                  py: { xs: 1.5, sm: 2, md: 2.5 }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: { xs: 1, sm: 1.5, md: 2 },
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                    <Avatar
                      sx={{
                        bgcolor: `${bravoColors.primaryFlat}15`,
                        color: bravoColors.primaryFlat,
                        width: { xs: 36, sm: 40, md: 48 },
                        height: { xs: 36, sm: 40, md: 48 },
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                        fontWeight: 600,
                        border: `2px solid ${bravoColors.primaryFlat}20`,
                        alignSelf: { xs: 'flex-start', sm: 'flex-start' }
                      }}
                    >
                      {template.title.charAt(0).toUpperCase()}
                    </Avatar>
                    
                    <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          color: bravoColors.primaryFlat,
                          lineHeight: 1.3,
                          mb: 0.5,
                          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                          wordBreak: 'break-word'
                        }}
                      >
                        {template.title}
                      </Typography>
                      
                      {template.content && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: { xs: 0.5, sm: 1 }, 
                          mb: { xs: 0.5, sm: 1 },
                          flexDirection: { xs: 'column', sm: 'row' }
                        }}>
                          <DescriptionIcon 
                            sx={{ 
                              fontSize: { xs: '0.9rem', sm: '1rem' }, 
                              color: 'text.secondary',
                              mt: { xs: 0, sm: 0.1 },
                              flexShrink: 0,
                              display: { xs: 'none', sm: 'block' }
                            }} 
                          />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              lineHeight: 1.4,
                              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                              display: '-webkit-box',
                              WebkitLineClamp: { xs: 1, sm: 2 },
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              wordBreak: 'break-word'
                            }}
                          >
                            {isSmallMobile && template.content.length > 40 
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
                          gap: { xs: 0.5, sm: 1 }, 
                          flexWrap: 'wrap' 
                        }}>
                          <TagIcon sx={{ 
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }, 
                            color: 'text.secondary',
                            display: { xs: 'none', sm: 'block' }
                          }} />
                          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                            {template.tags.slice(0, isSmallMobile ? 1 : isMobile ? 2 : 3).map((tag, tagIndex) => (
                              <Chip
                                key={tagIndex}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                                  height: { xs: 18, sm: 20, md: 22 },
                                  borderColor: `${bravoColors.primaryFlat}40`,
                                  color: bravoColors.primaryFlat,
                                  backgroundColor: `${bravoColors.primaryFlat}08`,
                                  '&:hover': {
                                    backgroundColor: `${bravoColors.primaryFlat}15`
                                  },
                                  '& .MuiChip-label': {
                                    px: { xs: 0.5, sm: 0.75, md: 1 }
                                  }
                                }}
                              />
                            ))}
                            {template.tags.length > (isSmallMobile ? 1 : isMobile ? 2 : 3) && (
                              <Chip
                                label={`+${template.tags.length - (isSmallMobile ? 1 : isMobile ? 2 : 3)}`}
                                size="small"
                                sx={{
                                  fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                                  height: { xs: 18, sm: 20, md: 22 },
                                  backgroundColor: 'text.secondary',
                                  color: 'white',
                                  '& .MuiChip-label': {
                                    px: { xs: 0.5, sm: 0.75, md: 1 }
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
                  py: { xs: 1.5, sm: 2, md: 2.5 },
                  px: { xs: 0.5, sm: 1, md: 1.5 }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: { xs: 0.5, sm: 1, md: 1.5 }
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: { xs: 0.5, sm: 0.75, md: 1 },
                      backgroundColor: `${getSpecialtyColor(template.specialty)}15`,
                      borderRadius: { xs: 1.5, sm: 2 },
                      px: { xs: 1, sm: 1.5, md: 2 },
                      py: { xs: 0.5, sm: 0.75, md: 1 },
                      border: `1px solid ${getSpecialtyColor(template.specialty)}30`,
                      flexDirection: { xs: 'column', sm: 'row' },
                      minWidth: 0
                    }}>
                      <Typography sx={{ 
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
                      }}>
                        {getTypeIcon(template.type)}
                      </Typography>
                      <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color: getSpecialtyColor(template.specialty),
                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.85rem' },
                            lineHeight: 1.2,
                            wordBreak: 'break-word'
                          }}
                        >
                          {template.type}
                        </Typography>
                        {template.specialty && !isMobile && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                              display: 'block',
                              wordBreak: 'break-word'
                            }}
                          >
                            {template.specialty}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell align="center" sx={{ 
                  py: { xs: 1.5, sm: 2, md: 2.5 },
                  px: { xs: 0.5, sm: 1, md: 1.5 }
                }}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={{ xs: 0.5, sm: 0.75, md: 1 }} 
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Tooltip title="Preview Template" placement="top">
                      <IconButton
                        size={isMobile ? "small" : "medium"}
                        onClick={() => handleView(template)}
                        sx={{
                          backgroundColor: `${bravoColors.secondary}15`,
                          color: bravoColors.secondary,
                          border: `1px solid ${bravoColors.secondary}30`,
                          width: { xs: 32, sm: 36, md: 40 },
                          height: { xs: 32, sm: 36, md: 40 },
                          '&:hover': {
                            backgroundColor: bravoColors.secondary,
                            color: 'white',
                            transform: { xs: 'none', md: 'translateY(-2px)' },
                            boxShadow: { xs: 'none', md: `0 4px 12px ${bravoColors.secondary}40` }
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <VisibilityIcon fontSize={isMobile ? "small" : "small"} />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Edit Template" placement="top">
                      <IconButton
                        size={isMobile ? "small" : "medium"}
                        onClick={() => handleEdit(template)}
                        sx={{
                          backgroundColor: `${bravoColors.primaryFlat}15`,
                          color: bravoColors.primaryFlat,
                          border: `1px solid ${bravoColors.primaryFlat}30`,
                          width: { xs: 32, sm: 36, md: 40 },
                          height: { xs: 32, sm: 36, md: 40 },
                          '&:hover': {
                            backgroundColor: bravoColors.primaryFlat,
                            color: 'white',
                            transform: { xs: 'none', md: 'translateY(-2px)' },
                            boxShadow: { xs: 'none', md: `0 4px 12px ${bravoColors.primaryFlat}40` }
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <EditIcon fontSize={isMobile ? "small" : "small"} />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Duplicate Template" placement="top">
                      <IconButton
                        size={isMobile ? "small" : "medium"}
                        onClick={() => handleCopy(template)}
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.08)',
                          color: 'text.secondary',
                          border: '1px solid rgba(0,0,0,0.12)',
                          width: { xs: 32, sm: 36, md: 40 },
                          height: { xs: 32, sm: 36, md: 40 },
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.15)',
                            color: 'text.primary',
                            transform: { xs: 'none', md: 'translateY(-2px)' },
                            boxShadow: { xs: 'none', md: '0 4px 12px rgba(0,0,0,0.2)' }
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ContentCopyIcon fontSize={isMobile ? "small" : "small"} />
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
