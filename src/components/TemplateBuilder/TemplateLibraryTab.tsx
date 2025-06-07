import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Container,
  Grid2 as Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  GetApp as GetAppIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import { useResponsive } from '@/hooks/useResponsive';

interface Template {
  id: string;
  name: string;
  description: string;
  specialty: string;
  type: string;
  tags: string[];
  isPopular?: boolean;
  downloads?: number;
  rating?: number;
}

const libraryTemplates: Template[] = [
  {
    id: 'lib-1',
    name: 'Primary Care Visit - SOAP',
    description: 'Complete SOAP note template for primary care visits with comprehensive sections.',
    specialty: 'Primary Care',
    type: 'SOAP',
    tags: ['General', 'Primary Care', 'SOAP'],
    isPopular: true,
    downloads: 1250,
    rating: 4.8
  },
  {
    id: 'lib-2',
    name: 'Cardiology Consultation',
    description: 'Specialized template for cardiology consultations with cardiac-specific assessments.',
    specialty: 'Cardiology',
    type: 'Consultation',
    tags: ['Cardiology', 'Specialist', 'Consultation'],
    isPopular: true,
    downloads: 890,
    rating: 4.9
  },
  {
    id: 'lib-3',
    name: 'Emergency Department Note',
    description: 'Fast-track template for emergency department documentation.',
    specialty: 'Emergency Medicine',
    type: 'Emergency',
    tags: ['Emergency', 'Fast-track', 'Acute Care'],
    downloads: 2100,
    rating: 4.7
  },
  {
    id: 'lib-4',
    name: 'Pediatric Well-Child Visit',
    description: 'Age-appropriate template for pediatric wellness examinations.',
    specialty: 'Pediatrics',
    type: 'Well-Child',
    tags: ['Pediatrics', 'Wellness', 'Preventive'],
    downloads: 675,
    rating: 4.6
  }
];

const TemplateLibraryTab: React.FC = () => {
  const theme = useTheme();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const specialties = Array.from(new Set(libraryTemplates.map(t => t.specialty)));
  const types = Array.from(new Set(libraryTemplates.map(t => t.type)));

  const filteredTemplates = libraryTemplates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || template.specialty === selectedSpecialty;
    const matchesType = !selectedType || template.type === selectedType;
    
    return matchesSearch && matchesSpecialty && matchesType;
  });

  const handlePreviewTemplate = (template: Template) => {
    console.log('Preview template:', template);
  };

  const handleImportTemplate = (template: Template) => {
    console.log('Import template:', template);
  };

  const getGridColumns = () => {
    if (isMobile) return 12;
    if (isTablet) return 6;
    return 4;
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 2, sm: 3, md: 4 }, 
        px: { xs: 1, sm: 2, md: 3 },
        width: '100%'
      }}
    >
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            color: bravoColors.primaryFlat, 
            fontWeight: 700,
            mb: { xs: 2, sm: 3 },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Template Library
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            mb: { xs: 3, sm: 4 },
            textAlign: { xs: 'center', sm: 'left' },
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Browse and import professionally designed templates for your practice
        </Typography>

        {/* Filters */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 2, sm: 3 }}
          sx={{ mb: { xs: 3, sm: 4 } }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: { sm: 300 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <InputLabel>Specialty</InputLabel>
            <Select
              value={selectedSpecialty}
              label="Specialty"
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Specialties</MenuItem>
              {specialties.map((specialty) => (
                <MenuItem key={specialty} value={specialty}>
                  {specialty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={selectedType}
              label="Type"
              onChange={(e) => setSelectedType(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Types</MenuItem>
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Templates Grid */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {filteredTemplates.map((template) => (
          <Grid 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3}
            key={template.id}
          >
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  borderColor: bravoColors.primaryFlat
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        lineHeight: 1.3
                      }}
                    >
                      {template.name}
                    </Typography>
                    {template.isPopular && (
                      <Chip 
                        label="Popular" 
                        size="small" 
                        sx={{ 
                          backgroundColor: `${bravoColors.primaryFlat}20`,
                          color: bravoColors.primaryFlat,
                          fontSize: '0.75rem'
                        }} 
                      />
                    )}
                  </Box>
                </Box>

                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '0.85rem', sm: '0.875rem' },
                    lineHeight: 1.4
                  }}
                >
                  {template.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ display: 'block', mb: 1 }}
                  >
                    Specialty: {template.specialty}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {template.tags.slice(0, 3).map((tag) => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.7rem',
                          height: 24
                        }} 
                      />
                    ))}
                  </Box>
                </Box>

                {template.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <StarIcon sx={{ fontSize: 16, color: '#ffa726' }} />
                    <Typography variant="caption">
                      {template.rating} ({template.downloads} downloads)
                    </Typography>
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={1} 
                  sx={{ width: '100%' }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => handlePreviewTemplate(template)}
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      flex: { xs: 'none', sm: 1 },
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<GetAppIcon />}
                    onClick={() => handleImportTemplate(template)}
                    size="small"
                    sx={{
                      backgroundColor: bravoColors.primaryFlat,
                      borderRadius: 2,
                      textTransform: 'none',
                      flex: { xs: 'none', sm: 1 },
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      '&:hover': {
                        backgroundColor: bravoColors.secondary
                      }
                    }}
                  >
                    Import
                  </Button>
                </Stack>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTemplates.length === 0 && (
        <Box sx={{
          textAlign: 'center',
          py: { xs: 6, sm: 8 },
          color: 'text.secondary'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            No templates found
          </Typography>
          <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
            Try adjusting your search criteria to find more templates.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default TemplateLibraryTab;
