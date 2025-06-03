import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Divider,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Psychology as PsychologyIcon,
  LocalHospital as MedicalIcon,
  LocalPharmacy as PharmacyIcon,
  Warning as WarningIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  TextFields as TextFieldsIcon,
  Title as TitleIcon,
  List as ListIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { bravoColors } from '@/theme/colors';

interface TemplateSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'checkbox' | 'dropdown' | 'exam_list' | 'paragraph' | 'section_header';
  options?: string[];
  subsections?: Array<{
    id: string;
    title: string;
    instruction?: string;
  }>;
  aiInstruction?: string;
}

interface TemplateEditorProps {
  templateName: string;
  initialSections?: TemplateSection[];
  onSave: (sections: TemplateSection[]) => void;
  onBack: () => void;
}

const PREDEFINED_SECTIONS = [
  {
    id: 'past-psychiatric',
    title: 'Past Psychiatric History',
    description: "Patient's history of psychiatric conditions and treatments",
    icon: <PsychologyIcon />,
    type: 'paragraph' as const,
    content: "Document the patient's history of psychiatric conditions and treatments"
  },
  {
    id: 'medical-history',
    title: 'Medical History',
    description: "Patient's history of medical conditions",
    icon: <MedicalIcon />,
    type: 'paragraph' as const,
    content: "Patient's history of medical conditions"
  },
  {
    id: 'surgical-history',
    title: 'Surgical History',
    description: "Patient's history of surgical procedures",
    icon: <MedicalIcon />,
    type: 'paragraph' as const,
    content: "Patient's history of surgical procedures"
  },
  {
    id: 'current-medications',
    title: 'Current Medications',
    description: "List of patient's current medications",
    icon: <PharmacyIcon />,
    type: 'list' as const,
    content: "List of patient's current medications"
  },
  {
    id: 'allergies',
    title: 'Allergies',
    description: "Patient's allergies to medications, foods, or other substances",
    icon: <WarningIcon />,
    type: 'list' as const,
    content: "Patient's allergies to medications, foods, or other substances"
  },
  {
    id: 'substance-use',
    title: 'Substance Use History',
    description: "Patient's history of substance use",
    icon: <WarningIcon />,
    type: 'paragraph' as const,
    content: "Patient's history of substance use"
  },
  {
    id: 'treatment-history',
    title: 'Treatment History',
    description: "Patient's history of substance use treatment",
    icon: <MedicalIcon />,
    type: 'paragraph' as const,
    content: "Patient's history of substance use treatment"
  },
  {
    id: 'family-history',
    title: 'Family History',
    description: "Patient's family psychiatric history",
    icon: <PsychologyIcon />,
    type: 'paragraph' as const,
    content: "Patient's family psychiatric history"
  },
  {
    id: 'plan',
    title: 'Plan',
    description: 'Comprehensive treatment plan with interventions',
    icon: <AssignmentIcon />,
    type: 'paragraph' as const,
    content: 'Comprehensive treatment plan with interventions'
  },
  {
    id: 'developmental-history',
    title: 'Developmental History',
    description: "Patient's developmental history and milestones",
    icon: <SchoolIcon />,
    type: 'paragraph' as const,
    content: "Patient's developmental history and milestones"
  },
  {
    id: 'academic-history',
    title: 'Academic History',
    description: "Patient's academic performance and school history",
    icon: <SchoolIcon />,
    type: 'paragraph' as const,
    content: "Patient's academic performance and school history"
  },
  {
    id: 'todo-next-steps',
    title: 'To-do and Next Steps',
    description: 'Action items for provider and patient before next visit',
    icon: <CheckCircleIcon />,
    type: 'list' as const,
    content: 'Action items for provider and patient before next visit'
  }
];

const CUSTOM_SECTION_TYPES = [
  {
    id: 'paragraph',
    title: 'Paragraph',
    description: 'Add a paragraph for general note-taking or documentation.',
    icon: <TextFieldsIcon />
  },
  {
    id: 'section_header',
    title: 'Section Header',
    description: 'Insert a section header to organize and separate content.',
    icon: <TitleIcon />
  },
  {
    id: 'exam_list',
    title: 'Exam List',
    description: 'Use this for structured lists of exam observations or findings.',
    icon: <ListIcon />
  },
  {
    id: 'list',
    title: 'Bullet List',
    description: 'Create a bullet list for multiple items.',
    icon: <ListIcon />
  }
];

