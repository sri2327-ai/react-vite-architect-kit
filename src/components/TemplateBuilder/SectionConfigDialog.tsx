
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Paper,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Card,
  CardContent,
  Checkbox,
  FormGroup
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface SectionConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  onBack?: () => void;
  sectionType: string;
  sectionName: string;
}

interface ExamItem {
  id: string;
  title: string;
  instructions: string;
  normalText: string;
}

const SectionConfigDialog: React.FC<SectionConfigDialogProps> = ({
  open,
  onClose,
  onContinue,
  onBack,
  sectionType,
  sectionName
}) => {
  const [title, setTitle] = useState(sectionName);
  const [instructions, setInstructions] = useState('');
  const [examItems, setExamItems] = useState<ExamItem[]>([
    { id: '1', title: '', instructions: '', normalText: '' }
  ]);
  const [notDiscussedBehavior, setNotDiscussedBehavior] = useState('leave_blank');
  const [normalLimitsBehavior, setNormalLimitsBehavior] = useState('summarize');
  const [hideEmptyItems, setHideEmptyItems] = useState(false);

  React.useEffect(() => {
    if (open) {
      setTitle(sectionName);
      setInstructions('');
      setExamItems([{ id: '1', title: '', instructions: '', normalText: '' }]);
      setNotDiscussedBehavior('leave_blank');
      setNormalLimitsBehavior('summarize');
      setHideEmptyItems(false);
    }
  }, [open, sectionName]);

  const handleContinue = () => {
    console.log('Section configuration completed:', { 
      title, 
      instructions, 
      sectionType,
      examItems,
      notDiscussedBehavior,
      normalLimitsBehavior,
      hideEmptyItems
    });
    onContinue();
  };

  const handleBack = () => {
    console.log('Going back to section selection');
    if (onBack) {
      onBack();
    }
  };

  const addExamItem = () => {
    const newItem: ExamItem = {
      id: Date.now().toString(),
      title: '',
      instructions: '',
      normalText: ''
    };
    setExamItems([...examItems, newItem]);
  };

  const removeExamItem = (id: string) => {
    if (examItems.length > 1) {
      setExamItems(examItems.filter(item => item.id !== id));
    }
  };

  const updateExamItem = (id: string, field: keyof ExamItem, value: string) => {
    setExamItems(examItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const getBulletedListGuidance = () => (
    <Box>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
        How this works
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Specify your bulleted list instructions
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Tell the A.I. what information you want it to generate in a bulleted list format.
      </Typography>
      
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
        Example
      </Typography>
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          For instance, you could write:
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.primary' }}>
          Create a bullet for each medication that was discussed. Each bullet should follow this format: {'{Medication Name}'} - {'{Dosage}'}, {'{Frequency}'}
        </Typography>
      </Paper>
      
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
        Tips
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Be specific about what information you want included in each bullet point. The A.I. will format the output as a bulleted list.
      </Typography>
    </Box>
  );

  const getExamListGuidance = () => (
    <Box>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
        How this works
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
        Review each subsection
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        An exam-list is a structured output, with each subsection as it's own instruction for Medwriter. You can add, remove, or edit sections.
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
        Tell Medwriter what to focus on
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        For each section, you can tell Medwriter what to write for that subsection.
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
        Decide Normal Limits Behavior
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        You can specify certain default "within normal limits" text, and decide when you want Medwriter to fall back to that text.
      </Typography>
    </Box>
  );

  const getGeneralGuidance = () => (
    <Alert 
      severity="info" 
      sx={{ 
        mb: 3,
        borderRadius: 2,
        '& .MuiAlert-message': { width: '100%' }
      }}
    >
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        💡 How AI Instructions Work
      </Typography>
      <Box component="ul" sx={{ pl: 2, mb: 0, '& li': { mb: 1 } }}>
        <li><strong>Natural Language:</strong> Write instructions as you would explain to a colleague</li>
        <li><strong>Placeholders:</strong> Use {'{variable}'} for dynamic content</li>
        <li><strong>Exact Text:</strong> Use "quotes" for text that must appear exactly</li>
        <li><strong>Hidden Notes:</strong> Use (parentheses) for AI-only instructions</li>
      </Box>
    </Alert>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {onBack && (
              <IconButton 
                onClick={handleBack} 
                sx={{ 
                  mr: 1,
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {sectionType === 'bulleted_list' ? 'Edit Bulleted List' : 
               sectionType === 'exam_list' ? 'Edit Exam List' :
               `Configure Section: ${sectionName}`}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {sectionType === 'bulleted_list' && getBulletedListGuidance()}
        {sectionType === 'exam_list' && getExamListGuidance()}
        {sectionType !== 'bulleted_list' && sectionType !== 'exam_list' && getGeneralGuidance()}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
          />
          
          {sectionType === 'exam_list' ? (
            <Box>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                What exam sections would you like A.I. to report on?
              </Typography>
              
              {examItems.map((item, index) => (
                <Card key={item.id} sx={{ mb: 2, border: '1px solid', borderColor: 'grey.300' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Item {index + 1}
                      </Typography>
                      {examItems.length > 1 && (
                        <IconButton 
                          size="small" 
                          onClick={() => removeExamItem(item.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="I want to title this subsection..."
                        value={item.title}
                        onChange={(e) => updateExamItem(item.id, 'title', e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                      
                      <TextField
                        fullWidth
                        label="I want the A.I. to report on..."
                        value={item.instructions}
                        onChange={(e) => updateExamItem(item.id, 'instructions', e.target.value)}
                        multiline
                        rows={2}
                        variant="outlined"
                        size="small"
                      />
                      
                      <TextField
                        fullWidth
                        label="When findings are normal, use this text..."
                        value={item.normalText}
                        onChange={(e) => updateExamItem(item.id, 'normalText', e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                startIcon={<AddIcon />}
                onClick={addExamItem}
                sx={{ mb: 3, textTransform: 'none' }}
              >
                Add another item
              </Button>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Within Normal Limits Settings
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>
                    When an item is not discussed in the session:
                  </FormLabel>
                  <RadioGroup
                    value={notDiscussedBehavior}
                    onChange={(e) => setNotDiscussedBehavior(e.target.value)}
                  >
                    <FormControlLabel 
                      value="leave_blank" 
                      control={<Radio size="small" />} 
                      label="Leave it blank" 
                    />
                    <FormControlLabel 
                      value="default_normal" 
                      control={<Radio size="small" />} 
                      label='Default to "Within Normal Limits"' 
                    />
                    <FormControlLabel 
                      value="alert_provider" 
                      control={<Radio size="small" />} 
                      label="Alert provider to discuss this item" 
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>
                    When findings are within normal limits:
                  </FormLabel>
                  <RadioGroup
                    value={normalLimitsBehavior}
                    onChange={(e) => setNormalLimitsBehavior(e.target.value)}
                  >
                    <FormControlLabel 
                      value="summarize" 
                      control={<Radio size="small" />} 
                      label="Summarize the discussion" 
                    />
                    <FormControlLabel 
                      value="use_specified" 
                      control={<Radio size="small" />} 
                      label='Use specified "Within Normal Limits" text' 
                    />
                    <FormControlLabel 
                      value="highlight_abnormal" 
                      control={<Radio size="small" />} 
                      label="Highlight findings that are not within normal limits" 
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hideEmptyItems}
                      onChange={(e) => setHideEmptyItems(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Hide items that are empty"
                />
              </FormGroup>
            </Box>
          ) : (
            <TextField
              fullWidth
              label={sectionType === 'bulleted_list' ? "What do you want the A.I. to generate bullets for?" : "AI Instructions"}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              multiline
              rows={6}
              placeholder={sectionType === 'bulleted_list' 
                ? "Describe what information should be included in each bullet point..."
                : `Provide detailed instructions for how the AI should generate the ${sectionName} section...`
              }
              variant="outlined"
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleContinue}
          disabled={!title.trim()}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionConfigDialog;
