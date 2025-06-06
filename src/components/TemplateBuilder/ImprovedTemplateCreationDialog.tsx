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
  IconButton,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  Fade,
  Slide,
  Button
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

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
          <Fade in={currentStep === 0} timeout={300}>
            <Box sx={{ py: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                mb: 3, 
                textAlign: 'center',
                color: bravoColors.primaryFlat,
                fontWeight: 700
              }}>
                How would you like to create your template?
              </Typography>
              
              <Typography variant="body1" sx={{ 
                textAlign: 'center', 
                mb: 4, 
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto'
              }}>
                Choose the method that best fits your workflow. Each option is designed to save you time and improve your documentation quality.
              </Typography>

              {/* Scrollable container for template options */}
              <Box sx={{ 
                maxHeight: '60vh',
                overflowY: 'auto',
                overflowX: 'hidden',
                pr: 1
              }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                  gap: 3,
                  pb: 2
                }}>
                  {createTemplateOptions.map((option) => (
                    <Card 
                      key={option.id}
                      sx={{ 
                        height: 'auto',
                        cursor: 'pointer',
                        borderRadius: 3,
                        border: '2px solid transparent',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                          borderColor: bravoColors.primaryFlat
                        }
                      }}
                    >
                      <CardActionArea 
                        onClick={() => handleMethodSelect(option)}
                        sx={{ height: '100%', p: 3 }}
                      >
                        <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          {/* Header */}
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                            <Box
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 3,
                                background: bravoColors.primary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 20px rgba(20,49,81,0.3)'
                              }}
                            >
                              {React.cloneElement(option.icon, { sx: { color: 'white', fontSize: 28 } })}
                            </Box>
                            
                            <Box sx={{ textAlign: 'right' }}>
                              <Chip
                                label={option.difficulty}
                                size="small"
                                sx={{
                                  backgroundColor: getDifficultyColor(option.difficulty),
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '0.7rem',
                                  mb: 0.5
                                }}
                              />
                              <Typography variant="caption" display="block" color="text.secondary">
                                {option.timeEstimate}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Content */}
                          <Typography variant="h6" gutterBottom sx={{ 
                            fontWeight: 700,
                            color: bravoColors.primaryFlat,
                            mb: 1,
                            fontSize: '1.1rem'
                          }}>
                            {option.title}
                          </Typography>
                          
                          <Typography variant="body2" sx={{
                            color: 'text.primary',
                            lineHeight: 1.5,
                            mb: 2,
                            flex: 1
                          }}>
                            {option.description}
                          </Typography>

                          <Box sx={{ 
                            p: 2, 
                            backgroundColor: alpha(bravoColors.primaryFlat, 0.05),
                            borderRadius: 2,
                            borderLeft: `4px solid ${bravoColors.primaryFlat}`
                          }}>
                            <Typography variant="caption" sx={{ 
                              color: bravoColors.primaryFlat,
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
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
            </Box>
          </Fade>
        );

      case 1:
        return (
          <Slide direction="left" in={currentStep === 1} timeout={300}>
            <Box>
              {/* Method Header */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 4,
                p: 3,
                backgroundColor: alpha(bravoColors.primaryFlat, 0.05),
                borderRadius: 3,
                border: `1px solid ${alpha(bravoColors.primaryFlat, 0.2)}`
              }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
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
                  <Typography variant="h6" sx={{ fontWeight: 700, color: bravoColors.primaryFlat }}>
                    {selectedMethod?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedMethod?.description}
                  </Typography>
                </Box>
              </Box>

              {/* Scrollable content area */}
              <Box sx={{ 
                maxHeight: '55vh',
                overflowY: 'auto',
                pr: 1
              }}>
                {/* Browse Template Library - Just show templates */}
                {selectedMethod?.id === 5 ? (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                      Available Templates
                    </Typography>
                    
                    <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                      {templateLibrary.map((template, index) => (
                        <React.Fragment key={template.id}>
                          <ListItem disablePadding>
                            <ListItemButton 
                              onClick={() => handleLibraryTemplateSelect(template)}
                              selected={selectedLibraryTemplate?.id === template.id}
                              sx={{
                                py: 2,
                                px: 3,
                                '&:hover': {
                                  backgroundColor: bravoColors.highlight.hover
                                },
                                '&.Mui-selected': {
                                  backgroundColor: bravoColors.highlight.selected,
                                  '&:hover': {
                                    backgroundColor: bravoColors.highlight.hover
                                  }
                                }
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontWeight: 600,
                                      color: selectedLibraryTemplate?.id === template.id ? bravoColors.primaryFlat : 'text.primary'
                                    }}
                                  >
                                    {template.name}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="body2" color="text.secondary">
                                    {template.specialty} • {template.type}
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                          {index < templateLibrary.length - 1 && (
                            <Box sx={{ px: 3 }}>
                              <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />
                            </Box>
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                ) : (
                  // Other methods - show simplified form fields
                  <Stack spacing={3}>
                    {/* Basic Information */}
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Template Information
                      </Typography>
                      <Stack spacing={2}>
                        <TextField
                          fullWidth
                          label="Template Name *"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          placeholder="e.g., Cardiology Consultation Note"
                        />
                      </Stack>
                    </Box>

                    {/* Method-specific content */}
                    {selectedMethod?.id === 1 && (
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          Previous Notes to Convert
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={6}
                          label="Paste your previous notes here"
                          value={previousNotes}
                          onChange={(e) => setPreviousNotes(e.target.value)}
                          placeholder="Copy and paste a representative note that you'd like to turn into a template..."
                        />
                        <Alert severity="info" sx={{ mt: 1 }}>
                          AI will analyze your note structure and create reusable template sections.
                        </Alert>
                      </Box>
                    )}

                    {selectedMethod?.id === 2 && (
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          AI Configuration
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Clinical Context & Requirements"
                          value={clinicalContext}
                          onChange={(e) => setClinicalContext(e.target.value)}
                          placeholder="Describe your typical patients, common conditions, or specific documentation requirements..."
                        />
                        <Alert severity="info" sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            The more specific you are, the better AI can tailor the template to your practice.
                          </Typography>
                        </Alert>
                      </Box>
                    )}

                    {selectedMethod?.id === 4 && (
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          Import Template Content
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={8}
                          label="Paste existing template content"
                          value={existingTemplateContent}
                          onChange={(e) => setExistingTemplateContent(e.target.value)}
                          placeholder="Copy and paste template content from another system, colleague, or document..."
                        />
                      </Box>
                    )}
                  </Stack>
                )}
              </Box>
            </Box>
          </Slide>
        );

      case 2:
        return (
          <Slide direction="left" in={currentStep === 2} timeout={300}>
            <Box>
              {selectedMethod?.id === 2 && isProcessing ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <PsychologyIcon sx={{ fontSize: 64, color: bravoColors.primaryFlat, mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    AI is crafting your template...
                  </Typography>
                  <LinearProgress sx={{ mb: 2, maxWidth: 400, mx: 'auto' }} />
                  <Typography variant="body2" color="text.secondary">
                    Analyzing your requirements and generating optimized clinical sections
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  maxHeight: '60vh',
                  overflowY: 'auto',
                  pr: 1
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <VisibilityIcon sx={{ color: bravoColors.primaryFlat, mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Template Preview
                    </Typography>
                  </Box>
                  
                  {/* Template Preview Section */}
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 3, 
                      mb: 3,
                      borderRadius: 3,
                      backgroundColor: alpha(bravoColors.primaryFlat, 0.02),
                      border: `2px solid ${alpha(bravoColors.primaryFlat, 0.1)}`
                    }}
                  >
                    <Box sx={{ 
                      p: 3, 
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      maxHeight: 400,
                      overflow: 'auto'
                    }}>
                      {selectedMethod?.id === 5 && selectedLibraryTemplate ? (
                        <Typography variant="body2" sx={{ 
                          whiteSpace: 'pre-line', 
                          fontFamily: 'monospace',
                          fontSize: '0.875rem'
                        }}>
                          {templateService.generateTemplateContent(selectedLibraryTemplate.type)}
                        </Typography>
                      ) : selectedMethod?.id === 2 && processedContent ? (
                        <Typography variant="body2" sx={{ 
                          whiteSpace: 'pre-line', 
                          fontFamily: 'monospace',
                          fontSize: '0.875rem'
                        }}>
                          {processedContent}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          Template preview will be generated based on your configuration...
                        </Typography>
                      )}
                    </Box>
                  </Paper>

                  {selectedMethod?.id === 2 && processedContent && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ✅ {aiSummary}
                      </Typography>
                    </Alert>
                  )}
                </Box>
              )}
            </Box>
          </Slide>
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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-[90vw] max-w-[1200px] p-0 overflow-hidden"
      >
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <SheetHeader className="flex-shrink-0 p-6 border-b">
            <Box display="flex" alignItems="center" justifyContent="between">
              <Box>
                <SheetTitle>
                  <Typography variant="h4" sx={{ 
                    color: bravoColors.primaryFlat, 
                    fontWeight: 700,
                    mb: 0.5
                  }}>
                    Create Clinical Template
                  </Typography>
                </SheetTitle>
                <SheetDescription>
                  <Typography variant="body1" color="text.secondary">
                    Build efficient, standardized documentation for better patient care
                  </Typography>
                </SheetDescription>
              </Box>
            </Box>
          </SheetHeader>

          {/* Content */}
          <Box sx={{ 
            flex: 1, 
            p: 4, 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Horizontal Stepper */}
            <Stepper activeStep={currentStep} sx={{ mt: 2, mb: 4, flexShrink: 0 }}>
              {[0, 1, 2].map((step) => (
                <Step key={step}>
                  <StepLabel sx={{ 
                    '& .MuiStepLabel-label': { 
                      fontSize: '1rem', 
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
          <Box sx={{ p: 4, pt: 2, gap: 2, flexShrink: 0, borderTop: '1px solid #e0e0e0' }}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button 
                onClick={handleClose} 
                variant="outlined"
                sx={{ 
                  borderRadius: 2, 
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Close
              </Button>
              
              <Stack direction="row" spacing={2}>
                {currentStep > 0 && (
                  <Button 
                    onClick={handleBack}
                    variant="outlined"
                    startIcon={<NavigateBeforeIcon />}
                    sx={{ 
                      borderRadius: 2, 
                      px: 3,
                      textTransform: 'none',
                      fontWeight: 600
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
                    sx={{ 
                      borderRadius: 2, 
                      px: 4,
                      textTransform: 'none',
                      fontWeight: 600
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
                      sx={{ 
                        borderRadius: 2, 
                        px: 4,
                        textTransform: 'none',
                        fontWeight: 600,
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
                      sx={{ 
                        borderRadius: 2, 
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 600
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
      </SheetContent>
    </Sheet>
  );
};

export default ImprovedTemplateCreationDialog;
