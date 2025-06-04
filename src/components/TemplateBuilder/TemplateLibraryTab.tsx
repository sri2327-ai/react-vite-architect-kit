
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tab,
  Tabs,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';

interface LibraryTemplate {
  id: string;
  title: string;
  specialty: string;
  noteType: string;
  content: string;
}

interface TemplateLibraryTabProps {
  visitTypes?: string[];
  onAddTemplate?: (template: LibraryTemplate, visitType: string) => void;
}

const libraryTemplates: LibraryTemplate[] = [
  {
    id: '1',
    title: 'CLINICAL INTERVIEW1',
    specialty: 'cardiologist',
    noteType: 'SOAP',
    content: `History of Present Illness
Provide a comprehensive narrative of the patient's current condition. Include details about the onset, duration, and characteristics of the present illness. Note any associated symptoms, and incorporate relevant background information such as lifestyle factors and family medical history. Be sure to structure the narrative in a chronological manner, emphasizing the progression of the condition over time.

Allergies
List any known allergies the patient has, including reactions to medications, foods, or other substances. If there are no known allergies, indicate this as well.
• Create a bullet for each known allergy, specifying the substance and the type of reaction.
• Include a bullet to indicate if there are no known allergies.

Family Health History
Summarize the known family health history, focusing on immediate family members and highlighting relevant hereditary conditions.
• Include a bullet for each immediate family member (parents, siblings, children) and mention their known health conditions.
• For each individual mentioned, specify hereditary conditions that may be relevant to the patient's health.`
  },
  {
    id: '2',
    title: 'CLINICAL INTERVIEW2',
    specialty: 'pyschologist',
    noteType: 'SOAP',
    content: `Chief Complaint
Document the primary reason for the patient's visit in their own words.

History of Present Illness
Detailed chronological account of the current condition including onset, duration, severity, and associated symptoms.

Review of Systems
Systematic review of body systems to identify additional symptoms not covered in the HPI.

Physical Examination
Comprehensive physical examination findings organized by body systems.

Assessment and Plan
Clinical impression and treatment plan for each identified problem.`
  },
  {
    id: '3',
    title: 'CLINICAL INTERVIEW3',
    specialty: 'cardiologist',
    noteType: 'DPD',
    content: `Discharge Diagnosis
Primary and secondary diagnoses at the time of discharge.

Hospital Course
Summary of the patient's stay including procedures, treatments, and clinical progress.

Discharge Medications
Complete list of medications prescribed at discharge with dosing instructions.

Follow-up Instructions
Specific instructions for follow-up care including appointments and monitoring.

Discharge Condition
Patient's condition and functional status at the time of discharge.`
  },
  {
    id: '4',
    title: 'Dermatology Intake',
    specialty: 'Dermatology',
    noteType: 'SOAP',
    content: `Chief Complaint
Primary skin concern or dermatological issue.

Dermatological History
History of skin conditions, previous treatments, and family history of skin disorders.

Skin Examination
Systematic examination of skin, hair, and nails with detailed descriptions of lesions.

Dermatological Assessment
Clinical impression of skin findings and differential diagnoses.

Treatment Plan
Recommended treatments, medications, and follow-up care for skin conditions.`
  },
  {
    id: '5',
    title: 'Neurology Followup',
    specialty: 'pyschologist',
    noteType: 'SOAP',
    content: `Neurological Review
Assessment of current neurological symptoms and changes since last visit.

Neurological Examination
Detailed neurological examination including mental status, cranial nerves, motor, sensory, and coordination testing.

Medication Review
Review of current neurological medications, effectiveness, and side effects.

Plan
Adjustments to treatment plan and recommendations for continued care.`
  },
  {
    id: '6',
    title: 'Dermatology Intake1',
    specialty: 'cardiologist',
    noteType: 'DPD',
    content: `Initial Dermatological Assessment
Comprehensive evaluation of skin, hair, and nail concerns.

Skin History
Detailed history of skin conditions, exposures, and treatments.

Physical Examination
Complete skin examination with photodocumentation when appropriate.

Diagnostic Plan
Recommended tests, biopsies, or additional evaluations.

Treatment Recommendations
Initial treatment plan and patient education.`
  }
];

