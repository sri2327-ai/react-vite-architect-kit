
import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography
} from '@mui/material';
import {
  Help,
  PlayArrow,
  AutoStories,
  WorkflowIcon,
  Refresh
} from '@mui/icons-material';
import { useTour } from '@/contexts/TourContext';
import { welcomeTour, templateBuilderTour, workflowBuilderTour } from '@/data/tours';

export const HelpButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { startTour, isTourCompleted } = useTour();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStartTour = (tour: any) => {
    startTour(tour);
    handleClose();
  };

  return (
    <>
      <IconButton
        data-tour-id="help-button"
        onClick={handleClick}
        size="small"
        sx={{ color: 'text.secondary' }}
        aria-label="Help and tours"
      >
        <Help />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 250 }
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2" color="text.secondary">
            Interactive Tours
          </Typography>
        </MenuItem>
        
        <MenuItem onClick={() => handleStartTour(welcomeTour)}>
          <ListItemIcon>
            <PlayArrow fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">
              Welcome Tour
              {isTourCompleted(welcomeTour.id) && (
                <Typography variant="caption" color="success.main" component="span" sx={{ ml: 1 }}>
                  ✓ Completed
                </Typography>
              )}
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleStartTour(templateBuilderTour)}>
          <ListItemIcon>
            <AutoStories fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">
              Template Builder Guide
              {isTourCompleted(templateBuilderTour.id) && (
                <Typography variant="caption" color="success.main" component="span" sx={{ ml: 1 }}>
                  ✓ Completed
                </Typography>
              )}
            </Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleStartTour(workflowBuilderTour)}>
          <ListItemIcon>
            <WorkflowIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">
              Workflow Builder Guide
              {isTourCompleted(workflowBuilderTour.id) && (
                <Typography variant="caption" color="success.main" component="span" sx={{ ml: 1 }}>
                  ✓ Completed
                </Typography>
              )}
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
