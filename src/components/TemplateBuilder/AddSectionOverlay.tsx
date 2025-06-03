
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
  Divider,
  InputAdornment,
  Stack,
  Chip,
  alpha
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
  Add as AddIcon
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
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 4, 
          maxHeight: '95vh',
          height: '95vh',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" sx={{ 
              color: bravoColors.primaryFlat, 
              fontWeight: 700,
              mb: 0.5
            }}>
              Add Section
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choose from our comprehensive library of medical documentation sections
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose}
            sx={{ 
              bgcolor: alpha(bravoColors.primaryFlat, 0.1),
              '&:hover': { bgcolor: alpha(bravoColors.primaryFlat, 0.2) }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 3, px: 3 }}>
        {/* Search and Filter Section */}
        <Box sx={{ mb: 4 }}>
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
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: '1.1rem'
              }
            }}
          />

          {/* Category Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Filter by Category
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                  sx={{
                    borderRadius: 3,
                    px: 1,
                    bgcolor: selectedCategory === category ? getCategoryColor(category) : 'transparent',
                    color: selectedCategory === category ? 'white' : getCategoryColor(category),
                    borderColor: getCategoryColor(category),
                    '&:hover': {
                      bgcolor: selectedCategory === category ? getCategoryColor(category) : alpha(getCategoryColor(category), 0.1)
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
          
          {/* Custom Section Creator */}
          <Box sx={{ 
            p: 3, 
            border: `2px dashed ${bravoColors.highlight.border}`, 
            borderRadius: 3, 
            bgcolor: alpha(bravoColors.primaryFlat, 0.02),
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AddIcon sx={{ mr: 1, color: bravoColors.primaryFlat }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Create Custom Section
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Not finding what you need? Create a custom section tailored to your specific requirements.
            </Typography>
            
            {!showCustomForm ? (
              <Button
                variant="outlined"
                onClick={() => setShowCustomForm(true)}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Create Custom Section
              </Button>
            ) : (
              <Box>
                <TextField
                  fullWidth
                  label="Section Name"
                  value={customSectionName}
                  onChange={(e) => setCustomSectionName(e.target.value)}
                  placeholder="e.g., Medication Compliance Assessment"
                  sx={{ mb: 2 }}
                />
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    onClick={handleAddCustomSection}
                    disabled={!customSectionName.trim()}
                    sx={{ borderRadius: 2 }}
                  >
                    Add Section
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => setShowCustomForm(false)}
                    sx={{ borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        </Box>

        {/* Results Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Showing {filteredSections.length} sections
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </Typography>
        </Box>

        {/* Sections Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: 3,
          maxHeight: '60vh',
          overflowY: 'auto',
          pr: 1
        }}>
          {selectedCategory === 'All' ? (
            // Group by category when showing all
            categories.slice(1).map((category) => {
              const categorySections = filteredSections.filter(section => section.category === category);
              if (categorySections.length === 0) return null;

              return (
                <Box key={category} sx={{ gridColumn: '1 / -1' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    pb: 1,
                    borderBottom: `2px solid ${getCategoryColor(category)}`
                  }}>
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: getCategoryColor(category),
                      mr: 2
                    }} />
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700,
                      color: getCategoryColor(category)
                    }}>
                      {category}
                    </Typography>
                    <Chip 
                      label={`${categorySections.length} sections`}
                      size="small"
                      sx={{ 
                        ml: 2,
                        bgcolor: alpha(getCategoryColor(category), 0.1),
                        color: getCategoryColor(category)
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: 2,
                    mb: 4
                  }}>
                    {categorySections.map((section) => (
                      <Card 
                        key={section.id}
                        sx={{ 
                          height: '100%',
                          cursor: 'pointer',
                          borderRadius: 3,
                          border: `1px solid ${alpha(getCategoryColor(category), 0.2)}`,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 8px 25px ${alpha(getCategoryColor(category), 0.15)}`,
                            borderColor: getCategoryColor(category)
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
                          <CardContent sx={{ p: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                              <Box sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: alpha(getCategoryColor(category), 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2,
                                fontSize: '1.5rem'
                              }}>
                                {section.emoji}
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 600, 
                                  lineHeight: 1.3,
                                  mb: 0.5,
                                  color: getCategoryColor(category)
                                }}>
                                  {section.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                  lineHeight: 1.4,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
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
            // Show filtered sections in selected category
            filteredSections.map((section) => (
              <Card 
                key={section.id}
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: `1px solid ${alpha(getCategoryColor(section.category), 0.2)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${alpha(getCategoryColor(section.category), 0.15)}`,
                    borderColor: getCategoryColor(section.category)
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
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: alpha(getCategoryColor(section.category), 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        fontSize: '1.5rem'
                      }}>
                        {section.emoji}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600, 
                          lineHeight: 1.3,
                          mb: 0.5,
                          color: getCategoryColor(section.category)
                        }}>
                          {section.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {section.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))
          )}
        </Box>

        {filteredSections.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            color: 'text.secondary'
          }}>
            <SearchIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              No sections found
            </Typography>
            <Typography variant="body2">
              Try adjusting your search terms or create a custom section above.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddSectionOverlay;
