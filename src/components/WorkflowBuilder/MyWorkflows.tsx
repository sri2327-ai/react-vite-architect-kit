
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  LinearProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  MoreVert as MoreIcon,
  Download as ImportIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

interface ImportedWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'error';
  lastRun?: string;
  blocks: WorkflowBlock[];
}

interface WorkflowBlock {
  id: string;
  type: string;
  name: string;
  config: any;
  position: { x: number; y: number };
}

const MyWorkflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<ImportedWorkflow[]>([
    {
      id: '1',
      name: 'Practice Fusion - Patient Visit Workflow',
      description: 'Complete patient encounter workflow with automated note generation',
      status: 'active',
      lastRun: '2024-01-15 14:30',
      blocks: []
    }
  ]);
  
  const [executeDialog, setExecuteDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ImportedWorkflow | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [executionStep, setExecutionStep] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const executionSteps = [
    'EHR Authentication',
    'MFA Verification',
    'Workflow Execution',
    'Complete'
  ];

  const handleExecuteWorkflow = (workflow: ImportedWorkflow) => {
    setSelectedWorkflow(workflow);
    setExecuteDialog(true);
    setExecutionStep(0);
    setCredentials({ username: '', password: '' });
    setOtpCode('');
    setMfaEnabled(false);
  };

  const handleStartExecution = async () => {
    if (!credentials.username || !credentials.password) return;
    
    setIsExecuting(true);
    setExecutionStep(1);
    
    // Simulate authentication
    setTimeout(() => {
      if (mfaEnabled) {
        setExecutionStep(1); // Wait for OTP
      } else {
        setExecutionStep(2);
        startWorkflowExecution();
      }
      setIsExecuting(false);
    }, 2000);
  };

  const handleMfaVerification = () => {
    if (!otpCode) return;
    
    setIsExecuting(true);
    setTimeout(() => {
      setExecutionStep(2);
      startWorkflowExecution();
    }, 1000);
  };

  const startWorkflowExecution = () => {
    setTimeout(() => {
      setExecutionStep(3);
      setIsExecuting(false);
      // Update workflow status
      if (selectedWorkflow) {
        setWorkflows(prev => prev.map(w => 
          w.id === selectedWorkflow.id 
            ? { ...w, status: 'active' as const, lastRun: new Date().toLocaleString() }
            : w
        ));
      }
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckIcon />;
      case 'error': return <ErrorIcon />;
      default: return <WarningIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {workflows.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ImportIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="text.secondary">
            No Workflows Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Import workflows from the Workflow Library to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<ImportIcon />}
            onClick={() => {
              // This would switch to workflow library tab
              console.log('Navigate to workflow library');
            }}
          >
            Go to Workflow Library
          </Button>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 3 
        }}>
          {workflows.map((workflow) => (
            <Card key={workflow.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {workflow.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {workflow.description}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    <MoreIcon />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    label={workflow.status.toUpperCase()}
                    color={getStatusColor(workflow.status)}
                    size="small"
                    icon={getStatusIcon(workflow.status)}
                  />
                  {workflow.lastRun && (
                    <Typography variant="caption" color="text.secondary">
                      Last run: {workflow.lastRun}
                    </Typography>
                  )}
                </Box>
              </CardContent>
              
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PlayIcon />}
                  onClick={() => handleExecuteWorkflow(workflow)}
                  disabled={workflow.status === 'error'}
                  sx={{ mb: 1 }}
                >
                  Execute Workflow
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                  Click to run this workflow with your EHR
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Workflow Execution Dialog */}
      <Dialog open={executeDialog} onClose={() => setExecuteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Execute Workflow: {selectedWorkflow?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Stepper activeStep={executionStep} alternativeLabel>
              {executionSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {isExecuting && <LinearProgress sx={{ mb: 2 }} />}

          {executionStep === 0 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Enter your EHR credentials to authenticate and execute the workflow
              </Alert>
              <TextField
                fullWidth
                label="EHR Username"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                sx={{ mb: 2 }}
                size="small"
              />
              <TextField
                fullWidth
                label="EHR Password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                sx={{ mb: 2 }}
                size="small"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mfaEnabled}
                    onChange={(e) => setMfaEnabled(e.target.checked)}
                  />
                }
                label="My EHR has Multi-Factor Authentication (MFA)"
              />
            </Box>
          )}

          {executionStep === 1 && mfaEnabled && (
            <Box>
              <Alert severity="warning" sx={{ mb: 3 }}>
                MFA detected. Please check your device for the OTP code and enter it below.
              </Alert>
              <TextField
                fullWidth
                label="Enter OTP Code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                inputProps={{ maxLength: 6 }}
                size="small"
              />
            </Box>
          )}

          {executionStep === 2 && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Authentication successful! Executing workflow...
              </Alert>
              <Typography variant="body2" color="text.secondary">
                The workflow is now running in your EHR system. You can monitor progress in the workflow dashboard.
              </Typography>
            </Box>
          )}

          {executionStep === 3 && (
            <Alert severity="success">
              Workflow executed successfully! Your EHR is now automated according to the configured workflow.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExecuteDialog(false)}>
            {executionStep === 3 ? 'Close' : 'Cancel'}
          </Button>
          {executionStep === 0 && (
            <Button
              variant="contained"
              onClick={handleStartExecution}
              disabled={!credentials.username || !credentials.password || isExecuting}
            >
              Authenticate & Start
            </Button>
          )}
          {executionStep === 1 && mfaEnabled && (
            <Button
              variant="contained"
              onClick={handleMfaVerification}
              disabled={!otpCode || isExecuting}
            >
              Verify OTP
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Workflow
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Workflow
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MyWorkflows;
