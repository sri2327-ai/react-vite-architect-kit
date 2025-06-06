import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Alert,
  LinearProgress,
  Chip,
  Stack,
  Paper,
  Button,
  IconButton,
  Fade
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  ContentCopy as ContentCopyIcon,
  AutoFixHigh as AutoFixHighIcon,
  EditNote as EditNoteIcon,
  Description as DescriptionIcon,
  LibraryBooks as LibraryBooksIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Check as CheckIcon,
  Psychology as PsychologyIcon,
  Healing as HealingIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import { templateService } from '@/services/templateService';

interface ImprovedTemplateCreationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateTemplate: (templateData: any) => void;
}

interface CreateTemplateOption {
  id: number;
  title: string;
  description: string;
  clinicalContext: string;
  icon: React.ReactElement;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  timeEstimate: string;
}

const createTemplateOptions: CreateTemplateOption[] = [
  {
    id: 1,
    title: 'Smart Copy from Previous',
    description: "Convert your existing notes into reusable templates",
    clinicalContext: "Perfect for standardizing your documentation workflow",
    icon: <ContentCopyIcon />,
    difficulty: 'Easy',
    timeEstimate: '2 min'
  },
  {
    id: 2,
    title: 'AI-Assisted Creation',
    description: "Let AI build a template based on your specialty and preferences",
    clinicalContext: "Ideal for creating specialty-specific documentation",
    icon: <AutoFixHighIcon />,
    difficulty: 'Easy',
    timeEstimate: '3 min'
  },
  {
    id: 3,
    title: 'Custom Template Builder',
    description: "Build from scratch with full customization control",
    clinicalContext: "For unique workflows or specialized practices",
    icon: <EditNoteIcon />,
    difficulty: 'Medium',
    timeEstimate: '10 min'
  },
  {
    id: 4,
    title: 'Import Existing Template',
    description: "Import from other systems or colleagues",
    clinicalContext: "Great for transitioning from paper or other EMRs",
    icon: <DescriptionIcon />,
    difficulty: 'Easy',
    timeEstimate: '5 min'
  },
  {
    id: 5,
    title: 'Browse Template Library',
    description: "Choose from evidence-based clinical templates",
    clinicalContext: "Access peer-reviewed templates by specialty",
    icon: <LibraryBooksIcon />,
    difficulty: 'Easy',
    timeEstimate: '1 min'
  }
];

// Use the same template library data as TemplateLibraryTab
const templateLibrary = [
  {
    id: 1,
    name: "CLINICAL INTERVIEW1",
    specialty: "cardiologist",
    type: "SOAP",
    description: "Comprehensive cardiac evaluation template"
  },
  {
    id: 2,
    name: "CLINICAL INTERVIEW2", 
    specialty: "pyschologist",
    type: "SOAP",
    description: "Standard primary care documentation"
  },
  {
    id: 3,
    name: "CLINICAL INTERVIEW3",
    specialty: "cardiologist",
    type: "DPD",
    description: "ED triage and assessment template"
  },
  {
    id: 4,
    name: "Dermatology Intake",
    specialty: "Dermatology",
    type: "SOAP",
    description: "Mental health assessment template"
  },
  {
    id: 5,
    name: "Neurology Followup",
    specialty: "pyschologist",
    type: "SOAP", 
    description: "Musculoskeletal assessment template"
  },
  {
    id: 6,
    name: "Dermatology Intake1",
    specialty: "cardiologist",
    type: "DPD",
    description: "Routine pediatric check-up template"
  }
];

