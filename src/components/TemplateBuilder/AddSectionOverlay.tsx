
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  Button,
  Divider,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Psychology as PsychologyIcon,
  LocalHospital as LocalHospitalIcon,
  MedicalServices as MedicalServicesIcon,
  Medication as MedicationIcon,
  Warning as WarningIcon,
  Smoking as SmokingIcon,
  Family as FamilyIcon,
  ChildCare as ChildCareIcon,
  School as SchoolIcon,
  Restaurant as RestaurantIcon,
  Group as GroupIcon,
  Bedtime as BedtimeIcon,
  FemaleIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Science as ScienceIcon,
  Visibility as VisibilityIcon,
  MonitorHeart as MonitorHeartIcon,
  Assessment as AssessmentIcon,
  Favorite as FavoriteIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Healing as HealingIcon,
  Folder as FolderIcon,
  TextFields as TextFieldsIcon,
  Title as TitleIcon,
  List as ListIcon,
  Checklist as ChecklistIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  emoji: string;
}

interface AddSectionOverlayProps {
  open: boolean;
  onClose: () => void;
  onAddSection: (section: SectionTemplate) => void;
}

const sectionTemplates: SectionTemplate[] = [
  // Subjective
  { id: 'psych-history', name: 'Past Psychiatric History', description: "Patient's history of psychiatric conditions and treatments", icon: <PsychologyIcon />, category: 'Subjective', emoji: '🧠' },
  { id: 'medical-history', name: 'Medical History', description: "Patient's history of medical conditions", icon: <LocalHospitalIcon />, category: 'Subjective', emoji: '🏥' },
  { id: 'surgical-history', name: 'Surgical History', description: "Patient's history of surgical procedures", icon: <MedicalServicesIcon />, category: 'Subjective', emoji: '🔪' },
  { id: 'current-medications', name: 'Current Medications', description: "List of patient's current medications", icon: <MedicationIcon />, category: 'Subjective', emoji: '💊' },
  { id: 'allergies', name: 'Allergies', description: "Patient's allergies to medications, foods, or other substances", icon: <WarningIcon />, category: 'Subjective', emoji: '⚠️' },
  { id: 'substance-use', name: 'Substance Use History', description: "Patient's history of substance use", icon: <SmokingIcon />, category: 'Subjective', emoji: '🚬' },
  { id: 'treatment-history', name: 'Treatment History', description: "Patient's history of substance use treatment", icon: <LocalHospitalIcon />, category: 'Subjective', emoji: '🏥' },
  { id: 'family-history', name: 'Family History', description: "Patient's family psychiatric history", icon: <FamilyIcon />, category: 'Subjective', emoji: '👪' },
  { id: 'developmental-history', name: 'Developmental History', description: "Patient's developmental history and milestones", icon: <ChildCareIcon />, category: 'Subjective', emoji: '👶' },
  { id: 'academic-history', name: 'Academic History', description: "Patient's academic performance and school history", icon: <SchoolIcon />, category: 'Subjective', emoji: '🏫' },
  { id: 'nutrition-weight', name: 'Nutrition and Weight History', description: "Patient's diet, nutrition patterns and weight history", icon: <RestaurantIcon />, category: 'Subjective', emoji: '🍎' },
  { id: 'collateral-info', name: 'Collateral Information', description: 'Information from family, caregivers, or other providers', icon: <GroupIcon />, category: 'Subjective', emoji: '👥' },
  { id: 'sleep-history', name: 'Sleep History', description: "Patient's sleep patterns and sleep-related issues", icon: <BedtimeIcon />, category: 'Subjective', emoji: '😴' },
  { id: 'obgyn-history', name: 'OBGYN History', description: "Patient's obstetric and gynecological history", icon: <FemaleIcon />, category: 'Subjective', emoji: '👩‍⚕️' },
  { id: 'treatment-compliance', name: 'Treatment Compliance', description: "Patient's adherence to treatment plans and medication", icon: <CheckCircleIcon />, category: 'Subjective', emoji: '✅' },
  { id: 'social-history', name: 'Social History', description: "Patient's social background, relationships and living situation", icon: <GroupIcon />, category: 'Subjective', emoji: '👥' },
  { id: 'psychiatric-ros', name: 'Psychiatric Review of Systems', description: 'Comprehensive review of psychiatric symptoms and mental health concerns', icon: <PsychologyIcon />, category: 'Subjective', emoji: '🧠' },
  { id: 'chief-complaint', name: 'Chief Complaint', description: "Patient's primary reason for visit", icon: <AssignmentIcon />, category: 'Subjective', emoji: '❗' },
  { id: 'hpi', name: 'History of Present Illness', description: "Detailed history of the patient's current condition", icon: <DescriptionIcon />, category: 'Subjective', emoji: '📝' },

  // Plan
  { id: 'plan', name: 'Plan', description: 'Comprehensive treatment plan with interventions', icon: <AssignmentIcon />, category: 'Plan', emoji: '📝' },
  { id: 'patient-instructions', name: 'Patient Instructions', description: 'Instructions provided to patient for self-care', icon: <DescriptionIcon />, category: 'Plan', emoji: '📝' },
  { id: 'orders-referrals', name: 'Orders and Referrals', description: 'Documentation of orders and referrals with justification', icon: <AssignmentIcon />, category: 'Plan', emoji: '📋' },
  { id: 'follow-ups', name: 'Follow-ups', description: 'Details for follow-up appointments and check-ins', icon: <CheckCircleIcon />, category: 'Plan', emoji: '📅' },
  { id: 'todo-next-steps', name: 'To-do and Next Steps', description: 'Action items for provider and patient before next visit', icon: <ChecklistIcon />, category: 'Plan', emoji: '✅' },
  { id: 'crisis-safety', name: 'Crisis and Safety Plan', description: 'Comprehensive safety plan for crisis situations', icon: <WarningIcon />, category: 'Plan', emoji: '🚨' },
  { id: 'long-term-plan', name: 'Long-Term Treatment Plan', description: 'Comprehensive long-term treatment plan with SMART goals', icon: <AssignmentIcon />, category: 'Plan', emoji: '🎯' },

  // Objective
  { id: 'lab-results', name: 'Lab Results / Imaging', description: 'Documentation of laboratory and imaging results', icon: <ScienceIcon />, category: 'Objective', emoji: '🔬' },
  { id: 'medical-ros', name: 'Medical Review of Systems', description: 'Comprehensive review of body systems and symptoms', icon: <VisibilityIcon />, category: 'Objective', emoji: '🔍' },
  { id: 'mental-status', name: 'Mental Status Exam', description: "Detailed assessment of patient's mental status and cognitive functioning", icon: <PsychologyIcon />, category: 'Objective', emoji: '🔍' },
  { id: 'physical-exam', name: 'Physical Examination', description: 'Comprehensive physical examination findings', icon: <MedicalServicesIcon />, category: 'Objective', emoji: '🩺' },
  { id: 'assessments-scales', name: 'Assessments & Scales', description: 'Documentation of assessment scales and their results', icon: <AssessmentIcon />, category: 'Objective', emoji: '📊' },
  { id: 'vitals', name: 'Vitals', description: "Patient's vital signs documentation", icon: <MonitorHeartIcon />, category: 'Objective', emoji: '❤️' },

  // Assessment
  { id: 'assessment', name: 'Assessment', description: 'Clinical assessment of diagnoses with ICD-10 codes', icon: <AssessmentIcon />, category: 'Assessment', emoji: '🔍' },
  { id: 'biopsychosocial', name: 'Biopsychosocial Assessment', description: 'Comprehensive assessment of biological, psychological, and social factors', icon: <PsychologyIcon />, category: 'Assessment', emoji: '🧠' },
  { id: 'assessment-plan', name: 'Assessment & Plan', description: 'Combined assessment and plan organized by diagnosis', icon: <AssignmentIcon />, category: 'Assessment', emoji: '📊' },
  { id: 'risk-assessment', name: 'Risk Assessment', description: 'Assessment of suicide, homicide, and other safety risks', icon: <WarningIcon />, category: 'Assessment', emoji: '⚠️' },
  { id: 'risk-protective', name: 'Risk & Protective Factors', description: 'Identification of risk and protective factors', icon: <FavoriteIcon />, category: 'Assessment', emoji: '🛡️' },
  { id: 'medical-decision', name: 'Medical Decision Making', description: 'Documentation of medical decision making complexity', icon: <AssessmentIcon />, category: 'Assessment', emoji: '🧩' },
  { id: 'psychiatric-impression', name: 'Psychiatric Impression', description: 'Comprehensive psychiatric diagnostic formulation', icon: <PsychologyIcon />, category: 'Assessment', emoji: '🧠' },
  { id: 'differential-dx', name: 'Differential Diagnosis', description: 'Alternative diagnoses considered with supporting evidence', icon: <AssessmentIcon />, category: 'Assessment', emoji: '🔄' },
  { id: 'dsm5-eval', name: 'DSM5 Evaluation', description: 'Formal DSM-5 diagnostic evaluation with criteria', icon: <AssignmentIcon />, category: 'Assessment', emoji: '📋' },

  // Patient Information
  { id: 'location-accompaniment', name: 'Location and Accompaniment', description: 'Information about visit location and patient accompaniment', icon: <LocationOnIcon />, category: 'Patient Information', emoji: '📍' },
  { id: 'patient-demographics', name: 'Patient Demographics', description: 'Basic patient demographic information', icon: <PersonIcon />, category: 'Patient Information', emoji: '👤' },

  // Add-Ons
  { id: 'therapy-interventions', name: 'Therapy Interventions', description: 'Documentation of therapeutic techniques and patient response', icon: <HealingIcon />, category: 'Add-Ons', emoji: '🧠' },
  { id: 'tms-justification', name: 'TMS Justification', description: 'Clinical justification for TMS therapy', icon: <PsychologyIcon />, category: 'Add-Ons', emoji: '🧲' },
  { id: 'spravato-justification', name: 'Spravato Justification', description: 'Clinical justification for Spravato treatment', icon: <MedicationIcon />, category: 'Add-Ons', emoji: '💊' },
  { id: 'case-management', name: 'Case Management Notes', description: 'Documentation of case management and care coordination', icon: <FolderIcon />, category: 'Add-Ons', emoji: '📁' },

  // Custom Blocks
  { id: 'paragraph', name: 'Paragraph', description: 'A block of text for general content', icon: <TextFieldsIcon />, category: 'Custom Blocks', emoji: '📝' },
  { id: 'section-header', name: 'Section Header', description: 'A header to organize your template', icon: <TitleIcon />, category: 'Custom Blocks', emoji: '📌' },
  { id: 'bulleted-list', name: 'Bulleted List', description: 'A list of items with bullet points', icon: <ListIcon />, category: 'Custom Blocks', emoji: '•' },
  { id: 'exam-list', name: 'Exam List', description: 'A structured list for exam findings', icon: <ListIcon />, category: 'Custom Blocks', emoji: '📋' },
  { id: 'checklist', name: 'Checklist', description: 'A list of items that can be checked off', icon: <ChecklistIcon />, category: 'Custom Blocks', emoji: '✓' },
  { id: 'static-text', name: 'Static Text', description: 'Fixed text that cannot be edited in notes', icon: <DescriptionIcon />, category: 'Custom Blocks', emoji: '📄' }
];

