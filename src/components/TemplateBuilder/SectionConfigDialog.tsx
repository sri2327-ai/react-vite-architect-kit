
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
  FormGroup,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  KeyboardArrowUp as MoveUpIcon,
  KeyboardArrowDown as MoveDownIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useResponsive } from '../../hooks/useResponsive';

interface SectionConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: (sectionData?: any) => void;
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

interface ChecklistItem {
  id: string;
  buttonName: string;
  text: string;
}

const SectionConfigDialog: React.FC<SectionConfigDialogProps> = ({
  open,
  onClose,
  onContinue,
  onBack,
  sectionType,
  sectionName
}) => {
  const { isMobile } = useResponsive();
  const [title, setTitle] = useState(sectionName);
  const [instructions, setInstructions] = useState('');
  const [examItems, setExamItems] = useState<ExamItem[]>([
    { id: '1', title: '', instructions: '', normalText: '' }
  ]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: '1', buttonName: '', text: '' }
  ]);
  const [notDiscussedBehavior, setNotDiscussedBehavior] = useState('leave_blank');
  const [normalLimitsBehavior, setNormalLimitsBehavior] = useState('summarize');
  const [hideEmptyItems, setHideEmptyItems] = useState(false);

  React.useEffect(() => {
    if (open) {
      setTitle(sectionName);
      setInstructions('');
      setExamItems([{ id: '1', title: '', instructions: '', normalText: '' }]);
      setChecklistItems([{ id: '1', buttonName: '', text: '' }]);
      setNotDiscussedBehavior('leave_blank');
      setNormalLimitsBehavior('summarize');
      setHideEmptyItems(false);
    }
  }, [open, sectionName]);

  const handleContinue = () => {
    const sectionData = {
      id: Date.now().toString(),
      name: title,
      type: sectionType,
      content: instructions || 'AI will generate content based on the instructions below.',
      description: 'A.I. will write content following the guidelines below.',
      // Include specific configuration based on section type
      ...(isExamList && {
        examItems: examItems,
        notDiscussedBehavior,
        normalLimitsBehavior,
        hideEmptyItems
      }),
      ...(isChecklist && {
        checklistItems: checklistItems
      }),
      ...(isBulletedList && {
        instructions: instructions
      })
    };

    console.log('Section configuration completed:', sectionData);
    onContinue(sectionData);
  };

  const handleBack = () => {
    console.log('Going back to section selection');
    if (onBack) {
      onBack();
    }
  };

  // Debug log to see what sectionType we're receiving
  console.log('SectionConfigDialog - sectionType:', sectionType);

  // Check if this is an exam list type (handle different possible values)
  const isExamList = sectionType === 'exam_list' || sectionType === 'exam-list' || sectionType === 'examlist' || sectionType.toLowerCase().includes('exam');
  const isBulletedList = sectionType === 'bulleted_list' || sectionType === 'bulleted-list' || sectionType === 'bulletedlist' || sectionType.toLowerCase().includes('bullet');
  const isChecklist = sectionType === 'checklist' || sectionType === 'check-list' || sectionType.toLowerCase().includes('checklist');

  // Exam items functions
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

  // Checklist items functions
  const addChecklistItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      buttonName: '',
      text: ''
    };
    setChecklistItems([...checklistItems, newItem]);
  };

  const removeChecklistItem = (id: string) => {
    if (checklistItems.length > 1) {
      setChecklistItems(checklistItems.filter(item => item.id !== id));
    }
  };

  const updateChecklistItem = (id: string, field: keyof ChecklistItem, value: string) => {
    setChecklistItems(checklistItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const moveChecklistItem = (id: string, direction: 'up' | 'down') => {
    const currentIndex = checklistItems.findIndex(item => item.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === checklistItems.length - 1)
    ) {
      return;
    }

    const newItems = [...checklistItems];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newItems[currentIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[currentIndex]];
    setChecklistItems(newItems);
  };

  const getBulletedListGuidance = () => (
    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
          💡 How Bulleted Lists Work
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Tell the A.I. what information you want it to generate in a bulleted list format.
        </Typography>
        
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            EXAMPLE
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
            "Create a bullet for each medication that was discussed. Each bullet should follow this format: {'{Medication Name}'} - {'{Dosage}'}, {'{Frequency}'}"
          </Typography>
        </Box>
      </Box>
    </Alert>
  );

  const getExamListGuidance = () => (
    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}>
          🔍 How Exam Lists Work
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 0, '& li': { mb: 1 } }}>
          <li>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Structured Output:</strong> Each subsection has its own instruction for AI generation
            </Typography>
          </li>
          <li>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Customizable Sections:</strong> Add, remove, or edit sections as needed
            </Typography>
          </li>
          <li>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Normal Limits:</strong> Set default text and behavior for normal findings
            </Typography>
          </li>
        </Box>
      </Box>
    </Alert>
  );

  const getChecklistGuidance = () => (
    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
          ✅ How Checklists Work
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Create clickable buttons that insert predefined text into your notes. Each button click adds the exact corresponding text - no AI generation involved.
        </Typography>
      </Box>
    </Alert>
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
        sx: { 
          borderRadius: 3, 
          maxHeight: '90vh',
          m: { xs: 1, sm: 2 }
        }
      }}
    >
      <DialogTitle sx={{ pb: 2, px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1 }}>
            {onBack && (
              <IconButton 
                onClick={handleBack} 
                size="small"
                sx={{ 
                  mr: { xs: 0.5, sm: 1 },
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            )}
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                {isBulletedList ? 'Edit Bulleted List' : 
                 isExamList ? 'Edit Exam List' :
                 isChecklist ? 'Edit Checklist' :
                 `Configure Section: ${sectionName}`}
              </Typography>
              {isExamList && (
                <Chip 
                  label="Structured AI Output" 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    mt: 0.5,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                />
              )}
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2, px: { xs: 2, sm: 3 } }}>
        {isBulletedList && getBulletedListGuidance()}
        {isExamList && getExamListGuidance()}
        {isChecklist && getChecklistGuidance()}
        {!isBulletedList && !isExamList && !isChecklist && getGeneralGuidance()}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
          <TextField
            fullWidth
            label="Section Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
            required
            helperText="This will appear as the section header in your template"
          />
          
          {isExamList && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  Exam Sections
                </Typography>
                <Tooltip title="Define what specific aspects of the exam the AI should report on">
                  <InfoIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
              
              {examItems.map((item, index) => (
                <Card 
                  key={item.id} 
                  sx={{ 
                    mb: 2, 
                    border: '2px solid', 
                    borderColor: 'grey.200',
                    '&:hover': { borderColor: 'primary.light' },
                    transition: 'border-color 0.2s'
                  }}
                >
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`Section ${index + 1}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        />
                        {item.title && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary', 
                              fontWeight: 500,
                              fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }}
                          >
                            {item.title}
                          </Typography>
                        )}
                      </Box>
                      {examItems.length > 1 && (
                        <Tooltip title="Remove this section">
                          <IconButton 
                            size="small" 
                            onClick={() => removeExamItem(item.id)}
                            sx={{ 
                              color: 'error.main',
                              '&:hover': { bgcolor: 'error.lighter' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Subsection Title"
                        value={item.title}
                        onChange={(e) => updateExamItem(item.id, 'title', e.target.value)}
                        variant="outlined"
                        size="small"
                        placeholder="e.g., Heart, Lungs, Abdomen..."
                      />
                      
                      <TextField
                        fullWidth
                        label="AI Instructions"
                        value={item.instructions}
                        onChange={(e) => updateExamItem(item.id, 'instructions', e.target.value)}
                        multiline
                        rows={2}
                        variant="outlined"
                        size="small"
                        placeholder="Tell the AI what to focus on for this section..."
                      />
                      
                      <TextField
                        fullWidth
                        label="Normal Findings Text (Optional)"
                        value={item.normalText}
                        onChange={(e) => updateExamItem(item.id, 'normalText', e.target.value)}
                        variant="outlined"
                        size="small"
                        placeholder="Text to use when findings are within normal limits..."
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                startIcon={<AddIcon />}
                onClick={addExamItem}
                variant="outlined"
                fullWidth={isMobile}
                sx={{ 
                  mb: 4, 
                  textTransform: 'none',
                  borderStyle: 'dashed',
                  '&:hover': { borderStyle: 'solid' },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Add Another Exam Section
              </Button>
              
              <Divider sx={{ my: 4 }} />
              
              <Accordion defaultExpanded sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'grey.200' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Normal Limits Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormControl component="fieldset">
                      <FormLabel 
                        component="legend" 
                        sx={{ 
                          mb: 2, 
                          fontWeight: 600,
                          fontSize: { xs: '0.85rem', sm: '0.9rem' }
                        }}
                      >
                        When an exam section is not discussed:
                      </FormLabel>
                      <RadioGroup
                        value={notDiscussedBehavior}
                        onChange={(e) => setNotDiscussedBehavior(e.target.value)}
                      >
                        <FormControlLabel 
                          value="leave_blank" 
                          control={<Radio size="small" />} 
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Leave it blank</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Section won't appear in the final output</Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel 
                          value="default_normal" 
                          control={<Radio size="small" />} 
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Default to "Within Normal Limits"</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Use standard normal findings text</Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel 
                          value="alert_provider" 
                          control={<Radio size="small" />} 
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Alert provider to discuss this item</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Add a reminder note for missing sections</Typography>
                            </Box>
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                    
                    <FormControl component="fieldset">
                      <FormLabel 
                        component="legend" 
                        sx={{ 
                          mb: 2, 
                          fontWeight: 600,
                          fontSize: { xs: '0.85rem', sm: '0.9rem' }
                        }}
                      >
                        When findings are within normal limits:
                      </FormLabel>
                      <RadioGroup
                        value={normalLimitsBehavior}
                        onChange={(e) => setNormalLimitsBehavior(e.target.value)}
                      >
                        <FormControlLabel 
                          value="summarize" 
                          control={<Radio size="small" />} 
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Summarize the discussion</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>AI generates summary of normal findings</Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel 
                          value="use_specified" 
                          control={<Radio size="small" />} 
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Use specified "Normal Limits" text</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Use the text you defined above</Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel 
                          value="highlight_abnormal" 
                          control={<Radio size="small" />} 
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Highlight abnormal findings only</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Focus on what's not normal</Typography>
                            </Box>
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                    
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={hideEmptyItems}
                            onChange={(e) => setHideEmptyItems(e.target.checked)}
                            size="small"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Hide empty sections</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Don't show sections with no content</Typography>
                          </Box>
                        }
                      />
                    </FormGroup>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}

          {isChecklist && (
            <Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 500,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                What buttons do you want to include?
              </Typography>
              
              {checklistItems.map((item, index) => (
                <Card key={item.id} sx={{ mb: 2, border: '1px solid', borderColor: 'grey.300' }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.85rem', sm: '0.9rem' }
                        }}
                      >
                        Item {index + 1}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => moveChecklistItem(item.id, 'up')}
                          disabled={index === 0}
                          title="Move Up"
                        >
                          <MoveUpIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => moveChecklistItem(item.id, 'down')}
                          disabled={index === checklistItems.length - 1}
                          title="Move Down"
                        >
                          <MoveDownIcon fontSize="small" />
                        </IconButton>
                        {checklistItems.length > 1 && (
                          <IconButton 
                            size="small" 
                            onClick={() => removeChecklistItem(item.id)}
                            sx={{ color: 'error.main' }}
                            title="Delete Item"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Button Name"
                        value={item.buttonName}
                        onChange={(e) => updateChecklistItem(item.id, 'buttonName', e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                      
                      <TextField
                        fullWidth
                        label="What text should be added when this button is clicked?"
                        value={item.text}
                        onChange={(e) => updateChecklistItem(item.id, 'text', e.target.value)}
                        multiline
                        rows={3}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                startIcon={<AddIcon />}
                onClick={addChecklistItem}
                fullWidth={isMobile}
                sx={{ 
                  mb: 3, 
                  textTransform: 'none',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Add Another Item
              </Button>
            </Box>
          )}

          {isBulletedList && (
            <TextField
              fullWidth
              label="What do you want the A.I. to generate bullets for?"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              multiline
              rows={6}
              placeholder="Describe what information should be included in each bullet point..."
              variant="outlined"
            />
          )}

          {!isBulletedList && !isExamList && !isChecklist && (
            <TextField
              fullWidth
              label="AI Instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              multiline
              rows={6}
              placeholder={`Provide detailed instructions for how the AI should generate the ${sectionName} section...`}
              variant="outlined"
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 1, gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          fullWidth={isMobile}
          sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleContinue}
          disabled={!title.trim()}
          fullWidth={isMobile}
          sx={{ 
            minWidth: 120,
            fontSize: { xs: '0.85rem', sm: '0.9rem' }
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionConfigDialog;
