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
  icon: React.ReactNode;
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

  // Get available template types from templateService
  const availableTemplateTypes = templateService.getTemplateTypes();

  const handleMethodSelect = (method: CreateTemplateOption) => {
    setSelectedMethod(method);
    
    // If selecting template library, get library templates
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
      // AI Generation with template service integration
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
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Choose how you'd like to create your template:
            </Typography>
            <Grid container spacing={2}>
              {createTemplateOptions.map((option) => (
                <Grid item xs={12} sm={6} key={option.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    <CardActionArea 
                      onClick={() => handleMethodSelect(option)}
                      sx={{ height: '100%', p: 2 }}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            backgroundColor: bravoColors.primaryFlat,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            mx: 'auto'
                          }}
                        >
                          {option.icon}
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          {option.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Chip 
                icon={selectedMethod?.icon} 
                label={<span>{selectedMethod?.title || ''}</span>}
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
                  Template Details
                </Typography>
                
                <TextField
                  fullWidth
                  label="Template Name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="Enter a descriptive name for your template"
                />
                
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Template Description (Optional)"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="Brief description of when to use this template"
                />

                {selectedMethod?.id === 2 && processedContent && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      AI Generated Content:
                    </Typography>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {aiSummary}
                    </Alert>
                    <Box sx={{ 
                      p: 2, 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 1, 
                      backgroundColor: '#f5f5f5',
                      maxHeight: 200,
                      overflow: 'auto'
                    }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {processedContent}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {selectedTemplateType && (
                  <Box sx={{ mt: 2 }}>
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, minHeight: 500 }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
            Create New Template
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ minHeight: 400 }}>
        <Stepper activeStep={currentStep} orientation="vertical">
          <Step>
            <StepLabel>Choose Creation Method</StepLabel>
            <StepContent>
              {renderStepContent(0)}
            </StepContent>
          </Step>
          
          <Step>
            <StepLabel>Configure Template</StepLabel>
            <StepContent>
              {renderStepContent(1)}
            </StepContent>
          </Step>
          
          <Step>
            <StepLabel>Finalize Details</StepLabel>
            <StepContent>
              {renderStepContent(2)}
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        
        {currentStep > 0 && (
          <Button 
            onClick={handleBack}
            variant="outlined"
            startIcon={<NavigateBeforeIcon />}
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
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleCreate}
            variant="contained"
            disabled={!canProceed()}
            endIcon={<CheckIcon />}
          >
            Create Template
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TemplateCreationDialog;
