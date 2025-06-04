import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  Alert,
  LinearProgress,
  Chip,
  IconButton
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
  Check as CheckIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import { templateService } from '@/services/templateService';

interface TemplateCreationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateTemplate: (templateData: any) => void;
}

interface CreateTemplateOption {
  id: number;
  title: string;
  description: string;
  icon: React.ReactElement;
}

const createTemplateOptions: CreateTemplateOption[] = [
  {
    id: 1,
    title: 'Copy Previous Notes',
    description: "Reuse the last note you copied.",
    icon: <ContentCopyIcon sx={{ color: 'white', fontSize: 24 }} />
  },
  {
    id: 2,
    title: 'Generate Template',
    description: "AI-assisted template creation with summary.",
    icon: <AutoFixHighIcon sx={{ color: 'white', fontSize: 24 }} />
  },
  {
    id: 3,
    title: 'Start from Scratch',
    description: "Begin with a blank slate.",
    icon: <EditNoteIcon sx={{ color: 'white', fontSize: 24 }} />
  },
  {
    id: 4,
    title: 'Use Existing Template',
    description: "Copy-paste existing template.",
    icon: <DescriptionIcon sx={{ color: 'white', fontSize: 24 }} />
  },
  {
    id: 5,
    title: 'Template Library',
    description: "Access and manage all your templates.",
    icon: <LibraryBooksIcon sx={{ color: 'white', fontSize: 24 }} />
  }
];

