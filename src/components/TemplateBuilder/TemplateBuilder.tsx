
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
  MenuItem
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
  Circle as CircleIcon
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
}

interface ConsultType {
  id: number;
  name: string;
  isNew?: boolean;
}

const TemplateBuilder: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<'consultTypes' | 'templates' | 'templateEditor'>('consultTypes');
  const [selectedConsultType, setSelectedConsultType] = useState<ConsultType | null>(null);
  
  // Modal states
  const [openCreateTemplate, setOpenCreateTemplate] = useState(false);
  const [openModifyTemplate, setOpenModifyTemplate] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [templateMethod, setTemplateMethod] = useState<any>({});
  const [sectionList, setSectionList] = useState<any[]>([]);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [openAddSection, setOpenAddSection] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Form controls
  const { control, handleSubmit, formState: { errors }, trigger, getValues } = useForm();

  // Sample data
  const consultTypes: ConsultType[] = [
    { id: 1, name: "SOAP NOTE", isNew: true },
    { id: 2, name: "SOAP NOTE VIRTUAL", isNew: true },
  ];

  const templates: TemplateData[] = [
    { id: 1, title: "template 01", specialty: "General", type: "SOAP", fields: [] },
    { id: 2, title: "template 02", specialty: "General", type: "SOAP", fields: [] },
    { id: 3, title: "template 03", specialty: "General", type: "SOAP", fields: [] },
    { id: 4, title: "template 04", specialty: "General", type: "SOAP", fields: [] },
    { id: 5, title: "template 05", specialty: "General", type: "SOAP", fields: [] },
    { id: 6, title: "template 05", specialty: "General", type: "SOAP", fields: [] },
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

  // Event handlers
  const handleConsultTypeSelect = (consultType: ConsultType) => {
    setSelectedConsultType(consultType);
    setCurrentScreen('templates');
  };

  const handleTemplateEdit = (template: TemplateData) => {
    setCurrentScreen('templateEditor');
    setOpenModifyTemplate(true);
    setShowTemplate(true);
    // Initialize with sample data
    setSectionList([]);
  };

  const handleTemplateView = (template: TemplateData) => {
    console.log('View template:', template);
  };

  const handleBackToConsultTypes = () => {
    setCurrentScreen('consultTypes');
    setSelectedConsultType(null);
  };

  const handleBackToTemplates = () => {
    setCurrentScreen('templates');
    setOpenModifyTemplate(false);
    setShowTemplate(false);
  };

  const onCreateTemplate = async () => {
    const isValid = await trigger();
    if (isValid) {
      const data = getValues();
      console.log("Create Template Data", data);
      setOpenCreateTemplate(false);
      setCurrentScreen('templateEditor');
      setOpenModifyTemplate(true);
      setShowTemplate(true);
      setSectionList([]);
    }
  };

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

  // Main render logic
  const renderContent = () => {
    if (currentScreen === 'templateEditor' && openModifyTemplate && showTemplate) {
      return renderTemplateEditor();
    }

    if (currentScreen === 'templates') {
      return renderTemplates();
    }

    return renderConsultTypes();
  };

  return (
    <>
      {renderContent()}

      {/* Create Template Dialog */}
      <Dialog
        open={openCreateTemplate}
        onClose={() => setOpenCreateTemplate(false)}
        maxWidth="md"
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
              Create Template
            </Typography>
            <IconButton onClick={() => setOpenCreateTemplate(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
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
                    },
                    "&.selected": {
                      borderColor: bravoColors.primaryFlat,
                      backgroundColor: bravoColors.highlight.selected,
                    }
                  }}
                  onClick={() => setTemplateMethod(option)}
                  className={templateMethod.id === option.id ? 'selected' : ''}
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
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenCreateTemplate(false)}
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
            BACK
          </Button>
          <Button 
            onClick={onCreateTemplate}
            variant="contained"
            disabled={!templateMethod.id}
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
            CREATE
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TemplateBuilder;
