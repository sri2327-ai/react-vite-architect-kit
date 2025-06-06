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
  Badge
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
          overflow: 'hidden'
        },
        '& .MuiBackdrop-root': {
          backgroundColor: alpha('#000000', 0.8),
          backdropFilter: 'blur(10px)'
        }
      }}
    >
      <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header with better gradient and positioning */}
        <Box sx={{ 
          background: `linear-gradient(135deg, ${bravoColors.primaryFlat} 0%, ${bravoColors.primary} 100%)`,
          color: '#ffffff',
          p: 4,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          {/* Decorative background elements */}
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: alpha('#ffffff', 0.05),
            zIndex: 1
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: alpha('#ffffff', 0.03),
            zIndex: 1
          }} />
          
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ position: 'relative', zIndex: 2 }}>
            <Box display="flex" alignItems="center">
              <Box sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                backgroundColor: alpha('#ffffff', 0.15),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}>
                <AutoAwesomeIcon sx={{ fontSize: 32, color: '#ffffff' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  textShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  letterSpacing: '-0.02em'
                }}>
                  Add Section
                </Typography>
                <Typography variant="h6" sx={{ 
                  opacity: 0.9,
                  fontWeight: 400,
                  lineHeight: 1.4
                }}>
                  Choose from our comprehensive library of medical documentation sections
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={onClose}
              sx={{ 
                bgcolor: alpha('#ffffff', 0.15),
                color: '#ffffff',
                width: 56,
                height: 56,
                '&:hover': { 
                  bgcolor: alpha('#ffffff', 0.25),
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }}
            >
              <CloseIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Search and Filter Section */}
        <Box sx={{ p: 4, bgcolor: alpha(bravoColors.primaryFlat, 0.02) }}>
          <TextField
            fullWidth
            size="medium"
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
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                fontSize: '1.1rem',
                backgroundColor: '#ffffff',
                height: 56,
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
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              fontWeight: 700, 
              color: bravoColors.primaryFlat,
              fontSize: '1.25rem'
            }}>
              Filter by Category
            </Typography>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                  sx={{
                    borderRadius: 4,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    fontSize: '1rem',
                    height: 44,
                    bgcolor: selectedCategory === category ? getCategoryColor(category) : 'transparent',
                    color: selectedCategory === category ? '#ffffff' : getCategoryColor(category),
                    borderColor: getCategoryColor(category),
                    borderWidth: 2,
                    boxShadow: selectedCategory === category ? `0 6px 16px ${alpha(getCategoryColor(category), 0.3)}` : 'none',
                    '&:hover': {
                      bgcolor: selectedCategory === category ? getCategoryColor(category) : alpha(getCategoryColor(category), 0.08),
                      transform: 'translateY(-2px)',
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
              p: 4, 
              border: `3px dashed ${bravoColors.highlight.border}`, 
              borderRadius: 4, 
              background: `linear-gradient(135deg, ${alpha(bravoColors.primaryFlat, 0.03)} 0%, ${alpha(bravoColors.secondary, 0.03)} 100%)`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{
              position: 'absolute',
              top: -15,
              right: -15,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: alpha(bravoColors.secondary, 0.08)
            }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                backgroundColor: bravoColors.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <AddIcon sx={{ color: '#ffffff', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: bravoColors.primaryFlat, mb: 0.5 }}>
                  Create Custom Section
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Not finding what you need? Create a custom section tailored to your specific requirements.
                </Typography>
              </Box>
            </Box>
            
            {!showCustomForm ? (
              <Button
                variant="outlined"
                onClick={() => setShowCustomForm(true)}
                sx={{ 
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  height: 48,
                  px: 3,
                  borderColor: bravoColors.secondary,
                  color: bravoColors.secondary,
                  borderWidth: 2,
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
                  size="medium"
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
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
                      borderRadius: 3,
                      height: 44,
                      px: 3,
                      backgroundColor: bravoColors.secondary,
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
                      borderRadius: 3,
                      height: 44,
                      px: 3
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
        <Box sx={{ px: 4, pb: 3 }}>
          <Paper sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: alpha(bravoColors.primaryFlat, 0.05),
            border: `2px solid ${alpha(bravoColors.primaryFlat, 0.1)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: bravoColors.primaryFlat }}>
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
                    fontSize: '0.9rem',
                    height: 24,
                    minWidth: 24
                  }
                }}
              >
                <Box sx={{ width: 32, height: 32 }} />
              </Badge>
            )}
          </Paper>
        </Box>

        {/* Sections Grid */}
        <Box sx={{ 
          flex: 1,
          overflow: 'auto',
          px: 4,
          pb: 4
        }}>
          {selectedCategory === 'All' ? (
            // Category groups
            categories.slice(1).map((category) => {
              const categorySections = filteredSections.filter(section => section.category === category);
              if (categorySections.length === 0) return null;

              return (
                <Box key={category} sx={{ mb: 5 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      mb: 4,
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${alpha(getCategoryColor(category), 0.08)} 0%, ${alpha(getCategoryColor(category), 0.03)} 100%)`,
                      border: `2px solid ${alpha(getCategoryColor(category), 0.15)}`
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: getCategoryColor(category),
                          mr: 3,
                          boxShadow: `0 3px 12px ${alpha(getCategoryColor(category), 0.4)}`
                        }} />
                        <Typography variant="h5" sx={{ 
                          fontWeight: 800,
                          color: getCategoryColor(category),
                          letterSpacing: '-0.01em'
                        }}>
                          {category}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`${categorySections.length} sections`}
                        size="medium"
                        sx={{ 
                          bgcolor: getCategoryColor(category),
                          color: '#ffffff',
                          fontWeight: 700,
                          height: 32,
                          fontSize: '0.9rem'
                        }}
                      />
                    </Box>
                  </Paper>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
                    gap: 3
                  }}>
                    {categorySections.map((section) => (
                      <Card 
                        key={section.id}
                        sx={{ 
                          cursor: 'pointer',
                          borderRadius: 4,
                          border: `2px solid transparent`,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          background: '#ffffff',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 16px 40px ${alpha(getCategoryColor(category), 0.15)}`,
                            borderColor: getCategoryColor(category),
                            '& .section-emoji': {
                              transform: 'scale(1.3) rotate(10deg)'
                            },
                            '& .section-content': {
                              transform: 'translateY(-2px)'
                            }
                          }
                        }}
                      >
                        <CardActionArea 
                          onClick={() => {
                            onAddSection(section);
                            onClose();
                          }}
                          sx={{ height: '100%', p: 3 }}
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
                                width: 72,
                                height: 72,
                                borderRadius: 4,
                                background: `linear-gradient(135deg, ${alpha(getCategoryColor(category), 0.1)} 0%, ${alpha(getCategoryColor(category), 0.05)} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 3,
                                fontSize: '2.2rem',
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
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 700, 
                                  lineHeight: 1.3,
                                  mb: 2,
                                  color: getCategoryColor(category),
                                  fontSize: '1.2rem'
                                }}>
                                  {section.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                  lineHeight: 1.6,
                                  fontSize: '0.95rem'
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
              gap: 4
            }}>
              {filteredSections.map((section) => (
                <Card 
                  key={section.id}
                  sx={{ 
                    cursor: 'pointer',
                    borderRadius: 4,
                    border: `2px solid transparent`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: '#ffffff',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 16px 40px ${alpha(getCategoryColor(section.category), 0.15)}`,
                      borderColor: getCategoryColor(section.category),
                      '& .section-emoji': {
                        transform: 'scale(1.3) rotate(10deg)'
                      },
                      '& .section-content': {
                        transform: 'translateY(-2px)'
                      }
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => {
                      onAddSection(section);
                      onClose();
                    }}
                    sx={{ height: '100%', p: 3 }}
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
                          width: 72,
                          height: 72,
                          borderRadius: 4,
                          background: `linear-gradient(135deg, ${alpha(getCategoryColor(section.category), 0.1)} 0%, ${alpha(getCategoryColor(section.category), 0.05)} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 3,
                          fontSize: '2.2rem',
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
                          <Typography variant="h6" sx={{ 
                            fontWeight: 700, 
                            lineHeight: 1.3,
                            mb: 2,
                            color: getCategoryColor(section.category),
                            fontSize: '1.2rem'
                          }}>
                            {section.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            lineHeight: 1.6,
                            fontSize: '0.95rem'
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
              py: 12,
              color: 'text.secondary'
            }}>
              <Box sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: alpha(bravoColors.primaryFlat, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4
              }}>
                <SearchIcon sx={{ fontSize: 60, opacity: 0.5 }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                No sections found
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
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