const TemplateCreationDialog: React.FC<TemplateCreationDialogProps> = ({
  open,
  onClose,
  onCreateTemplate
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<CreateTemplateOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [previousNotes, setPreviousNotes] = useState('');
  const [existingTemplateContent, setExistingTemplateContent] = useState('');
  const [processedContent, setProcessedContent] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [selectedTemplateType, setSelectedTemplateType] = useState('');

  const availableTemplateTypes = templateService.getTemplateTypes();

  const handleMethodSelect = (method: CreateTemplateOption) => {
    setSelectedMethod(method);
    
    if (method.id === 5) {
      const libraryTemplates = [
        { title: 'SOAP Note', sections: [{ name: 'Chief Complaint' }, { name: 'History' }, { name: 'Assessment' }, { name: 'Plan' }] },
        { title: 'Progress Note', sections: [{ name: 'Subjective' }, { name: 'Objective' }, { name: 'Plan' }] }
      ];
      templateService.registerLibraryTemplates(libraryTemplates);
    }
    
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedMethod?.id === 2) {
      setIsProcessing(true);
      setTimeout(() => {
        const mapping = templateService.getEhrFieldMappings(selectedTemplateType || 'SOAP Note');
        const generatedContent = mapping 
          ? `AI-generated template for ${selectedTemplateType}\n\n${mapping.ehrFields.map(field => `${field}:\n[AI will fill this section]\n`).join('\n')}`
          : `AI-generated template based on: ${previousNotes}\n\nChief Complaint:\n[AI will fill this based on your notes]\n\nHistory of Present Illness:\n[AI will extract relevant history]\n\nAssessment and Plan:\n[AI will suggest assessment and plan]`;
        
        setProcessedContent(generatedContent);
        setAiSummary(`AI has analyzed your input and created a structured template with ${mapping?.ehrFields.length || 'common'} medical documentation sections.`);
        setIsProcessing(false);
        setCurrentStep(2);
      }, 2000);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleCreate = () => {
    const templateData = {
      name: templateName,
      description: templateDescription,
      method: selectedMethod?.title,
      content: selectedMethod?.id === 2 ? processedContent : existingTemplateContent,
      previousNotes: selectedMethod?.id === 1 ? previousNotes : undefined,
      aiSummary: selectedMethod?.id === 2 ? aiSummary : undefined,
      templateType: selectedTemplateType,
      ehrFields: selectedTemplateType ? templateService.getEhrFieldMappings(selectedTemplateType)?.ehrFields : undefined
    };
    
    onCreateTemplate(templateData);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedMethod(null);
    setIsProcessing(false);
    setTemplateName('');
    setTemplateDescription('');
    setPreviousNotes('');
    setExistingTemplateContent('');
    setProcessedContent('');
    setAiSummary('');
    setSelectedTemplateType('');
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ 
              mb: 4, 
              textAlign: 'center',
              color: bravoColors.primaryFlat,
              fontWeight: 600
            }}>
              Choose how you'd like to create your template
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: 3,
              maxWidth: '900px',
              mx: 'auto'
            }}>
              {createTemplateOptions.map((option) => (
                <Card 
                  key={option.id}
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    borderRadius: 3,
                    border: '2px solid transparent',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                      borderColor: bravoColors.primaryFlat
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleMethodSelect(option)}
                    sx={{ height: '100%', p: 3 }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 0 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 3,
                          background: bravoColors.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                          mx: 'auto',
                          boxShadow: '0 4px 12px rgba(20,49,81,0.3)'
                        }}
                      >
                        {React.cloneElement(option.icon, { sx: { color: 'white', fontSize: 28 } })}
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ 
                        fontWeight: 600,
                        color: bravoColors.primaryFlat,
                        mb: 1
                      }}>
                        {option.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        lineHeight: 1.5,
                        px: 1
                      }}>
                        {option.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Chip 
                icon={selectedMethod?.icon} 
                label={selectedMethod?.title || ''}
                color="primary"
                sx={{ mr: 2 }}
              />
              <Typography variant="h6">
                {selectedMethod?.description}
              </Typography>
            </Box>

            {selectedMethod?.id === 1 && (
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Paste your previous notes here"
                value={previousNotes}
                onChange={(e) => setPreviousNotes(e.target.value)}
                placeholder="Copy and paste the notes you want to convert into a template..."
                sx={{ mb: 2 }}
              />
            )}

            {selectedMethod?.id === 2 && (
              <Box>
                <TextField
                  fullWidth
                  select
                  label="Template Type"
                  value={selectedTemplateType}
                  onChange={(e) => setSelectedTemplateType(e.target.value)}
                  sx={{ mb: 2 }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select Template Type</option>
                  {availableTemplateTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Describe what kind of template you want"
                  value={previousNotes}
                  onChange={(e) => setPreviousNotes(e.target.value)}
                  placeholder="E.g., 'Create a cardiology consultation template with focus on chest pain evaluation'"
                  sx={{ mb: 2 }}
                />
                <Alert severity="info">
                  AI will analyze your description and create a structured template with relevant medical sections using the selected template type.
                </Alert>
              </Box>
            )}

            {selectedMethod?.id === 3 && (
              <Alert severity="info">
                You'll start with a blank template and can add sections manually in the editor.
              </Alert>
            )}

            {selectedMethod?.id === 4 && (
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Paste existing template content"
                value={existingTemplateContent}
                onChange={(e) => setExistingTemplateContent(e.target.value)}
                placeholder="Copy and paste template content from another source..."
                sx={{ mb: 2 }}
              />
            )}

            {selectedMethod?.id === 5 && (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Available template types from library:
                </Alert>
                <Box sx={{ mb: 2 }}>
                  {availableTemplateTypes.map((type) => {
                    const mapping = templateService.getEhrFieldMappings(type);
                    return (
                      <Card key={type} sx={{ mb: 1, p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Fields: {mapping?.ehrFields.join(', ') || 'Standard fields'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Workflow Steps: {mapping?.workflowSteps.length || 0}
                        </Typography>
                      </Card>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            {selectedMethod?.id === 2 && isProcessing ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  AI is generating your template...
                </Typography>
                <LinearProgress sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  This may take a few moments while we analyze your input and create the optimal template structure.
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Review & Finalize Template
                </Typography>
                
                <TextField
                  fullWidth
                  label="Template Name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  sx={{ mb: 3 }}
                  placeholder="Enter a descriptive name for your template"
                />

                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                  Template Content:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  value={selectedMethod?.id === 2 ? processedContent : existingTemplateContent || previousNotes || 'New template content will be generated based on your selections.'}
                  variant="outlined"
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f9f9f9',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      lineHeight: 1.6
                    }
                  }}
                  InputProps={{
                    readOnly: true
                  }}
                />

                {selectedTemplateType && (
                  <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Template Type: {selectedTemplateType}
                    </Typography>
                    {templateService.getEhrFieldMappings(selectedTemplateType) && (
                      <Typography variant="body2" color="text.secondary">
                        EHR Fields: {templateService.getEhrFieldMappings(selectedTemplateType)?.ehrFields.join(', ')}
                      </Typography>
                    )}
                  </Box>
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
      if (selectedMethod?.id === 1) return previousNotes.trim().length > 0;
      if (selectedMethod?.id === 2) return previousNotes.trim().length > 0;
      if (selectedMethod?.id === 4) return existingTemplateContent.trim().length > 0;
      return true;
    }
    if (currentStep === 2) return templateName.trim().length > 0 && !isProcessing;
    return false;
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
          minHeight: 600,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" sx={{ 
              color: bravoColors.primaryFlat, 
              fontWeight: 700,
              mb: 0.5
            }}>
              Create New Template
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Build powerful templates for streamlined documentation
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

      <DialogContent sx={{ minHeight: 450, px: 4 }}>
        <Stepper activeStep={currentStep} orientation="vertical" sx={{ mt: 2 }}>
          <Step>
            <StepLabel sx={{ 
              '& .MuiStepLabel-label': { 
                fontSize: '1.1rem', 
                fontWeight: 600 
              } 
            }}>
              Choose Creation Method
            </StepLabel>
            <StepContent>
              {renderStepContent(0)}
            </StepContent>
          </Step>
          
          <Step>
            <StepLabel sx={{ 
              '& .MuiStepLabel-label': { 
                fontSize: '1.1rem', 
                fontWeight: 600 
              } 
            }}>
              Configure Template
            </StepLabel>
            <StepContent>
              {renderStepContent(1)}
            </StepContent>
          </Step>
          
          <Step>
            <StepLabel sx={{ 
              '& .MuiStepLabel-label': { 
                fontSize: '1.1rem', 
                fontWeight: 600 
              } 
            }}>
              Review & Finalize
            </StepLabel>
            <StepContent>
              {renderStepContent(2)}
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Cancel
        </Button>
        
        {currentStep > 0 && (
          <Button 
            onClick={handleBack}
            variant="outlined"
            startIcon={<NavigateBeforeIcon />}
            sx={{ borderRadius: 2, px: 3 }}
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
            sx={{ borderRadius: 2, px: 4 }}
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleCreate}
            variant="contained"
            disabled={!canProceed()}
            endIcon={<CheckIcon />}
            sx={{ borderRadius: 2, px: 4 }}
          >
            Create Template
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TemplateCreationDialog;
