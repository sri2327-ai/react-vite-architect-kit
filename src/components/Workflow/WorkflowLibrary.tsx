
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
  LocalHospital as VisitIcon,
  Edit as EditIcon,
  MapIcon
} from '@mui/icons-material';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  ehrSystem: string;
  category: string;
  blocks: WorkflowBlock[];
}

interface WorkflowBlock {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  name: string;
  description: string;
  icon: React.ReactNode;
  isEditable?: boolean;
  isNoteField?: boolean;
  config: any;
}

const WorkflowLibrary: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Mock user EHR - this would come from user profile
  const userEHR = 'Practice Fusion';

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
      isEditable: false,
      isNoteField: false
    },
    {
      id: 'provider-filter',
      type: 'action',
      name: 'Filter by Provider',
      description: 'Select your name from provider list',
      icon: <PersonIcon />,
      config: { dynamic: true, userInput: 'provider_name' },
      isEditable: true,
      isNoteField: false
    },
    {
      id: 'date-filter',
      type: 'action',
      name: 'Select Date',
      description: 'Choose appointment date',
      icon: <TodayIcon />,
      config: { automated: true, value: 'current_date' },
      isEditable: true,
      isNoteField: false
    },
    {
      id: 'patient-select',
      type: 'action',
      name: 'Select Patient',
      description: 'Click on patient from schedule',
      icon: <PersonIcon />,
      config: { userAction: true },
      isEditable: false,
      isNoteField: false
    },
    {
      id: 'chief-complaint',
      type: 'action',
      name: 'Chief Complaint',
      description: 'Document primary reason for visit - will map to your EHR field',
      icon: <NoteIcon />,
      config: { templateField: true, required: true },
      isEditable: true,
      isNoteField: true
    },
    {
      id: 'subjective',
      type: 'action',
      name: 'History & Review',
      description: 'Document patient history and symptoms - will map to your EHR field',
      icon: <NoteIcon />,
      config: { templateField: true, multiline: true },
      isEditable: true,
      isNoteField: true
    },
    {
      id: 'objective',
      type: 'action',
      name: 'Physical Exam',
      description: 'Record examination findings - will map to your EHR field',
      icon: <NoteIcon />,
      config: { templateField: true, multiline: true },
      isEditable: true,
      isNoteField: true
    },
    {
      id: 'assessment',
      type: 'action',
      name: 'Clinical Assessment',
      description: 'Document clinical impression - will map to your EHR field',
      icon: <NoteIcon />,
      config: { templateField: true, multiline: true },
      isEditable: true,
      isNoteField: true
    },
    {
      id: 'plan',
      type: 'action',
      name: 'Treatment Plan',
      description: 'Outline treatment approach - will map to your EHR field',
      icon: <NoteIcon />,
      config: { templateField: true, multiline: true },
      isEditable: true,
      isNoteField: true
    }
  ];

  // Predefined EHR workflows (not visit-type specific)
  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'pf-complete-encounter',
      name: 'Complete Patient Encounter',
      description: 'Full patient encounter workflow with comprehensive documentation',
      ehrSystem: 'Practice Fusion',
      category: 'Patient Encounter',
      blocks: workflowBlocks
    },
    {
      id: 'pf-quick-visit',
      name: 'Quick Visit Documentation',
      description: 'Streamlined workflow for brief encounters',
      ehrSystem: 'Practice Fusion',
      category: 'Patient Encounter',
      blocks: workflowBlocks.slice(0, 7)
    },
    {
      id: 'pf-prescription-only',
      name: 'Prescription Focused Visit',
      description: 'Workflow optimized for medication management visits',
      ehrSystem: 'Practice Fusion',
      category: 'Prescription',
      blocks: workflowBlocks.slice(0, 6)
    },
    {
      id: 'pf-follow-up',
      name: 'Follow-up Visit Workflow',
      description: 'Efficient workflow for follow-up appointments',
      ehrSystem: 'Practice Fusion',
      category: 'Patient Encounter',
      blocks: workflowBlocks.slice(0, 8)
    }
  ];

  const filteredWorkflows = workflowTemplates.filter(wf => {
    const ehrMatch = wf.ehrSystem === userEHR;
    const categoryMatch = selectedCategory === 'all' || wf.category === selectedCategory;
    return ehrMatch && categoryMatch;
  });

  const handleViewWorkflow = (workflow: WorkflowTemplate) => {
    setSelectedWorkflow(workflow);
    setViewDialog(true);
  };

  const handleImportWorkflow = (workflow: WorkflowTemplate) => {
    console.log('Importing workflow:', workflow.name);
    setViewDialog(false);
    // This will take user to configuration where they map to visit types and EHR fields
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
          <strong>EHR System:</strong> {userEHR} - These are predefined workflows that you can customize for your visit types
        </Typography>
      </Alert>

      {/* Category Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
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
                  <Chip label={workflow.category} size="small" color="secondary" />
                  <Chip label={`${workflow.blocks.filter(b => b.isEditable).length} Editable Steps`} size="small" color="primary" />
                  <Chip label={`${workflow.blocks.filter(b => b.isNoteField).length} Note Fields`} size="small" color="warning" />
                </Box>
              </Box>
              
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Workflow Steps: {workflow.blocks.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                After importing, you'll map this to your visit types and configure EHR field mappings
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
                Import & Configure
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
            Try adjusting your category filter
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
            <Chip label={`Category: ${selectedWorkflow?.category}`} color="secondary" />
            <Chip label={`EHR: ${selectedWorkflow?.ehrSystem}`} color="primary" />
          </Box>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Configuration Required:</strong> After importing, you'll need to:
              <br />• Map this workflow to your specific visit types
              <br />• Configure which EHR fields each note block should populate
              <br />• Customize editable steps for your practice patterns
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
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                      <Chip 
                        label={block.type} 
                        size="small" 
                        color={getBlockTypeColor(block.type)}
                      />
                      {block.isEditable && (
                        <Chip 
                          label="Editable" 
                          size="small" 
                          color="success"
                          icon={<EditIcon />}
                        />
                      )}
                      {block.isNoteField && (
                        <Chip 
                          label="Note Field" 
                          size="small" 
                          color="warning"
                          icon={<MapIcon />}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {block.description}
                </Typography>
              </Card>
            ))}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Alert severity="success">
            <Typography variant="body2">
              <strong>Next Steps:</strong> Import this workflow to start customizing it for your practice. 
              You'll be able to map it to multiple visit types and configure all EHR field mappings.
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
            Import & Configure
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowLibrary;
