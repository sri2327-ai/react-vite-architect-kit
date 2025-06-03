import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface SectionPlacementDialogProps {
  open: boolean;
  onClose: () => void;
  onPlaceSection: (position: number) => void;
  existingSections: Array<{ id: string; name: string; }>;
}

const SectionPlacementDialog: React.FC<SectionPlacementDialogProps> = ({
  open,
  onClose,
  onPlaceSection,
  existingSections
}) => {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  const handlePlacement = () => {
    if (selectedPosition !== null) {
      onPlaceSection(selectedPosition);
      setSelectedPosition(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Where would you like to add this section?
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Click where you'd like to move the section. The blue indicator shows where the section will be placed.
        </Typography>

        <List sx={{ mt: 2 }}>
          {/* Insert at beginning option */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setSelectedPosition(0)}
              selected={selectedPosition === 0}
              sx={{
                borderRadius: 1,
                mb: 1,
                backgroundColor: selectedPosition === 0 ? 'primary.light' : 'transparent',
                '&:hover': {
                  backgroundColor: selectedPosition === 0 ? 'primary.light' : 'action.hover'
                }
              }}
            >
              <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
              <ListItemText 
                primary="Insert at the beginning"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>

          {/* Existing sections with placement options */}
          {existingSections.map((section, index) => (
            <Box key={section.id}>
              <ListItem disablePadding>
                <ListItemText
                  primary={section.name}
                  secondary="Existing section"
                  sx={{ 
                    pl: 2,
                    py: 1,
                    backgroundColor: 'grey.50',
                    borderRadius: 1,
                    mb: 1
                  }}
                />
              </ListItem>
              
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setSelectedPosition(index + 1)}
                  selected={selectedPosition === index + 1}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: selectedPosition === index + 1 ? 'primary.light' : 'transparent',
                    '&:hover': {
                      backgroundColor: selectedPosition === index + 1 ? 'primary.light' : 'action.hover'
                    }
                  }}
                >
                  <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <ListItemText 
                    primary="Place Here"
                    primaryTypographyProps={{ 
                      fontWeight: 500,
                      color: selectedPosition === index + 1 ? 'primary.main' : 'text.primary'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Box>
          ))}
        </List>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handlePlacement}
          variant="contained"
          disabled={selectedPosition === null}
        >
          Place Section
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionPlacementDialog;
