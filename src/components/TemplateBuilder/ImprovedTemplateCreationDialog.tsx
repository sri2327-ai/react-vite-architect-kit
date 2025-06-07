
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
import { useResponsive } from '@/hooks/useResponsive';

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
  const { isMobile, isTablet } = useResponsive();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<CreateTemplateOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLibraryTemplate, setSelectedLibraryTemplate] = useState<any>(null);
  
  // Form states
  const [templateName, setTemplateName] = useState('');
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
    if (currentStep === 1) {
      // Custom Template Builder - go directly to final step with basic template
      if (selectedMethod?.id === 3) {
        setCurrentStep(2);
        return;
      }
      
      // AI processing for method 2
      if (selectedMethod?.id === 2) {
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
        setCurrentStep(2);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleCreate = () => {
    let templateData;

    // Method 1: Smart Copy from Previous
    if (selectedMethod?.id === 1) {
      templateData = {
        name: templateName || 'Template from Previous Notes',
        method: selectedMethod.title,
        content: previousNotes,
        redirectToEditor: true
      };
    }
    // Method 2: AI-Assisted Creation  
    else if (selectedMethod?.id === 2) {
      templateData = {
        name: templateName || 'AI Generated Template',
        method: selectedMethod.title,
        content: processedContent,
        aiSummary: aiSummary,
        redirectToEditor: true
      };
    }
    // Method 3: Custom Template Builder
    else if (selectedMethod?.id === 3) {
      templateData = {
        name: templateName || 'Custom Template',
        method: selectedMethod.title,
        content: '', // Start with empty content for custom builder
        redirectToEditor: true
      };
    }
    // Method 4: Import Existing Template
    else if (selectedMethod?.id === 4) {
      templateData = {
        name: templateName || 'Imported Template',
        method: selectedMethod.title,
        content: existingTemplateContent,
        redirectToEditor: true
      };
    }
    // Method 5: Browse Template Library
    else if (selectedMethod?.id === 5 && selectedLibraryTemplate) {
      templateData = {
        name: selectedLibraryTemplate.name,
        specialty: selectedLibraryTemplate.specialty,
        templateType: selectedLibraryTemplate.type,
        content: templateService.generateTemplateContent(selectedLibraryTemplate.type),
        method: selectedMethod.title,
        redirectToEditor: true
      };
    }
    
    // Call the parent callback to create template and redirect to editor
    onCreateTemplate(templateData);
    handleStartNew();
    onClose();
  };

  const handleStartNew = () => {
    // Reset form but keep overlay open for creating another template
    setCurrentStep(0);
    setSelectedMethod(null);
    setSelectedLibraryTemplate(null);
    setIsProcessing(false);
    setTemplateName('');
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
      case 1: 
        if (selectedMethod?.id === 5) return 'Select Template';
        if (selectedMethod?.id === 3) return 'Template Name';
        return 'Configure Template Details';
      case 2: return 'Template Preview';
      default: return '';
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            overflow: 'auto',
            p: { xs: 1, sm: 2, md: 3 }
          }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3, md: 4 } }}>
              <Typography variant="h5" sx={{ 
                color: bravoColors.primaryFlat,
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
              }}>
                How would you like to create your template?
              </Typography>
              
              <Typography variant="body2" sx={{ 
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                lineHeight: 1.4,
                px: { xs: 1, sm: 0 }
              }}>
                Choose the method that best fits your workflow and saves you time.
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: { xs: 1.5, sm: 2, md: 3 },
              maxWidth: '1200px',
              mx: 'auto',
              width: '100%'
            }}>
              {createTemplateOptions.map((option) => (
                <Card 
                  key={option.id}
                  sx={{ 
                    cursor: 'pointer',
                    borderRadius: { xs: 1.5, sm: 2 },
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease',
                    height: 'auto',
                    minHeight: { xs: '180px', sm: '200px', md: '220px' },
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: { xs: 'none', sm: 'translateY(-2px)' },
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      borderColor: bravoColors.primaryFlat
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleMethodSelect(option)}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <CardContent sx={{ 
                      p: { xs: 1.5, sm: 2, md: 2.5 }, 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: { xs: 1, sm: 1.5 },
                      flex: 1
                    }}>
                      {/* Header Row */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        justifyContent: 'space-between',
                        gap: 1,
                        mb: { xs: 0.5, sm: 1 }
                      }}>
                        <Box
                          sx={{
                            width: { xs: 36, sm: 40, md: 44 },
                            height: { xs: 36, sm: 40, md: 44 },
                            borderRadius: { xs: 1.5, sm: 2 },
                            background: bravoColors.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(20,49,81,0.15)'
                          }}
                        >
                          {React.cloneElement(option.icon, { 
                            sx: { 
                              color: 'white', 
                              fontSize: { xs: 18, sm: 20, md: 22 } 
                            } 
                          })}
                        </Box>
                        
                        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                          <Chip
                            label={option.difficulty}
                            size="small"
                            sx={{
                              backgroundColor: getDifficultyColor(option.difficulty),
                              color: 'white',
                              fontWeight: 600,
                              fontSize: { xs: '0.65rem', sm: '0.7rem' },
                              height: { xs: 18, sm: 20 },
                              mb: 0.5
                            }}
                          />
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ 
                            fontWeight: 500,
                            fontSize: { xs: '0.65rem', sm: '0.7rem' }
                          }}>
                            {option.timeEstimate}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Title */}
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: bravoColors.primaryFlat,
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        lineHeight: 1.2,
                        mb: { xs: 0.5, sm: 1 }
                      }}>
                        {option.title}
                      </Typography>
                      
                      {/* Description */}
                      <Typography variant="body2" sx={{
                        color: 'text.primary',
                        lineHeight: 1.4,
                        fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                        flex: 1
                      }}>
                        {option.description}
                      </Typography>

                      {/* Clinical Context */}
                      <Box sx={{ 
                        p: { xs: 0.75, sm: 1, md: 1.25 }, 
                        backgroundColor: alpha(bravoColors.primaryFlat, 0.04),
                        borderRadius: { xs: 1, sm: 1.5 },
                        borderLeft: `2px solid ${bravoColors.primaryFlat}`,
                        mt: 'auto'
                      }}>
                        <Typography variant="caption" sx={{ 
                          color: bravoColors.primaryFlat,
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                          lineHeight: 1.3
                        }}>
                          <HealingIcon sx={{ fontSize: { xs: 8, sm: 10, md: 12 } }} />
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
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            overflow: 'auto',
            p: { xs: 1, sm: 2 }
          }}>
            {/* Method Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: { xs: 2, sm: 3 },
              p: { xs: 1.5, sm: 2 },
              backgroundColor: alpha(bravoColors.primaryFlat, 0.05),
              borderRadius: { xs: 1.5, sm: 2 },
              border: `2px solid ${alpha(bravoColors.primaryFlat, 0.1)}`
            }}>
              <Box
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  borderRadius: { xs: 1, sm: 1.5 },
                  background: bravoColors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: { xs: 1.5, sm: 2 }
                }}
              >
                {selectedMethod?.icon && React.cloneElement(selectedMethod.icon, { 
                  sx: { color: 'white', fontSize: { xs: 16, sm: 20 } } 
                })}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: bravoColors.primaryFlat, 
                  mb: 0.5,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}>
                  {selectedMethod?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  fontSize: { xs: '0.75rem', sm: '0.8rem' }
                }}>
                  {selectedMethod?.description}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'auto'
            }}>
              {/* Custom Template Builder - Just ask for name */}
              {selectedMethod?.id === 3 ? (
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 2, sm: 3 },
                  flex: 1,
                  justifyContent: 'center',
                  maxWidth: 500,
                  mx: 'auto',
                  px: { xs: 1, sm: 0 }
                }}>
                  <Box sx={{ textAlign: 'center', mb: { xs: 1, sm: 2 } }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      color: bravoColors.primaryFlat,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}>
                      Name Your Template
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}>
                      Give your custom template a descriptive name to help you find it later.
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Template Name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g., Cardiology Consultation Template"
                    required
                    size="small"
                    autoFocus
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        py: { xs: 0.5, sm: 1 }
                      }
                    }}
                  />
                  
                  <Alert severity="info" sx={{ mt: { xs: 1, sm: 2 } }}>
                    <Typography variant="body2" sx={{
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }}>
                      You'll be taken directly to the template editor where you can add sections and customize your template using our building blocks.
                    </Typography>
                  </Alert>
                </Box>
              ) : selectedMethod?.id === 5 ? (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600, 
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}>
                    Available Templates
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)'
                    },
                    gap: { xs: 1.5, sm: 2 },
                    maxHeight: { xs: '40vh', sm: '50vh' },
                    overflow: 'auto'
                  }}>
                    {templateLibrary.map((template) => (
                      <Card 
                        key={template.id}
                        sx={{
                          cursor: 'pointer',
                          border: selectedLibraryTemplate?.id === template.id ? `3px solid ${bravoColors.primaryFlat}` : '2px solid transparent',
                          borderRadius: { xs: 1.5, sm: 2 },
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: bravoColors.primaryFlat,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }
                        }}
                        onClick={() => handleLibraryTemplateSelect(template)}
                      >
                        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            mb: 1, 
                            color: bravoColors.primaryFlat,
                            fontSize: { xs: '0.85rem', sm: '0.9rem' }
                          }}>
                            {template.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            mb: 1,
                            fontSize: { xs: '0.75rem', sm: '0.8rem' }
                          }}>
                            {template.specialty} • {template.type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{
                            fontSize: { xs: '0.75rem', sm: '0.8rem' }
                          }}>
                            {template.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 2, sm: 3 },
                  flex: 1,
                  height: '100%'
                }}>
                  {/* Basic Information */}
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ 
                      fontWeight: 600, 
                      mb: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}>
                      Template Information
                    </Typography>
                    <TextField
                      fullWidth
                      label="Template Name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="e.g., Cardiology Consultation Note"
                      required
                      size="small"
                    />
                  </Box>

                  {/* Method-specific content */}
                  <Box sx={{ 
                    flex: 1,
                    display: 'flex', 
                    flexDirection: 'column' 
                  }}>
                    {selectedMethod?.id === 1 && (
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom sx={{ 
                          fontWeight: 600, 
                          mb: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}>
                          Previous Notes to Convert
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={isMobile ? 6 : 8}
                          label="Paste your previous notes here"
                          value={previousNotes}
                          onChange={(e) => setPreviousNotes(e.target.value)}
                          placeholder="Copy and paste a representative note that you'd like to turn into a template..."
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <Alert severity="info" sx={{ mt: { xs: 1.5, sm: 2 } }}>
                          <Typography variant="body2" sx={{
                            fontSize: { xs: '0.75rem', sm: '0.8rem' }
                          }}>
                            AI will analyze your note structure and create reusable template sections.
                          </Typography>
                        </Alert>
                      </Box>
                    )}

                    {selectedMethod?.id === 2 && (
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom sx={{ 
                          fontWeight: 600, 
                          mb: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}>
                          AI Configuration
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={isMobile ? 5 : 6}
                          label="Clinical Context & Requirements"
                          value={clinicalContext}
                          onChange={(e) => setClinicalContext(e.target.value)}
                          placeholder="Describe your typical patients, common conditions, or specific documentation requirements..."
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <Alert severity="info" sx={{ mt: { xs: 1.5, sm: 2 } }}>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                            The more specific you are, the better AI can tailor the template to your practice.
                          </Typography>
                        </Alert>
                      </Box>
                    )}

                    {selectedMethod?.id === 4 && (
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom sx={{ 
                          fontWeight: 600, 
                          mb: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}>
                          Import Template Content
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={isMobile ? 6 : 8}
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
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            overflow: 'auto',
            p: { xs: 1, sm: 2 }
          }}>
            {selectedMethod?.id === 2 && isProcessing ? (
              <Box sx={{ 
                textAlign: 'center', 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center',
                py: { xs: 3, sm: 4 }
              }}>
                <PsychologyIcon sx={{ 
                  fontSize: { xs: 40, sm: 48 }, 
                  color: bravoColors.primaryFlat, 
                  mb: { xs: 1.5, sm: 2 } 
                }} />
                <Typography variant="h5" gutterBottom sx={{ 
                  fontWeight: 600, 
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}>
                  AI is crafting your template...
                </Typography>
                <LinearProgress sx={{ 
                  mb: { xs: 2, sm: 3 }, 
                  width: { xs: 240, sm: 280 }, 
                  height: 6, 
                  borderRadius: 3 
                }} />
                <Typography variant="body1" color="text.secondary" sx={{
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  px: { xs: 2, sm: 0 },
                  textAlign: 'center'
                }}>
                  Analyzing your requirements and generating optimized clinical sections
                </Typography>
              </Box>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1.5, sm: 2 } }}>
                  <VisibilityIcon sx={{ 
                    color: bravoColors.primaryFlat, 
                    mr: { xs: 1.5, sm: 2 }, 
                    fontSize: { xs: 20, sm: 24 } 
                  }} />
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600, 
                    color: bravoColors.primaryFlat,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    Ready to Create Template
                  </Typography>
                </Box>
                
                <Alert severity="success" sx={{ mb: { xs: 2, sm: 3 } }}>
                  <Typography variant="body1" sx={{ 
                    fontWeight: 500,
                    fontSize: { xs: '0.8rem', sm: '0.9rem' }
                  }}>
                    ✅ Template configured successfully! Click "Create Template" to open the Template Editor where you can customize sections, add content, and finalize your template.
                  </Typography>
                </Alert>

                {/* Template Summary */}
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: { xs: 2, sm: 3 },
                    borderRadius: { xs: 1.5, sm: 2 },
                    backgroundColor: alpha(bravoColors.primaryFlat, 0.02),
                    border: `2px solid ${alpha(bravoColors.primaryFlat, 0.1)}`
                  }}
                >
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    mb: { xs: 1.5, sm: 2 },
                    color: bravoColors.primaryFlat,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}>
                    Template Summary
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gap: { xs: 1.5, sm: 2 } }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{
                        fontSize: { xs: '0.75rem', sm: '0.8rem' }
                      }}>
                        Template Name:
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 500,
                        fontSize: { xs: '0.85rem', sm: '0.9rem' }
                      }}>
                        {selectedMethod?.id === 5 && selectedLibraryTemplate 
                          ? selectedLibraryTemplate.name
                          : templateName || 'New Template'
                        }
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{
                        fontSize: { xs: '0.75rem', sm: '0.8rem' }
                      }}>
                        Creation Method:
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 500,
                        fontSize: { xs: '0.85rem', sm: '0.9rem' }
                      }}>
                        {selectedMethod?.title}
                      </Typography>
                    </Box>

                    {selectedMethod?.id === 5 && selectedLibraryTemplate && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{
                          fontSize: { xs: '0.75rem', sm: '0.8rem' }
                        }}>
                          Template Type:
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          fontWeight: 500,
                          fontSize: { xs: '0.85rem', sm: '0.9rem' }
                        }}>
                          {selectedLibraryTemplate.specialty} • {selectedLibraryTemplate.type}
                        </Typography>
                      </Box>
                    )}

                    {selectedMethod?.id === 2 && aiSummary && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{
                          fontSize: { xs: '0.75rem', sm: '0.8rem' }
                        }}>
                          AI Analysis:
                        </Typography>
                        <Typography variant="body2" sx={{
                          fontSize: { xs: '0.8rem', sm: '0.85rem' }
                        }}>
                          {aiSummary}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
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
      if (selectedMethod?.id === 3) {
        return templateName.trim().length > 0;
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
          p: { xs: 1.5, sm: 2 }, 
          borderBottom: '1px solid #e0e0e0',
          flexShrink: 0,
          backgroundColor: 'white'
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h5" sx={{ 
                color: bravoColors.primaryFlat, 
                fontWeight: 600,
                mb: 0.5,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}>
                Create Clinical Template
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                display: { xs: 'none', sm: 'block' }
              }}>
                Build efficient, standardized documentation for better patient care
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              size={isMobile ? 'small' : 'medium'}
              sx={{ 
                bgcolor: alpha(bravoColors.primaryFlat, 0.1),
                '&:hover': { bgcolor: alpha(bravoColors.primaryFlat, 0.2) }
              }}
            >
              <CloseIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0
        }}>
          {/* Horizontal Stepper */}
          <Stepper activeStep={currentStep} sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            flexShrink: 0,
            '& .MuiStep-root': {
              px: { xs: 0.5, sm: 1 }
            }
          }}>
            {[0, 1, 2].map((step) => (
              <Step key={step}>
                <StepLabel sx={{ 
                  '& .MuiStepLabel-label': { 
                    fontSize: { xs: '0.7rem', sm: '0.8rem' }, 
                    fontWeight: 600 
                  } 
                }}>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {getStepTitle(step)}
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content - Takes remaining space */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}>
            {renderStepContent(currentStep)}
          </Box>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          flexShrink: 0, 
          borderTop: '1px solid #e0e0e0',
          backgroundColor: 'white'
        }}>
          <Stack 
            direction="row" 
            spacing={{ xs: 1, sm: 2 }} 
            justifyContent="space-between" 
            alignItems="center"
          >
            <Box /> {/* Spacer */}
            
            <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
              {currentStep > 0 && (
                <Button 
                  onClick={handleBack}
                  variant="outlined"
                  startIcon={!isMobile && <NavigateBeforeIcon />}
                  size="small"
                  sx={{ 
                    borderRadius: { xs: 1.5, sm: 2 }, 
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.75, sm: 1 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
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
                  endIcon={!isMobile && <NavigateNextIcon />}
                  size="small"
                  sx={{ 
                    borderRadius: { xs: 1.5, sm: 2 }, 
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.75, sm: 1 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  Next{isMobile ? '' : ' Step'}
                </Button>
              ) : (
                <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
                  <Button 
                    onClick={handleCreate}
                    variant="contained"
                    disabled={!canProceed()}
                    endIcon={!isMobile && <CheckIcon />}
                    size="small"
                    sx={{ 
                      borderRadius: { xs: 1.5, sm: 2 }, 
                      px: { xs: 2, sm: 3 },
                      py: { xs: 0.75, sm: 1 },
                      backgroundColor: bravoColors.secondary,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      '&:hover': {
                        backgroundColor: bravoColors.primaryFlat
                      }
                    }}
                  >
                    Create{isMobile ? '' : ' Template'}
                  </Button>
                  <Button 
                    onClick={handleStartNew}
                    variant="outlined"
                    startIcon={!isMobile && <AddIcon />}
                    size="small"
                    sx={{ 
                      borderRadius: { xs: 1.5, sm: 2 }, 
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 0.75, sm: 1 },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      display: { xs: 'none', sm: 'flex' }
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
