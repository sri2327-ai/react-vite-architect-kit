import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  Button,
  InputAdornment,
  Stack,
  Chip,
  alpha,
  Paper,
  Badge,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Psychology as PsychologyIcon,
  LocalHospital as LocalHospitalIcon,
  MedicalServices as MedicalServicesIcon,
  Medication as MedicationIcon,
  Warning as WarningIcon,
  SmokingRooms as SmokingRoomsIcon,
  People as PeopleIcon,
  ChildCare as ChildCareIcon,
  School as SchoolIcon,
  Restaurant as RestaurantIcon,
  Group as GroupIcon,
  Bedtime as BedtimeIcon,
  Female as FemaleIcon,
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
  Description as DescriptionIcon,
  Add as AddIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import SectionPlacementDialog from './SectionPlacementDialog';

interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
  category: string;
  emoji: string;
}

interface AddSectionOverlayProps {
  open: boolean;
  onClose: () => void;
  onAddSection: (section: SectionTemplate) => void;
  existingSections?: Array<{ id: string; name: string; type?: string; }>;
}

const sectionTemplates: SectionTemplate[] = [
  // Subjective
  { id: 'psych-history', name: 'Past Psychiatric History', description: "Patient's history of psychiatric conditions and treatments", icon: <PsychologyIcon />, category: 'Subjective', emoji: '🧠' },
  { id: 'medical-history', name: 'Medical History', description: "Patient's history of medical conditions", icon: <LocalHospitalIcon />, category: 'Subjective', emoji: '🏥' },
  { id: 'surgical-history', name: 'Surgical History', description: "Patient's history of surgical procedures", icon: <MedicalServicesIcon />, category: 'Subjective', emoji: '🔪' },
  { id: 'current-medications', name: 'Current Medications', description: "List of patient's current medications", icon: <MedicationIcon />, category: 'Subjective', emoji: '💊' },
  { id: 'allergies', name: 'Allergies', description: "Patient's allergies to medications, foods, or other substances", icon: <WarningIcon />, category: 'Subjective', emoji: '⚠️' },
  { id: 'substance-use', name: 'Substance Use History', description: "Patient's history of substance use", icon: <SmokingRoomsIcon />, category: 'Subjective', emoji: '🚬' },
  { id: 'treatment-history', name: 'Treatment History', description: "Patient's history of substance use treatment", icon: <LocalHospitalIcon />, category: 'Subjective', emoji: '🏥' },
  { id: 'family-history', name: 'Family History', description: "Patient's family psychiatric history", icon: <PeopleIcon />, category: 'Subjective', emoji: '👪' },
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

  // Plan sections
  { id: 'plan', name: 'Plan', description: 'Comprehensive treatment plan with interventions', icon: <AssignmentIcon />, category: 'Plan', emoji: '📝' },
  { id: 'patient-instructions', name: 'Patient Instructions', description: 'Instructions provided to patient for self-care', icon: <DescriptionIcon />, category: 'Plan', emoji: '📝' },
  { id: 'orders-referrals', name: 'Orders and Referrals', description: 'Documentation of orders and referrals with justification', icon: <AssignmentIcon />, category: 'Plan', emoji: '📋' },
  { id: 'follow-ups', name: 'Follow-ups', description: 'Details for follow-up appointments and check-ins', icon: <CheckCircleIcon />, category: 'Plan', emoji: '📅' },
  { id: 'todo-next-steps', name: 'To-do and Next Steps', description: 'Action items for provider and patient before next visit', icon: <ChecklistIcon />, category: 'Plan', emoji: '✅' },
  { id: 'crisis-safety', name: 'Crisis and Safety Plan', description: 'Comprehensive safety plan for crisis situations', icon: <WarningIcon />, category: 'Plan', emoji: '🚨' },
  { id: 'long-term-plan', name: 'Long-Term Treatment Plan', description: 'Comprehensive long-term treatment plan with SMART goals', icon: <AssignmentIcon />, category: 'Plan', emoji: '🎯' },

  // Objective sections
  { id: 'lab-results', name: 'Lab Results / Imaging', description: 'Documentation of laboratory and imaging results', icon: <ScienceIcon />, category: 'Objective', emoji: '🔬' },
  { id: 'medical-ros', name: 'Medical Review of Systems', description: 'Comprehensive review of body systems and symptoms', icon: <VisibilityIcon />, category: 'Objective', emoji: '🔍' },
  { id: 'mental-status', name: 'Mental Status Exam', description: "Detailed assessment of patient's mental status and cognitive functioning", icon: <PsychologyIcon />, category: 'Objective', emoji: '🔍' },
  { id: 'physical-exam', name: 'Physical Examination', description: 'Comprehensive physical examination findings', icon: <MedicalServicesIcon />, category: 'Objective', emoji: '🩺' },
  { id: 'assessments-scales', name: 'Assessments & Scales', description: 'Documentation of assessment scales and their results', icon: <AssessmentIcon />, category: 'Objective', emoji: '📊' },
  { id: 'vitals', name: 'Vitals', description: "Patient's vital signs documentation", icon: <MonitorHeartIcon />, category: 'Objective', emoji: '❤️' },

  // Assessment sections
  { id: 'assessment', name: 'Assessment', description: 'Clinical assessment of diagnoses with ICD-10 codes', icon: <AssessmentIcon />, category: 'Assessment', emoji: '🔍' },
  { id: 'biopsychosocial', name: 'Biopsychosocial Assessment', description: 'Comprehensive assessment of biological, psychological, and social factors', icon: <PsychologyIcon />, category: 'Assessment', emoji: '🧠' },
  { id: 'assessment-plan', name: 'Assessment & Plan', description: 'Combined assessment and plan organized by diagnosis', icon: <AssignmentIcon />, category: 'Assessment', emoji: '📊' },
  { id: 'risk-assessment', name: 'Risk Assessment', description: 'Assessment of suicide, homicide, and other safety risks', icon: <WarningIcon />, category: 'Assessment', emoji: '⚠️' },
  { id: 'risk-protective', name: 'Risk & Protective Factors', description: 'Identification of risk and protective factors', icon: <FavoriteIcon />, category: 'Assessment', emoji: '🛡️' },
  { id: 'medical-decision', name: 'Medical Decision Making', description: 'Documentation of medical decision making complexity', icon: <AssessmentIcon />, category: 'Assessment', emoji: '🧩' },
  { id: 'psychiatric-impression', name: 'Psychiatric Impression', description: 'Comprehensive psychiatric diagnostic formulation', icon: <PsychologyIcon />, category: 'Assessment', emoji: '🧠' },
  { id: 'differential-dx', name: 'Differential Diagnosis', description: 'Alternative diagnoses considered with supporting evidence', icon: <AssessmentIcon />, category: 'Assessment', emoji: '🔄' },
  { id: 'dsm5-eval', name: 'DSM5 Evaluation', description: 'Formal DSM-5 diagnostic evaluation with criteria', icon: <AssignmentIcon />, category: 'Assessment', emoji: '📋' },

  // Patient Information sections
  { id: 'location-accompaniment', name: 'Location and Accompaniment', description: 'Information about visit location and patient accompaniment', icon: <LocationOnIcon />, category: 'Patient Information', emoji: '📍' },
  { id: 'patient-demographics', name: 'Patient Demographics', description: 'Basic patient demographic information', icon: <PersonIcon />, category: 'Patient Information', emoji: '👤' },

  // Add-Ons sections
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
  onAddSection,
  existingSections = []
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [customSectionName, setCustomSectionName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [placementDialogOpen, setPlacementDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionTemplate | null>(null);

  const categories = ['All', 'Subjective', 'Plan', 'Objective', 'Assessment', 'Patient Information', 'Add-Ons', 'Custom Blocks'];

  const filteredSections = sectionTemplates.filter(section => {
    const matchesSearch = section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || section.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const getCategoryColor = (category: string) => {
    const colors = {
      'Subjective': '#2196F3',
      'Plan': '#4CAF50', 
      'Objective': '#FF9800',
      'Assessment': '#9C27B0',
      'Patient Information': '#00BCD4',
      'Add-Ons': '#FF5722',
      'Custom Blocks': '#607D8B'
    };
    return colors[category as keyof typeof colors] || bravoColors.primaryFlat;
  };

  const handleSectionClick = (section: SectionTemplate) => {
    setSelectedSection(section);
    setPlacementDialogOpen(true);
  };

  const handlePlaceSection = (position: number) => {
    if (selectedSection) {
      onAddSection({ ...selectedSection, position });
      setSelectedSection(null);
      setPlacementDialogOpen(false);
      onClose();
    }
  };

  const handlePlacementDialogClose = () => {
    setPlacementDialogOpen(false);
    setSelectedSection(null);
  };

  const handleBackFromPlacement = () => {
    setPlacementDialogOpen(false);
    setSelectedSection(null);
    // Keep the main overlay open
  };

  return (
    <>
      <Dialog
        open={open && !placementDialogOpen}
        onClose={onClose}
        maxWidth={false}
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100vh',
            height: '100vh',
            width: '100vw',
            maxWidth: '100vw',
            borderRadius: 0,
            background: '#f8fafc',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          },
          '& .MuiBackdrop-root': {
            backgroundColor: alpha('#000000', 0.7)
          }
        }}
      >
        <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Compact Header */}
          <Box sx={{ 
            background: `linear-gradient(135deg, ${bravoColors.primaryFlat} 0%, ${bravoColors.secondary} 100%)`,
            color: '#ffffff',
            p: { xs: 1.5, sm: 2 },
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Box>
                  <Typography variant={isMobile ? "h6" : "h5"} sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    lineHeight: 1.2,
                    color: '#ffffff'
                  }}>
                    Add Section
                  </Typography>
                  {!isMobile && (
                    <Typography variant="body2" sx={{ 
                      opacity: 0.9,
                      fontSize: '0.875rem',
                      mt: 0.25,
                      color: '#ffffff'
                    }}>
                      Choose from medical documentation sections
                    </Typography>
                  )}
                </Box>
              </Box>
              <IconButton 
                onClick={onClose}
                sx={{ 
                  bgcolor: alpha('#ffffff', 0.15),
                  color: '#ffffff',
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  '&:hover': { 
                    bgcolor: alpha('#ffffff', 0.25)
                  }
                }}
              >
                <CloseIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
              </IconButton>
            </Box>
          </Box>

          {/* Compact Search and Filter */}
          <Box sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            bgcolor: alpha(bravoColors.primaryFlat, 0.02),
            flexShrink: 0,
            borderBottom: '1px solid #e0e0e0'
          }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: bravoColors.primaryFlat, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: { xs: 1.5, sm: 2 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  backgroundColor: '#ffffff',
                  height: { xs: 40, sm: 44 },
                  '& fieldset': {
                    borderColor: alpha(bravoColors.primaryFlat, 0.2)
                  }
                }
              }}
            />

            {/* Compact Category Filter */}
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                flexWrap: 'wrap', 
                gap: { xs: 0.75, sm: 1 },
                mb: 1
              }}
            >
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    height: { xs: 28, sm: 32 },
                    bgcolor: selectedCategory === category ? getCategoryColor(category) : 'transparent',
                    color: selectedCategory === category ? '#ffffff' : getCategoryColor(category),
                    borderColor: getCategoryColor(category),
                    '&:hover': {
                      bgcolor: selectedCategory === category ? getCategoryColor(category) : alpha(getCategoryColor(category), 0.08)
                    }
                  }}
                />
              ))}
            </Stack>
            
            {/* Compact Custom Section Creator */}
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 1.5, sm: 2 }, 
                border: `1px dashed ${bravoColors.highlight.border}`, 
                borderRadius: 2, 
                background: alpha(bravoColors.primaryFlat, 0.02)
              }}
            >
              {!showCustomForm ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AddIcon sx={{ color: bravoColors.secondary, mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      Create Custom Section
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowCustomForm(true)}
                    sx={{ 
                      textTransform: 'none',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                      height: { xs: 28, sm: 32 },
                      borderColor: bravoColors.secondary,
                      color: bravoColors.secondary
                    }}
                  >
                    Create
                  </Button>
                </Box>
              ) : (
                <Box>
                  <TextField
                    fullWidth
                    label="Section Name"
                    value={customSectionName}
                    onChange={(e) => setCustomSectionName(e.target.value)}
                    size="small"
                    sx={{ 
                      mb: 1.5,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        backgroundColor: '#ffffff'
                      }
                    }}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={handleAddCustomSection}
                      disabled={!customSectionName.trim()}
                      sx={{ 
                        backgroundColor: bravoColors.secondary,
                        fontSize: { xs: '0.75rem', sm: '0.8rem' }
                      }}
                    >
                      Add
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => setShowCustomForm(false)}
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              )}
            </Paper>

            {/* Results Summary */}
            <Paper sx={{
              p: { xs: 1, sm: 1.5 },
              mt: { xs: 1.5, sm: 2 },
              borderRadius: 1.5,
              backgroundColor: alpha(bravoColors.primaryFlat, 0.05),
              border: `1px solid ${alpha(bravoColors.primaryFlat, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: bravoColors.primaryFlat,
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}>
                {filteredSections.length} sections
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </Typography>
              <Badge 
                badgeContent={filteredSections.length} 
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: bravoColors.secondary,
                    fontSize: '0.7rem',
                    height: 18,
                    minWidth: 18
                  }
                }}
              >
                <Box sx={{ width: 20, height: 20 }} />
              </Badge>
            </Paper>
          </Box>

          {/* Scrollable Sections Grid */}
          <Box sx={{ 
            flex: 1,
            overflow: 'auto',
            p: { xs: 1.5, sm: 2 }
          }}>
            {selectedCategory === 'All' ? (
              // Category groups
              categories.slice(1).map((category) => {
                const categorySections = filteredSections.filter(section => section.category === category);
                if (categorySections.length === 0) return null;

                return (
                  <Box key={category} sx={{ mb: { xs: 2.5, sm: 3 } }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        mb: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        background: alpha(getCategoryColor(category), 0.05),
                        border: `1px solid ${alpha(getCategoryColor(category), 0.15)}`
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{
                            width: { xs: 8, sm: 12 },
                            height: { xs: 8, sm: 12 },
                            borderRadius: '50%',
                            bgcolor: getCategoryColor(category),
                            mr: { xs: 1.5, sm: 2 }
                          }} />
                          <Typography variant={isMobile ? "subtitle2" : "h6"} sx={{ 
                            fontWeight: 700,
                            color: getCategoryColor(category),
                            fontSize: { xs: '1rem', sm: '1.1rem' }
                          }}>
                            {category}
                          </Typography>
                        </Box>
                        <Chip 
                          label={`${categorySections.length}`}
                          size="small"
                          sx={{ 
                            bgcolor: getCategoryColor(category),
                            color: '#ffffff',
                            fontWeight: 600,
                            height: { xs: 22, sm: 26 },
                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                          }}
                        />
                      </Box>
                    </Paper>
                    
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { 
                        xs: '1fr', 
                        sm: 'repeat(auto-fit, minmax(260px, 1fr))', 
                        md: 'repeat(auto-fill, minmax(280px, 1fr))'
                      }, 
                      gap: { xs: 1.5, sm: 2 }
                    }}>
                      {categorySections.map((section) => (
                        <Card 
                          key={section.id}
                          sx={{ 
                            cursor: 'pointer',
                            borderRadius: 2,
                            border: `1px solid transparent`,
                            transition: 'all 0.2s ease',
                            background: '#ffffff',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 12px ${alpha(getCategoryColor(category), 0.15)}`,
                              borderColor: getCategoryColor(category)
                            }
                          }}
                        >
                          <CardActionArea 
                            onClick={() => handleSectionClick(section)}
                            sx={{ p: { xs: 1.5, sm: 2 } }}
                          >
                            <CardContent sx={{ p: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Box sx={{
                                  width: { xs: 40, sm: 48 },
                                  height: { xs: 40, sm: 48 },
                                  borderRadius: 2,
                                  background: alpha(getCategoryColor(category), 0.1),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: { xs: 1.5, sm: 2 },
                                  fontSize: { xs: '1.2rem', sm: '1.4rem' },
                                  flexShrink: 0
                                }}>
                                  {section.emoji}
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography variant="subtitle2" sx={{ 
                                    fontWeight: 600, 
                                    lineHeight: 1.3,
                                    mb: 0.5,
                                    color: getCategoryColor(category),
                                    fontSize: { xs: '0.875rem', sm: '0.95rem' }
                                  }}>
                                    {section.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ 
                                    lineHeight: 1.4,
                                    fontSize: { xs: '0.75rem', sm: '0.8rem' }
                                  }}>
                                    {section.description}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                );
              })
            ) : (
              // Single category view
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: 'repeat(auto-fit, minmax(260px, 1fr))', 
                  md: 'repeat(auto-fill, minmax(280px, 1fr))'
                }, 
                gap: { xs: 1.5, sm: 2 }
              }}>
                {filteredSections.map((section) => (
                  <Card 
                    key={section.id}
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: 2,
                      border: `1px solid transparent`,
                      transition: 'all 0.2s ease',
                      background: '#ffffff',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${alpha(getCategoryColor(section.category), 0.15)}`,
                        borderColor: getCategoryColor(section.category)
                      }
                    }}
                  >
                    <CardActionArea 
                      onClick={() => handleSectionClick(section)}
                      sx={{ p: { xs: 1.5, sm: 2 } }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Box sx={{
                            width: { xs: 40, sm: 48 },
                            height: { xs: 40, sm: 48 },
                            borderRadius: 2,
                            background: alpha(getCategoryColor(section.category), 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: { xs: 1.5, sm: 2 },
                            fontSize: { xs: '1.2rem', sm: '1.4rem' },
                            flexShrink: 0
                          }}>
                            {section.emoji}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{ 
                              fontWeight: 600, 
                              lineHeight: 1.3,
                              mb: 0.5,
                              color: getCategoryColor(section.category),
                              fontSize: { xs: '0.875rem', sm: '0.95rem' }
                            }}>
                              {section.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ 
                              lineHeight: 1.4,
                              fontSize: { xs: '0.75rem', sm: '0.8rem' }
                            }}>
                              {section.description}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Box>
            )}

            {filteredSections.length === 0 && (
              <Box sx={{ 
                textAlign: 'center', 
                py: { xs: 4, sm: 6 },
                color: 'text.secondary'
              }}>
                <SearchIcon sx={{ fontSize: { xs: 48, sm: 64 }, opacity: 0.3, mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  No sections found
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Try adjusting your search or create a custom section.
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      <SectionPlacementDialog
        open={placementDialogOpen}
        onClose={handlePlacementDialogClose}
        onPlaceSection={handlePlaceSection}
        onBack={handleBackFromPlacement}
        existingSections={existingSections}
      />
    </>
  );
};

export default AddSectionOverlay;
