
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

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
  itemName?: string;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ open, onClose, itemName }) => {
  const theme = useTheme();
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
              backgroundColor: alpha(bravoColors.secondary, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AutoFixHighIcon sx={{ color: bravoColors.secondary, fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: bravoColors.primaryFlat }}>
              Edit Auto-Generated Section
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
          Select an option to modify how this section is generated:
        </Typography>

        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ 
            fontWeight: 600, 
            color: bravoColors.primaryFlat,
            mb: 2
          }}>
            Select an option:
          </FormLabel>
          
          <RadioGroup
            value={selectedOption}
            onChange={handleOptionChange}
            sx={{ mb: 3 }}
          >
            <FormControlLabel 
              value="change-narrative" 
              control={<Radio sx={{ color: bravoColors.primaryFlat }} />} 
              label="Change to Narrative"
              sx={{ mb: 1 }}
            />
            <FormControlLabel 
              value="increase-detail" 
              control={<Radio sx={{ color: bravoColors.primaryFlat }} />} 
              label="Increase Detail"
              sx={{ mb: 1 }}
            />
            {showParagraphSelector && selectedOption === 'increase-detail' && (
              <Box sx={{ ml: 4, mb: 2, mt: 1 }}>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: 600, 
                  color: bravoColors.primaryFlat,
                  mb: 2
                }}>
                  How many paragraphs do you prefer?
                </Typography>
                
                <Box sx={{ px: 2 }}>
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
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Currently selected: {paragraphCount} paragraph{paragraphCount > 1 ? 's' : ''}
                </Typography>
              </Box>
            )}
            
            <FormControlLabel 
              value="decrease-detail" 
              control={<Radio sx={{ color: bravoColors.primaryFlat }} />} 
              label="Decrease Detail"
              sx={{ mb: 1 }}
            />
            {showParagraphSelector && selectedOption === 'decrease-detail' && (
              <Box sx={{ ml: 4, mb: 2, mt: 1 }}>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: 600, 
                  color: bravoColors.primaryFlat,
                  mb: 2
                }}>
                  How many paragraphs do you prefer?
                </Typography>
                
                <Box sx={{ px: 2 }}>
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
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Currently selected: {paragraphCount} paragraph{paragraphCount > 1 ? 's' : ''}
                </Typography>
              </Box>
            )}
            
            <FormControlLabel 
              value="format-specific" 
              control={<Radio sx={{ color: bravoColors.primaryFlat }} />} 
              label="Format Specific"
              sx={{ mb: 1 }}
            />
            {showFormatSpecificTextArea && (
              <Box sx={{ ml: 4, mb: 2, mt: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Describe your format requirements"
                  value={formatSpecificRequest}
                  onChange={(e) => setFormatSpecificRequest(e.target.value)}
                  placeholder="Please describe the specific format you need..."
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: bravoColors.primaryFlat
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: bravoColors.primaryFlat
                    }
                  }}
                />
              </Box>
            )}
            
            <FormControlLabel 
              value="other" 
              control={<Radio sx={{ color: bravoColors.primaryFlat }} />} 
              label="Other"
              sx={{ mb: 1 }}
            />
            {showOtherTextArea && (
              <Box sx={{ ml: 4, mb: 2, mt: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Describe your specific request"
                  value={otherRequest}
                  onChange={(e) => setOtherRequest(e.target.value)}
                  placeholder="Please describe how you'd like this section to be modified..."
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: bravoColors.primaryFlat
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: bravoColors.primaryFlat
                    }
                  }}
                />
              </Box>
            )}
          </RadioGroup>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
        <Button 
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: alpha(bravoColors.primaryFlat, 0.5),
            color: bravoColors.primaryFlat,
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
          startIcon={<AutoFixHighIcon />}
          sx={{
            backgroundColor: bravoColors.secondary,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
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
