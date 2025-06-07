
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
  alpha,
  Stack,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Close as CloseIcon,
  ViewHeadline as ViewHeadlineIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Title as TitleIcon,
  Assignment as AssignmentIcon,
  TextSnippet as TextSnippetIcon,
  Checklist as ChecklistIcon,
  Psychology as PsychologyIcon,
  LocalHospital as LocalHospitalIcon,
  MedicalServices as MedicalServicesIcon,
  Healing as HealingIcon,
  Warning as WarningIcon,
  SmokingRooms as SmokingRoomsIcon,
  Family as FamilyIcon,
  ChildCare as ChildCareIcon,
  School as SchoolIcon,
  Restaurant as RestaurantIcon,
  Groups as GroupsIcon,
  Bedtime as BedtimeIcon,
  FemaleIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  ReportProblem as ReportProblemIcon,
  Description as DescriptionIcon,
  Science as ScienceIcon,
  Visibility as VisibilityIcon,
  MonitorHeart as MonitorHeartIcon,
  BarChart as BarChartIcon,
  FavoriteIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  AutoFixHigh as AutoFixHighIcon,
  MagnetIcon,
  Medication as MedicationIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import SectionPlacementDialog from './SectionPlacementDialog';

interface SectionTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  type: string;
  icon: React.ReactNode;
}

interface AddSectionOverlayProps {
  open: boolean;
  onClose: () => void;
  onAddSection: (sectionTemplate: SectionTemplate, position: number) => void;
  existingSections: Array<{ id: string; name: string; type?: string; }>;
}

