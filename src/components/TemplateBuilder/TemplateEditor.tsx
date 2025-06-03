
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
  IconButton,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';

interface TemplateItem {
  id: string;
  name: string;
  type: string;
  content: string;
  description?: string;
  paste_template?: string;
  is_editing?: boolean;
  is_editing_template?: boolean;
  temp_description?: string;
  temp_template?: string;
  items?: Array<{
    content: string;
    name?: string;
  }>;
}

interface TemplateEditorProps {
  initialItems?: TemplateItem[];
  onSave?: (items: TemplateItem[]) => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  initialItems = [], 
  onSave 
}) => {
  const [sectionList, setSectionList] = useState<TemplateItem[]>(initialItems);
  const [addSectionDialog, setAddSectionDialog] = useState(false);
  const [newSectionType, setNewSectionType] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');

  // Sample initial data if none provided
  useEffect(() => {
    if (initialItems.length === 0) {
      setSectionList([
        {
          id: '1',
          name: 'Chief Complaint',
          type: 'paragraph',
          content: 'Document the primary reason for the patient visit',
          description: 'A.I. will write a descriptive block of text following the guidelines below.'
        },
        {
          id: '2', 
          name: 'History of Present Illness',
          type: 'bulleted_list',
          content: 'Document the current illness details',
          description: 'A.I. will create a bulleted list based on the instructions provided',
          items: [
            { content: 'Onset and duration of symptoms' },
            { content: 'Associated symptoms' },
            { content: 'Previous treatments attempted' }
          ]
        }
      ]);
    }
  }, [initialItems]);

  const editItem = (index: number, field: string, value: any) => {
    setSectionList(prev => prev.map((item, idx) => 
      idx === index ? { ...item, [field]: value } : item
    ));
  };

  const deleteItem = (index: number) => {
    setSectionList(prev => prev.filter((_, idx) => idx !== index));
  };

  const addNewSection = () => {
    if (!newSectionName || !newSectionType) return;
    
    const newSection: TemplateItem = {
      id: Date.now().toString(),
      name: newSectionName,
      type: newSectionType,
      content: newSectionContent,
      description: getDescriptionForType(newSectionType)
    };

    setSectionList(prev => [...prev, newSection]);
    setAddSectionDialog(false);
    setNewSectionName('');
    setNewSectionContent('');
    setNewSectionType('');
  };

  const getDescriptionForType = (type: string): string => {
    switch (type) {
      case 'paragraph':
        return 'A.I. will write a descriptive block of text following the guidelines below.';
      case 'bulleted_list':
        return 'A.I. will create a bulleted list based on the instructions provided';
      case 'section_header':
        return 'A.I. will include the following section headers in the note';
      case 'static_text':
        return 'A.I. will insert the exact text below into the note.';
      default:
        return 'A.I. will craft an examination list in a structured format, as instructed.';
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(sectionList);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#1d4556', fontWeight: 600 }}>
          Template Editor
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddSectionDialog(true)}
            sx={{
              borderRadius: "5px",
              padding: "5px 10px",
              color: "#F4FCFF",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            Add Section
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{
              borderRadius: "5px",
              padding: "5px 10px",
              color: "#F4FCFF",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            Save Template
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={2} sx={{
        maxHeight: "70vh",
        overflowY: "auto",
        pr: 1
      }}>
        {sectionList.map((item, idx) => (
          <Card key={item.id} elevation={3} sx={{ 
            borderRadius: 2,
            '&:hover': {
              boxShadow: '0px 8px 16px rgba(0,0,0,0.1)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="h6" sx={{ color: "#343434", fontWeight: 600, mb: 0.5 }}>
                    {item.name}
                  </Typography>
                  <Chip 
                    label={item.type.replace('_', ' ')} 
                    size="small" 
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => editItem(idx, "is_editing", true)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => deleteItem(idx)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>

              <Divider sx={{ my: 2 }} />

              {item.is_editing ? (
                <Stack spacing={2}>
                  <TextField
                    label="Section Name"
                    value={item.temp_description || item.name}
                    onChange={(e) => editItem(idx, "temp_description", e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Instructions for A.I."
                    value={item.temp_template || item.content}
                    onChange={(e) => editItem(idx, "temp_template", e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    size="small"
                  />
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        editItem(idx, "name", item.temp_description || item.name);
                        editItem(idx, "content", item.temp_template || item.content);
                        editItem(idx, "is_editing", false);
                        editItem(idx, "temp_description", "");
                        editItem(idx, "temp_template", "");
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        editItem(idx, "is_editing", false);
                        editItem(idx, "temp_description", "");
                        editItem(idx, "temp_template", "");
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description || getDescriptionForType(item.type)}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {item.content}
                  </Typography>

                  {item.items && item.items.length > 0 && (
                    <Box sx={{ ml: 2 }}>
                      {item.items.map((subItem, subIdx) => (
                        <Stack key={subIdx} direction="row" alignItems="flex-start" spacing={1}>
                          <CircleIcon sx={{ fontSize: 8, color: '#343434', mt: 0.7 }} />
                          <Typography variant="body2" color="text.secondary">
                            {subItem.name ? `${subItem.name}: ` : ''}{subItem.content}
                          </Typography>
                        </Stack>
                      ))}
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Add Section Dialog */}
      <Dialog 
        open={addSectionDialog} 
        onClose={() => setAddSectionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add New Section</Typography>
            <IconButton onClick={() => setAddSectionDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Section Name"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              fullWidth
              size="small"
            />
            
            <FormControl fullWidth size="small">
              <InputLabel>Section Type</InputLabel>
              <Select
                value={newSectionType}
                onChange={(e) => setNewSectionType(e.target.value)}
                label="Section Type"
              >
                <MenuItem value="paragraph">Paragraph</MenuItem>
                <MenuItem value="bulleted_list">Bulleted List</MenuItem>
                <MenuItem value="section_header">Section Header</MenuItem>
                <MenuItem value="static_text">Static Text</MenuItem>
                <MenuItem value="exam_list">Exam List</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Content/Instructions"
              value={newSectionContent}
              onChange={(e) => setNewSectionContent(e.target.value)}
              multiline
              rows={4}
              fullWidth
              size="small"
              helperText="Provide instructions for what the A.I. should generate in this section"
            />
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setAddSectionDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={addNewSection}
            disabled={!newSectionName || !newSectionType}
          >
            Add Section
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateEditor;
