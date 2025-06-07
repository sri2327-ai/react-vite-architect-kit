
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Help as HelpIcon,
  DragIndicator as DragIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  AutoFixHigh as AutoFixHighIcon,
  KeyboardArrowUp as UpIcon,
  KeyboardArrowDown as DownIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
  itemName?: string;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ open, onClose, itemName }) => {
  const theme = useTheme();

  const helpSections = [
    {
      title: 'Template Section Actions',
      items: [
        {
          icon: <EditIcon sx={{ fontSize: 20 }} />,
          title: 'Edit Section',
          description: 'Modify the section name, description, and content'
        },
        {
          icon: <CopyIcon sx={{ fontSize: 20 }} />,
          title: 'Duplicate Section',
          description: 'Create a copy of this section'
        },
        {
          icon: <DeleteIcon sx={{ fontSize: 20 }} />,
          title: 'Delete Section',
          description: 'Remove this section from the template'
        },
        {
          icon: <AutoFixHighIcon sx={{ fontSize: 20 }} />,
          title: 'AI Edit',
          description: 'Use AI to improve or modify the section content'
        }
      ]
    },
    {
      title: 'Navigation & Organization',
      items: [
        {
          icon: <DragIcon sx={{ fontSize: 20 }} />,
          title: 'Drag & Drop',
          description: 'Click and drag the handle to reorder sections'
        },
        {
          icon: <UpIcon sx={{ fontSize: 20 }} />,
          title: 'Move Up',
          description: 'Move this section up in the template order'
        },
        {
          icon: <DownIcon sx={{ fontSize: 20 }} />,
          title: 'Move Down',
          description: 'Move this section down in the template order'
        }
      ]
    },
    {
      title: 'Template Management',
      items: [
        {
          icon: <AddIcon sx={{ fontSize: 20 }} />,
          title: 'Add Section',
          description: 'Add new sections to your template from the library'
        }
      ]
    }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2,
        borderBottom: `1px solid ${alpha(bravoColors.primaryFlat, 0.1)}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: alpha(bravoColors.primaryFlat, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <HelpIcon sx={{ color: bravoColors.primaryFlat, fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: bravoColors.primaryFlat }}>
              Template Editor Help
            </Typography>
            {itemName && (
              <Typography variant="body2" color="text.secondary">
                Section: {itemName}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Learn how to use the template editor to create and manage your clinical note templates.
        </Typography>

        {helpSections.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: bravoColors.primaryFlat,
                mb: 2,
                fontSize: '1.1rem'
              }}
            >
              {section.title}
            </Typography>
            
            <List dense sx={{ bgcolor: alpha(bravoColors.primaryFlat, 0.02), borderRadius: 2, p: 0 }}>
              {section.items.map((item, itemIndex) => (
                <React.Fragment key={itemIndex}>
                  <ListItem sx={{ py: 1.5, px: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1.5,
                          backgroundColor: alpha(bravoColors.secondary, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: bravoColors.secondary
                        }}
                      >
                        {item.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {itemIndex < section.items.length - 1 && (
                    <Divider sx={{ mx: 2 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        ))}

        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: alpha(bravoColors.secondary, 0.05),
            border: `1px solid ${alpha(bravoColors.secondary, 0.2)}`,
            borderRadius: 2
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: bravoColors.secondary, mb: 1 }}>
            💡 Pro Tip
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the drag handle to quickly reorder sections, or use the Move Up/Down buttons for precise positioning. 
            The AI Edit feature can help you improve content based on your specific requirements.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{
            backgroundColor: bravoColors.primaryFlat,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            '&:hover': {
              backgroundColor: bravoColors.secondary
            }
          }}
        >
          Got it, thanks!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpDialog;