const SortableSection: React.FC<{
  section: TemplateSection;
  onEdit: (section: TemplateSection) => void;
  onDelete: (id: string) => void;
  onEditAI: (section: TemplateSection) => void;
}> = ({ section, onEdit, onDelete, onEditAI }) => {
  const [expanded, setExpanded] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <IconButton
            {...attributes}
            {...listeners}
            sx={{ 
              cursor: 'grab',
              color: bravoColors.text.secondary,
              mt: -1,
              '&:active': { cursor: 'grabbing' }
            }}
          >
            <DragIndicatorIcon />
          </IconButton>
          
          <Box flex={1}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: bravoColors.text.primary }}>
                {section.title} - {section.type.replace('_', ' ')}
              </Typography>
              <Box display="flex" gap={1}>
                <IconButton size="small" onClick={() => onEdit(section)}>
                  <EditIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(section.id)}>
                  <DeleteIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ color: bravoColors.text.secondary, mb: 2 }}>
              {section.content}
            </Typography>

            {section.type === 'exam_list' && section.subsections && (
              <Box mb={2}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Exam Sections:
                </Typography>
                {section.subsections.map((subsection, index) => (
                  <Box key={subsection.id} display="flex" alignItems="center" mb={0.5}>
                    <Typography variant="body2" sx={{ color: bravoColors.text.primary }}>
                      • {subsection.title}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            
            {section.options && section.options.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                {section.options.map((option, index) => (
                  <Chip
                    key={index}
                    label={option}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                ))}
              </Box>
            )}

            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEditAI(section)}
                sx={{
                  backgroundColor: bravoColors.secondary,
                  color: 'white',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  '&:hover': {
                    backgroundColor: bravoColors.primaryFlat
                  }
                }}
              >
                Edit Instruction for A.I
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<HelpIcon />}
                sx={{
                  borderColor: bravoColors.secondary,
                  color: bravoColors.secondary,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase'
                }}
              >
                Help Me
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  templateName,
  initialSections = [],
  onSave,
  onBack
}) => {
  const [sections, setSections] = useState<TemplateSection[]>(initialSections);
  const [openAddSection, setOpenAddSection] = useState(false);
  const [openCustomSection, setOpenCustomSection] = useState(false);
  const [openExamListEditor, setOpenExamListEditor] = useState(false);
  const [openAIInstructionEditor, setOpenAIInstructionEditor] = useState(false);
  const [editingSection, setEditingSection] = useState<TemplateSection | null>(null);
  const [selectedPredefinedSection, setSelectedPredefinedSection] = useState<any>(null);
  const [customSectionForm, setCustomSectionForm] = useState({
    title: '',
    description: '',
    type: 'paragraph' as const
  });
  const [examListForm, setExamListForm] = useState({
    title: '',
    subsections: [
      { id: '1', title: 'Past Psychiatric Diagnoses' },
      { id: '2', title: 'Psychiatric Hospitalizations' },
      { id: '3', title: 'Suicide Attempts' },
      { id: '4', title: 'Self-Injurious Behavior' },
      { id: '5', title: 'Psychiatric Medication Trials' },
      { id: '6', title: 'Previous mental health treatment' }
    ]
  });
  const [aiInstructionForm, setAIInstructionForm] = useState({
    instruction: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddPredefinedSection = (predefinedSection: any) => {
    const newSection: TemplateSection = {
      id: `section-${Date.now()}`,
      title: predefinedSection.title,
      content: predefinedSection.content,
      type: predefinedSection.type,
      options: predefinedSection.type === 'list' ? [''] : undefined
    };

    setSections(prev => [...prev, newSection]);
    setOpenAddSection(false);
  };

  const handleCreateCustomSection = () => {
    setOpenAddSection(false);
    setOpenCustomSection(true);
  };

  const handleSaveCustomSection = () => {
    if (customSectionForm.type === 'exam_list') {
      setOpenCustomSection(false);
      setOpenExamListEditor(true);
      setExamListForm(prev => ({ ...prev, title: customSectionForm.title }));
    } else {
      const newSection: TemplateSection = {
        id: `section-${Date.now()}`,
        title: customSectionForm.title,
        content: customSectionForm.description,
        type: customSectionForm.type
      };

      setSections(prev => [...prev, newSection]);
      setOpenCustomSection(false);
      setCustomSectionForm({ title: '', description: '', type: 'paragraph' });
    }
  };

  const handleSaveExamList = () => {
    const newSection: TemplateSection = {
      id: `section-${Date.now()}`,
      title: examListForm.title,
      content: 'A.I. will craft an examination list in a structured format, as instructed.',
      type: 'exam_list',
      subsections: examListForm.subsections
    };

    setSections(prev => [...prev, newSection]);
    setOpenExamListEditor(false);
    setExamListForm({
      title: '',
      subsections: [
        { id: '1', title: 'Past Psychiatric Diagnoses' },
        { id: '2', title: 'Psychiatric Hospitalizations' },
        { id: '3', title: 'Suicide Attempts' },
        { id: '4', title: 'Self-Injurious Behavior' },
        { id: '5', title: 'Psychiatric Medication Trials' },
        { id: '6', title: 'Previous mental health treatment' }
      ]
    });
  };

  const handleEditSection = (section: TemplateSection) => {
    // Handle different edit modes based on section type
    console.log('Edit section:', section);
  };

  const handleDeleteSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
  };

  const handleEditAI = (section: TemplateSection) => {
    setEditingSection(section);
    setAIInstructionForm({ instruction: section.aiInstruction || '' });
    setOpenAIInstructionEditor(true);
  };

  const handleSaveAIInstruction = () => {
    if (editingSection) {
      setSections(prev => prev.map(section => 
        section.id === editingSection.id 
          ? { ...section, aiInstruction: aiInstructionForm.instruction }
          : section
      ));
    }
    setOpenAIInstructionEditor(false);
    setEditingSection(null);
  };

  const handleAddSubsection = () => {
    setExamListForm(prev => ({
      ...prev,
      subsections: [...prev.subsections, { id: Date.now().toString(), title: '' }]
    }));
  };

  const handleRemoveSubsection = (id: string) => {
    setExamListForm(prev => ({
      ...prev,
      subsections: prev.subsections.filter(sub => sub.id !== id)
    }));
  };

  const handleSubsectionChange = (id: string, title: string) => {
    setExamListForm(prev => ({
      ...prev,
      subsections: prev.subsections.map(sub => 
        sub.id === id ? { ...sub, title } : sub
      )
    }));
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={onBack} sx={{ mr: 2, color: bravoColors.primaryFlat }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
            {templateName}
          </Typography>
        </Box>
        
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddSection(true)}
            sx={{
              backgroundColor: bravoColors.secondary,
              color: 'white',
              borderRadius: 2,
              textTransform: 'uppercase',
              '&:hover': {
                backgroundColor: bravoColors.primaryFlat
              }
            }}
          >
            Add Section
          </Button>
          <Button
            variant="contained"
            onClick={() => onSave(sections)}
            sx={{
              backgroundColor: bravoColors.primaryFlat,
              color: 'white',
              borderRadius: 2,
              textTransform: 'uppercase'
            }}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ backgroundColor: bravoColors.secondary, height: 4, borderRadius: 2, mb: 4 }} />

      {/* Sections List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              onEdit={handleEditSection}
              onDelete={handleDeleteSection}
              onEditAI={handleEditAI}
            />
          ))}
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            border: '2px dashed #ccc',
            borderRadius: 2,
            backgroundColor: '#f9f9f9'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: bravoColors.text.secondary }}>
            No sections added yet
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: bravoColors.text.secondary }}>
            Start building your template by adding sections
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddSection(true)}
            sx={{
              backgroundColor: bravoColors.primaryFlat,
              color: 'white',
              borderRadius: 2
            }}
          >
            ADD FIRST SECTION
          </Button>
        </Box>
      )}

      {/* Add Section Dialog */}
      <Dialog
        open={openAddSection}
        onClose={() => setOpenAddSection(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2, height: '80vh' }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              Add section
            </Typography>
            <IconButton onClick={() => setOpenAddSection(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              border: '2px dashed #ccc',
              borderRadius: 2,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { borderColor: bravoColors.secondary }
            }}
            onClick={handleCreateCustomSection}
          >
            <Typography variant="body1" sx={{ color: bravoColors.text.secondary }}>
              Can't find the section you need?{' '}
              <Typography component="span" sx={{ color: bravoColors.secondary, fontWeight: 600 }}>
                Click here to Create your own!
              </Typography>
            </Typography>
          </Paper>

          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Predefined Sections
          </Typography>

          <Grid container spacing={2}>
            {PREDEFINED_SECTIONS.map((section) => (
              <Grid xs={12} md={4} key={section.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => handleAddPredefinedSection(section)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      {section.icon}
                      <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
                        {section.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: bravoColors.text.secondary }}>
                      {section.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Custom Section Dialog */}
      <Dialog
        open={openCustomSection}
        onClose={() => setOpenCustomSection(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              Create Custom Section
            </Typography>
            <IconButton onClick={() => setOpenCustomSection(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Explain the type of content you want to generate.
            </Typography>
            <Typography variant="body2" sx={{ color: bravoColors.text.secondary }}>
              Example: A comprehensive mental status exam with sections for appearance, behavior, mood, affect, and thought process
            </Typography>
          </Paper>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Describe what you want"
            value={customSectionForm.description}
            onChange={(e) => setCustomSectionForm(prev => ({ ...prev, description: e.target.value }))}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Define From Scratch
          </Typography>

          <Stack spacing={2}>
            {CUSTOM_SECTION_TYPES.map((type) => (
              <Paper
                key={type.id}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: customSectionForm.type === type.id ? `2px solid ${bravoColors.secondary}` : '1px solid #e0e0e0',
                  '&:hover': { borderColor: bravoColors.secondary }
                }}
                onClick={() => setCustomSectionForm(prev => ({ ...prev, type: type.id as any }))}
              >
                <Box display="flex" alignItems="center">
                  {type.icon}
                  <Box ml={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {type.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: bravoColors.text.secondary }}>
                      {type.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenCustomSection(false)}
            variant="outlined"
            sx={{ borderColor: bravoColors.secondary, color: bravoColors.secondary }}
          >
            BACK
          </Button>
          <Button
            onClick={handleSaveCustomSection}
            variant="contained"
            disabled={!customSectionForm.description.trim()}
            sx={{
              backgroundColor: bravoColors.secondary,
              color: 'white',
              '&:hover': { backgroundColor: bravoColors.primaryFlat }
            }}
          >
            GENERATE
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exam List Editor Dialog */}
      <Dialog
        open={openExamListEditor}
        onClose={() => setOpenExamListEditor(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              Add section Exam List
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6" sx={{ color: bravoColors.text.secondary }}>
                How this works
              </Typography>
              <IconButton onClick={() => setOpenExamListEditor(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box display="flex" gap={4}>
            <Box flex={1}>
              <TextField
                fullWidth
                label="Title"
                value={examListForm.title}
                onChange={(e) => setExamListForm(prev => ({ ...prev, title: e.target.value }))}
                variant="outlined"
                size="small"
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                What exam sections would you like A.I. to report on?
              </Typography>

              <Stack spacing={1}>
                {examListForm.subsections.map((subsection, index) => (
                  <Box key={subsection.id} display="flex" alignItems="center" gap={1}>
                    <DeleteIcon sx={{ color: 'red', cursor: 'pointer' }} onClick={() => handleRemoveSubsection(subsection.id)} />
                    <TextField
                      fullWidth
                      size="small"
                      value={subsection.title}
                      onChange={(e) => handleSubsectionChange(subsection.id, e.target.value)}
                      variant="outlined"
                    />
                    <ExpandMoreIcon />
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box flex={1} sx={{ pl: 2, borderLeft: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                How this works
              </Typography>
              
              <Box mb={3}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Review each subsection
                </Typography>
                <Typography variant="body2" sx={{ color: bravoColors.text.secondary }}>
                  An exam-list is a structured output, with each subsection as it's own instruction for A.I. You can add, remove, or edit sections.
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Tell A.I what to focus on
                </Typography>
                <Typography variant="body2" sx={{ color: bravoColors.text.secondary }}>
                  For each section, you can tell A.I what to write for that subsection.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Decide Normal Limits Behavior
                </Typography>
                <Typography variant="body2" sx={{ color: bravoColors.text.secondary }}>
                  You can specify certain default "within normal limits" text, and decide when you want A.I to fall back to that text.
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenExamListEditor(false)}
            variant="outlined"
            sx={{ borderColor: bravoColors.secondary, color: bravoColors.secondary }}
          >
            BACK
          </Button>
          <Button
            onClick={handleSaveExamList}
            variant="contained"
            disabled={!examListForm.title.trim()}
            sx={{
              backgroundColor: bravoColors.secondary,
              color: 'white',
              '&:hover': { backgroundColor: bravoColors.primaryFlat }
            }}
          >
            UPDATE
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Instruction Editor Dialog */}
      <Dialog
        open={openAIInstructionEditor}
        onClose={() => setOpenAIInstructionEditor(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              Edit AI Instructions
            </Typography>
            <IconButton onClick={() => setOpenAIInstructionEditor(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Provide specific instructions for how AI should handle this section:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="Enter detailed instructions for AI..."
            value={aiInstructionForm.instruction}
            onChange={(e) => setAIInstructionForm(prev => ({ ...prev, instruction: e.target.value }))}
            variant="outlined"
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenAIInstructionEditor(false)}
            variant="outlined"
            sx={{ borderColor: bravoColors.secondary, color: bravoColors.secondary }}
          >
            CANCEL
          </Button>
          <Button
            onClick={handleSaveAIInstruction}
            variant="contained"
            sx={{
              backgroundColor: bravoColors.secondary,
              color: 'white',
              '&:hover': { backgroundColor: bravoColors.primaryFlat }
            }}
          >
            SAVE INSTRUCTIONS
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateEditor;
