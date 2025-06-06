import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ImprovedTemplateCreationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateTemplate: (templateData: any) => void;
}

const ImprovedTemplateCreationDialog: React.FC<ImprovedTemplateCreationDialogProps> = ({
  open,
  onClose,
  onCreateTemplate
}) => {
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('note');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateSummary, setTemplateSummary] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [providerType, setProviderType] = useState('');
  const [encounterType, setEncounterType] = useState('');

  const handleClose = useCallback(() => {
    setTemplateName('');
    setTemplateType('note');
    setTemplateDescription('');
    setTemplateSummary('');
    setSpecialty('');
    setProviderType('');
    setEncounterType('');
    onClose();
  }, [onClose]);

  const handleCreate = () => {
    const templateData = {
      name: templateName,
      type: templateType,
      content: generateFinalTemplateContent(),
      description: templateDescription,
      summary: templateSummary,
      category: specialty,
      provider: providerType,
      encounter: encounterType,
      createdAt: new Date().toISOString(),
      id: Date.now().toString(),
      redirectToEditor: true
    };

    onCreateTemplate(templateData);
    handleClose();
  };

  const finalizeTemplate = () => {
    const templateData = {
      name: templateName,
      type: templateType,
      content: generateFinalTemplateContent(),
      description: templateDescription,
      summary: templateSummary,
      category: specialty,
      provider: providerType,
      encounter: encounterType,
      createdAt: new Date().toISOString(),
      id: Date.now().toString(),
      redirectToEditor: true
    };

    onCreateTemplate(templateData);
    handleClose();
  };

  const generateFinalTemplateContent = () => {
    // Generate the actual template content that would be used in clinical documentation
    let content = '';
    
    if (templateType === 'note') {
      content = `${templateName}\n\n`;
      content += `CHIEF COMPLAINT:\n`;
      content += `The patient presents for [reason for visit].\n\n`;
      content += `HISTORY OF PRESENT ILLNESS:\n`;
      content += `[Patient history details]\n\n`;
      content += `PHYSICAL EXAMINATION:\n`;
      content += `[Examination findings]\n\n`;
      content += `ASSESSMENT AND PLAN:\n`;
      content += `[Clinical assessment and treatment plan]\n`;
    } else if (templateType === 'order') {
      content = `${templateName}\n\n`;
      content += `ORDER TYPE: [Type of order]\n`;
      content += `INDICATION: [Clinical indication]\n`;
      content += `INSTRUCTIONS: [Specific instructions]\n`;
      content += `FREQUENCY: [How often]\n`;
      content += `DURATION: [How long]\n`;
    } else if (templateType === 'letter') {
      content = `${templateName}\n\n`;
      content += `Dear [Recipient],\n\n`;
      content += `I am writing to provide information regarding [patient/topic].\n\n`;
      content += `[Letter content]\n\n`;
      content += `Please contact me if you have any questions.\n\n`;
      content += `Sincerely,\n[Provider name]`;
    }
    
    return content;
  };

  const renderTemplateDetails = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Template Details
      </Typography>
      
      <TextField
        fullWidth
        label="Template Name"
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
        margin="normal"
        variant="outlined"
        size="small"
      />

      <FormControl fullWidth margin="normal" size="small">
        <InputLabel id="template-type-label">Template Type</InputLabel>
        <Select
          labelId="template-type-label"
          id="template-type"
          value={templateType}
          label="Template Type"
          onChange={(e) => setTemplateType(e.target.value as string)}
        >
          <MenuItem value="note">Note</MenuItem>
          <MenuItem value="order">Order</MenuItem>
          <MenuItem value="letter">Letter</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  const renderClinicalContext = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Clinical Context
      </Typography>
      
      <FormControl fullWidth margin="normal" size="small">
        <InputLabel id="specialty-label">Specialty</InputLabel>
        <Select
          labelId="specialty-label"
          id="specialty"
          value={specialty}
          label="Specialty"
          onChange={(e) => setSpecialty(e.target.value as string)}
        >
          <MenuItem value="cardiology">Cardiology</MenuItem>
          <MenuItem value="neurology">Neurology</MenuItem>
          <MenuItem value="orthopedics">Orthopedics</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" size="small">
        <InputLabel id="provider-type-label">Provider Type</InputLabel>
        <Select
          labelId="provider-type-label"
          id="provider-type"
          value={providerType}
          label="Provider Type"
          onChange={(e) => setProviderType(e.target.value as string)}
        >
          <MenuItem value="physician">Physician</MenuItem>
          <MenuItem value="nurse">Nurse</MenuItem>
          <MenuItem value="therapist">Therapist</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" size="small">
        <InputLabel id="encounter-type-label">Encounter Type</InputLabel>
        <Select
          labelId="encounter-type-label"
          id="encounter-type"
          value={encounterType}
          label="Encounter Type"
          onChange={(e) => setEncounterType(e.target.value as string)}
        >
          <MenuItem value="inpatient">Inpatient</MenuItem>
          <MenuItem value="outpatient">Outpatient</MenuItem>
          <MenuItem value="telehealth">Telehealth</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  const renderFinalTemplate = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Template Preview
      </Typography>
      
      <Paper 
        sx={{ 
          p: 3, 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #e9ecef',
          borderRadius: 2,
          fontFamily: 'monospace',
          maxHeight: 400,
          overflow: 'auto'
        }}
      >
        <Typography 
          variant="body2" 
          component="pre" 
          sx={{ 
            whiteSpace: 'pre-wrap', 
            wordWrap: 'break-word',
            fontFamily: 'inherit',
            margin: 0,
            fontSize: '0.875rem',
            lineHeight: 1.6
          }}
        >
          {generateFinalTemplateContent()}
        </Typography>
      </Paper>
      
      <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(25, 118, 210, 0.04)', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          This template will be processed by AI to generate intelligent clinical documentation based on patient encounters and clinical data.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Create New Template
        </Typography>
        <CloseIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Fill out the details to create a new template.
        </Alert>

        {renderTemplateDetails()}
        {renderClinicalContext()}
        {renderFinalTemplate()}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          onClick={finalizeTemplate}
          variant="contained"
          disabled={!templateName}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Create Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImprovedTemplateCreationDialog;
