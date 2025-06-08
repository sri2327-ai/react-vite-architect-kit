
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Slider,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import {
  AutoFixHigh as AutoFixHighIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { bravoColors } from '@/theme/colors';
import { useResponsive } from '@/hooks/useResponsive';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
  itemName?: string;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ open, onClose, itemName }) => {
  const theme = useTheme();
  const { isMobile, isTablet } = useResponsive();
  const [selectedOption, setSelectedOption] = useState('change-narrative');
  const [paragraphCount, setParagraphCount] = useState(2);
  const [formatSpecificRequest, setFormatSpecificRequest] = useState('');
  const [otherRequest, setOtherRequest] = useState('');

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleParagraphChange = (event: Event, newValue: number | number[]) => {
    setParagraphCount(newValue as number);
  };

  const handleGenerate = () => {
    console.log('Generating with options:', {
      option: selectedOption,
      paragraphs: paragraphCount,
      formatSpecificRequest,
      otherRequest,
      itemName
    });
    // TODO: Implement the actual generation logic
    onClose();
  };

  const showParagraphSelector = selectedOption === 'increase-detail' || selectedOption === 'decrease-detail';
  const showFormatSpecificTextArea = selectedOption === 'format-specific';
  const showOtherTextArea = selectedOption === 'other';

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          maxHeight: { xs: '100vh', sm: '90vh' },
          m: { xs: 0, sm: 2 }
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: { xs: 1, sm: 2 },
        px: { xs: 2, sm: 3 },
        pt: { xs: 2, sm: 3 },
        borderBottom: `1px solid ${alpha(bravoColors.primaryFlat, 0.1)}`,
        position: { xs: 'sticky', sm: 'static' },
        top: 0,
        zIndex: 1,
        backgroundColor: 'background.paper'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
          <Box
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: 2,
              backgroundColor: alpha(bravoColors.secondary, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AutoFixHighIcon sx={{ 
              color: bravoColors.secondary, 
              fontSize: { xs: 20, sm: 24 } 
            }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: bravoColors.primaryFlat,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                lineHeight: 1.2
              }}
            >
              Edit Auto-Generated Section
            </Typography>
            {itemName && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  mt: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                Section: {itemName}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
        overflowY: 'auto',
        flex: 1
      }}>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: { xs: 2, sm: 3 }, 
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          Select an option to modify how this section is generated:
        </Typography>

        <FormControl component="fieldset" fullWidth>
          <FormLabel 
            component="legend" 
            sx={{ 
              fontWeight: 600, 
              color: bravoColors.primaryFlat,
              mb: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Select an option:
          </FormLabel>
          
          <RadioGroup
            value={selectedOption}
            onChange={handleOptionChange}
            sx={{ mb: { xs: 2, sm: 3 } }}
          >
            <FormControlLabel 
              value="change-narrative" 
              control={<Radio sx={{ color: bravoColors.primaryFlat }} />} 
              label={
                <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Change to Narrative
                </Typography>
              }
              sx={{ mb: { xs: 0.5, sm: 1 } }}
            />
            
            <FormControlLabel 
              value="increase-detail" 
              control={<Radio sx={{ color: bravoColors.primaryFlat }} />} 
              label={
                <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Increase Detail
                </Typography>
              }
              sx={{ mb: { xs: 0.5, sm: 1 } }}
            />
            {showParagraphSelector && selectedOption === 'increase-detail' && (
              <Box sx={{ 
                ml: { xs: 3, sm: 4 }, 
                mb: { xs: 1.5, sm: 2 }, 
                mt: { xs: 0.5, sm: 1 },
                mr: { xs: 1, sm: 2 }
              }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: bravoColors.primaryFlat,
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
                  }}
                >
                  How many paragraphs do you prefer?
                </Typography>
                
                <Box sx={{ px: { xs: 1, sm: 2 } }}>
                  <Slider
                    value={paragraphCount}
                    onChange={handleParagraphChange}
                    min={1}
                    max={5}
                    step={1}
                    marks={[
                      { value: 1, label: '1' },
                      { value: 2, label: '2' },
                      { value: 3, label: '3' },
                      { value: 4, label: '4' },
                      { value: 5, label: '5' }
                    ]}
                    valueLabelDisplay="auto"
                    sx={{
                      color: bravoColors.secondary,
                      '& .MuiSlider-markLabel': {
                        fontSize: { xs: '0.65rem', sm: '0.75rem' }
                      },
                      '& .MuiSlider-thumb': {
                        width: { xs: 18, sm: 20 },
                        height: { xs: 18, sm: 20 }
                      },
                      '& .MuiSlider-track': {
                        height: { xs: 4, sm: 6 }
                      },
                      '& .MuiSlider-rail': {
                        height: { xs: 4, sm: 6 }
                      }
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mt: 1, 
                    textAlign: 'center',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  Currently selected: {paragraphCount} paragraph{paragraphCount > 1 ? 's' : ''}
                </Typography>
              </Box>
            )}
            
            <FormControlLabel 
              value="decrease-detail" 
              control={<Radio sx={{ color: bravoColors.primaryFlat }} />} 
              label={
                <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Decrease Detail
                </Typography>
              }
              sx={{ mb: { xs: 0.5, sm: 1 } }}
            />
            {showParagraphSelector && selectedOption === 'decrease-detail' && (
              <Box sx={{ 
                ml: { xs: 3, sm: 4 }, 
                mb: { xs: 1.5, sm: 2 }, 
                mt: { xs: 0.5, sm: 1 },
                mr: { xs: 1, sm: 2 }
              }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: bravoColors.primaryFlat,
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
                  }}
                >
                  How many paragraphs do you prefer?
                </Typography>
                
                <Box sx={{ px: { xs: 1, sm: 2 } }}>
                  <Slider
                    value={paragraphCount}
                    onChange={handleParagraphChange}
                    min={1}
                    max={5}
                    step={1}
                    marks={[
                      { value: 1, label: '1' },
                      { value: 2, label: '2' },
                      { value: 3, label: '3' },
                      { value: 4, label: '4' },
                      { value: 5, label: '5' }
                    ]}
                    valueLabelDisplay="auto"
                    sx={{
                      color: bravoColors.secondary,
                      '& .MuiSlider-markLabel': {
                        fontSize: { xs: '0.65rem', sm: '0.75rem' }
                      },
                      '& .MuiSlider-thumb': {
                        width: { xs: 18, sm: 20 },
                        height: { xs: 18, sm: 20 }
                      },
                      '& .MuiSlider-track': {
                        height: { xs: 4, sm: 6 }
                      },
                      '& .MuiSlider-rail': {
                        height: { xs: 4, sm: 6 }
                      }
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mt: 1, 
                    textAlign: 'center',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  Currently selected: {paragraphCount} paragraph{paragraphCount > 1 ? 's' : ''}
                </Typography>
              </Box>
            )}
            
            <FormControlLabel 
              value="format-specific" 
              control={<Radio sx={{ color: bravoColors.primaryFlat }} />} 
              label={
                <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Format Specific
                </Typography>
              }
              sx={{ mb: { xs: 0.5, sm: 1 } }}
            />
            {showFormatSpecificTextArea && (
              <Box sx={{ 
                ml: { xs: 3, sm: 4 }, 
                mb: { xs: 1.5, sm: 2 }, 
                mt: { xs: 0.5, sm: 1 },
                mr: { xs: 1, sm: 2 }
              }}>
                <TextField
                  fullWidth
                  multiline
                  rows={isMobile ? 2 : 3}
                  label="Describe your format requirements"
                  value={formatSpecificRequest}
                  onChange={(e) => setFormatSpecificRequest(e.target.value)}
                  placeholder="Please describe the specific format you need..."
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: bravoColors.primaryFlat
                      },
                      borderRadius: 2
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: bravoColors.primaryFlat
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.85rem', sm: '0.875rem' }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                />
              </Box>
            )}
            
            <FormControlLabel 
              value="other" 
              control={<Radio sx={{ color: bravoColors.primaryFlat }} />} 
              label={
                <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Other
                </Typography>
              }
              sx={{ mb: { xs: 0.5, sm: 1 } }}
            />
            {showOtherTextArea && (
              <Box sx={{ 
                ml: { xs: 3, sm: 4 }, 
                mb: { xs: 1.5, sm: 2 }, 
                mt: { xs: 0.5, sm: 1 },
                mr: { xs: 1, sm: 2 }
              }}>
                <TextField
                  fullWidth
                  multiline
                  rows={isMobile ? 2 : 3}
                  label="Describe your specific request"
                  value={otherRequest}
                  onChange={(e) => setOtherRequest(e.target.value)}
                  placeholder="Please describe how you'd like this section to be modified..."
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: bravoColors.primaryFlat
                      },
                      borderRadius: 2
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: bravoColors.primaryFlat
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.85rem', sm: '0.875rem' }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                />
              </Box>
            )}
          </RadioGroup>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 }, 
        pt: 0, 
        gap: { xs: 1, sm: 2 },
        flexDirection: { xs: 'column', sm: 'row' },
        position: { xs: 'sticky', sm: 'static' },
        bottom: 0,
        backgroundColor: 'background.paper',
        borderTop: { xs: '1px solid', sm: 'none' },
        borderColor: { xs: 'divider', sm: 'transparent' }
      }}>
        <Button 
          variant="outlined"
          onClick={onClose}
          fullWidth={isMobile}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: alpha(bravoColors.primaryFlat, 0.5),
            color: bravoColors.primaryFlat,
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            py: { xs: 1.5, sm: 1 },
            px: { xs: 2, sm: 3 },
            '&:hover': {
              borderColor: bravoColors.primaryFlat,
              backgroundColor: alpha(bravoColors.primaryFlat, 0.05)
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleGenerate}
          startIcon={<AutoFixHighIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
          fullWidth={isMobile}
          sx={{
            backgroundColor: bravoColors.secondary,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 3, sm: 4 },
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            py: { xs: 1.5, sm: 1 },
            '&:hover': {
              backgroundColor: bravoColors.primaryFlat
            }
          }}
        >
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpDialog;
