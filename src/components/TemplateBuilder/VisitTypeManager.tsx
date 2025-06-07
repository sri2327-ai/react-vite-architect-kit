
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import { InputField } from '@/components/form/InputField/InputField';
import { templateBuilderService } from '@/services/templateBuilderService';

interface VisitType {
  id: string;
  name: string;
  description?: string;
}

interface VisitTypeManagerProps {
  onVisitTypeSelect?: (visitType: VisitType) => void;
  isCreateDialogOpen?: boolean;
  onCloseCreateDialog?: () => void;
}

const VisitTypeManager: React.FC<VisitTypeManagerProps> = ({ 
  onVisitTypeSelect,
  isCreateDialogOpen = false,
  onCloseCreateDialog
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [visitTypes, setVisitTypes] = useState<VisitType[]>(() => {
    return templateBuilderService.getVisitTypes().map(vt => ({
      id: vt.id,
      name: vt.name,
      description: `Template for ${vt.name} appointments`
    }));
  });
  
  const [editingVisitType, setEditingVisitType] = useState<VisitType | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const handleEditVisitType = (visitType: VisitType) => {
    setFormData({ name: visitType.name });
    setEditingVisitType(visitType);
  };

  const handleSaveVisitType = () => {
    if (!formData.name.trim()) return;

    const visitTypeData = {
      id: editingVisitType?.id || `vt-${Date.now()}`,
      name: formData.name,
      description: `Template for ${formData.name} appointments`
    };

    if (editingVisitType) {
      setVisitTypes(prev => prev.map(vt => vt.id === editingVisitType.id ? visitTypeData : vt));
    } else {
      setVisitTypes(prev => [...prev, visitTypeData]);
    }

    if (onCloseCreateDialog) {
      onCloseCreateDialog();
    }
    setFormData({ name: '' });
    setEditingVisitType(null);
  };

  const handleDeleteVisitType = (id: string) => {
    setVisitTypes(prev => prev.filter(vt => vt.id !== id));
  };

  const handleVisitTypeClick = (visitType: VisitType) => {
    if (onVisitTypeSelect) {
      onVisitTypeSelect(visitType);
    }
  };

  const handleCloseDialog = () => {
    if (onCloseCreateDialog) {
      onCloseCreateDialog();
    }
    setFormData({ name: '' });
    setEditingVisitType(null);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: bravoColors.primaryFlat, 
            fontWeight: 600,
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Visit Types
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {visitTypes.map((visitType) => (
          <Grid key={visitType.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card 
              sx={{ 
                height: '100%',
                border: `1px solid ${bravoColors.primary}20`,
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: onVisitTypeSelect ? 'pointer' : 'default',
                '&:hover': {
                  borderColor: bravoColors.primaryFlat,
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${bravoColors.primaryFlat}20`
                }
              }}
              onClick={() => handleVisitTypeClick(visitType)}
            >
              <CardContent sx={{ pb: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      color: bravoColors.primaryFlat,
                      flex: 1,
                      fontSize: '1.1rem'
                    }}
                  >
                    {visitType.name}
                  </Typography>
                  {onVisitTypeSelect && (
                    <ChevronRightIcon sx={{ color: bravoColors.primaryFlat }} />
                  )}
                </Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ minHeight: 40, fontSize: '0.875rem' }}
                >
                  {visitType.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ pt: 0, justifyContent: 'flex-end', px: 3, pb: 2 }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditVisitType(visitType);
                  }}
                  sx={{ 
                    color: bravoColors.primaryFlat,
                    backgroundColor: `${bravoColors.primaryFlat}10`,
                    '&:hover': {
                      backgroundColor: `${bravoColors.primaryFlat}20`
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteVisitType(visitType.id);
                  }}
                  sx={{ 
                    color: 'error.main',
                    backgroundColor: 'error.main10',
                    '&:hover': {
                      backgroundColor: 'error.main20'
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {visitTypes.length === 0 && (
        <Box sx={{
          textAlign: 'center',
          py: 6,
          color: 'text.secondary'
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No visit types created yet
          </Typography>
          <Typography variant="body2">
            Create your first visit type to start organizing your templates.
          </Typography>
        </Box>
      )}

      <Dialog
        open={isCreateDialogOpen || !!editingVisitType}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2
          }
        }}
      >
        <DialogTitle>
          {editingVisitType ? 'Edit Visit Type' : 'Create New Visit Type'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <InputField
              name="name"
              label="Visit Type Name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Office Visit, Follow-up, Annual Physical"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveVisitType}
            variant="contained"
            disabled={!formData.name.trim()}
            sx={{
              backgroundColor: bravoColors.primaryFlat,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: bravoColors.secondary
              }
            }}
          >
            {editingVisitType ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VisitTypeManager;
