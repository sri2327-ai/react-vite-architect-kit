import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  GetApp as GetAppIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import { useResponsive } from '@/hooks/useResponsive';
import { SelectField } from '@/components/form';
import { templateBuilderService } from '@/services/templateBuilderService';
import TemplateBuilderHeader from './TemplateBuilderHeader';

interface Template {
  id: string;
  name: string;
  description: string;
  specialty: string;
  type: string;
  tags: string[];
  isPopular?: boolean;
  downloads?: number;
  rating?: number;
}

interface ImportDialogProps {
  open: boolean;
  template: Template | null;
  onClose: () => void;
  onConfirm: (visitType: string) => void;
}

interface PreviewDialogProps {
  open: boolean;
  template: Template | null;
  onClose: () => void;
  onImport: (template: Template) => void;
}

const ImportDialog: React.FC<ImportDialogProps> = ({ open, template, onClose, onConfirm }) => {
  const [selectedVisitType, setSelectedVisitType] = useState('');
  const { isMobile } = useResponsive();
  
  const visitTypes = templateBuilderService.getAllVisitTypeNames();

  const handleConfirm = () => {
    if (selectedVisitType && template) {
      onConfirm(selectedVisitType);
      setSelectedVisitType('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedVisitType('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          m: isMobile ? 0 : 2
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: { xs: '1.1rem', sm: '1.25rem' },
        pb: { xs: 1, sm: 2 }
      }}>
        Import Template: {template?.name}
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mt: { xs: 1, sm: 2 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '0.85rem', sm: '0.875rem' }
            }}
          >
            Select the visit type for this template:
          </Typography>
          
          <FormControl fullWidth size="small">
            <InputLabel>Visit Type</InputLabel>
            <Select
              value={selectedVisitType}
              label="Visit Type"
              onChange={(e) => setSelectedVisitType(e.target.value)}
            >
              {visitTypes.map((visitType) => (
                <MenuItem key={visitType} value={visitType}>
                  {visitType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 0 }
      }}>
        <Button 
          onClick={handleClose} 
          color="inherit"
          fullWidth={isMobile}
          sx={{ order: { xs: 2, sm: 1 } }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          disabled={!selectedVisitType}
          fullWidth={isMobile}
          sx={{
            backgroundColor: bravoColors.primaryFlat,
            order: { xs: 1, sm: 2 },
            '&:hover': {
              backgroundColor: bravoColors.secondary
            }
          }}
        >
          Import Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PreviewDialog: React.FC<PreviewDialogProps> = ({ open, template, onClose, onImport }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { isMobile } = useResponsive();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleImport = () => {
    if (template) {
      onImport(template);
    }
  };

  const sampleNoteContent = `
CHIEF COMPLAINT:
Follow-up visit for hypertension and diabetes management.

HISTORY OF PRESENT ILLNESS:
Patient reports feeling well overall. Blood pressure has been stable on current medications. Blood glucose levels have been within target range with current regimen.

PHYSICAL EXAMINATION:
Vital Signs: BP 128/78, HR 72, Temp 98.6°F
General: Alert, oriented, no acute distress
Cardiovascular: Regular rate and rhythm, no murmurs
Respiratory: Clear to auscultation bilaterally

ASSESSMENT:
1. Hypertension - well controlled
2. Type 2 Diabetes - good glycemic control

PLAN:
1. Continue current antihypertensive regimen
2. Continue metformin 1000mg BID
3. Follow up in 3 months
4. Patient to monitor BP at home
5. HbA1c in 3 months
  `;

  const sampleTemplateContent = `
[CHIEF COMPLAINT]
Brief description of patient's main concern

[HISTORY OF PRESENT ILLNESS]
Detailed history of the presenting problem including:
- Onset, duration, characteristics
- Associated symptoms
- Aggravating/alleviating factors
- Previous treatments tried

[PHYSICAL EXAMINATION]
- Vital Signs: BP ___, HR ___, Temp ___, RR ___
- General Appearance: 
- Cardiovascular: 
- Respiratory: 
- Other relevant systems: 

[ASSESSMENT]
1. Primary diagnosis
2. Secondary diagnoses
3. Rule out considerations

[PLAN]
1. Diagnostic tests/labs if needed
2. Treatment recommendations
3. Follow-up instructions
4. Patient education provided
  `;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          m: isMobile ? 0 : 1,
          height: isMobile ? '100vh' : '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 2 }
      }}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Preview: {template?.name}
        </Typography>
        <Button 
          onClick={onClose}
          color="inherit"
          size="small"
          sx={{ minWidth: 'auto', p: 1 }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ px: { xs: 2, sm: 3 } }}
          >
            <Tab 
              label="Sample Note" 
              sx={{ 
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }} 
            />
            <Tab 
              label="Template Structure" 
              sx={{ 
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }} 
            />
          </Tabs>
        </Box>
        
        <Box sx={{ 
          p: { xs: 2, sm: 3 }, 
          height: 'calc(100% - 48px)', 
          overflow: 'auto' 
        }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: bravoColors.primaryFlat }}>
                Sample Note using this template:
              </Typography>
              <Box sx={{ 
                backgroundColor: 'grey.50', 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography 
                  component="pre" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    lineHeight: 1.5
                  }}
                >
                  {sampleNoteContent}
                </Typography>
              </Box>
            </Box>
          )}
          
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: bravoColors.primaryFlat }}>
                Template Structure:
              </Typography>
              <Box sx={{ 
                backgroundColor: 'grey.50', 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography 
                  component="pre" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    lineHeight: 1.5
                  }}
                >
                  {sampleTemplateContent}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 },
        borderTop: 1,
        borderColor: 'divider',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 2 }
      }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          fullWidth={isMobile}
          sx={{ order: { xs: 2, sm: 1 } }}
        >
          Close
        </Button>
        <Button 
          onClick={handleImport} 
          variant="contained"
          startIcon={<GetAppIcon />}
          fullWidth={isMobile}
          sx={{
            backgroundColor: bravoColors.primaryFlat,
            order: { xs: 1, sm: 2 },
            '&:hover': {
              backgroundColor: bravoColors.secondary
            }
          }}
        >
          Import Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const libraryTemplates: Template[] = [
  {
    id: 'lib-1',
    name: 'Primary Care Visit - SOAP',
    description: 'Complete SOAP note template for primary care visits with comprehensive sections.',
    specialty: 'Primary Care',
    type: 'SOAP',
    tags: ['General', 'Primary Care', 'SOAP'],
    isPopular: true,
    downloads: 1250,
    rating: 4.8
  },
  {
    id: 'lib-2',
    name: 'Cardiology Consultation',
    description: 'Specialized template for cardiology consultations with cardiac-specific assessments.',
    specialty: 'Cardiology',
    type: 'Consultation',
    tags: ['Cardiology', 'Specialist', 'Consultation'],
    isPopular: true,
    downloads: 890,
    rating: 4.9
  },
  {
    id: 'lib-3',
    name: 'Emergency Department Note',
    description: 'Fast-track template for emergency department documentation.',
    specialty: 'Emergency Medicine',
    type: 'Emergency',
    tags: ['Emergency', 'Fast-track', 'Acute Care'],
    downloads: 2100,
    rating: 4.7
  },
  {
    id: 'lib-4',
    name: 'Pediatric Well-Child Visit',
    description: 'Age-appropriate template for pediatric wellness examinations.',
    specialty: 'Pediatrics',
    type: 'Well-Child',
    tags: ['Pediatrics', 'Wellness', 'Preventive'],
    downloads: 675,
    rating: 4.6
  }
];

const TemplateLibraryTab: React.FC = () => {
  const theme = useTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const specialties = Array.from(new Set(libraryTemplates.map(t => t.specialty)));
  const types = Array.from(new Set(libraryTemplates.map(t => t.type)));

  const filteredTemplates = libraryTemplates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || template.specialty === selectedSpecialty;
    const matchesType = !selectedType || template.type === selectedType;
    
    return matchesSearch && matchesSpecialty && matchesType;
  });

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewDialogOpen(true);
  };

  const handleImportTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setImportDialogOpen(true);
  };

  const handleImportFromPreview = (template: Template) => {
    setPreviewDialogOpen(false);
    setSelectedTemplate(template);
    setImportDialogOpen(true);
  };

  const handleConfirmImport = (visitType: string) => {
    if (selectedTemplate) {
      console.log('Importing template:', selectedTemplate, 'for visit type:', visitType);
      // Here you would implement the actual import logic
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <TemplateBuilderHeader 
        title="Template Library" 
        showBackButton={false}
      />
      
      {/* Content */}
      <Container 
        maxWidth={false}
        sx={{ 
          py: { xs: 2, sm: 3, md: 4 }, 
          px: { xs: 1, sm: 2, md: 3 },
          width: '100%',
          maxWidth: '100%',
          flex: 1,
          overflow: 'auto'
        }}
      >
        <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              mb: { xs: 3, sm: 4 },
              textAlign: { xs: 'center', sm: 'left' },
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Browse and import professionally designed templates for your practice
          </Typography>

          {/* Filters */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 2, sm: 3 }}
            sx={{ mb: { xs: 3, sm: 4 } }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: { sm: 300 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
              <InputLabel>Specialty</InputLabel>
              <Select
                value={selectedSpecialty}
                label="Specialty"
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">All Specialties</MenuItem>
                {specialties.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedType}
                label="Type"
                onChange={(e) => setSelectedType(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">All Types</MenuItem>
                {types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Templates Grid - Using Box with CSS Grid instead of MUI Grid */}
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
              xl: 'repeat(4, 1fr)'
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
            width: '100%'
          }}
        >
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id}
              sx={{ 
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: { xs: 'none', sm: 'translateY(-2px)' },
                  boxShadow: theme.shadows[4],
                  borderColor: bravoColors.primaryFlat
                }
              }}
            >
              <CardContent sx={{ 
                flexGrow: 1, 
                p: { xs: 2, sm: 2.5, md: 3 },
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                        lineHeight: 1.3
                      }}
                    >
                      {template.name}
                    </Typography>
                    {template.isPopular && (
                      <Chip 
                        label="Popular" 
                        size="small" 
                        sx={{ 
                          backgroundColor: `${bravoColors.primaryFlat}20`,
                          color: bravoColors.primaryFlat,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          height: { xs: 22, sm: 24 }
                        }} 
                      />
                    )}
                  </Box>
                </Box>

                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '0.85rem', sm: '0.875rem', md: '0.9rem' },
                    lineHeight: 1.4,
                    flexGrow: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: { xs: 2, sm: 3, md: 3 },
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {template.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      display: 'block', 
                      mb: 1, 
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      fontWeight: 500
                    }}
                  >
                    {template.specialty}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {template.tags.slice(0, isMobile ? 1 : 2).map((tag) => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          fontSize: { xs: '0.65rem', sm: '0.7rem' },
                          height: { xs: 20, sm: 22 }
                        }} 
                      />
                    ))}
                    {template.tags.length > 2 && (
                      <Chip 
                        label={`+${template.tags.length - 2}`} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          fontSize: { xs: '0.65rem', sm: '0.7rem' },
                          height: { xs: 20, sm: 22 }
                        }} 
                      />
                    )}
                  </Box>
                </Box>

                {template.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <StarIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: '#ffa726' }} />
                    <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      {template.rating} ({template.downloads})
                    </Typography>
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ p: { xs: 2, sm: 2.5, md: 3 }, pt: 0 }}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 1, sm: 1.5 }} 
                  sx={{ width: '100%' }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => handlePreviewTemplate(template)}
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      flex: { xs: 'none', sm: 1 },
                      fontSize: { xs: '0.8rem', sm: '0.85rem' },
                      py: { xs: 0.75, sm: 1 }
                    }}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<GetAppIcon />}
                    onClick={() => handleImportTemplate(template)}
                    size="small"
                    sx={{
                      backgroundColor: bravoColors.primaryFlat,
                      borderRadius: 2,
                      textTransform: 'none',
                      flex: { xs: 'none', sm: 1 },
                      fontSize: { xs: '0.8rem', sm: '0.85rem' },
                      py: { xs: 0.75, sm: 1 },
                      '&:hover': {
                        backgroundColor: bravoColors.secondary
                      }
                    }}
                  >
                    Import
                  </Button>
                </Stack>
              </CardActions>
            </Card>
          ))}
        </Box>

        {filteredTemplates.length === 0 && (
          <Box sx={{
            textAlign: 'center',
            py: { xs: 4, sm: 6 },
            color: 'text.secondary'
          }}>
            <Typography variant="h6" sx={{ mb: 1, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
              No templates found
            </Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
              Try adjusting your search criteria to find more templates.
            </Typography>
          </Box>
        )}

        <ImportDialog
          open={importDialogOpen}
          template={selectedTemplate}
          onClose={() => setImportDialogOpen(false)}
          onConfirm={handleConfirmImport}
        />

        <PreviewDialog
          open={previewDialogOpen}
          template={selectedTemplate}
          onClose={() => setPreviewDialogOpen(false)}
          onImport={handleImportFromPreview}
        />
      </Container>
    </Box>
  );
};

export default TemplateLibraryTab;