const ImprovedTemplateCreationDialog: React.FC<ImprovedTemplateCreationDialogProps> = ({
  open,
  onClose,
  onCreateTemplate
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<CreateTemplateOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLibraryTemplate, setSelectedLibraryTemplate] = useState<any>(null);
  
  // Form states
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [clinicalContext, setClinicalContext] = useState('');
  const [previousNotes, setPreviousNotes] = useState('');
  const [existingTemplateContent, setExistingTemplateContent] = useState('');
  
  // AI processing results
  const [processedContent, setProcessedContent] = useState('');
  const [aiSummary, setAiSummary] = useState('');

  const templateTypes = templateService.getTemplateTypes();

  const handleMethodSelect = (method: CreateTemplateOption) => {
    setSelectedMethod(method);
    setCurrentStep(1);
  };

  const handleLibraryTemplateSelect = (template: any) => {
    setSelectedLibraryTemplate(template);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedMethod?.id === 2) {
      // AI processing
      setIsProcessing(true);
      setTimeout(() => {
        const generatedContent = templateService.generateTemplateContent('SOAP', {
          clinicalContext,
          previousNotes
        });
        setProcessedContent(generatedContent);
        setAiSummary(`AI has created a template with ${clinicalContext ? 'specialized sections' : 'standard sections'}.`);
        setIsProcessing(false);
        setCurrentStep(2);
      }, 2500);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleCreate = () => {
    let templateData;

    if (selectedMethod?.id === 5 && selectedLibraryTemplate) {
      // Browse Template Library - use selected template
      templateData = {
        name: selectedLibraryTemplate.name,
        description: selectedLibraryTemplate.description,
        specialty: selectedLibraryTemplate.specialty,
        templateType: selectedLibraryTemplate.type,
        content: templateService.generateTemplateContent(selectedLibraryTemplate.type),
        method: selectedMethod.title,
      };
    } else {
      // Other methods - use form data
      templateData = {
        name: templateName,
        description: templateDescription,
        method: selectedMethod?.title,
        content: selectedMethod?.id === 2 ? processedContent : existingTemplateContent,
        previousNotes: selectedMethod?.id === 1 ? previousNotes : undefined,
        aiSummary: selectedMethod?.id === 2 ? aiSummary : undefined,
      };
    }
    
    onCreateTemplate(templateData);
    handleStartNew();
  };

  const handleStartNew = () => {
    // Reset form but keep overlay open for creating another template
    setCurrentStep(0);
    setSelectedMethod(null);
    setSelectedLibraryTemplate(null);
    setIsProcessing(false);
    setTemplateName('');
    setTemplateDescription('');
    setClinicalContext('');
    setPreviousNotes('');
    setExistingTemplateContent('');
    setProcessedContent('');
    setAiSummary('');
  };

  const handleClose = () => {
    handleStartNew();
    onClose();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4caf50';
      case 'Medium': return '#ff9800';
      case 'Advanced': return '#f44336';
      default: return '#757575';
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 0: return 'Choose Creation Method';
      case 1: return selectedMethod?.id === 5 ? 'Select Template' : 'Configure Template Details';
      case 2: return 'Template Preview';
      default: return '';
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ 
            height: 'calc(100vh - 300px)', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            py: 4
          }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" sx={{ 
                color: bravoColors.primaryFlat,
                fontWeight: 700,
                mb: 3
              }}>
                How would you like to create your template?
              </Typography>
              
              <Typography variant="h5" sx={{ 
                color: 'text.secondary',
                maxWidth: 900,
                mx: 'auto',
                fontWeight: 400
              }}>
                Choose the method that best fits your workflow. Each option is designed to save you time and improve your documentation quality.
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
              gap: 5,
              maxWidth: '1400px',
              mx: 'auto',
              width: '100%'
            }}>
              {createTemplateOptions.map((option) => (
                <Card 
                  key={option.id}
                  sx={{ 
                    cursor: 'pointer',
                    borderRadius: 4,
                    border: '3px solid transparent',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '280px',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                      borderColor: bravoColors.primaryFlat
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleMethodSelect(option)}
                    sx={{ height: '100%', p: 4 }}
                  >
                    <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 4,
                            background: bravoColors.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 20px rgba(20,49,81,0.3)'
                          }}
                        >
                          {React.cloneElement(option.icon, { sx: { color: 'white', fontSize: 40 } })}
                        </Box>
                        
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip
                            label={option.difficulty}
                            size="medium"
                            sx={{
                              backgroundColor: getDifficultyColor(option.difficulty),
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              mb: 1
                            }}
                          />
                          <Typography variant="body1" display="block" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {option.timeEstimate}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Content */}
                      <Typography variant="h4" gutterBottom sx={{ 
                        fontWeight: 700,
                        color: bravoColors.primaryFlat,
                        mb: 2,
                        fontSize: '1.4rem'
                      }}>
                        {option.title}
                      </Typography>
                      
                      <Typography variant="h6" sx={{
                        color: 'text.primary',
                        lineHeight: 1.6,
                        mb: 3,
                        flex: 1,
                        fontSize: '1.1rem'
                      }}>
                        {option.description}
                      </Typography>

                      <Box sx={{ 
                        p: 3, 
                        backgroundColor: alpha(bravoColors.primaryFlat, 0.08),
                        borderRadius: 3,
                        borderLeft: `5px solid ${bravoColors.primaryFlat}`
                      }}>
                        <Typography variant="h6" sx={{ 
                          color: bravoColors.primaryFlat,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <HealingIcon sx={{ fontSize: 20 }} />
                          {option.clinicalContext}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
            {/* Method Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 4,
              p: 4,
              backgroundColor: alpha(bravoColors.primaryFlat, 0.08),
              borderRadius: 4,
              border: `3px solid ${alpha(bravoColors.primaryFlat, 0.2)}`
            }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  background: bravoColors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 4
                }}
              >
                {selectedMethod?.icon && React.cloneElement(selectedMethod.icon, { sx: { color: 'white', fontSize: 40 } })}
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: bravoColors.primaryFlat, mb: 1 }}>
                  {selectedMethod?.title}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                  {selectedMethod?.description}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Browse Template Library - Just show templates */}
              {selectedMethod?.id === 5 ? (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                    Available Templates
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
                    gap: 4,
                    height: 'calc(100% - 80px)',
                    overflow: 'visible'
                  }}>
                    {templateLibrary.map((template) => (
                      <Card 
                        key={template.id}
                        sx={{
                          cursor: 'pointer',
                          border: selectedLibraryTemplate?.id === template.id ? `4px solid ${bravoColors.primaryFlat}` : '3px solid transparent',
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          height: 'fit-content',
                          '&:hover': {
                            borderColor: bravoColors.primaryFlat,
                            boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
                          }
                        }}
                        onClick={() => handleLibraryTemplateSelect(template)}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: bravoColors.primaryFlat }}>
                            {template.name}
                          </Typography>
                          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                            {template.specialty} • {template.type}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {template.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              ) : (
                // Other methods - show form fields
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: selectedMethod?.id === 2 ? '1fr 1fr' : '1fr',
                  gap: 8,
                  flex: 1,
                  height: '100%'
                }}>
                  {/* Left Column - Basic Information */}
                  <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                      Template Information
                    </Typography>
                    <Stack spacing={4}>
                      <TextField
                        fullWidth
                        label="Template Name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="e.g., Cardiology Consultation Note"
                        required
                        size="medium"
                        sx={{ 
                          '& .MuiInputBase-root': { fontSize: '1.2rem', py: 1.5 },
                          '& .MuiInputLabel-root': { fontSize: '1.1rem' }
                        }}
                      />
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Template Description (Optional)"
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        placeholder="Brief description of when to use this template"
                        size="medium"
                        sx={{ 
                          '& .MuiInputBase-root': { fontSize: '1.1rem' },
                          '& .MuiInputLabel-root': { fontSize: '1.1rem' }
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Right Column - Method-specific content */}
                  <Box sx={{ height: '100%' }}>
                    {selectedMethod?.id === 1 && (
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                          Previous Notes to Convert
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={15}
                          label="Paste your previous notes here"
                          value={previousNotes}
                          onChange={(e) => setPreviousNotes(e.target.value)}
                          placeholder="Copy and paste a representative note that you'd like to turn into a template..."
                          size="medium"
                          sx={{ 
                            flex: 1,
                            '& .MuiInputBase-root': { fontSize: '1.1rem', height: '100%' },
                            '& .MuiInputLabel-root': { fontSize: '1.1rem' }
                          }}
                        />
                        <Alert severity="info" sx={{ mt: 3, fontSize: '1.1rem' }}>
                          AI will analyze your note structure and create reusable template sections.
                        </Alert>
                      </Box>
                    )}

                    {selectedMethod?.id === 2 && (
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                          AI Configuration
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={12}
                          label="Clinical Context & Requirements"
                          value={clinicalContext}
                          onChange={(e) => setClinicalContext(e.target.value)}
                          placeholder="Describe your typical patients, common conditions, or specific documentation requirements..."
                          size="medium"
                          sx={{ 
                            flex: 1,
                            '& .MuiInputBase-root': { fontSize: '1.1rem', height: '100%' },
                            '& .MuiInputLabel-root': { fontSize: '1.1rem' }
                          }}
                        />
                        <Alert severity="info" sx={{ mt: 3 }}>
                          <Typography variant="h6">
                            The more specific you are, the better AI can tailor the template to your practice.
                          </Typography>
                        </Alert>
                      </Box>
                    )}

                    {selectedMethod?.id === 4 && (
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                          Import Template Content
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={15}
                          label="Paste existing template content"
                          value={existingTemplateContent}
                          onChange={(e) => setExistingTemplateContent(e.target.value)}
                          placeholder="Copy and paste template content from another system, colleague, or document..."
                          size="medium"
                          sx={{ 
                            flex: 1,
                            '& .MuiInputBase-root': { fontSize: '1.1rem', height: '100%' },
                            '& .MuiInputLabel-root': { fontSize: '1.1rem' }
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
            {selectedMethod?.id === 2 && isProcessing ? (
              <Box sx={{ 
                textAlign: 'center', 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <PsychologyIcon sx={{ fontSize: 120, color: bravoColors.primaryFlat, mb: 4 }} />
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  AI is crafting your template...
                </Typography>
                <LinearProgress sx={{ mb: 4, width: 600, height: 10, borderRadius: 5 }} />
                <Typography variant="h5" color="text.secondary">
                  Analyzing your requirements and generating optimized clinical sections
                </Typography>
              </Box>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <VisibilityIcon sx={{ color: bravoColors.primaryFlat, mr: 3, fontSize: 40 }} />
                  <Typography variant="h3" sx={{ fontWeight: 700, color: bravoColors.primaryFlat }}>
                    Template Preview
                  </Typography>
                </Box>
                
                {/* Template Preview Section */}
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    flex: 1,
                    borderRadius: 4,
                    backgroundColor: alpha(bravoColors.primaryFlat, 0.03),
                    border: `4px solid ${alpha(bravoColors.primaryFlat, 0.15)}`,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ 
                    flex: 1,
                    p: 6, 
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: '3px solid #e0e0e0',
                    m: 3,
                    overflow: 'auto'
                  }}>
                    {selectedMethod?.id === 5 && selectedLibraryTemplate ? (
                      <Typography variant="h6" sx={{ 
                        whiteSpace: 'pre-line', 
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                        lineHeight: 1.8
                      }}>
                        {templateService.generateTemplateContent(selectedLibraryTemplate.type)}
                      </Typography>
                    ) : selectedMethod?.id === 2 && processedContent ? (
                      <Typography variant="h6" sx={{ 
                        whiteSpace: 'pre-line', 
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                        lineHeight: 1.8
                      }}>
                        {processedContent}
                      </Typography>
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100%',
                        flexDirection: 'column'
                      }}>
                        <Typography variant="h4" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                          Template preview will be generated based on your configuration...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>

                {selectedMethod?.id === 2 && processedContent && (
                  <Alert severity="success" sx={{ mt: 3, fontSize: '1.1rem' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ✅ {aiSummary}
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return selectedMethod !== null;
    if (currentStep === 1) {
      if (selectedMethod?.id === 5) {
        return selectedLibraryTemplate !== null;
      }
      const hasBasicInfo = templateName.trim();
      if (selectedMethod?.id === 1) return hasBasicInfo && previousNotes.trim();
      if (selectedMethod?.id === 2) return hasBasicInfo;
      if (selectedMethod?.id === 4) return hasBasicInfo && existingTemplateContent.trim();
      return hasBasicInfo;
    }
    if (currentStep === 2) return !isProcessing;
    return false;
  };

  if (!open) return null;

  return (
    <Fade in={open} timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 6, 
          borderBottom: '3px solid #e0e0e0',
          flexShrink: 0,
          backgroundColor: 'white'
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h2" sx={{ 
                color: bravoColors.primaryFlat, 
                fontWeight: 700,
                mb: 1
              }}>
                Create Clinical Template
              </Typography>
              <Typography variant="h5" color="text.secondary">
                Build efficient, standardized documentation for better patient care
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              size="large"
              sx={{ 
                bgcolor: alpha(bravoColors.primaryFlat, 0.1),
                '&:hover': { bgcolor: alpha(bravoColors.primaryFlat, 0.2) },
                p: 2
              }}
            >
              <CloseIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ 
          flex: 1, 
          p: 6, 
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Horizontal Stepper */}
          <Stepper activeStep={currentStep} sx={{ mb: 6, flexShrink: 0 }}>
            {[0, 1, 2].map((step) => (
              <Step key={step}>
                <StepLabel sx={{ 
                  '& .MuiStepLabel-label': { 
                    fontSize: '1.4rem', 
                    fontWeight: 700 
                  } 
                }}>
                  {getStepTitle(step)}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content - Takes remaining space */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {renderStepContent(currentStep)}
          </Box>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ 
          p: 6, 
          pt: 4, 
          flexShrink: 0, 
          borderTop: '3px solid #e0e0e0',
          backgroundColor: 'white'
        }}>
          <Stack direction="row" spacing={4} justifyContent="space-between" alignItems="center">
            <Box /> {/* Spacer */}
            
            <Stack direction="row" spacing={4}>
              {currentStep > 0 && (
                <Button 
                  onClick={handleBack}
                  variant="outlined"
                  startIcon={<NavigateBeforeIcon />}
                  size="large"
                  sx={{ 
                    borderRadius: 3, 
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    borderWidth: 2
                  }}
                >
                  Back
                </Button>
              )}
              
              {currentStep < 2 ? (
                <Button 
                  onClick={handleNext}
                  variant="contained"
                  disabled={!canProceed()}
                  endIcon={<NavigateNextIcon />}
                  size="large"
                  sx={{ 
                    borderRadius: 3, 
                    px: 8,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 700
                  }}
                >
                  Next Step
                </Button>
              ) : (
                <Stack direction="row" spacing={4}>
                  <Button 
                    onClick={handleCreate}
                    variant="contained"
                    disabled={!canProceed()}
                    endIcon={<CheckIcon />}
                    size="large"
                    sx={{ 
                      borderRadius: 3, 
                      px: 8,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      backgroundColor: bravoColors.secondary,
                      '&:hover': {
                        backgroundColor: bravoColors.primaryFlat
                      }
                    }}
                  >
                    Create Template
                  </Button>
                  <Button 
                    onClick={handleStartNew}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    size="large"
                    sx={{ 
                      borderRadius: 3, 
                      px: 6,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      borderWidth: 2
                    }}
                  >
                    Create Another
                  </Button>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Fade>
  );
};

export default ImprovedTemplateCreationDialog;
