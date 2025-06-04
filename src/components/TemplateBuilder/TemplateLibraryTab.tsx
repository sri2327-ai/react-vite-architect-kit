
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
  IconButton
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

const TemplateLibraryTab: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedNoteType, setSelectedNoteType] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<LibraryTemplate | null>(null);
  const [previewTab, setPreviewTab] = useState(0);

  const specialties = ['', 'cardiologist', 'pyschologist', 'Dermatology'];
  const noteTypes = ['', 'SOAP', 'DPD'];

  const filteredTemplates = libraryTemplates.filter(template => {
    const matchesSpecialty = !selectedSpecialty || template.specialty === selectedSpecialty;
    const matchesNoteType = !selectedNoteType || template.noteType === selectedNoteType;
    return matchesSpecialty && matchesNoteType;
  });

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'cardiologist': return '#4FC3F7';
      case 'pyschologist': return '#81C784';
      case 'dermatology': return '#FFB74D';
      default: return bravoColors.primaryFlat;
    }
  };

  const getNoteTypeColor = (noteType: string) => {
    switch (noteType) {
      case 'SOAP': return '#64B5F6';
      case 'DPD': return '#4DB6AC';
      default: return bravoColors.secondary;
    }
  };

  const handleTemplateClick = (template: LibraryTemplate) => {
    setPreviewTemplate(template);
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
    setPreviewTab(0);
  };

  const handleAddToLibrary = () => {
    // Handle adding template to user's library
    console.log('Adding template to library:', previewTemplate);
    handleClosePreview();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ 
        color: bravoColors.primaryFlat, 
        fontWeight: 700,
        mb: 1
      }}>
        Template Library
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <FormControl sx={{ minWidth: 150 }}>
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

        <FormControl sx={{ minWidth: 120 }}>
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

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: 3 
      }}>
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id}
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}
            onClick={() => handleTemplateClick(template)}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                mb: 2,
                color: bravoColors.primaryFlat
              }}>
                {template.title}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip 
                  label={`Specialty: ${template.specialty}`}
                  size="small"
                  sx={{
                    backgroundColor: getSpecialtyColor(template.specialty),
                    color: 'white',
                    fontWeight: 600,
                    alignSelf: 'flex-start'
                  }}
                />
                <Chip 
                  label={`Note Type: ${template.noteType}`}
                  size="small"
                  sx={{
                    backgroundColor: getNoteTypeColor(template.noteType),
                    color: 'white',
                    fontWeight: 600,
                    alignSelf: 'flex-start'
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Template Preview Dialog */}
      <Dialog 
        open={!!previewTemplate} 
        onClose={handleClosePreview}
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { height: '80vh' }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 0
        }}>
          <Typography variant="h6">Template Preview</Typography>
          <IconButton onClick={handleClosePreview}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={previewTab} 
              onChange={(_, newValue) => setPreviewTab(newValue)}
              sx={{ px: 3 }}
            >
              <Tab 
                label="Template Preview" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: previewTab === 0 ? bravoColors.primaryFlat : 'transparent',
                  color: previewTab === 0 ? 'white' : 'inherit',
                  borderRadius: '8px 8px 0 0',
                  mx: 1
                }}
              />
              <Tab 
                label="Example Note" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600
                }}
              />
            </Tabs>
          </Box>

          {previewTab === 0 && previewTemplate && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ 
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 3,
                mb: 3
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Template Preview
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-line',
                    lineHeight: 1.6,
                    fontFamily: 'monospace'
                  }}
                >
                  {previewTemplate.content}
                </Typography>
              </Box>
            </Box>
          )}

          {previewTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Example note content would be displayed here.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClosePreview}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleAddToLibrary}
            variant="contained"
            sx={{ 
              textTransform: 'none',
              backgroundColor: bravoColors.primaryFlat,
              '&:hover': {
                backgroundColor: bravoColors.primaryDark
              }
            }}
          >
            ADD TO LIBRARY
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateLibraryTab;
