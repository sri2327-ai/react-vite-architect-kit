
import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Button,
  Autocomplete,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
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
  const specialties = [
    'All Specialties',
    'General Medicine',
    'Cardiology',
    'Neurology',
    'Dermatology',
    'Psychiatry',
    'Emergency Medicine',
    'Pediatrics',
    'Orthopedics'
  ];

  const templateTypes = [
    'All Types',
    'SOAP Note',
    'Consultation',
    'Progress Note',
    'Procedure Note',
    'Discharge Summary',
    'H&P',
    'Follow-up'
  ];

  const commonTags = [
    'Urgent Care',
    'Routine',
    'Chronic Care',
    'Preventive',
    'Follow-up',
    'New Patient',
    'Telemedicine',
    'Post-Op',
    'Annual Exam'
  ];

  const sortOptions = [
    { value: 'recent', label: 'Recently Used' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'usage', label: 'Most Used' },
    { value: 'created', label: 'Recently Created' },
    { value: 'specialty', label: 'By Specialty' }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Quick View Toggles */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && onViewModeChange(newMode)}
          sx={{
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
          }}
        >
          <ToggleButton value="all">
            <FilterListIcon sx={{ mr: 1, fontSize: 18 }} />
            All Templates
          </ToggleButton>
          <ToggleButton value="favorites">
            <StarIcon sx={{ mr: 1, fontSize: 18 }} />
            Favorites
          </ToggleButton>
          <ToggleButton value="recent">
            <AccessTimeIcon sx={{ mr: 1, fontSize: 18 }} />
            Recently Used
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Search and Filters */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search templates by name, specialty, or content..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'background.default',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: bravoColors.primaryFlat
                }
              }
            }
          }}
        />

        {/* Filter Controls */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Specialty</InputLabel>
            <Select
              value={selectedSpecialty}
              label="Specialty"
              onChange={(e) => onSpecialtyChange(e.target.value)}
            >
              {specialties.map((specialty) => (
                <MenuItem key={specialty} value={specialty}>
                  {specialty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Template Type</InputLabel>
            <Select
              value={selectedType}
              label="Template Type"
              onChange={(e) => onTypeChange(e.target.value)}
            >
              {templateTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => onSortChange(e.target.value)}
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
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={onClearFilters}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2
              }}
            >
              Clear Filters
            </Button>
          )}
        </Stack>

        {/* Tags Filter */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Filter by Tags:
          </Typography>
          <Autocomplete
            multiple
            options={commonTags}
            value={selectedTags}
            onChange={(_, newValue) => onTagsChange(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="filled"
                  label={option}
                  {...getTagProps({ index })}
                  sx={{
                    backgroundColor: bravoColors.primaryFlat,
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select tags to filter..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            )}
          />
        </Box>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Active Filters:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {selectedSpecialty && selectedSpecialty !== 'All Specialties' && (
                <Chip
                  label={`Specialty: ${selectedSpecialty}`}
                  size="small"
                  onDelete={() => onSpecialtyChange('All Specialties')}
                  sx={{ backgroundColor: bravoColors.tertiary }}
                />
              )}
              {selectedType && selectedType !== 'All Types' && (
                <Chip
                  label={`Type: ${selectedType}`}
                  size="small"
                  onDelete={() => onTypeChange('All Types')}
                  sx={{ backgroundColor: bravoColors.tertiary }}
                />
              )}
              {selectedTags.map((tag) => (
                <Chip
                  key={tag}
                  label={`Tag: ${tag}`}
                  size="small"
                  onDelete={() => onTagsChange(selectedTags.filter(t => t !== tag))}
                  sx={{ backgroundColor: bravoColors.tertiary }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TemplateFilters;
