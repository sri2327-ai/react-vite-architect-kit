import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
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
  Fade,
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
  onAddSection
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [customSectionName, setCustomSectionName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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

  return (
    <Dialog
      open={open}
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
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        },
        '& .MuiBackdrop-root': {
          backgroundColor: alpha('#000000', 0.8),
          backdropFilter: 'blur(10px)'
        }
      }}
    >
      <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ 
          background: `linear-gradient(135deg, ${bravoColors.primaryFlat} 0%, ${bravoColors.secondary} 100%)`,
          color: '#ffffff',
          p: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          flexShrink: 0
        }}>
          <Box sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: { xs: 100, md: 200 },
            height: { xs: 100, md: 200 },
            borderRadius: '50%',
            background: alpha('#ffffff', 0.05),
            zIndex: 1
          }} />
          
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ position: 'relative', zIndex: 2 }}>
            <Box display="flex" alignItems="center">
              <Box sx={{
                width: { xs: 40, sm: 48, md: 64 },
                height: { xs: 40, sm: 48, md: 64 },
                borderRadius: 2,
                backgroundColor: alpha('#ffffff', 0.15),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: { xs: 2, sm: 3 },
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}>
                <AutoAwesomeIcon sx={{ fontSize: { xs: 20, sm: 24, md: 32 }, color: '#ffffff' }} />
              </Box>
              <Box>
                <Typography variant={isMobile ? "h4" : "h3"} sx={{ 
                  fontWeight: 800,
                  mb: 0.5,
                  textShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  letterSpacing: '-0.02em'
                }}>
                  Add Section
                </Typography>
                <Typography 
                  variant={isMobile ? "body1" : "h6"} 
                  sx={{ 
                    opacity: 0.9,
                    fontWeight: 400,
                    lineHeight: 1.4,
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Choose from our comprehensive library of medical documentation sections
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={onClose}
              sx={{ 
                bgcolor: alpha('#ffffff', 0.15),
                color: '#ffffff',
                width: { xs: 40, sm: 48, md: 56 },
                height: { xs: 40, sm: 48, md: 56 },
                '&:hover': { 
                  bgcolor: alpha('#ffffff', 0.25),
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }}
            >
              <CloseIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />
            </IconButton>
          </Box>
        </Box>

        {/* Search and Filter Section */}
        <Box sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          bgcolor: alpha(bravoColors.primaryFlat, 0.02),
          flexShrink: 0
        }}>
          <TextField
            fullWidth
            size={isMobile ? "small" : "medium"}
            placeholder="Search sections by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: bravoColors.primaryFlat }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: { xs: '1rem', md: '1.1rem' },
                backgroundColor: '#ffffff',
                height: { xs: 48, md: 56 },
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: 'none',
                '&:hover': {
                  boxShadow: '0 6px 24px rgba(0,0,0,0.12)'
                },
                '&.Mui-focused': {
                  boxShadow: `0 6px 24px ${alpha(bravoColors.primaryFlat, 0.2)}`
                },
                '& fieldset': {
                  border: 'none'
                }
              }
            }}
          />

          {/* Category Filter */}
          <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ 
              mb: { xs: 1.5, sm: 2, md: 3 }, 
              fontWeight: 700, 
              color: bravoColors.primaryFlat,
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}>
              Filter by Category
            </Typography>
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                flexWrap: 'wrap', 
                gap: { xs: 1, sm: 1.5, md: 2 },
                '& > *': {
                  flexShrink: 0
                }
              }}
            >
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                  sx={{
                    borderRadius: 3,
                    px: { xs: 1.5, sm: 2, md: 3 },
                    py: 0.5,
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                    height: { xs: 36, sm: 40, md: 44 },
                    bgcolor: selectedCategory === category ? getCategoryColor(category) : 'transparent',
                    color: selectedCategory === category ? '#ffffff' : getCategoryColor(category),
                    borderColor: getCategoryColor(category),
                    borderWidth: 2,
                    boxShadow: selectedCategory === category ? `0 6px 16px ${alpha(getCategoryColor(category), 0.3)}` : 'none',
                    '&:hover': {
                      bgcolor: selectedCategory === category ? getCategoryColor(category) : alpha(getCategoryColor(category), 0.08),
                      transform: 'translateY(-1px)',
                      boxShadow: `0 6px 16px ${alpha(getCategoryColor(category), 0.25)}`
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </Stack>
          </Box>
          
          {/* Custom Section Creator */}
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              border: `2px dashed ${bravoColors.highlight.border}`, 
              borderRadius: 3, 
              background: `linear-gradient(135deg, ${alpha(bravoColors.primaryFlat, 0.03)} 0%, ${alpha(bravoColors.secondary, 0.03)} 100%)`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
              <Box sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                borderRadius: 2,
                backgroundColor: bravoColors.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: { xs: 2, md: 3 },
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <AddIcon sx={{ color: '#ffffff', fontSize: { xs: 20, md: 24 } }} />
              </Box>
              <Box>
                <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 700, color: bravoColors.primaryFlat, mb: 0.5 }}>
                  Create Custom Section
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                  Not finding what you need? Create a custom section tailored to your specific requirements.
                </Typography>
              </Box>
            </Box>
            
            {!showCustomForm ? (
              <Button
                variant="outlined"
                onClick={() => setShowCustomForm(true)}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  height: { xs: 40, md: 48 },
                  px: { xs: 2, md: 3 },
                  borderColor: bravoColors.secondary,
                  color: bravoColors.secondary,
                  borderWidth: 2,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  '&:hover': {
                    borderColor: bravoColors.primaryFlat,
                    backgroundColor: alpha(bravoColors.primaryFlat, 0.05),
                    color: bravoColors.primaryFlat,
                    borderWidth: 2
                  },
                  position: 'relative',
                  zIndex: 1
                }}
              >
                Create Custom Section
              </Button>
            ) : (
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <TextField
                  fullWidth
                  label="Section Name"
                  value={customSectionName}
                  onChange={(e) => setCustomSectionName(e.target.value)}
                  placeholder="e.g., Medication Compliance Assessment"
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    mb: { xs: 2, md: 3 },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#ffffff'
                    }
                  }}
                />
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    onClick={handleAddCustomSection}
                    disabled={!customSectionName.trim()}
                    sx={{ 
                      borderRadius: 2,
                      height: { xs: 40, md: 44 },
                      px: { xs: 2, md: 3 },
                      backgroundColor: bravoColors.secondary,
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      '&:hover': {
                        backgroundColor: bravoColors.primaryFlat
                      }
                    }}
                  >
                    Add Section
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => setShowCustomForm(false)}
                    sx={{ 
                      borderRadius: 2,
                      height: { xs: 40, md: 44 },
                      px: { xs: 2, md: 3 },
                      fontSize: { xs: '0.875rem', md: '1rem' }
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Results Summary */}
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: { xs: 1, sm: 2, md: 3 }, flexShrink: 0 }}>
          <Paper sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            borderRadius: 2,
            backgroundColor: alpha(bravoColors.primaryFlat, 0.05),
            border: `2px solid ${alpha(bravoColors.primaryFlat, 0.1)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant={isMobile ? "body1" : "h6"} sx={{ 
              fontWeight: 600, 
              color: bravoColors.primaryFlat,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}>
              {filteredSections.length} sections available
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </Typography>
            {filteredSections.length > 0 && (
              <Badge 
                badgeContent={filteredSections.length} 
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: bravoColors.secondary,
                    color: '#ffffff',
                    fontSize: { xs: '0.75rem', md: '0.9rem' },
                    height: { xs: 20, md: 24 },
                    minWidth: { xs: 20, md: 24 }
                  }
                }}
              >
                <Box sx={{ width: { xs: 24, md: 32 }, height: { xs: 24, md: 32 } }} />
              </Badge>
            )}
          </Paper>
        </Box>

        {/* Sections Grid */}
        <Box sx={{ 
          flex: 1,
          overflow: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 2, sm: 3, md: 4 }
        }}>
          {selectedCategory === 'All' ? (
            // Category groups
            categories.slice(1).map((category) => {
              const categorySections = filteredSections.filter(section => section.category === category);
              if (categorySections.length === 0) return null;

              return (
                <Box key={category} sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 2.5, md: 3 },
                      mb: { xs: 2, sm: 3, md: 4 },
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(getCategoryColor(category), 0.08)} 0%, ${alpha(getCategoryColor(category), 0.03)} 100%)`,
                      border: `2px solid ${alpha(getCategoryColor(category), 0.15)}`
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 0 }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                          width: { xs: 12, md: 16 },
                          height: { xs: 12, md: 16 },
                          borderRadius: '50%',
                          bgcolor: getCategoryColor(category),
                          mr: { xs: 2, md: 3 },
                          boxShadow: `0 3px 12px ${alpha(getCategoryColor(category), 0.4)}`
                        }} />
                        <Typography variant={isMobile ? "h6" : "h5"} sx={{ 
                          fontWeight: 800,
                          color: getCategoryColor(category),
                          letterSpacing: '-0.01em',
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
                        }}>
                          {category}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`${categorySections.length} sections`}
                        size={isMobile ? "small" : "medium"}
                        sx={{ 
                          bgcolor: getCategoryColor(category),
                          color: '#ffffff',
                          fontWeight: 700,
                          height: { xs: 28, md: 32 },
                          fontSize: { xs: '0.75rem', md: '0.9rem' }
                        }}
                      />
                    </Box>
                  </Paper>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { 
                      xs: '1fr', 
                      sm: 'repeat(auto-fit, minmax(280px, 1fr))', 
                      md: 'repeat(auto-fill, minmax(320px, 1fr))',
                      lg: 'repeat(auto-fill, minmax(380px, 1fr))'
                    }, 
                    gap: { xs: 2, sm: 2.5, md: 3 }
                  }}>
                    {categorySections.map((section) => (
                      <Card 
                        key={section.id}
                        sx={{ 
                          cursor: 'pointer',
                          borderRadius: 3,
                          border: `2px solid transparent`,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          background: '#ffffff',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: { xs: 'translateY(-2px)', md: 'translateY(-4px)' },
                            boxShadow: `0 ${isMobile ? '8px 24px' : '16px 40px'} ${alpha(getCategoryColor(category), 0.15)}`,
                            borderColor: getCategoryColor(category),
                            '& .section-emoji': {
                              transform: { xs: 'scale(1.1)', md: 'scale(1.3) rotate(10deg)' }
                            },
                            '& .section-content': {
                              transform: 'translateY(-1px)'
                            }
                          }
                        }}
                      >
                        <CardActionArea 
                          onClick={() => {
                            onAddSection(section);
                            onClose();
                          }}
                          sx={{ height: '100%', p: { xs: 2, sm: 2.5, md: 3 } }}
                        >
                          <CardContent sx={{ p: 0, height: '100%' }}>
                            <Box 
                              className="section-content"
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'flex-start',
                                transition: 'transform 0.3s ease'
                              }}
                            >
                              <Box sx={{
                                width: { xs: 56, sm: 64, md: 72 },
                                height: { xs: 56, sm: 64, md: 72 },
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${alpha(getCategoryColor(category), 0.1)} 0%, ${alpha(getCategoryColor(category), 0.05)} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: { xs: 2, sm: 2.5, md: 3 },
                                fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
                                border: `2px solid ${alpha(getCategoryColor(category), 0.15)}`,
                                flexShrink: 0
                              }}>
                                <Box 
                                  className="section-emoji"
                                  sx={{ 
                                    transition: 'transform 0.3s ease',
                                    lineHeight: 1
                                  }}
                                >
                                  {section.emoji}
                                </Box>
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ 
                                  fontWeight: 700, 
                                  lineHeight: 1.3,
                                  mb: { xs: 1, md: 2 },
                                  color: getCategoryColor(category),
                                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
                                }}>
                                  {section.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                  lineHeight: 1.6,
                                  fontSize: { xs: '0.875rem', md: '0.95rem' }
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
                sm: 'repeat(auto-fit, minmax(280px, 1fr))', 
                md: 'repeat(auto-fill, minmax(320px, 1fr))',
                lg: 'repeat(auto-fill, minmax(380px, 1fr))'
              }, 
              gap: { xs: 2, sm: 3, md: 4 }
            }}>
              {filteredSections.map((section) => (
                <Card 
                  key={section.id}
                  sx={{ 
                    cursor: 'pointer',
                    borderRadius: 3,
                    border: `2px solid transparent`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: '#ffffff',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: { xs: 'translateY(-2px)', md: 'translateY(-4px)' },
                      boxShadow: `0 ${isMobile ? '8px 24px' : '16px 40px'} ${alpha(getCategoryColor(section.category), 0.15)}`,
                      borderColor: getCategoryColor(section.category),
                      '& .section-emoji': {
                        transform: { xs: 'scale(1.1)', md: 'scale(1.3) rotate(10deg)' }
                      },
                      '& .section-content': {
                        transform: 'translateY(-1px)'
                      }
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => {
                      onAddSection(section);
                      onClose();
                    }}
                    sx={{ height: '100%', p: { xs: 2, sm: 2.5, md: 3 } }}
                  >
                    <CardContent sx={{ p: 0, height: '100%' }}>
                      <Box 
                        className="section-content"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start',
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        <Box sx={{
                          width: { xs: 56, sm: 64, md: 72 },
                          height: { xs: 56, sm: 64, md: 72 },
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${alpha(getCategoryColor(section.category), 0.1)} 0%, ${alpha(getCategoryColor(section.category), 0.05)} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: { xs: 2, sm: 2.5, md: 3 },
                          fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
                          border: `2px solid ${alpha(getCategoryColor(section.category), 0.15)}`,
                          flexShrink: 0
                        }}>
                          <Box 
                            className="section-emoji"
                            sx={{ 
                              transition: 'transform 0.3s ease',
                              lineHeight: 1
                            }}
                          >
                            {section.emoji}
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ 
                            fontWeight: 700, 
                            lineHeight: 1.3,
                            mb: { xs: 1, md: 2 },
                            color: getCategoryColor(section.category),
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
                          }}>
                            {section.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            lineHeight: 1.6,
                            fontSize: { xs: '0.875rem', md: '0.95rem' }
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
              py: { xs: 6, sm: 8, md: 12 },
              color: 'text.secondary'
            }}>
              <Box sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: { xs: 80, sm: 100, md: 120 },
                borderRadius: '50%',
                backgroundColor: alpha(bravoColors.primaryFlat, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: { xs: 2, sm: 3, md: 4 }
              }}>
                <SearchIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 }, opacity: 0.5 }} />
              </Box>
              <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                No sections found
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>
                Try adjusting your search terms or create a custom section above.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddSectionOverlay;
