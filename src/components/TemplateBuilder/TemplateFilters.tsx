import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Stack, Button, Autocomplete, ToggleButtonGroup, ToggleButton, Typography, Divider } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterListIcon, Star as StarIcon, AccessTime as AccessTimeIcon, TrendingUp as TrendingUpIcon, Clear as ClearIcon } from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
interface TemplateFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSpecialty: string;
  onSpecialtyChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: 'all' | 'favorites' | 'recent';
  onViewModeChange: (mode: 'all' | 'favorites' | 'recent') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}
const TemplateFilters: React.FC<TemplateFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedSpecialty,
  onSpecialtyChange,
  selectedType,
  onTypeChange,
  selectedTags,
  onTagsChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
  hasActiveFilters
}) => {
  const specialties = ['All Specialties', 'General Medicine', 'Cardiology', 'Neurology', 'Dermatology', 'Psychiatry', 'Emergency Medicine', 'Pediatrics', 'Orthopedics'];
  const templateTypes = ['All Types', 'SOAP Note', 'Consultation', 'Progress Note', 'Procedure Note', 'Discharge Summary', 'H&P', 'Follow-up'];
  const commonTags = ['Urgent Care', 'Routine', 'Chronic Care', 'Preventive', 'Follow-up', 'New Patient', 'Telemedicine', 'Post-Op', 'Annual Exam'];
  const sortOptions = [{
    value: 'recent',
    label: 'Recently Used'
  }, {
    value: 'alphabetical',
    label: 'Alphabetical'
  }, {
    value: 'usage',
    label: 'Most Used'
  }, {
    value: 'created',
    label: 'Recently Created'
  }, {
    value: 'specialty',
    label: 'By Specialty'
  }];
  return <Box sx={{
    mb: 3
  }}>
      {/* Quick View Toggles */}
      <Box sx={{
      mb: 3
    }}>
        <ToggleButtonGroup value={viewMode} exclusive onChange={(_, newMode) => newMode && onViewModeChange(newMode)} sx={{
        '& .MuiToggleButton-root': {
          borderRadius: 3,
          textTransform: 'none',
          fontWeight: 600,
          px: 3,
          py: 1,
          border: '2px solid',
          borderColor: 'divider',
          '&.Mui-selected': {
            backgroundColor: bravoColors.primaryFlat,
            color: 'white',
            borderColor: bravoColors.primaryFlat,
            '&:hover': {
              backgroundColor: bravoColors.primaryDark
            }
          }
        }
      }}>
          <ToggleButton value="all">
            <FilterListIcon sx={{
            mr: 1,
            fontSize: 18
          }} />
            All Templates
          </ToggleButton>
          <ToggleButton value="favorites">
            <StarIcon sx={{
            mr: 1,
            fontSize: 18
          }} />
            Favorites
          </ToggleButton>
          
        </ToggleButtonGroup>
      </Box>

      {/* Search and Filters */}
      
    </Box>;
};
export default TemplateFilters;