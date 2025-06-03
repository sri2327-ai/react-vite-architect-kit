
import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Paper,
  Autocomplete,
  TextField,
  Button,
  Divider
} from '@mui/material';
import {
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import { alpha } from '@mui/material/styles';

interface FilterState {
  specialty: string;
  noteType: string;
  complexity: string;
  searchTerm: string;
}

interface TemplateLibraryFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableSpecialties: string[];
  availableNoteTypes: string[];
}

const TemplateLibraryFilters: React.FC<TemplateLibraryFiltersProps> = ({
  filters,
  onFiltersChange,
  availableSpecialties,
  availableNoteTypes
}) => {
  const complexityOptions = ['Simple', 'Moderate', 'Complex'];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      specialty: '',
      noteType: '',
      complexity: '',
      searchTerm: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <Paper 
      elevation={1}
      sx={{ 
        p: 3, 
        borderRadius: 3,
        border: '1px solid',
        borderColor: alpha(bravoColors.primaryFlat, 0.1),
        mb: 3
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon sx={{ color: bravoColors.primaryFlat }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: bravoColors.primaryFlat }}>
            Find Your Perfect Template
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip 
              label={`${activeFiltersCount} active`}
              size="small"
              sx={{
                backgroundColor: alpha(bravoColors.secondary, 0.1),
                color: bravoColors.secondary,
                fontWeight: 600
              }}
            />
          )}
        </Box>
        {activeFiltersCount > 0 && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<ClearIcon />}
            onClick={clearAllFilters}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              borderColor: alpha(bravoColors.secondary, 0.3),
              color: bravoColors.secondary
            }}
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search templates by name, specialty, or keywords..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: alpha(bravoColors.background?.light || '#f5f5f5', 0.5)
            }
          }}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Filter Controls */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: bravoColors.primaryFlat }}>
        Refine by Clinical Practice
      </Typography>
      
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Medical Specialty</InputLabel>
          <Select
            value={filters.specialty}
            label="Medical Specialty"
            onChange={(e) => handleFilterChange('specialty', e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All Specialties</MenuItem>
            {availableSpecialties.map((specialty) => (
              <MenuItem key={specialty} value={specialty}>
                {specialty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Note Type</InputLabel>
          <Select
            value={filters.noteType}
            label="Note Type"
            onChange={(e) => handleFilterChange('noteType', e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All Note Types</MenuItem>
            {availableNoteTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Complexity</InputLabel>
          <Select
            value={filters.complexity}
            label="Complexity"
            onChange={(e) => handleFilterChange('complexity', e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">Any Complexity</MenuItem>
            {complexityOptions.map((complexity) => (
              <MenuItem key={complexity} value={complexity}>
                {complexity}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Quick Filter Chips */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Quick Filters:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {['Primary Care', 'Emergency Medicine', 'Cardiology', 'Mental Health'].map((quickFilter) => (
            <Chip
              key={quickFilter}
              label={quickFilter}
              variant={filters.specialty === quickFilter ? 'filled' : 'outlined'}
              onClick={() => handleFilterChange('specialty', 
                filters.specialty === quickFilter ? '' : quickFilter
              )}
              sx={{
                borderRadius: 2,
                cursor: 'pointer',
                ...(filters.specialty === quickFilter && {
                  backgroundColor: bravoColors.primaryFlat,
                  color: 'white'
                })
              }}
            />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

export default TemplateLibraryFilters;
