import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Dialog,
  Chip,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Button,
  Modal,
  Typography,
  Stack,
  DialogTitle,
  DialogContent,
  Divider,
  Autocomplete,
  useTheme,
  useMediaQuery,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  ReceiptLong as ReceiptLongIcon,
  Visibility as VisibilityIcon,
  DoDisturb as DoDisturbIcon,
  ArrowBack as ArrowBackIcon,
  AutoFixHigh as AutoFixHighIcon,
  EditNote as EditNoteIcon,
  ContentCopy as ContentCopyIcon,
  CopyAll as CopyAllIcon,
  LibraryBooks as LibraryBooksIcon,
  Description as DescriptionIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Circle as CircleIcon,
  Preview as PreviewIcon,
  Note as NoteIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { bravoColors } from '@/theme/colors';
import DragDropList from './DragDropList';

interface TemplateData {
  id: number;
  title: string;
  specialty: string;
  type: string;
  fields: any[];
  content?: string;
}

interface ConsultType {
  id: number;
  name: string;
  isNew?: boolean;
}

interface LibraryTemplate {
  id: number;
  name: string;
  specialty: string;
  noteType: string;
  content: string;
  sampleNote?: string;
}

const TemplateBuilder: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Tab state
  const [currentTab, setCurrentTab] = useState(0);
  
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<'consultTypes' | 'templates' | 'templateEditor' | 'templateView'>('consultTypes');
  const [selectedConsultType, setSelectedConsultType] = useState<ConsultType | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<TemplateData | null>(null);
  
  // Modal states
  const [openCreateTemplate, setOpenCreateTemplate] = useState(false);
  const [openModifyTemplate, setOpenModifyTemplate] = useState(false);
  const [openAddType, setOpenAddType] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [templateMethod, setTemplateMethod] = useState<any>({});
  const [sectionList, setSectionList] = useState<any[]>([]);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [openAddSection, setOpenAddSection] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Multi-step workflow states
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedContent, setProcessedContent] = useState('');
  const [aiSummary, setAiSummary] = useState('');

  // Form states for different creation methods
  const [templateName, setTemplateName] = useState('');
  const [previousNotes, setPreviousNotes] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [existingTemplateContent, setExistingTemplateContent] = useState('');
  const [selectedLibraryTemplate, setSelectedLibraryTemplate] = useState<LibraryTemplate | null>(null);
  const [libraryFilters, setLibraryFilters] = useState({
    specialty: '',
    noteType: ''
  });
  const [newTypeName, setNewTypeName] = useState('');

  // Template preview states
  const [previewTemplate, setPreviewTemplate] = useState<LibraryTemplate | null>(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewType, setPreviewType] = useState<'template' | 'sample'>('template');
  
  // Import confirmation states
  const [openImportConfirm, setOpenImportConfirm] = useState(false);
  const [selectedImportType, setSelectedImportType] = useState<string>('');

  // Form controls
  const { control, handleSubmit, formState: { errors }, trigger, getValues } = useForm();

  // Sample data
  const [consultTypes, setConsultTypes] = useState<ConsultType[]>([
    { id: 1, name: "SOAP NOTE", isNew: true },
    { id: 2, name: "SOAP NOTE VIRTUAL", isNew: true },
  ]);

  const templates: TemplateData[] = [
    { 
      id: 1, 
      title: "template 01", 
      specialty: "General", 
      type: "SOAP", 
      fields: [],
      content: "Sample template content for template 01\n\nChief Complaint:\n[Patient's primary concern]\n\nHistory of Present Illness:\n[Detailed description of current condition]\n\nPast Medical History:\n[Previous medical conditions and treatments]\n\nAssessment and Plan:\n[Clinical assessment and treatment plan]"
    },
    { 
      id: 2, 
      title: "template 02", 
      specialty: "General", 
      type: "SOAP", 
      fields: [],
      content: "Sample template content for template 02\n\nSubjective:\n[Patient's description of symptoms]\n\nObjective:\n[Physical examination findings]\n\nAssessment:\n[Clinical diagnosis]\n\nPlan:\n[Treatment recommendations]"
    },
    { 
      id: 3, 
      title: "template 03", 
      specialty: "General", 
      type: "SOAP", 
      fields: [],
      content: "Sample template content for template 03"
    },
    { 
      id: 4, 
      title: "template 04", 
      specialty: "General", 
      type: "SOAP", 
      fields: [],
      content: "Sample template content for template 04"
    },
    { 
      id: 5, 
      title: "template 05", 
      specialty: "General", 
      type: "SOAP", 
      fields: [],
      content: "Sample template content for template 05"
    },
    { 
      id: 6, 
      title: "template 06", 
      specialty: "General", 
      type: "SOAP", 
      fields: [],
      content: "Sample template content for template 06"
    },
  ];

  const libraryTemplates: LibraryTemplate[] = [
    {
      id: 1,
      name: "CLINICAL INTERVIEW1",
      specialty: "cardiologist",
      noteType: "SOAP",
      content: "History of Present Illness\nProvide a comprehensive narrative of the patient's current condition. Include details about the onset, duration, and characteristics of the present illness. Note any associated symptoms, and incorporate relevant background information such as lifestyle factors and family medical history. Be sure to structure the narrative in a chronological manner, emphasizing the progression of the condition over time.\n\nAllergies\nList any known allergies the patient has, including reactions to medications, foods, or other substances. If there are no known allergies, indicate this as well.\n• Create a bullet for each known allergy, specifying the substance and the type of reaction.\n• Include a bullet to indicate if there are no known allergies.\n\nFamily Health History\nSummarize the known family health history, focusing on immediate family members and highlighting relevant hereditary conditions.",
      sampleNote: "PATIENT: John Doe, 45-year-old male\n\nHISTORY OF PRESENT ILLNESS:\nThe patient presents with a 3-week history of chest pain that began gradually and has progressively worsened. The pain is described as a dull, aching sensation located in the center of the chest, radiating to the left arm. Episodes typically last 15-20 minutes and are triggered by physical exertion such as climbing stairs or walking briskly. The patient reports associated shortness of breath and mild diaphoresis during episodes. He denies any nausea, vomiting, or palpitations.\n\nALLERGIES:\n• Penicillin - rash and hives\n• Shellfish - facial swelling and difficulty breathing\n• No known environmental allergies\n\nFAMILY HEALTH HISTORY:\nFather: Myocardial infarction at age 52, hypertension\nMother: Type 2 diabetes, alive at age 68\nPaternal grandfather: Stroke at age 65\nNo known family history of cancer or genetic disorders"
    },
    {
      id: 2,
      name: "CLINICAL INTERVIEW2",
      specialty: "pyschologist",
      noteType: "SOAP",
      content: "Psychological assessment content...",
      sampleNote: "Sample psychological assessment note..."
    },
    {
      id: 3,
      name: "CLINICAL INTERVIEW3",
      specialty: "cardiologist",
      noteType: "DPD",
      content: "Cardiology specific content...",
      sampleNote: "Sample cardiology note..."
    },
    {
      id: 4,
      name: "Dermatology Intake",
      specialty: "Dermatology",
      noteType: "SOAP",
      content: "Dermatology intake content...",
      sampleNote: "Sample dermatology intake note..."
    },
    {
      id: 5,
      name: "Neurology Followup",
      specialty: "pyschologist",
      noteType: "SOAP",
      content: "Neurology followup content...",
      sampleNote: "Sample neurology followup note..."
    },
    {
      id: 6,
      name: "Dermatology Intake1",
      specialty: "cardiologist",
      noteType: "DPD",
      content: "Another dermatology intake content...",
      sampleNote: "Another sample dermatology note..."
    }
  ];

  const createTemplateOptions = [
    {
      id: 1,
      title: 'Copy Previous Notes',
      description: "Reuse the last note you copied.",
      icon: (
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            backgroundColor: bravoColors.primaryFlat,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <ContentCopyIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
      ),
    },
    {
      id: 2,
      title: 'Generate Template',
      description: "AI-assisted template creation with summary.",
      icon: (
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            backgroundColor: bravoColors.primaryFlat,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <AutoFixHighIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
      ),
    },
    {
      id: 3,
      title: 'Start from Scratch',
      description: "Begin with a blank slate.",
      icon: (
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            backgroundColor: bravoColors.primaryFlat,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <EditNoteIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
      ),
    },
    {
      id: 4,
      title: 'Use Existing Template',
      description: "Copy-paste existing template.",
      icon: (
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            backgroundColor: bravoColors.primaryFlat,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <DescriptionIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
      ),
    },
    {
      id: 5,
      title: 'Template Library',
      description: "Access and manage all your templates.",
      icon: (
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            backgroundColor: bravoColors.primaryFlat,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <LibraryBooksIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
      ),
    },
  ];

  // Multi-step workflow handlers
  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleResetSteps = () => {
    setCurrentStep(0);
    setIsProcessing(false);
    setProcessedContent('');
    setAiSummary('');
  };

  // Simulate AI processing for different methods
  const simulateAIProcessing = async (content: string, method: string) => {
    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let result = '';
    let summary = '';
    
    switch (method) {
      case 'copyNotes':
        result = `Processed Template Content:\n\n${content}\n\n[AI has analyzed and structured your previous notes into a template format]`;
        summary = 'AI has successfully converted your previous notes into a structured template format, organizing key sections and improving readability.';
        break;
      case 'generateTemplate':
        result = `Generated Template Based on Description:\n\nSubjective:\n[Patient's description of symptoms and concerns]\n\nObjective:\n[Physical examination findings and vital signs]\n\nAssessment:\n[Clinical diagnosis and differential diagnosis]\n\nPlan:\n[Treatment plan and follow-up instructions]\n\n[AI generated this template based on: "${content}"]`;
        summary = 'AI has created a comprehensive template structure based on your description, following medical documentation best practices.';
        break;
      case 'existingTemplate':
        result = `Optimized Template Content:\n\n${content}\n\n[AI has reviewed and optimized the existing template for better structure and completeness]`;
        summary = 'AI has analyzed your existing template and made structural improvements while maintaining the original content intent.';
        break;
      default:
        result = content;
        summary = 'Content processed successfully.';
    }
    
    setProcessedContent(result);
    setAiSummary(summary);
    setIsProcessing(false);
    handleNextStep();
  };

  // Event handlers
  const handleConsultTypeSelect = (consultType: ConsultType) => {
    setSelectedConsultType(consultType);
    setCurrentScreen('templates');
  };

  const handleTemplateEdit = (template: TemplateData) => {
    setCurrentScreen('templateEditor');
    setOpenModifyTemplate(true);
    setShowTemplate(true);
    setSectionList([]);
  };

  const handleTemplateView = (template: TemplateData) => {
    setViewingTemplate(template);
    setCurrentScreen('templateView');
  };

  const handleBackToConsultTypes = () => {
    setCurrentScreen('consultTypes');
    setSelectedConsultType(null);
  };

  const handleBackToTemplates = () => {
    setCurrentScreen('templates');
    setOpenModifyTemplate(false);
    setShowTemplate(false);
    setViewingTemplate(null);
  };

  const handleCreateTemplateMethod = (method: any) => {
    setTemplateMethod(method);
    setCurrentStep(0);
    // Reset form states
    setTemplateName('');
    setPreviousNotes('');
    setTemplateDescription('');
    setExistingTemplateContent('');
    setSelectedLibraryTemplate(null);
    setProcessedContent('');
    setAiSummary('');
  };

  const handleAddType = () => {
    if (newTypeName.trim()) {
      const newType: ConsultType = {
        id: consultTypes.length + 1,
        name: newTypeName.trim(),
        isNew: true
      };
      setConsultTypes([...consultTypes, newType]);
      setNewTypeName('');
      setOpenAddType(false);
    }
  };

  const onCreateTemplate = async () => {
    // For methods 1, 2, 4 - go through the step process
    if ([1, 2, 4].includes(templateMethod.id)) {
      if (currentStep === 0) {
        // Validate first step
        if (!templateName.trim()) return;
        
        if (templateMethod.id === 1 && !previousNotes.trim()) return;
        if (templateMethod.id === 2 && !templateDescription.trim()) return;
        if (templateMethod.id === 4 && !existingTemplateContent.trim()) return;
        
        handleNextStep();
      } else if (currentStep === 1) {
        // Process content with AI
        let content = '';
        let method = '';
        
        if (templateMethod.id === 1) {
          content = previousNotes;
          method = 'copyNotes';
        } else if (templateMethod.id === 2) {
          content = templateDescription;
          method = 'generateTemplate';
        } else if (templateMethod.id === 4) {
          content = existingTemplateContent;
          method = 'existingTemplate';
        }
        
        await simulateAIProcessing(content, method);
      } else if (currentStep === 2) {
        // Final step - create template
        console.log("Create Template Data", {
          method: templateMethod,
          name: templateName,
          processedContent,
          aiSummary
        });
        
        setOpenCreateTemplate(false);
        handleResetSteps();
        setCurrentScreen('templateEditor');
        setOpenModifyTemplate(true);
        setShowTemplate(true);
        setSectionList([]);
      }
    } else {
      // For methods 3 and 5 - direct creation
      if (!templateName.trim()) return;
      
      if (templateMethod.id === 5 && !selectedLibraryTemplate) return;
      
      console.log("Create Template Data", {
        method: templateMethod,
        name: templateName,
        libraryTemplate: selectedLibraryTemplate
      });

      setOpenCreateTemplate(false);
      setCurrentScreen('templateEditor');
      setOpenModifyTemplate(true);
      setShowTemplate(true);
      setSectionList([]);
    }
  };

  // Get steps for current method
  const getStepsForMethod = (methodId: number) => {
    switch (methodId) {
      case 1: // Copy Previous Notes
        return [
          'Enter Template Details',
          'AI Processing',
          'Review & Confirm'
        ];
      case 2: // Generate Template
        return [
          'Describe Template',
          'AI Generation',
          'Review & Confirm'
        ];
      case 4: // Use Existing Template
        return [
          'Paste Template Content',
          'AI Optimization',
          'Review & Confirm'
        ];
      default:
        return [];
    }
  };

  // Render step content for multi-step workflows
  const renderStepContent = (methodId: number, step: number) => {
    switch (methodId) {
      case 1: // Copy Previous Notes
        if (step === 0) {
          return (
            <Box>
              <TextField
                fullWidth
                label="Template Name *"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Copy and paste your previous notes"
                placeholder="Paste the previous notes that you want to convert into a template..."
                value={previousNotes}
                onChange={(e) => setPreviousNotes(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Typography variant="body2" sx={{ color: bravoColors.text.secondary, mt: 2, fontStyle: 'italic' }}>
                AI will analyze your notes and create a structured template format.
              </Typography>
            </Box>
          );
        } else if (step === 1) {
          return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              {isProcessing ? (
                <>
                  <LinearProgress sx={{ mb: 3 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    AI is processing your notes...
                  </Typography>
                  <Typography variant="body2" sx={{ color: bravoColors.text.secondary }}>
                    This may take a few moments while we analyze and structure your content.
                  </Typography>
                </>
              ) : (
                <>
                  <CheckIcon sx={{ fontSize: 64, color: 'green', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Processing Complete!
                  </Typography>
                  <Typography variant="body2" sx={{ color: bravoColors.text.secondary }}>
                    Your notes have been successfully processed. Click Next to review.
                  </Typography>
                </>
              )}
            </Box>
          );
        } else if (step === 2) {
          return (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                AI Summary:
              </Typography>
              <Box sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: 2, mb: 3 }}>
                <Typography variant="body2">{aiSummary}</Typography>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Generated Template:
              </Typography>
              <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#f9f9f9', maxHeight: 300, overflowY: 'auto' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {processedContent}
                </Typography>
              </Box>
            </Box>
          );
        }
        break;
        
      case 2: // Generate Template
        if (step === 0) {
          return (
            <Box>
              <TextField
                fullWidth
                label="Template Name *"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Describe the template you want AI to create"
                placeholder="Describe what kind of template you need. For example: 'Create a cardiology consultation template for chest pain evaluation' or 'Generate a pediatric well-child visit template'..."
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Typography variant="body2" sx={{ color: bravoColors.text.secondary, mt: 2, fontStyle: 'italic' }}>
                Be as specific as possible about what you need in your template.
              </Typography>
            </Box>
          );
        } else if (step === 1) {
          return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              {isProcessing ? (
                <>
                  <LinearProgress sx={{ mb: 3 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    AI is generating your template...
                  </Typography>
                  <Typography variant="body2" sx={{ color: bravoColors.text.secondary }}>
                    Creating a customized template based on your description.
                  </Typography>
                </>
              ) : (
                <>
                  <CheckIcon sx={{ fontSize: 64, color: 'green', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Template Generated!
                  </Typography>
                  <Typography variant="body2" sx={{ color: bravoColors.text.secondary }}>
                    Your custom template has been created. Click Next to review.
                  </Typography>
                </>
              )}
            </Box>
          );
        } else if (step === 2) {
          return (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                AI Summary:
              </Typography>
              <Box sx={{ p: 2, backgroundColor: '#e8f5e8', borderRadius: 2, mb: 3 }}>
                <Typography variant="body2">{aiSummary}</Typography>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Generated Template:
              </Typography>
              <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#f9f9f9', maxHeight: 300, overflowY: 'auto' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {processedContent}
                </Typography>
              </Box>
            </Box>
          );
        }
        break;
        
      case 4: // Use Existing Template
        if (step === 0) {
          return (
            <Box>
              <TextField
                fullWidth
                label="Template Name *"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Copy and paste your existing template content"
                placeholder="Paste your existing template content here. AI will help optimize and structure it..."
                value={existingTemplateContent}
                onChange={(e) => setExistingTemplateContent(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Typography variant="body2" sx={{ color: bravoColors.text.secondary, mt: 2, fontStyle: 'italic' }}>
                AI will review and optimize your template for better structure and completeness.
              </Typography>
            </Box>
          );
        } else if (step === 1) {
          return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              {isProcessing ? (
                <>
                  <LinearProgress sx={{ mb: 3 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    AI is optimizing your template...
                  </Typography>
                  <Typography variant="body2" sx={{ color: bravoColors.text.secondary }}>
                    Analyzing structure and making improvements to your template.
                  </Typography>
                </>
              ) : (
                <>
                  <CheckIcon sx={{ fontSize: 64, color: 'green', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Optimization Complete!
                  </Typography>
                  <Typography variant="body2" sx={{ color: bravoColors.text.secondary }}>
                    Your template has been optimized. Click Next to review.
                  </Typography>
                </>
              )}
            </Box>
          );
        } else if (step === 2) {
          return (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                AI Summary:
              </Typography>
              <Box sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 2, mb: 3 }}>
                <Typography variant="body2">{aiSummary}</Typography>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Optimized Template:
              </Typography>
              <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#f9f9f9', maxHeight: 300, overflowY: 'auto' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {processedContent}
                </Typography>
              </Box>
            </Box>
          );
        }
        break;
    }
    return null;
  };

  // Render different content based on selected method
  const renderTemplateCreationContent = () => {
    if (!templateMethod.id) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
          {createTemplateOptions.map((option) => (
            <Box 
              key={option.id} 
              sx={{ 
                flexBasis: 'calc(50% - 12px)', 
                minWidth: 280,
                '@media (max-width: 900px)': {
                  flexBasis: '100%'
                }
              }}
            >
              <Card
                elevation={0}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s ease-in-out",
                  border: `2px solid ${bravoColors.highlight.border}`,
                  borderRadius: 3,
                  p: 2,
                  height: '100%',
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 12px 24px rgba(0,0,0,0.12)",
                    borderColor: bravoColors.secondary,
                  }
                }}
                onClick={() => handleCreateTemplateMethod(option)}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box display="flex" flexDirection="column" alignItems="flex-start" gap={1}>
                    {option.icon}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: bravoColors.text.primary, 
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      }}
                    >
                      {option.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: bravoColors.text.secondary,
                        fontSize: '0.9rem',
                        lineHeight: 1.4
                      }}
                    >
                      {option.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      );
    }

    // Multi-step workflow for methods 1, 2, 4
    if ([1, 2, 4].includes(templateMethod.id)) {
      const steps = getStepsForMethod(templateMethod.id);
      
      return (
        <Box sx={{ mt: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton onClick={() => setTemplateMethod({})} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              {templateMethod.title}
            </Typography>
          </Box>

          {/* Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={currentStep} orientation="horizontal">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Step Content */}
          <Box sx={{ mb: 4 }}>
            {renderStepContent(templateMethod.id, currentStep)}
          </Box>
        </Box>
      );
    }

    // Show specific form for methods 3 and 5 (single step)
    return (
      <Box sx={{ mt: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => setTemplateMethod({})} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
            {templateMethod.title}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Template Name *"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ mb: 3 }}
        />

        {/* Start from Scratch */}
        {templateMethod.id === 3 && (
          <Typography variant="body2" sx={{ color: bravoColors.text.secondary, fontStyle: 'italic' }}>
            You'll start with a blank template that you can customize completely.
          </Typography>
        )}

        {/* Template Library */}
        {templateMethod.id === 5 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
              Template Library
            </Typography>
            
            <Box display="flex" gap={2} mb={3} justifyContent="center">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Specialty</InputLabel>
                <Select
                  value={libraryFilters.specialty}
                  label="Specialty"
                  onChange={(e) => setLibraryFilters(prev => ({ ...prev, specialty: e.target.value }))}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="cardiologist">Cardiologist</MenuItem>
                  <MenuItem value="pyschologist">Psychologist</MenuItem>
                  <MenuItem value="Dermatology">Dermatology</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Note Type</InputLabel>
                <Select
                  value={libraryFilters.noteType}
                  label="Note Type"
                  onChange={(e) => setLibraryFilters(prev => ({ ...prev, noteType: e.target.value }))}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="SOAP">SOAP</MenuItem>
                  <MenuItem value="DPD">DPD</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 2,
                mb: 3
              }}
            >
              {filteredLibraryTemplates.map((template) => (
                <Card
                  key={template.id}
                  sx={{
                    cursor: 'pointer',
                    border: selectedLibraryTemplate?.id === template.id ? `2px solid ${bravoColors.primaryFlat}` : '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 2,
                    height: '100%',
                    '&:hover': {
                      borderColor: bravoColors.secondary,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                  onClick={() => setSelectedLibraryTemplate(template)}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                    {template.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: bravoColors.text.secondary, mb: 0.5 }}>
                    Specialty: {template.specialty}
                  </Typography>
                  <Typography variant="body2" sx={{ color: bravoColors.text.secondary }}>
                    Note Type: {template.noteType}
                  </Typography>
                </Card>
              ))}
            </Box>

            {selectedLibraryTemplate && (
              <Box sx={{ mt: 3, p: 2, border: '2px dashed #ccc', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Template Preview
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: bravoColors.text.secondary }}>
                  {selectedLibraryTemplate.content}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  };

  // Render Template Library Tab
  const renderTemplateLibrary = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600, mb: 4 }}>
        Template Library
      </Typography>
      
      <Box display="flex" gap={2} mb={3}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Specialty</InputLabel>
          <Select
            value={libraryFilters.specialty}
            label="Specialty"
            onChange={(e) => setLibraryFilters(prev => ({ ...prev, specialty: e.target.value }))}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="cardiologist">Cardiologist</MenuItem>
            <MenuItem value="pyschologist">Psychologist</MenuItem>
            <MenuItem value="Dermatology">Dermatology</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Note Type</InputLabel>
          <Select
            value={libraryFilters.noteType}
            label="Note Type"
            onChange={(e) => setLibraryFilters(prev => ({ ...prev, noteType: e.target.value }))}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="SOAP">SOAP</MenuItem>
            <MenuItem value="DPD">DPD</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3
        }}
      >
        {filteredLibraryTemplates.map((template) => (
          <Card
            key={template.id}
            sx={{
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              overflow: 'hidden',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderColor: bravoColors.secondary
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: bravoColors.text.primary }}>
                {template.name}
              </Typography>
              
              <Box display="flex" gap={1} mb={2}>
                <Chip 
                  label={`Specialty: ${template.specialty}`} 
                  size="small" 
                  sx={{ 
                    backgroundColor: bravoColors.primaryFlat, 
                    color: 'white',
                    fontSize: '0.75rem'
                  }} 
                />
                <Chip 
                  label={`Note Type: ${template.noteType}`} 
                  size="small" 
                  sx={{ 
                    backgroundColor: bravoColors.secondary, 
                    color: 'white',
                    fontSize: '0.75rem'
                  }} 
                />
              </Box>
              
              <Box display="flex" gap={1} mt={3}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleLibraryTemplatePreview(template)}
                  sx={{
                    borderColor: bravoColors.secondary,
                    color: bravoColors.secondary,
                    '&:hover': {
                      borderColor: bravoColors.primaryFlat,
                      backgroundColor: bravoColors.background.light
                    }
                  }}
                >
                  Preview
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );

  // Render Consult Types Screen
  const renderConsultTypes = () => (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
          Consult Type List
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddType(true)}
          sx={{
            backgroundColor: bravoColors.secondary,
            color: 'white',
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontSize: '0.9rem',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: bravoColors.primaryFlat,
            }
          }}
        >
          ADD TYPE
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {consultTypes.map((consultType) => (
          <Card
            key={consultType.id}
            sx={{
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-2px)',
              },
            }}
            onClick={() => handleConsultTypeSelect(consultType)}
          >
            <CardContent sx={{ py: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography
                  variant="h5"
                  sx={{
                    color: bravoColors.primaryFlat,
                    fontWeight: 600,
                    fontSize: '1.2rem'
                  }}
                >
                  {consultType.name}
                </Typography>
                {consultType.isNew && (
                  <Chip
                    label="New"
                    size="small"
                    sx={{
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );

  // Render Templates Screen
  const renderTemplates = () => (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
          {selectedConsultType?.name}
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToConsultTypes}
            sx={{
              backgroundColor: bravoColors.secondary,
              color: 'white',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: bravoColors.primaryFlat,
              }
            }}
          >
            BACK
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateTemplate(true)}
            sx={{
              backgroundColor: bravoColors.secondary,
              color: 'white',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: bravoColors.primaryFlat,
              }
            }}
          >
            ADD
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {templates.map((template) => (
          <Card
            key={template.id}
            sx={{
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography
                  variant="h6"
                  sx={{
                    color: bravoColors.primaryFlat,
                    fontWeight: 500,
                    fontSize: '1.1rem'
                  }}
                >
                  {template.title}
                </Typography>
                <IconButton
                  onClick={() => handleTemplateView(template)}
                  sx={{
                    color: bravoColors.secondary,
                    '&:hover': {
                      backgroundColor: bravoColors.highlight.hover,
                    }
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );

  // Render Template View Screen
  const renderTemplateView = () => (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton 
          onClick={handleBackToTemplates}
          sx={{ mr: 2, color: bravoColors.primaryFlat }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
          Template View: {viewingTemplate?.title}
        </Typography>
      </Box>
      
      {viewingTemplate && (
        <Card sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Template Content:
          </Typography>
          <Box sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {viewingTemplate.content || 'No content available for this template.'}
            </Typography>
          </Box>
          
          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => handleTemplateEdit(viewingTemplate)}
              sx={{
                backgroundColor: bravoColors.primaryFlat,
                color: 'white',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontSize: '0.9rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: bravoColors.secondary,
                }
              }}
            >
              EDIT TEMPLATE
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );

  // Render Template Editor Screen
  const renderTemplateEditor = () => (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton 
          onClick={handleBackToTemplates}
          sx={{ mr: 2, color: bravoColors.primaryFlat }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
          Verify Template Changes
        </Typography>
      </Box>
      
      <Typography sx={{ fontSize: 14, color: "#808080", width: '70%', mb: 4 }}>
        Based on its analysis, the AI has generated documentation improvements tailored to your template. 
        Please review and approve the suggested edits below.
      </Typography>

      <DragDropList onFinalApi={() => {}} />
    </Box>
  );

  // Main render logic for My Templates tab
  const renderMyTemplatesContent = () => {
    if (currentScreen === 'templateEditor' && openModifyTemplate && showTemplate) {
      return renderTemplateEditor();
    }

    if (currentScreen === 'templateView') {
      return renderTemplateView();
    }

    if (currentScreen === 'templates') {
      return renderTemplates();
    }

    return renderConsultTypes();
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                color: bravoColors.text.secondary,
                '&.Mui-selected': {
                  color: bravoColors.primaryFlat,
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: bravoColors.primaryFlat,
                height: 3,
              }
            }}
          >
            <Tab label="My Templates" />
            <Tab label="Template Library" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {currentTab === 0 && renderMyTemplatesContent()}
        {currentTab === 1 && renderTemplateLibrary()}
      </Box>

      {/* Add Type Dialog */}
      <Dialog
        open={openAddType}
        onClose={() => setOpenAddType(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            p: 2
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              Add New Consult Type
            </Typography>
            <IconButton onClick={() => setOpenAddType(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Consult Type Name"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mt: 2 }}
            placeholder="Enter consult type name"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenAddType(false)}
            variant="outlined"
            sx={{
              borderColor: bravoColors.secondary,
              color: bravoColors.secondary,
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 600,
              '&:hover': {
                borderColor: bravoColors.primaryFlat,
                backgroundColor: bravoColors.background.light,
              }
            }}
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleAddType}
            variant="contained"
            disabled={!newTypeName.trim()}
            sx={{
              backgroundColor: bravoColors.secondary,
              color: 'white',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: bravoColors.primaryFlat,
              },
              '&:disabled': {
                backgroundColor: '#ccc',
                color: '#666'
              }
            }}
          >
            ADD
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog
        open={openCreateTemplate}
        onClose={() => setOpenCreateTemplate(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            p: 2,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              Create Template
            </Typography>
            <IconButton onClick={() => setOpenCreateTemplate(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {renderTemplateCreationContent()}

          {templateMethod.id && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: bravoColors.text.secondary,
                mt: 3,
                textAlign: 'center',
                fontStyle: 'italic'
              }}
            >
              Always double-check the template to confirm it's correct, complete, and safe to use based on medical advice.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          {/* Multi-step navigation for methods 1, 2, 4 */}
          {[1, 2, 4].includes(templateMethod.id) ? (
            <>
              <Button 
                onClick={currentStep === 0 ? () => setOpenCreateTemplate(false) : handlePrevStep}
                variant="outlined"
                disabled={isProcessing}
                sx={{
                  borderColor: bravoColors.secondary,
                  color: bravoColors.secondary,
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: bravoColors.primaryFlat,
                    backgroundColor: bravoColors.background.light,
                  }
                }}
              >
                {currentStep === 0 ? 'CANCEL' : 'BACK'}
              </Button>
              <Button 
                onClick={onCreateTemplate}
                variant="contained"
                disabled={isProcessing || 
                  (currentStep === 0 && (!templateName.trim() || 
                    (templateMethod.id === 1 && !previousNotes.trim()) ||
                    (templateMethod.id === 2 && !templateDescription.trim()) ||
                    (templateMethod.id === 4 && !existingTemplateContent.trim())
                  )) ||
                  (currentStep === 1 && isProcessing)
                }
                sx={{
                  backgroundColor: bravoColors.secondary,
                  color: 'white',
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: bravoColors.primaryFlat,
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc',
                    color: '#666'
                  }
                }}
              >
                {currentStep === 0 ? 'NEXT' : currentStep === 1 ? (isProcessing ? 'PROCESSING...' : 'NEXT') : 'CREATE TEMPLATE'}
              </Button>
            </>
          ) : (
            // Single step navigation for methods 3 and 5
            <>
              <Button 
                onClick={() => setOpenCreateTemplate(false)}
                variant="outlined"
                sx={{
                  borderColor: bravoColors.secondary,
                  color: bravoColors.secondary,
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: bravoColors.primaryFlat,
                    backgroundColor: bravoColors.background.light,
                  }
                }}
              >
                BACK
              </Button>
              <Button 
                onClick={onCreateTemplate}
                variant="contained"
                disabled={!templateMethod.id || !templateName.trim() || 
                  (templateMethod.id === 5 && !selectedLibraryTemplate)
                }
                sx={{
                  backgroundColor: bravoColors.secondary,
                  color: 'white',
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: bravoColors.primaryFlat,
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc',
                    color: '#666'
                  }
                }}
              >
                {templateMethod.id === 5 ? 'IMPORT' : 'CREATE'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            p: 2,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              Preview Options
            </Typography>
            <IconButton onClick={() => setOpenPreview(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {previewTemplate && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {previewTemplate.name}
                </Typography>
                <Box display="flex" gap={1} mb={3}>
                  <Chip 
                    label={`Specialty: ${previewTemplate.specialty}`} 
                    size="small" 
                    sx={{ 
                      backgroundColor: bravoColors.primaryFlat, 
                      color: 'white',
                      fontSize: '0.75rem'
                    }} 
                  />
                  <Chip 
                    label={`Note Type: ${previewTemplate.noteType}`} 
                    size="small" 
                    sx={{ 
                      backgroundColor: bravoColors.secondary, 
                      color: 'white',
                      fontSize: '0.75rem'
                    }} 
                  />
                </Box>
              </Box>

              {/* Preview Type Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Select Preview Type:
                </Typography>
                <RadioGroup
                  value={previewType}
                  onChange={(e) => setPreviewType(e.target.value as 'template' | 'sample')}
                  row
                >
                  <FormControlLabel 
                    value="template" 
                    control={<Radio />} 
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <PreviewIcon sx={{ fontSize: 20 }} />
                        Template Preview
                      </Box>
                    }
                  />
                  <FormControlLabel 
                    value="sample" 
                    control={<Radio />} 
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <NoteIcon sx={{ fontSize: 20 }} />
                        Sample Note Preview
                      </Box>
                    }
                  />
                </RadioGroup>
              </Box>
              
              <Box sx={{ p: 3, border: '2px dashed #ccc', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {previewType === 'template' ? 'Template Content' : 'Sample Note Example'}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: bravoColors.text.primary, lineHeight: 1.6 }}>
                  {previewType === 'template' ? previewTemplate.content : previewTemplate.sampleNote}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenPreview(false)}
            variant="outlined"
            sx={{
              borderColor: bravoColors.secondary,
              color: bravoColors.secondary,
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 600,
              '&:hover': {
                borderColor: bravoColors.primaryFlat,
                backgroundColor: bravoColors.background.light,
              }
            }}
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleImportToMyTemplates}
            variant="contained"
            sx={{
              backgroundColor: bravoColors.secondary,
              color: 'white',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: bravoColors.primaryFlat,
              }
            }}
          >
            ADD TO LIBRARY
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Confirmation Dialog */}
      <Dialog
        open={openImportConfirm}
        onClose={() => setOpenImportConfirm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            p: 2
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              Import Template
            </Typography>
            <IconButton onClick={() => setOpenImportConfirm(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Select which consult type you want to add this template to:
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel>Select Consult Type</InputLabel>
            <Select
              value={selectedImportType}
              label="Select Consult Type"
              onChange={(e) => setSelectedImportType(e.target.value)}
            >
              {consultTypes.map((type) => (
                <MenuItem key={type.id} value={type.name}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenImportConfirm(false)}
            variant="outlined"
            sx={{
              borderColor: bravoColors.secondary,
              color: bravoColors.secondary,
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 600,
              '&:hover': {
                borderColor: bravoColors.primaryFlat,
                backgroundColor: bravoColors.background.light,
              }
            }}
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleConfirmImport}
            variant="contained"
            disabled={!selectedImportType}
            sx={{
              backgroundColor: bravoColors.secondary,
              color: 'white',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: bravoColors.primaryFlat,
              },
              '&:disabled': {
                backgroundColor: '#ccc',
                color: '#666'
              }
            }}
          >
            IMPORT
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TemplateBuilder;