const AddSectionOverlay: React.FC<AddSectionOverlayProps> = ({
  open,
  onClose,
  onAddSection,
  existingSections = []
}) => {
  const theme = useTheme();
  const [selectedSection, setSelectedSection] = useState<SectionTemplate | null>(null);
  const [showPlacementDialog, setShowPlacementDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const sectionTemplates: SectionTemplate[] = [
    // Basic sections
    {
      id: 'paragraph',
      name: 'Paragraph',
      category: 'Basic',
      description: 'A.I. will write a descriptive block of text following the guidelines below.',
      type: 'paragraph',
      icon: <ViewHeadlineIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'bulleted-list',
      name: 'Bulleted List',
      category: 'Basic',
      description: 'A.I. will create a bulleted list based on the instructions provided.',
      type: 'bulleted-list',
      icon: <FormatListBulletedIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'section-header',
      name: 'Section Header',
      category: 'Basic',
      description: 'Add a section header to organize your template.',
      type: 'section-header',
      icon: <TitleIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'exam-list',
      name: 'Exam List',
      category: 'Basic',
      description: 'A structured list for physical examination findings.',
      type: 'exam-list',
      icon: <AssignmentIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'static-text',
      name: 'Static Text',
      category: 'Basic',
      description: 'Add static text that will not be modified by A.I.',
      type: 'static-text',
      icon: <TextSnippetIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'checklist',
      name: 'Checklist',
      category: 'Basic',
      description: 'Create a checklist with customizable items.',
      type: 'checklist',
      icon: <ChecklistIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    
    // Subjective sections
    {
      id: 'chief-complaint',
      name: 'Chief Complaint',
      category: 'Subjective',
      description: "Patient's primary reason for visit",
      type: 'chief-complaint',
      icon: <ReportProblemIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'history-present-illness',
      name: 'History of Present Illness',
      category: 'Subjective',
      description: "Detailed history of the patient's current condition",
      type: 'history-present-illness',
      icon: <DescriptionIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'past-psychiatric-history',
      name: 'Past Psychiatric History',
      category: 'Subjective',
      description: "Patient's history of psychiatric conditions and treatments",
      type: 'past-psychiatric-history',
      icon: <PsychologyIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'medical-history',
      name: 'Medical History',
      category: 'Subjective',
      description: "Patient's history of medical conditions",
      type: 'medical-history',
      icon: <LocalHospitalIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'surgical-history',
      name: 'Surgical History',
      category: 'Subjective',
      description: "Patient's history of surgical procedures",
      type: 'surgical-history',
      icon: <HealingIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'current-medications',
      name: 'Current Medications',
      category: 'Subjective',
      description: "List of patient's current medications",
      type: 'current-medications',
      icon: <MedicationIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'allergies',
      name: 'Allergies',
      category: 'Subjective',
      description: "Patient's allergies to medications, foods, or other substances",
      type: 'allergies',
      icon: <WarningIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'substance-use-history',
      name: 'Substance Use History',
      category: 'Subjective',
      description: "Patient's history of substance use",
      type: 'substance-use-history',
      icon: <SmokingRoomsIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'treatment-history',
      name: 'Treatment History',
      category: 'Subjective',
      description: "Patient's history of substance use treatment",
      type: 'treatment-history',
      icon: <LocalHospitalIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'family-history',
      name: 'Family History',
      category: 'Subjective',
      description: "Patient's family psychiatric history",
      type: 'family-history',
      icon: <FamilyIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'developmental-history',
      name: 'Developmental History',
      category: 'Subjective',
      description: "Patient's developmental history and milestones",
      type: 'developmental-history',
      icon: <ChildCareIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'academic-history',
      name: 'Academic History',
      category: 'Subjective',
      description: "Patient's academic performance and school history",
      type: 'academic-history',
      icon: <SchoolIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'nutrition-weight-history',
      name: 'Nutrition and Weight History',
      category: 'Subjective',
      description: "Patient's diet, nutrition patterns and weight history",
      type: 'nutrition-weight-history',
      icon: <RestaurantIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'collateral-information',
      name: 'Collateral Information',
      category: 'Subjective',
      description: 'Information from family, caregivers, or other providers',
      type: 'collateral-information',
      icon: <GroupsIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'sleep-history',
      name: 'Sleep History',
      category: 'Subjective',
      description: "Patient's sleep patterns and sleep-related issues",
      type: 'sleep-history',
      icon: <BedtimeIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'obgyn-history',
      name: 'OBGYN History',
      category: 'Subjective',
      description: "Patient's obstetric and gynecological history",
      type: 'obgyn-history',
      icon: <FemaleIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'treatment-compliance',
      name: 'Treatment Compliance',
      category: 'Subjective',
      description: "Patient's adherence to treatment plans and medication",
      type: 'treatment-compliance',
      icon: <CheckCircleIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'social-history',
      name: 'Social History',
      category: 'Subjective',
      description: "Patient's social background, relationships and living situation",
      type: 'social-history',
      icon: <PeopleIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'psychiatric-review-systems',
      name: 'Psychiatric Review of Systems',
      category: 'Subjective',
      description: 'Comprehensive review of psychiatric symptoms and mental health concerns',
      type: 'psychiatric-review-systems',
      icon: <PsychologyIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },

    // Objective sections
    {
      id: 'lab-results-imaging',
      name: 'Lab Results / Imaging',
      category: 'Objective',
      description: 'Documentation of laboratory and imaging results',
      type: 'lab-results-imaging',
      icon: <ScienceIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'medical-review-systems',
      name: 'Medical Review of Systems',
      category: 'Objective',
      description: 'Comprehensive review of body systems and symptoms',
      type: 'medical-review-systems',
      icon: <VisibilityIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'mental-status-exam',
      name: 'Mental Status Exam',
      category: 'Objective',
      description: "Detailed assessment of patient's mental status and cognitive functioning",
      type: 'mental-status-exam',
      icon: <PsychologyIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'physical-examination',
      name: 'Physical Examination',
      category: 'Objective',
      description: 'Comprehensive physical examination findings',
      type: 'physical-examination',
      icon: <MedicalServicesIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'assessments-scales',
      name: 'Assessments & Scales',
      category: 'Objective',
      description: 'Documentation of assessment scales and their results',
      type: 'assessments-scales',
      icon: <BarChartIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'vitals',
      name: 'Vitals',
      category: 'Objective',
      description: "Patient's vital signs documentation",
      type: 'vitals',
      icon: <MonitorHeartIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },

    // Assessment sections
    {
      id: 'assessment',
      name: 'Assessment',
      category: 'Assessment',
      description: 'Clinical assessment of diagnoses with ICD-10 codes',
      type: 'assessment',
      icon: <VisibilityIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'biopsychosocial-assessment',
      name: 'Biopsychosocial Assessment',
      category: 'Assessment',
      description: 'Comprehensive assessment of biological, psychological, and social factors',
      type: 'biopsychosocial-assessment',
      icon: <PsychologyIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'assessment-plan',
      name: 'Assessment & Plan',
      category: 'Assessment',
      description: 'Combined assessment and plan organized by diagnosis',
      type: 'assessment-plan',
      icon: <AssignmentIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'risk-assessment',
      name: 'Risk Assessment',
      category: 'Assessment',
      description: 'Assessment of suicide, homicide, and other safety risks',
      type: 'risk-assessment',
      icon: <WarningIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'risk-protective-factors',
      name: 'Risk & Protective Factors',
      category: 'Assessment',
      description: 'Identification of risk and protective factors',
      type: 'risk-protective-factors',
      icon: <CheckCircleIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'medical-decision-making',
      name: 'Medical Decision Making',
      category: 'Assessment',
      description: 'Documentation of medical decision making complexity',
      type: 'medical-decision-making',
      icon: <PsychologyIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'psychiatric-impression',
      name: 'Psychiatric Impression',
      category: 'Assessment',
      description: 'Comprehensive psychiatric diagnostic formulation',
      type: 'psychiatric-impression',
      icon: <PsychologyIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'differential-diagnosis',
      name: 'Differential Diagnosis',
      category: 'Assessment',
      description: 'Alternative diagnoses considered with supporting evidence',
      type: 'differential-diagnosis',
      icon: <VisibilityIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'dsm5-evaluation',
      name: 'DSM5 Evaluation',
      category: 'Assessment',
      description: 'Formal DSM-5 diagnostic evaluation with criteria',
      type: 'dsm5-evaluation',
      icon: <AssignmentIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },

    // Plan sections
    {
      id: 'plan',
      name: 'Plan',
      category: 'Plan',
      description: 'Comprehensive treatment plan with interventions',
      type: 'plan',
      icon: <DescriptionIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'patient-instructions',
      name: 'Patient Instructions',
      category: 'Plan',
      description: 'Instructions provided to patient for self-care',
      type: 'patient-instructions',
      icon: <DescriptionIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'orders-referrals',
      name: 'Orders and Referrals',
      category: 'Plan',
      description: 'Documentation of orders and referrals with justification',
      type: 'orders-referrals',
      icon: <AssignmentIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'follow-ups',
      name: 'Follow-ups',
      category: 'Plan',
      description: 'Details for follow-up appointments and check-ins',
      type: 'follow-ups',
      icon: <CheckCircleIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'todo-next-steps',
      name: 'To-do and Next Steps',
      category: 'Plan',
      description: 'Action items for provider and patient before next visit',
      type: 'todo-next-steps',
      icon: <ChecklistIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'crisis-safety-plan',
      name: 'Crisis and Safety Plan',
      category: 'Plan',
      description: 'Comprehensive safety plan for crisis situations',
      type: 'crisis-safety-plan',
      icon: <WarningIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'long-term-treatment-plan',
      name: 'Long-Term Treatment Plan',
      category: 'Plan',
      description: 'Comprehensive long-term treatment plan with SMART goals',
      type: 'long-term-treatment-plan',
      icon: <AssignmentIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },

    // Patient Information sections
    {
      id: 'location-accompaniment',
      name: 'Location and Accompaniment',
      category: 'Patient Information',
      description: 'Information about visit location and patient accompaniment',
      type: 'location-accompaniment',
      icon: <LocationOnIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'patient-demographics',
      name: 'Patient Demographics',
      category: 'Patient Information',
      description: 'Basic patient demographic information',
      type: 'patient-demographics',
      icon: <PersonIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },

    // Add-Ons sections
    {
      id: 'therapy-interventions',
      name: 'Therapy Interventions',
      category: 'Add-Ons',
      description: 'Documentation of therapeutic techniques and patient response',
      type: 'therapy-interventions',
      icon: <PsychologyIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'tms-justification',
      name: 'TMS Justification',
      category: 'Add-Ons',
      description: 'Clinical justification for TMS therapy',
      type: 'tms-justification',
      icon: <MagnetIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'spravato-justification',
      name: 'Spravato Justification',
      category: 'Add-Ons',
      description: 'Clinical justification for Spravato treatment',
      type: 'spravato-justification',
      icon: <MedicationIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    },
    {
      id: 'case-management-notes',
      name: 'Case Management Notes',
      category: 'Add-Ons',
      description: 'Documentation of case management and care coordination',
      type: 'case-management-notes',
      icon: <FolderIcon sx={{ fontSize: 24, color: bravoColors.primaryFlat }} />
    }
  ];

  const categories = ['Basic', 'Subjective', 'Objective', 'Assessment', 'Plan', 'Patient Information', 'Add-Ons'];

  const getFilteredSections = () => {
    if (activeTab === 0) return sectionTemplates;
    const category = categories[activeTab];
    return sectionTemplates.filter(section => section.category === category);
  };

  const handleSectionClick = (section: SectionTemplate) => {
    setSelectedSection(section);
    setShowPlacementDialog(true);
  };

  const handlePlaceSection = (position: number) => {
    if (selectedSection) {
      onAddSection(selectedSection, position);
      setSelectedSection(null);
      setShowPlacementDialog(false);
      onClose();
    }
  };

  const handleClosePlacement = () => {
    setShowPlacementDialog(false);
    setSelectedSection(null);
  };

  const handleBackToSections = () => {
    setShowPlacementDialog(false);
    setSelectedSection(null);
  };

  return (
    <>
      {/* Main Add Section Dialog */}
      <Dialog
        open={open && !showPlacementDialog}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 4,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                Add New Section
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose a section type to add to your template
              </Typography>
            </Box>
            <IconButton 
              onClick={onClose}
              sx={{
                backgroundColor: alpha(theme.palette.grey[500], 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.grey[500], 0.2)
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 3 }}>
          {/* Category Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }
              }}
            >
              <Tab label="All Sections" />
              {categories.map((category) => (
                <Tab key={category} label={category} />
              ))}
            </Tabs>
          </Box>

          <Grid container spacing={3}>
            {getFilteredSections().map((section) => (
              <Grid item xs={12} sm={6} md={4} key={section.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: `2px solid transparent`,
                    height: '100%',
                    '&:hover': {
                      borderColor: bravoColors.primaryFlat,
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 25px ${alpha(bravoColors.primaryFlat, 0.15)}`
                    }
                  }}
                  onClick={() => handleSectionClick(section)}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Stack spacing={2} sx={{ height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {section.icon}
                        <Chip
                          label={section.category}
                          size="small"
                          sx={{
                            backgroundColor: alpha(bravoColors.secondary, 0.15),
                            color: bravoColors.secondary,
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: bravoColors.primaryFlat,
                            mb: 1,
                            fontSize: '1rem',
                            lineHeight: 1.3
                          }}
                        >
                          {section.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            lineHeight: 1.4,
                            fontSize: '0.85rem'
                          }}
                        >
                          {section.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Section Placement Dialog */}
      <SectionPlacementDialog
        open={showPlacementDialog}
        onClose={handleClosePlacement}
        onPlaceSection={handlePlaceSection}
        onBack={handleBackToSections}
        existingSections={existingSections}
      />
    </>
  );
};

export default AddSectionOverlay;
