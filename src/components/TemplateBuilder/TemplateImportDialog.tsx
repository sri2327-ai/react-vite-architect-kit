
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Chip,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider
} from '@mui/material';
import {
  GetApp as ImportIcon,
  Assignment as TemplateIcon,
  Settings as ConfigIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import { alpha } from '@mui/material/styles';

interface LibraryTemplate {
  id: number;
  name: string;
  specialty: string;
  noteType: string;
  content?: string;
}

interface ConsultType {
  id: number;
  name: string;
}

interface TemplateImportDialogProps {
  open: boolean;
  template: LibraryTemplate | null;
  consultTypes: ConsultType[];
  onClose: () => void;
  onImport: (importConfig: any) => void;
}

const TemplateImportDialog: React.FC<TemplateImportDialogProps> = ({
  open,
  template,
  consultTypes,
  onClose,
  onImport
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedConsultType, setSelectedConsultType] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [customizations, setCustomizations] = useState({
    addClinicHeader: true,
    addProviderInfo: true,
    includeTimestamp: true,
    useStructuredFormat: true
  });

  React.useEffect(() => {
    if (template && open) {
      setTemplateName(template.name);
      setActiveStep(0);
    }
  }, [template, open]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleImport = () => {
    const importConfig = {
      template,
      consultType: selectedConsultType,
      templateName,
      customizations
    };
    
    onImport(importConfig);
    handleClose();
  };

  const handleClose = () => {
    setActiveStep(0);
    setSelectedConsultType('');
    setTemplateName('');
    onClose();
  };

  const steps = [
    {
      label: 'Choose Destination',
      description: 'Select where to add this template'
    },
    {
      label: 'Customize Template',
      description: 'Configure template settings'
    },
    {
      label: 'Review & Import',
      description: 'Confirm your selections'
    }
  ];

  if (!template) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ImportIcon sx={{ color: bravoColors.primaryFlat }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Import Template to Practice
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {template.name} • {template.specialty}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Step 1: Choose Destination */}
          <Step>
            <StepLabel>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {steps[0].label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select which consultation type should use this template.
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Consultation Type</InputLabel>
                <Select
                  value={selectedConsultType}
                  onChange={(e) => setSelectedConsultType(e.target.value)}
                  label="Consultation Type"
                  sx={{ borderRadius: 2 }}
                >
                  {consultTypes.map((type) => (
                    <MenuItem key={type.id} value={type.name}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TemplateIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        {type.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Alert severity="info" sx={{ mb: 2 }}>
                This template will be added to your selected consultation type and can be used 
                immediately for creating new clinical notes.
              </Alert>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!selectedConsultType}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  Continue
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 2: Customize Template */}
          <Step>
            <StepLabel>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {steps[1].label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Customize the template to match your practice preferences.
              </Typography>

              <TextField
                fullWidth
                label="Template Name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                helperText="You can rename this template for easier identification"
              />

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Template Enhancements
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={customizations.addClinicHeader}
                      onChange={(e) => setCustomizations(prev => ({
                        ...prev,
                        addClinicHeader: e.target.checked
                      }))}
                    />
                  }
                  label="Add clinic header with practice information"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={customizations.addProviderInfo}
                      onChange={(e) => setCustomizations(prev => ({
                        ...prev,
                        addProviderInfo: e.target.checked
                      }))}
                    />
                  }
                  label="Include provider name and credentials"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={customizations.includeTimestamp}
                      onChange={(e) => setCustomizations(prev => ({
                        ...prev,
                        includeTimestamp: e.target.checked
                      }))}
                    />
                  }
                  label="Auto-insert date and time stamps"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={customizations.useStructuredFormat}
                      onChange={(e) => setCustomizations(prev => ({
                        ...prev,
                        useStructuredFormat: e.target.checked
                      }))}
                    />
                  }
                  label="Use structured formatting for better EHR integration"
                />
              </Stack>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={handleBack} sx={{ borderRadius: 2, textTransform: 'none' }}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!templateName.trim()}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  Review Import
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 3: Review & Import */}
          <Step>
            <StepLabel>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {steps[2].label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Review your selections and confirm the import.
              </Typography>

              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  border: '1px solid',
                  borderColor: alpha(bravoColors.primaryFlat, 0.1),
                  borderRadius: 2,
                  mb: 3
                }}
              >
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Template Details
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={`Name: ${templateName}`} size="small" />
                      <Chip label={`Type: ${selectedConsultType}`} size="small" />
                      <Chip label={`Specialty: ${template.specialty}`} size="small" />
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Customizations Applied
                    </Typography>
                    <Stack spacing={1}>
                      {Object.entries(customizations).map(([key, value]) => (
                        value && (
                          <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
                            <Typography variant="body2">
                              {key === 'addClinicHeader' && 'Clinic header included'}
                              {key === 'addProviderInfo' && 'Provider information included'}
                              {key === 'includeTimestamp' && 'Timestamp functionality enabled'}
                              {key === 'useStructuredFormat' && 'Structured formatting applied'}
                            </Typography>
                          </Box>
                        )
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Paper>

              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Ready to import!</strong> This template will be added to your "{selectedConsultType}" 
                  consultation type and will be available immediately for creating new notes.
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={handleBack} sx={{ borderRadius: 2, textTransform: 'none' }}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ImportIcon />}
                  onClick={handleImport}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: bravoColors.primaryFlat,
                    '&:hover': {
                      backgroundColor: bravoColors.primaryDark
                    }
                  }}
                >
                  Import Template
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose}
          startIcon={<CloseIcon />}
          sx={{ 
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2
          }}
        >
          Cancel Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateImportDialog;