const TemplateLibraryTab: React.FC<TemplateLibraryTabProps> = ({ 
  visitTypes = [],
  onAddTemplate 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedNoteType, setSelectedNoteType] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<LibraryTemplate | null>(null);
  const [previewTab, setPreviewTab] = useState(0);
  const [visitTypeDialog, setVisitTypeDialog] = useState(false);
  const [selectedVisitType, setSelectedVisitType] = useState('');
  const [templateToAdd, setTemplateToAdd] = useState<LibraryTemplate | null>(null);

  const specialties = ['', 'cardiologist', 'pyschologist', 'Dermatology'];
  const noteTypes = ['', 'SOAP', 'DPD'];

  const filteredTemplates = libraryTemplates.filter(template => {
    const matchesSpecialty = !selectedSpecialty || template.specialty === selectedSpecialty;
    const matchesNoteType = !selectedNoteType || template.noteType === selectedNoteType;
    return matchesSpecialty && matchesNoteType;
  });

  const handleTemplateClick = (template: LibraryTemplate) => {
    setPreviewTemplate(template);
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
    setPreviewTab(0);
  };

  const handleAddToLibrary = () => {
    setTemplateToAdd(previewTemplate);
    setVisitTypeDialog(true);
    handleClosePreview();
  };

  const handleVisitTypeSelect = () => {
    if (templateToAdd && selectedVisitType && onAddTemplate) {
      onAddTemplate(templateToAdd, selectedVisitType);
      setVisitTypeDialog(false);
      setSelectedVisitType('');
      setTemplateToAdd(null);
    }
  };

  const handleCloseVisitTypeDialog = () => {
    setVisitTypeDialog(false);
    setSelectedVisitType('');
    setTemplateToAdd(null);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ 
        color: bravoColors.primaryFlat, 
        fontWeight: 700,
        mb: 1
      }}>
        Template Library
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2, 
        mb: 4 
      }}>
        <FormControl sx={{ minWidth: { xs: '100%', sm: 150 } }}>
          <InputLabel>Specialty</InputLabel>
          <Select
            value={selectedSpecialty}
            label="Specialty"
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            {specialties.filter(s => s).map((specialty) => (
              <MenuItem key={specialty} value={specialty}>
                {specialty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: { xs: '100%', sm: 120 } }}>
          <InputLabel>Select</InputLabel>
          <Select
            value={selectedNoteType}
            label="Select"
            onChange={(e) => setSelectedNoteType(e.target.value)}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            {noteTypes.filter(n => n).map((noteType) => (
              <MenuItem key={noteType} value={noteType}>
                {noteType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: `1px solid ${bravoColors.primaryFlat}20`,
                borderRadius: 3,
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${bravoColors.primaryFlat}30`,
                  borderColor: bravoColors.primaryFlat
                }
              }}
              onClick={() => handleTemplateClick(template)}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  color: bravoColors.primaryFlat,
                  flexGrow: 1
                }}>
                  {template.title}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip 
                    label={`Specialty: ${template.specialty}`}
                    size="small"
                    sx={{
                      backgroundColor: `${bravoColors.secondary}20`,
                      color: bravoColors.secondary,
                      fontWeight: 600,
                      alignSelf: 'flex-start'
                    }}
                  />
                  <Chip 
                    label={`Note Type: ${template.noteType}`}
                    size="small"
                    sx={{
                      backgroundColor: `${bravoColors.primaryFlat}20`,
                      color: bravoColors.primaryFlat,
                      fontWeight: 600,
                      alignSelf: 'flex-start'
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Enhanced Template Preview Dialog */}
      <Dialog 
        open={!!previewTemplate} 
        onClose={handleClosePreview}
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { 
            height: { xs: '90vh', md: '80vh' },
            borderRadius: 3,
            m: { xs: 1, md: 2 }
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
          px: { xs: 2, md: 3 }
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: bravoColors.primaryFlat }}>
            Template Preview
          </Typography>
          <IconButton onClick={handleClosePreview} sx={{ color: bravoColors.primaryFlat }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={previewTab} 
              onChange={(_, newValue) => setPreviewTab(newValue)}
              sx={{ 
                px: { xs: 2, md: 3 },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  '&.Mui-selected': {
                    color: bravoColors.primaryFlat
                  }
                }
              }}
              variant={isMobile ? "fullWidth" : "standard"}
            >
              <Tab label="Template Preview" />
              <Tab label="Example Note" />
            </Tabs>
          </Box>

          <Box sx={{ 
            flex: 1, 
            overflow: 'auto',
            p: { xs: 2, md: 3 }
          }}>
            {previewTab === 0 && previewTemplate && (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: { xs: 2, md: 3 },
                  borderRadius: 2,
                  backgroundColor: 'grey.50'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {previewTemplate.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-line',
                    lineHeight: 1.6,
                    fontFamily: 'monospace',
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  {previewTemplate.content}
                </Typography>
              </Paper>
            )}

            {previewTab === 1 && (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: { xs: 2, md: 3 },
                  borderRadius: 2,
                  backgroundColor: 'grey.50'
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Example note content would be displayed here. This would show how the template 
                  appears when filled out with sample patient data.
                </Typography>
              </Paper>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          p: { xs: 2, md: 3 }, 
          pt: 0,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Button 
            onClick={handleClosePreview}
            variant="outlined"
            fullWidth={isMobile}
            sx={{ 
              textTransform: 'none',
              borderColor: bravoColors.primaryFlat,
              color: bravoColors.primaryFlat,
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleAddToLibrary}
            variant="contained"
            fullWidth={isMobile}
            sx={{ 
              textTransform: 'none',
              backgroundColor: bravoColors.primaryFlat,
              borderRadius: 2,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: bravoColors.secondary
              }
            }}
          >
            ADD TO LIBRARY
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Visit Type Selection Dialog */}
      <Dialog 
        open={visitTypeDialog} 
        onClose={handleCloseVisitTypeDialog}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            m: { xs: 1, md: 2 },
            minHeight: '300px'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: bravoColors.primaryFlat }}>
            Select Visit Type
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ py: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Choose which visit type this template should be added to:
          </Typography>
          
          <Paper 
            variant="outlined" 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <List sx={{ p: 0 }}>
              {visitTypes.map((visitType, index) => (
                <React.Fragment key={visitType}>
                  <ListItem disablePadding>
                    <ListItemButton 
                      onClick={() => setSelectedVisitType(visitType)}
                      selected={selectedVisitType === visitType}
                      sx={{
                        py: 2,
                        px: 3,
                        '&.Mui-selected': {
                          backgroundColor: `${bravoColors.primaryFlat}15`,
                          '&:hover': {
                            backgroundColor: `${bravoColors.primaryFlat}20`
                          }
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: selectedVisitType === visitType ? 600 : 400,
                              color: selectedVisitType === visitType ? bravoColors.primaryFlat : 'text.primary'
                            }}
                          >
                            {visitType}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < visitTypes.length - 1 && (
                    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mx: 2 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ 
          p: 3, 
          pt: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Button 
            onClick={handleCloseVisitTypeDialog}
            variant="outlined"
            fullWidth={isMobile}
            sx={{ 
              textTransform: 'none',
              borderColor: bravoColors.primaryFlat,
              color: bravoColors.primaryFlat,
              borderRadius: 2,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleVisitTypeSelect}
            variant="contained"
            disabled={!selectedVisitType}
            fullWidth={isMobile}
            sx={{ 
              textTransform: 'none',
              backgroundColor: bravoColors.primaryFlat,
              borderRadius: 2,
              px: 3,
              '&:hover': {
                backgroundColor: bravoColors.secondary
              },
              '&:disabled': {
                backgroundColor: 'grey.300'
              }
            }}
          >
            Add Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateLibraryTab;
