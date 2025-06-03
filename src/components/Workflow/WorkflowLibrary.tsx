
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete
} from '@mui/material';
import {
  Download as ImportIcon,
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Today as TodayIcon,
  LocationOn as LocationIcon,
  Description as NoteIcon,
  Assignment as ChartIcon,
  LocalHospital as VisitIcon
} from '@mui/icons-material';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  ehrSystem: string;
  category: string;
  visitType: string;
  blocks: WorkflowBlock[];
}

interface WorkflowBlock {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  name: string;
  description: string;
  icon: React.ReactNode;
  templateMapping?: string;
  config: any;
  isEditable?: boolean;
  mappingOptions?: string[];
}

const WorkflowLibrary: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedVisitType, setSelectedVisitType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Mock user EHR - this would come from user profile
  const userEHR = 'Practice Fusion';

  // Available visit types for clinicians
  const visitTypes = [
    'Annual Physical',
    'Follow-up Visit',
    'Acute Care',
    'Preventive Care',
    'Specialist Consultation',
    'Urgent Care',
    'Telemedicine',
    'Pediatric Visit',
    'Geriatric Assessment'
  ];

  const categories = [
    'Patient Encounter',
    'Prescription',
    'Lab Review',
    'Imaging Review',
    'Care Coordination'
  ];

  const workflowBlocks: WorkflowBlock[] = [
    {
      id: 'schedule-menu',
      type: 'trigger',
      name: 'Access Schedule',
      description: 'Navigate to patient schedule interface',
      icon: <ScheduleIcon />,
      config: { automated: true },
      isEditable: false
    },
    {
      id: 'provider-filter',
      type: 'action',
      name: 'Filter by Provider',
      description: 'Select your name from provider list',
      icon: <PersonIcon />,
      config: { dynamic: true, userInput: 'provider_name' },
      isEditable: true
    },
    {
      id: 'date-filter',
      type: 'action',
      name: 'Select Date',
      description: 'Choose appointment date',
      icon: <TodayIcon />,
      config: { automated: true, value: 'current_date' },
      isEditable: true
    },
    {
      id: 'patient-select',
      type: 'action',
      name: 'Select Patient',
      description: 'Click on patient from schedule',
      icon: <PersonIcon />,
      config: { userAction: true },
      isEditable: false
    },
    {
      id: 'chief-complaint',
      type: 'action',
      name: 'Chief Complaint',
      description: 'Document primary reason for visit',
      icon: <NoteIcon />,
      templateMapping: 'chief_complaint_block',
      config: { templateField: true, required: true },
      isEditable: true,
      mappingOptions: ['Chief Complaint', 'Primary Concern', 'Reason for Visit', 'Main Issue']
    },
    {
      id: 'subjective',
      type: 'action',
      name: 'History & Review',
      description: 'Document patient history and symptoms',
      icon: <NoteIcon />,
      templateMapping: 'subjective_block',
      config: { templateField: true, multiline: true },
      isEditable: true,
      mappingOptions: ['History of Present Illness', 'Review of Systems', 'Past Medical History', 'Social History']
    },
    {
      id: 'objective',
      type: 'action',
      name: 'Physical Exam',
      description: 'Record examination findings',
      icon: <NoteIcon />,
      templateMapping: 'objective_block',
      config: { templateField: true, multiline: true },
      isEditable: true,
      mappingOptions: ['Physical Examination', 'Vital Signs', 'Clinical Findings', 'Objective Data']
    },
    {
      id: 'assessment',
      type: 'action',
      name: 'Clinical Assessment',
      description: 'Document clinical impression',
      icon: <NoteIcon />,
      templateMapping: 'assessment_block',
      config: { templateField: true, multiline: true },
      isEditable: true,
      mappingOptions: ['Assessment', 'Clinical Impression', 'Diagnosis', 'Problem List']
    },
    {
      id: 'plan',
      type: 'action',
      name: 'Treatment Plan',
      description: 'Outline treatment approach',
      icon: <NoteIcon />,
      templateMapping: 'plan_block',
      config: { templateField: true, multiline: true },
      isEditable: true,
      mappingOptions: ['Plan', 'Treatment Plan', 'Management', 'Next Steps']
    }
  ];

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'pf-annual-physical',
      name: 'Annual Physical Exam Workflow',
      description: 'Comprehensive annual physical examination with preventive care screening',
      ehrSystem: 'Practice Fusion',
      category: 'Patient Encounter',
      visitType: 'Annual Physical',
      blocks: workflowBlocks
    },
    {
      id: 'pf-followup-visit',
      name: 'Follow-up Visit Workflow',
      description: 'Streamlined follow-up visit for ongoing conditions',
      ehrSystem: 'Practice Fusion',
      category: 'Patient Encounter',
      visitType: 'Follow-up Visit',
      blocks: workflowBlocks.slice(0, 7)
    },
    {
      id: 'pf-acute-care',
      name: 'Acute Care Visit Workflow',
      description: 'Efficient workflow for urgent medical concerns',
      ehrSystem: 'Practice Fusion',
      category: 'Patient Encounter',
      visitType: 'Acute Care',
      blocks: workflowBlocks.slice(0, 8)
    },
    {
      id: 'pf-prescription',
      name: 'Prescription Management Workflow',
      description: 'Dedicated workflow for medication management',
      ehrSystem: 'Practice Fusion',
      category: 'Prescription',
      visitType: 'Follow-up Visit',
      blocks: workflowBlocks.slice(0, 6)
    }
  ];

  const filteredWorkflows = workflowTemplates.filter(wf => {
    const ehrMatch = wf.ehrSystem === userEHR;
    const visitMatch = selectedVisitType === 'all' || wf.visitType === selectedVisitType;
    const categoryMatch = selectedCategory === 'all' || wf.category === selectedCategory;
    return ehrMatch && visitMatch && categoryMatch;
  });

  const handleViewWorkflow = (workflow: WorkflowTemplate) => {
    setSelectedWorkflow(workflow);
    setViewDialog(true);
  };

  const handleImportWorkflow = (workflow: WorkflowTemplate) => {
    console.log('Importing workflow:', workflow.name);
    setViewDialog(false);
    // Navigate to My Workflows
  };

  const getBlockTypeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'primary';
      case 'action': return 'secondary';
      case 'condition': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>EHR System:</strong> {userEHR} - Showing workflows optimized for your practice
        </Typography>
      </Alert>

      {/* Filters */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
        gap: 2, 
        mb: 3 
      }}>
        <FormControl size="small">
          <InputLabel>Visit Type</InputLabel>
          <Select
            value={selectedVisitType}
            label="Visit Type"
            onChange={(e) => setSelectedVisitType(e.target.value)}
          >
            <MenuItem value="all">All Visit Types</MenuItem>
            {visitTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Workflow Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: 3 
      }}>
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <VisitIcon color="primary" />
                  <Typography variant="h6">
                    {workflow.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {workflow.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={workflow.visitType} size="small" color="primary" />
                  <Chip label={workflow.category} size="small" color="secondary" />
                </Box>
              </Box>
              
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Workflow Steps: {workflow.blocks.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Includes automated navigation, documentation, and template mapping
              </Typography>
            </CardContent>
            
            <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ViewIcon />}
                onClick={() => handleViewWorkflow(workflow)}
                size="small"
                sx={{ flex: 1 }}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                startIcon={<ImportIcon />}
                onClick={() => handleImportWorkflow(workflow)}
                size="small"
                sx={{ flex: 1 }}
              >
                Add to My Workflows
              </Button>
            </Box>
          </Card>
        ))}
      </Box>

      {filteredWorkflows.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <VisitIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom color="text.secondary">
            No workflows found for selected filters
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your visit type or category filters
          </Typography>
        </Box>
      )}

      {/* Workflow Details Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisitIcon color="primary" />
            {selectedWorkflow?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {selectedWorkflow?.description}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Chip label={`Visit Type: ${selectedWorkflow?.visitType}`} color="primary" />
            <Chip label={`Category: ${selectedWorkflow?.category}`} color="secondary" />
          </Box>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Template Integration:</strong> This workflow will map to your template fields. 
              You can customize field mappings after importing.
            </Typography>
          </Alert>

          <Typography variant="h6" gutterBottom>
            Workflow Steps ({selectedWorkflow?.blocks.length})
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 2 
          }}>
            {selectedWorkflow?.blocks.map((block, index) => (
              <Card key={block.id} variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ mr: 2, color: 'primary.main' }}>
                    {block.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2">
                      {index + 1}. {block.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip 
                        label={block.type} 
                        size="small" 
                        color={getBlockTypeColor(block.type)}
                      />
                      {block.isEditable && (
                        <Chip label="Editable" size="small" color="success" />
                      )}
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {block.description}
                </Typography>
                {block.templateMapping && (
                  <Typography variant="caption" color="primary">
                    Maps to: {block.templateMapping}
                  </Typography>
                )}
              </Card>
            ))}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Alert severity="success">
            <Typography variant="body2">
              <strong>Clinician-Friendly Design:</strong> After importing, you can customize each step, 
              map fields to your templates, and adjust the workflow to match your practice patterns.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<ImportIcon />}
            onClick={() => handleImportWorkflow(selectedWorkflow!)}
          >
            Import Workflow
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowLibrary;
