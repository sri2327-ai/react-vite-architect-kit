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
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ 
                color: bravoColors.primaryFlat,
                fontWeight: 600,
                mb: 1
              }}>
                How would you like to create your template?
              </Typography>
              
              <Typography variant="body1" sx={{ 
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                fontSize: '1rem'
              }}>
                Choose the method that best fits your workflow. Each option is designed to save you time and improve your documentation quality.
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: 2,
              flex: 1
            }}>
              {createTemplateOptions.map((option) => (
                <Card 
                  key={option.id}
                  sx={{ 
                    cursor: 'pointer',
                    borderRadius: 2,
                    border: '2px solid transparent',
                    transition: 'all 0.2s ease',
                    height: 'fit-content',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      borderColor: bravoColors.primaryFlat
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleMethodSelect(option)}
                    sx={{ height: '100%', p: 2 }}
                  >
                    <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            background: bravoColors.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(20,49,81,0.2)'
                          }}
                        >
                          {React.cloneElement(option.icon, { sx: { color: 'white', fontSize: 24 } })}
                        </Box>
                        
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip
                            label={option.difficulty}
                            size="small"
                            sx={{
                              backgroundColor: getDifficultyColor(option.difficulty),
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              mb: 0.5
                            }}
                          />
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {option.timeEstimate}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Content */}
                      <Typography variant="h6" gutterBottom sx={{ 
                        fontWeight: 600,
                        color: bravoColors.primaryFlat,
                        mb: 1,
                        fontSize: '1rem'
                      }}>
                        {option.title}
                      </Typography>
                      
                      <Typography variant="body2" sx={{
                        color: 'text.primary',
                        lineHeight: 1.4,
                        mb: 2,
                        flex: 1,
                        fontSize: '0.875rem'
                      }}>
                        {option.description}
                      </Typography>

                      <Box sx={{ 
                        p: 1.5, 
                        backgroundColor: alpha(bravoColors.primaryFlat, 0.05),
                        borderRadius: 1.5,
                        borderLeft: `3px solid ${bravoColors.primaryFlat}`
                      }}>
                        <Typography variant="caption" sx={{ 
                          color: bravoColors.primaryFlat,
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '0.75rem'
                        }}>
                          <HealingIcon sx={{ fontSize: 14 }} />
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
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Method Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              p: 2,
              backgroundColor: alpha(bravoColors.primaryFlat, 0.05),
              borderRadius: 2,
              border: `2px solid ${alpha(bravoColors.primaryFlat, 0.1)}`
            }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  background: bravoColors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                {selectedMethod?.icon && React.cloneElement(selectedMethod.icon, { sx: { color: 'white', fontSize: 24 } })}
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: bravoColors.primaryFlat, mb: 0.5 }}>
                  {selectedMethod?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMethod?.description}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Browse Template Library */}
              {selectedMethod?.id === 5 ? (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Available Templates
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: 2,
                    maxHeight: '60vh',
                    overflow: 'auto'
                  }}>
                    {templateLibrary.map((template) => (
                      <Card 
                        key={template.id}
                        sx={{
                          cursor: 'pointer',
                          border: selectedLibraryTemplate?.id === template.id ? `3px solid ${bravoColors.primaryFlat}` : '2px solid transparent',
                          borderRadius: 2,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: bravoColors.primaryFlat,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }
                        }}
                        onClick={() => handleLibraryTemplateSelect(template)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: bravoColors.primaryFlat }}>
                            {template.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {template.specialty} • {template.type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
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
                  gap: 3,
                  flex: 1,
                  height: '100%'
                }}>
                  {/* Left Column - Basic Information */}
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                      Template Information
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Template Name"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="e.g., Cardiology Consultation Note"
                        required
                        size="small"
                      />
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Template Description (Optional)"
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        placeholder="Brief description of when to use this template"
                        size="small"
                      />
                    </Stack>
                  </Box>

                  {/* Right Column - Method-specific content */}
                  <Box sx={{ height: '100%' }}>
                    {selectedMethod?.id === 1 && (
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                          Previous Notes to Convert
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={10}
                          label="Paste your previous notes here"
                          value={previousNotes}
                          onChange={(e) => setPreviousNotes(e.target.value)}
                          placeholder="Copy and paste a representative note that you'd like to turn into a template..."
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <Alert severity="info" sx={{ mt: 2 }}>
                          AI will analyze your note structure and create reusable template sections.
                        </Alert>
                      </Box>
                    )}

                    {selectedMethod?.id === 2 && (
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                          AI Configuration
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={8}
                          label="Clinical Context & Requirements"
                          value={clinicalContext}
                          onChange={(e) => setClinicalContext(e.target.value)}
                          placeholder="Describe your typical patients, common conditions, or specific documentation requirements..."
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <Alert severity="info" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            The more specific you are, the better AI can tailor the template to your practice.
                          </Typography>
                        </Alert>
                      </Box>
                    )}

                    {selectedMethod?.id === 4 && (
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                          Import Template Content
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={10}
                          label="Paste existing template content"
                          value={existingTemplateContent}
                          onChange={(e) => setExistingTemplateContent(e.target.value)}
                          placeholder="Copy and paste template content from another system, colleague, or document..."
                          size="small"
                          sx={{ flex: 1 }}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {selectedMethod?.id === 2 && isProcessing ? (
              <Box sx={{ 
                textAlign: 'center', 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <PsychologyIcon sx={{ fontSize: 60, color: bravoColors.primaryFlat, mb: 2 }} />
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  AI is crafting your template...
                </Typography>
                <LinearProgress sx={{ mb: 3, width: 400, height: 6, borderRadius: 3 }} />
                <Typography variant="body1" color="text.secondary">
                  Analyzing your requirements and generating optimized clinical sections
                </Typography>
              </Box>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VisibilityIcon sx={{ color: bravoColors.primaryFlat, mr: 2, fontSize: 28 }} />
                  <Typography variant="h4" sx={{ fontWeight: 600, color: bravoColors.primaryFlat }}>
                    Template Preview
                  </Typography>
                </Box>
                
                {/* Template Preview Section */}
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    flex: 1,
                    borderRadius: 2,
                    backgroundColor: alpha(bravoColors.primaryFlat, 0.02),
                    border: `2px solid ${alpha(bravoColors.primaryFlat, 0.1)}`,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ 
                    flex: 1,
                    p: 3, 
                    backgroundColor: 'white',
                    borderRadius: 1.5,
                    border: '1px solid #e0e0e0',
                    m: 2,
                    overflow: 'auto'
                  }}>
                    {selectedMethod?.id === 5 && selectedLibraryTemplate ? (
                      <Typography variant="body2" sx={{ 
                        whiteSpace: 'pre-line', 
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        lineHeight: 1.6
                      }}>
                        {templateService.generateTemplateContent(selectedLibraryTemplate.type)}
                      </Typography>
                    ) : selectedMethod?.id === 2 && processedContent ? (
                      <Typography variant="body2" sx={{ 
                        whiteSpace: 'pre-line', 
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        lineHeight: 1.6
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
                        <Typography variant="h6" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                          Template preview will be generated based on your configuration...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>

                {selectedMethod?.id === 2 && processedContent && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
    <Fade in={open} timeout={200}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'white',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #e0e0e0',
          flexShrink: 0,
          backgroundColor: 'white'
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ 
                color: bravoColors.primaryFlat, 
                fontWeight: 600,
                mb: 0.5
              }}>
                Create Clinical Template
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Build efficient, standardized documentation for better patient care
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              size="medium"
              sx={{ 
                bgcolor: alpha(bravoColors.primaryFlat, 0.1),
                '&:hover': { bgcolor: alpha(bravoColors.primaryFlat, 0.2) }
              }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ 
          flex: 1, 
          p: 2, 
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Horizontal Stepper */}
          <Stepper activeStep={currentStep} sx={{ mb: 3, flexShrink: 0 }}>
            {[0, 1, 2].map((step) => (
              <Step key={step}>
                <StepLabel sx={{ 
                  '& .MuiStepLabel-label': { 
                    fontSize: '0.9rem', 
                    fontWeight: 600 
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
          p: 2, 
          flexShrink: 0, 
          borderTop: '1px solid #e0e0e0',
          backgroundColor: 'white'
        }}>
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Box /> {/* Spacer */}
            
            <Stack direction="row" spacing={2}>
              {currentStep > 0 && (
                <Button 
                  onClick={handleBack}
                  variant="outlined"
                  startIcon={<NavigateBeforeIcon />}
                  size="medium"
                  sx={{ 
                    borderRadius: 2, 
                    px: 3,
                    py: 1
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
                  size="medium"
                  sx={{ 
                    borderRadius: 2, 
                    px: 4,
                    py: 1
                  }}
                >
                  Next Step
                </Button>
              ) : (
                <Stack direction="row" spacing={2}>
                  <Button 
                    onClick={handleCreate}
                    variant="contained"
                    disabled={!canProceed()}
                    endIcon={<CheckIcon />}
                    size="medium"
                    sx={{ 
                      borderRadius: 2, 
                      px: 4,
                      py: 1,
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
                    size="medium"
                    sx={{ 
                      borderRadius: 2, 
                      px: 3,
                      py: 1
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
