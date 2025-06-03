
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Chip,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  GetApp as ImportIcon,
  Visibility as ViewIcon,
  Assignment as TemplateIcon,
  Description as SampleIcon,
  Schedule as TimeIcon,
  Person as PatientIcon,
  LocalHospital as SpecialtyIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import { alpha } from '@mui/material/styles';

interface LibraryTemplate {
  id: number;
  name: string;
  specialty: string;
  noteType: string;
  content?: string;
  estimatedTime?: string;
  complexity?: 'Simple' | 'Moderate' | 'Complex';
  usageCount?: number;
}

interface TemplatePreviewDialogProps {
  open: boolean;
  template: LibraryTemplate | null;
  onClose: () => void;
  onImport: () => void;
}

const TemplatePreviewDialog: React.FC<TemplatePreviewDialogProps> = ({
  open,
  template,
  onClose,
  onImport
}) => {
  const [previewTab, setPreviewTab] = useState(0);

  if (!template) return null;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setPreviewTab(newValue);
  };

  const sampleNote = `Patient: John Doe, Age 45
Date: ${new Date().toLocaleDateString()}

CHIEF COMPLAINT:
Routine follow-up visit for hypertension management.

HISTORY OF PRESENT ILLNESS:
Patient reports good adherence to medication regimen. No recent episodes of elevated blood pressure readings at home. Denies chest pain, shortness of breath, or dizziness.

PHYSICAL EXAMINATION:
Vital Signs: BP 128/82, HR 72, RR 16, Temp 98.6°F
General: Well-appearing, no acute distress
Cardiovascular: Regular rate and rhythm, no murmurs
Lungs: Clear to auscultation bilaterally

ASSESSMENT AND PLAN:
1. Hypertension - well controlled on current regimen
   - Continue current medications
   - Recheck BP in 3 months
2. Health maintenance
   - Annual labs due next visit
   - Discussed lifestyle modifications

FOLLOW-UP:
Return in 3 months or sooner if concerns arise.`;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SpecialtyIcon sx={{ color: bravoColors.primaryFlat }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {template.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {template.specialty} • {template.noteType}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {/* Template Info */}
        <Box sx={{ px: 3, py: 2, backgroundColor: alpha(bravoColors.background?.light || '#f5f5f5', 0.5) }}>
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {template.complexity && (
              <Chip 
                label={`${template.complexity} Complexity`}
                size="small"
                color={template.complexity === 'Simple' ? 'success' : 
                       template.complexity === 'Moderate' ? 'warning' : 'error'}
              />
            )}
            {template.estimatedTime && (
              <Chip 
                icon={<TimeIcon />}
                label={`${template.estimatedTime} to complete`}
                size="small"
                variant="outlined"
              />
            )}
            {template.usageCount && (
              <Chip 
                icon={<PatientIcon />}
                label={`Used by ${template.usageCount}+ clinicians`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>

        <Divider />

        {/* Tab Navigation */}
        <Box sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={previewTab} onChange={handleTabChange}>
            <Tab 
              icon={<TemplateIcon />} 
              label="Template Structure" 
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
            <Tab 
              icon={<SampleIcon />} 
              label="Sample Note" 
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {previewTab === 0 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  This template provides a structured framework for your clinical documentation. 
                  You can customize all sections after importing to match your practice style.
                </Typography>
              </Alert>
              
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  border: '1px solid',
                  borderColor: alpha(bravoColors.primaryFlat, 0.1),
                  borderRadius: 2,
                  backgroundColor: '#fafafa',
                  fontFamily: 'monospace',
                  maxHeight: 400,
                  overflow: 'auto'
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {template.content || `
TEMPLATE: ${template.name}

CHIEF COMPLAINT:
[Brief description of patient's primary concern]

HISTORY OF PRESENT ILLNESS:
[Detailed narrative of current symptoms and timeline]

REVIEW OF SYSTEMS:
[Systematic review by body system]

PHYSICAL EXAMINATION:
[Objective findings from clinical examination]

ASSESSMENT:
[Clinical impression and differential diagnosis]

PLAN:
[Treatment recommendations and follow-up]

PATIENT EDUCATION:
[Information provided to patient]

FOLLOW-UP:
[Next steps and return visit scheduling]
                  `.trim()}
                </Typography>
              </Paper>
            </Box>
          )}

          {previewTab === 1 && (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Here's an example of how a completed note might look using this template structure.
                </Typography>
              </Alert>
              
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  border: '1px solid',
                  borderColor: alpha(bravoColors.secondary, 0.2),
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  maxHeight: 400,
                  overflow: 'auto'
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {sampleNote}
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2
          }}
        >
          Close Preview
        </Button>
        <Button 
          variant="contained" 
          startIcon={<ImportIcon />}
          onClick={onImport}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            backgroundColor: bravoColors.primaryFlat,
            '&:hover': {
              backgroundColor: bravoColors.primaryDark
            }
          }}
        >
          Add to My Templates
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplatePreviewDialog;
