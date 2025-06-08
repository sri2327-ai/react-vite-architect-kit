
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
  const { isMobile, isTablet, isMobileView } = useResponsive();
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
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
          💡 How Bulleted Lists Work
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          Tell the A.I. what information you want it to generate in a bulleted list format.
        </Typography>
        
        <Box sx={{ bgcolor: 'grey.50', p: { xs: 1.5, sm: 2 }, borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            EXAMPLE
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            "Create a bullet for each medication that was discussed. Each bullet should follow this format: {'{Medication Name}'} - {'{Dosage}'}"
          </Typography>
        </Box>
      </Box>
    </Alert>
  );

  const getExamListGuidance = () => (
    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
          🔍 How Exam Lists Work
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 0, '& li': { mb: 1 } }}>
          <li>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              <strong>Structured Output:</strong> Each subsection has its own instruction for AI generation
            </Typography>
          </li>
          <li>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              <strong>Customizable Sections:</strong> Add, remove, or edit sections as needed
            </Typography>
          </li>
          <li>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
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
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
          ✅ How Checklists Work
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
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
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
        💡 How AI Instructions Work
      </Typography>
      <Box component="ul" sx={{ pl: 2, mb: 0, '& li': { mb: 1 } }}>
        <li><Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}><strong>Natural Language:</strong> Write instructions as you would explain to a colleague</Typography></li>
        <li><Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}><strong>Placeholders:</strong> Use {'{variable}'} for dynamic content</Typography></li>
        <li><Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}><strong>Exact Text:</strong> Use "quotes" for text that must appear exactly</Typography></li>
        <li><Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}><strong>Hidden Notes:</strong> Use (parentheses) for AI-only instructions</Typography></li>
      </Box>
    </Alert>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: { 
          borderRadius: { xs: 0, sm: 3 }, 
          maxHeight: { xs: '100vh', sm: '90vh' },
          m: { xs: 0, sm: 2 },
          width: { xs: '100%', sm: 'auto' }
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: { xs: 1, sm: 2 }, 
        px: { xs: 2, sm: 3 }, 
        pt: { xs: 2, sm: 3 },
        position: { xs: 'sticky', sm: 'static' },
        top: 0,
        zIndex: 1,
        backgroundColor: 'background.paper'
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1 }}>
            {onBack && (
              <IconButton 
                onClick={handleBack} 
                size="small"
                sx={{ 
                  mr: { xs: 1, sm: 1 },
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                  minWidth: { xs: 36, sm: 40 },
                  minHeight: { xs: 36, sm: 40 }
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
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                  lineHeight: { xs: 1.2, sm: 1.3 }
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
                    fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                    height: { xs: 20, sm: 24 }
                  }}
                />
              )}
            </Box>
          </Box>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{
              minWidth: { xs: 36, sm: 40 },
              minHeight: { xs: 36, sm: 40 }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        pb: { xs: 1, sm: 2 }, 
        px: { xs: 2, sm: 3 },
        overflowY: 'auto',
        flex: 1
      }}>
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
            sx={{
              '& .MuiFormHelperText-root': {
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              },
              '& .MuiInputLabel-root': {
                fontSize: { xs: '0.85rem', sm: '0.875rem' }
              }
            }}
          />
          
          {isExamList && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' }
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
                    mb: { xs: 1.5, sm: 2 }, 
                    border: '2px solid', 
                    borderColor: 'grey.200',
                    '&:hover': { borderColor: 'primary.light' },
                    transition: 'border-color 0.2s'
                  }}
                >
                  <CardContent sx={{ 
                    '&:last-child': { pb: { xs: 2, sm: 2 } }, 
                    p: { xs: 2, sm: 2 } 
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: { xs: 1.5, sm: 2 }, 
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 1 },
                      alignItems: { xs: 'flex-start', sm: 'center' }
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        flexWrap: 'wrap',
                        width: { xs: '100%', sm: 'auto' }
                      }}>
                        <Chip 
                          label={`Section ${index + 1}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}
                        />
                        {item.title && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary', 
                              fontWeight: 500,
                              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
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
                              '&:hover': { bgcolor: 'error.lighter' },
                              minWidth: { xs: 32, sm: 36 },
                              minHeight: { xs: 32, sm: 36 }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                      <TextField
                        fullWidth
                        label="Subsection Title"
                        value={item.title}
                        onChange={(e) => updateExamItem(item.id, 'title', e.target.value)}
                        variant="outlined"
                        size="small"
                        placeholder="e.g., Heart, Lungs, Abdomen..."
                        sx={{
                          '& .MuiInputLabel-root': {
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="AI Instructions"
                        value={item.instructions}
                        onChange={(e) => updateExamItem(item.id, 'instructions', e.target.value)}
                        multiline
                        rows={isMobile ? 2 : 3}
                        variant="outlined"
                        size="small"
                        placeholder="Tell the AI what to focus on for this section..."
                        sx={{
                          '& .MuiInputLabel-root': {
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Normal Findings Text (Optional)"
                        value={item.normalText}
                        onChange={(e) => updateExamItem(item.id, 'normalText', e.target.value)}
                        variant="outlined"
                        size="small"
                        placeholder="Text to use when findings are within normal limits..."
                        sx={{
                          '& .MuiInputLabel-root': {
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                startIcon={<AddIcon />}
                onClick={addExamItem}
                variant="outlined"
                fullWidth
                sx={{ 
                  mb: { xs: 3, sm: 4 }, 
                  textTransform: 'none',
                  borderStyle: 'dashed',
                  '&:hover': { borderStyle: 'solid' },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  py: { xs: 1, sm: 1.5 }
                }}
              >
                Add Another Exam Section
              </Button>
              
              <Divider sx={{ my: { xs: 3, sm: 4 } }} />
              
              <Accordion defaultExpanded sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'grey.200' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: { xs: 1, sm: 2 } }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', sm: '1.25rem' }
                    }}
                  >
                    Normal Limits Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: { xs: 1, sm: 2 } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                    <FormControl component="fieldset">
                      <FormLabel 
                        component="legend" 
                        sx={{ 
                          mb: { xs: 1, sm: 2 }, 
                          fontWeight: 600,
                          fontSize: { xs: '0.8rem', sm: '0.9rem' }
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
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Leave it blank</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Section won't appear in the final output</Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel 
                          value="default_normal" 
                          control={<Radio size="small" />} 
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Default to "Within Normal Limits"</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Use standard normal findings text</Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel 
                          value="alert_provider" 
                          control={<Radio size="small" />} 
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Alert provider to discuss this item</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Add a reminder note for missing sections</Typography>
                            </Box>
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                    
                    <FormControl component="fieldset">
                      <FormLabel 
                        component="legend" 
                        sx={{ 
                          mb: { xs: 1, sm: 2 }, 
                          fontWeight: 600,
                          fontSize: { xs: '0.8rem', sm: '0.9rem' }
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
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Summarize the discussion</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>AI generates summary of normal findings</Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel 
                          value="use_specified" 
                          control={<Radio size="small" />} 
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Use specified "Normal Limits" text</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Use the text you defined above</Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel 
                          value="highlight_abnormal" 
                          control={<Radio size="small" />} 
                          label={
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Highlight abnormal findings only</Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Focus on what's not normal</Typography>
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
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Hide empty sections</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>Don't show sections with no content</Typography>
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
                  mb: { xs: 2, sm: 2 }, 
                  fontWeight: 500,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                What buttons do you want to include?
              </Typography>
              
              {checklistItems.map((item, index) => (
                <Card 
                  key={item.id} 
                  sx={{ 
                    mb: { xs: 1.5, sm: 2 }, 
                    border: '1px solid', 
                    borderColor: 'grey.300' 
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: { xs: 1.5, sm: 2 }, 
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 1 },
                      alignItems: { xs: 'flex-start', sm: 'center' }
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.85rem', sm: '0.9rem' }
                        }}
                      >
                        Item {index + 1}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        flexWrap: 'wrap',
                        width: { xs: '100%', sm: 'auto' },
                        justifyContent: { xs: 'flex-end', sm: 'flex-start' }
                      }}>
                        <IconButton 
                          size="small" 
                          onClick={() => moveChecklistItem(item.id, 'up')}
                          disabled={index === 0}
                          title="Move Up"
                          sx={{ minWidth: { xs: 32, sm: 36 }, minHeight: { xs: 32, sm: 36 } }}
                        >
                          <MoveUpIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => moveChecklistItem(item.id, 'down')}
                          disabled={index === checklistItems.length - 1}
                          title="Move Down"
                          sx={{ minWidth: { xs: 32, sm: 36 }, minHeight: { xs: 32, sm: 36 } }}
                        >
                          <MoveDownIcon fontSize="small" />
                        </IconButton>
                        {checklistItems.length > 1 && (
                          <IconButton 
                            size="small" 
                            onClick={() => removeChecklistItem(item.id)}
                            sx={{ 
                              color: 'error.main',
                              minWidth: { xs: 32, sm: 36 }, 
                              minHeight: { xs: 32, sm: 36 } 
                            }}
                            title="Delete Item"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                      <TextField
                        fullWidth
                        label="Button Name"
                        value={item.buttonName}
                        onChange={(e) => updateChecklistItem(item.id, 'buttonName', e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiInputLabel-root': {
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="What text should be added when this button is clicked?"
                        value={item.text}
                        onChange={(e) => updateChecklistItem(item.id, 'text', e.target.value)}
                        multiline
                        rows={isMobile ? 2 : 3}
                        variant="outlined"
                        size="small"
                        sx={{
                          '& .MuiInputLabel-root': {
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                startIcon={<AddIcon />}
                onClick={addChecklistItem}
                fullWidth
                sx={{ 
                  mb: { xs: 2, sm: 3 }, 
                  textTransform: 'none',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  py: { xs: 1, sm: 1.5 }
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
              rows={isMobile ? 4 : 6}
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
              rows={isMobile ? 4 : 6}
              placeholder={`Provide detailed instructions for how the AI should generate the ${sectionName} section...`}
              variant="outlined"
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 }, 
        pt: { xs: 1, sm: 1 }, 
        gap: { xs: 1, sm: 1 }, 
        flexDirection: { xs: 'column', sm: 'row' },
        position: { xs: 'sticky', sm: 'static' },
        bottom: 0,
        backgroundColor: 'background.paper',
        borderTop: { xs: '1px solid', sm: 'none' },
        borderColor: { xs: 'divider', sm: 'transparent' }
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          fullWidth={isMobile}
          sx={{ 
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            py: { xs: 1.5, sm: 1 }
          }}
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
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            py: { xs: 1.5, sm: 1 }
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionConfigDialog;