const AddSectionOverlay: React.FC<AddSectionOverlayProps> = ({
  open,
  onClose,
  onAddSection
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customSectionName, setCustomSectionName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  const categories = ['Subjective', 'Plan', 'Objective', 'Assessment', 'Patient Information', 'Add-Ons', 'Custom Blocks'];

  const filteredSections = sectionTemplates.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomSection = () => {
    if (customSectionName.trim()) {
      const customSection: SectionTemplate = {
        id: `custom-${Date.now()}`,
        name: customSectionName,
        description: 'Custom section',
        icon: <TextFieldsIcon />,
        category: 'Custom',
        emoji: '📝'
      };
      onAddSection(customSection);
      setCustomSectionName('');
      setShowCustomForm(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 3, 
          maxHeight: '90vh',
          height: '90vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Add Section
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search sections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setShowCustomForm(!showCustomForm)}
            sx={{ mb: 2 }}
          >
            Not seeing what you're looking for? Click here to create a custom section
          </Button>

          {showCustomForm && (
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Create Custom Section
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="Section Name"
                value={customSectionName}
                onChange={(e) => setCustomSectionName(e.target.value)}
                placeholder="e.g., Medication compliance"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small" onClick={handleAddCustomSection}>
                  Add Section
                </Button>
                <Button variant="outlined" size="small" onClick={() => setShowCustomForm(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {categories.map((category) => {
          const categorySections = filteredSections.filter(section => section.category === category);
          
          if (categorySections.length === 0) return null;

          return (
            <Box key={category} sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                {category}
              </Typography>
              
              <Grid container spacing={2}>
                {categorySections.map((section) => (
                  <Grid item xs={12} sm={6} md={4} key={section.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      <CardActionArea 
                        onClick={() => {
                          onAddSection(section);
                          onClose();
                        }}
                        sx={{ height: '100%', p: 2 }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <Typography sx={{ fontSize: '1.5rem', mr: 1 }}>
                              {section.emoji}
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                {section.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {section.description}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {category !== 'Custom Blocks' && (
                <>
                  <Divider sx={{ mt: 2, mb: 1 }} />
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      const customSection: SectionTemplate = {
                        id: `custom-${category.toLowerCase()}-${Date.now()}`,
                        name: `Custom ${category}`,
                        description: `Create a custom section for ${category.toLowerCase()}`,
                        icon: <TextFieldsIcon />,
                        category: 'Custom',
                        emoji: '📝'
                      };
                      onAddSection(customSection);
                      onClose();
                    }}
                    sx={{ textTransform: 'none' }}
                  >
                    Custom {category}
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    Create a custom section for {category.toLowerCase()}
                  </Typography>
                </>
              )}
            </Box>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default AddSectionOverlay;
