
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
  Paper,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Help as HelpIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface ExamItem {
  id: string;
  title: string;
  instructions: string;
  normalLimitsText: string;
}

interface ExamListConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onContinue: (config: any) => void;
}

const ExamListConfigDialog: React.FC<ExamListConfigDialogProps> = ({
  open,
  onClose,
  onBack,
  onContinue
}) => {
  const [title, setTitle] = useState('');
  const [examItems, setExamItems] = useState<ExamItem[]>([
    {
      id: '1',
      title: '',
      instructions: '',
      normalLimitsText: ''
    }
  ]);
  const [notDiscussedBehavior, setNotDiscussedBehavior] = useState('blank');
  const [normalLimitsBehavior, setNormalLimitsBehavior] = useState('summarize');

  const addExamItem = () => {
    setExamItems([...examItems, {
      id: Date.now().toString(),
      title: '',
      instructions: '',
      normalLimitsText: ''
    }]);
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

  const handleContinue = () => {
    if (!title.trim() || examItems.some(item => !item.title.trim() || !item.instructions.trim())) {
      return;
    }
    
    onContinue({
      title,
      examItems,
      notDiscussedBehavior,
      normalLimitsBehavior,
      type: 'exam-list'
    });
  };

  const handleClose = () => {
    setTitle('');
    setExamItems([{ id: '1', title: '', instructions: '', normalLimitsText: '' }]);
    setNotDiscussedBehavior('blank');
    setNormalLimitsBehavior('summarize');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Exam List
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3, 
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            border: '1px solid rgba(25, 118, 210, 0.12)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <HelpIcon sx={{ color: 'primary.main', mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                How this works
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 1 } }}>
                <li>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    <strong>Review each subsection:</strong> An exam-list is a structured output, with each subsection as it's own instruction for Medwriter.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    <strong>Tell Medwriter what to focus on:</strong> For each section, you can tell Medwriter what to write for that subsection.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    <strong>Decide Normal Limits Behavior:</strong> You can specify certain default "within normal limits" text, and decide when you want Medwriter to fall back to that text.
                  </Typography>
                </li>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Title
          </Typography>
          <TextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What exam sections would you like A.I. to report on?"
            variant="outlined"
            size="small"
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Exam Items
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={addExamItem}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Add another item
            </Button>
          </Box>

          {examItems.map((item, index) => (
            <Card key={item.id} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Item {index + 1}
                  </Typography>
                  {examItems.length > 1 && (
                    <IconButton
                      onClick={() => removeExamItem(item.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    I want to title this subsection...
                  </Typography>
                  <TextField
                    fullWidth
                    value={item.title}
                    onChange={(e) => updateExamItem(item.id, 'title', e.target.value)}
                    placeholder="Enter subsection title"
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    I want the A.I. to report on...
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={item.instructions}
                    onChange={(e) => updateExamItem(item.id, 'instructions', e.target.value)}
                    placeholder="Tell the AI what to focus on for this section"
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    When findings are normal, use this text...
                  </Typography>
                  <TextField
                    fullWidth
                    value={item.normalLimitsText}
                    onChange={(e) => updateExamItem(item.id, 'normalLimitsText', e.target.value)}
                    placeholder="Default text for normal findings"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Within Normal Limits Settings
          </Typography>

          <Box sx={{ mb: 3 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                When an item is not discussed in the session:
              </FormLabel>
              <RadioGroup
                value={notDiscussedBehavior}
                onChange={(e) => setNotDiscussedBehavior(e.target.value)}
              >
                <FormControlLabel value="blank" control={<Radio />} label="Leave it blank" />
                <FormControlLabel value="normal" control={<Radio />} label="Default to 'Within Normal Limits'" />
                <FormControlLabel value="alert" control={<Radio />} label="Alert provider to discuss this item" />
              </RadioGroup>
            </FormControl>
          </Box>

          <Box>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                When findings are within normal limits:
              </FormLabel>
              <RadioGroup
                value={normalLimitsBehavior}
                onChange={(e) => setNormalLimitsBehavior(e.target.value)}
              >
                <FormControlLabel value="summarize" control={<Radio />} label="Summarize the discussion" />
                <FormControlLabel value="specified" control={<Radio />} label="Use specified 'Within Normal Limits' text" />
                <FormControlLabel value="highlight" control={<Radio />} label="Highlight findings that are not within normal limits" />
                <FormControlLabel value="hide" control={<Radio />} label="Hide items that are empty" />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={onBack}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          variant="contained"
          disabled={!title.trim() || examItems.some(item => !item.title.trim() || !item.instructions.trim())}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Continue to Placement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExamListConfigDialog;
