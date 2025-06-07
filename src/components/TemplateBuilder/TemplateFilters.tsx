
import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Stack, Button, Autocomplete, Typography, Divider } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
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

  return (
    <Box sx={{ mb: 3 }}>
      {/* Search and Basic Filters */}
      <Box sx={{
        display: 'flex',
        gap: 2,
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' }
      }}>
        <TextField
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="outlined"
          size="small"
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Specialty</InputLabel>
          <Select
            value={selectedSpecialty}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            label="Specialty"
          >
            {specialties.map((specialty) => (
              <MenuItem key={specialty} value={specialty}>
                {specialty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            label="Sort By"
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            startIcon={<ClearIcon />}
            variant="outlined"
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Clear
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TemplateFilters;
