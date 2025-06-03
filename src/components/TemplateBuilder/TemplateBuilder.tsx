
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Dialog,
  Chip,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Button,
  Modal,
  Typography,
  Stack,
  DialogTitle,
  DialogContent,
  Divider,
  Autocomplete,
  useTheme,
  useMediaQuery,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  ReceiptLong as ReceiptLongIcon,
  Visibility as VisibilityIcon,
  DoDisturb as DoDisturbIcon,
  ArrowBack as ArrowBackIcon,
  AutoFixHigh as AutoFixHighIcon,
  EditNote as EditNoteIcon,
  ContentCopy as ContentCopyIcon,
  CopyAll as CopyAllIcon,
  LibraryBooks as LibraryBooksIcon,
  Description as DescriptionIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { bravoColors } from '@/theme/colors';
import DragDropList from './DragDropList';

interface TemplateData {
  id: number;
  title: string;
  specality: string;
  type: string;
  fields: any[];
}

const NoDataOverlay = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      color: 'gray',
      fontSize: '16px',
      fontFamily: '"Wix Madefor Text", "Roboto", "Helvetica", "Arial", sans-serif',
    }}
  >
    No data to display
  </Box>
);

const TemplateBuilder: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [templateScreen, setTemplateScreen] = useState("conTypePage");
  const [openCreateTemplate, setOpenCreateTemplate] = useState(false);
  const [openModifyTemplate, setOpenModifyTemplate] = useState(false);
  const [selectedConsType, setSelectedConsType] = useState("");
  const [showTemplate, setShowTemplate] = useState(false);
  const [templateType, setTemplateType] = useState("none");
  const [templateMethod, setTemplateMethod] = useState<any>({});
  const [sectionList, setSectionList] = useState<any[]>([]);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [openAddSection, setOpenAddSection] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Form controls
  const { control, handleSubmit, formState: { errors }, trigger, getValues } = useForm();

  // Sample data
  const data: TemplateData[] = [
    { id: 1, title: "CLINICAL INTERVIEW1", specality: "cardiologist", type: "SOAP", fields: [] },
    { id: 2, title: "CLINICAL INTERVIEW2", specality: "psychology", type: "SOAP", fields: [] },
    { id: 3, title: "CLINICAL INTERVIEW3", specality: "cardiologist", type: "DPD", fields: [] },
    { id: 4, title: "Dermatology Intake", specality: "Dermatology", type: "SOAP", fields: [] },
    { id: 5, title: "Neurology Followup", specality: "psychology", type: "SOAP", fields: [] },
    { id: 6, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", fields: [] }
  ];

  const sectionData = [
    {
      "name": "CHIEF COMPLAINT",
      "action": "add",
      "type": "paragraph",
      "is_editing": false,
      "is_editing_template": false,
      "paste_template": "",
      "description": "Capture the main reason for the visit, such as symptom or condition reported by the patient."
    },
    {
      "name": "SUBJECTIVE NOTE",
      "action": "add",
      "type": "paragraph",
      "is_editing": false,
      "is_editing_template": false,
      "paste_template": "",
      "description": "Brief summary of the reason for visit, including urgency or specific instructions provided by patient or referring doctor."
    },
    {
      "name": "HISTORY OF PRESENT ILLNESS (HPI)",
      "action": "add",
      "type": "paragraph",
      "is_editing": false,
      "is_editing_template": false,
      "paste_template": "",
      "description": "Detailed narrative of the current condition including onset, duration, characteristics, associated symptoms, and relevant background such as lifestyle and family medical history."
    },
    {
      "name": "ALLERGIES",
      "action": "add",
      "type": "bulleted_list",
      "is_editing": false,
      "is_editing_template": false,
      "paste_template": "",
      "description": "List known allergies or lack thereof, to medications or other substances."
    }
  ];

  const templatePreview = [
    {
      "content": "Provide a comprehensive narrative of the patient's current condition. Include details about the onset, duration, and characteristics of the present illness. Note any associated symptoms, and incorporate relevant background information such as lifestyle factors and family medical history. Be sure to structure the narrative in a chronological manner, emphasizing the progression of the condition over time.",
      "id": "cb1129e5-81e7-6dbd-d9f8-91d8a502d0b1",
      "name": "History of Present Illness",
      "type": "paragraph"
    },
    {
      "content": "List any known allergies the patient has, including reactions to medications, foods, or other substances. If there are no known allergies, indicate this as well.",
      "id": "dccbe5e5-6645-e3e2-b2b7-1fd45baf1477",
      "items": [
        {
          "content": "Create a bullet for each known allergy, specifying the substance and the type of reaction."
        },
        {
          "content": "Include a bullet to indicate if there are no known allergies."
        }
      ],
      "name": "Allergies",
      "type": "bulleted_list"
    },
    {
      "content": "Create a detailed plan of management for each diagnosis the patient has. For each diagnosis, include any tests to be ordered, follow-ups required, and treatments initiated or considered.",
      "id": "fce99b6b-1a72-9cc5-9cc9-bfe6fed4f355",
      "items": [
        {
          "content": "For each diagnosis, include specifics such as additional tests to be scheduled, frequency of follow-up appointments, and any treatments that have been initiated or are under consideration, including their dosage and duration where applicable."
        }
      ],
      "name": "Plan",
      "type": "bulleted_list"
    }
  ];

  const createTemplateItems = [
    {
      type: 1,
      title: 'Copy Previous Notes',
      Description: "Reuse the last note you copied.",
      icon: <CopyAllIcon sx={{ width: 60, height: 60, color: bravoColors.primaryFlat }} />,
    },
    {
      type: 2,
      title: 'Generate Template',
      Description: "AI-assisted template creation with summary.",
      icon: <AutoFixHighIcon sx={{ width: 60, height: 60, color: bravoColors.primaryFlat }} />
    },
    {
      type: 3,
      title: 'Start from Scratch',
      Description: "Begin with a blank slate.",
      icon: <EditNoteIcon sx={{ width: 60, height: 60, color: bravoColors.primaryFlat }} />,
    },
    {
      type: 4,
      title: 'Use Existing Template',
      Description: "Copy-paste existing template.",
      icon: <ContentCopyIcon sx={{ width: 60, height: 60, color: bravoColors.primaryFlat }} />,
    },
    {
      type: 5,
      title: 'Template Library',
      Description: "Access and manage all your templates.",
      icon: <LibraryBooksIcon sx={{ width: 60, height: 60, color: bravoColors.primaryFlat }} />,
    },
  ];

  const columns: GridColDef<TemplateData>[] = [
    { field: "id", headerName: "S.NO", width: 80 },
    {
      field: 'title',
      headerName: 'Title',
      width: 200,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'specality',
      headerName: 'Specialty',
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          sx={{ 
            backgroundColor: bravoColors.highlight.selected,
            color: bravoColors.primaryFlat
          }} 
        />
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          variant="outlined"
          size="small"
          sx={{ 
            borderColor: bravoColors.secondary,
            color: bravoColors.secondary
          }}
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions' as const,
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit-action"
          icon={<EditIcon sx={{ color: bravoColors.primaryFlat }} />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          key="view-action"
          icon={<VisibilityIcon sx={{ color: bravoColors.secondary }} />}
          label="View"
          onClick={() => handleView(params.row)}
        />,
        <GridActionsCellItem
          key="delete-action"
          icon={<DeleteIcon sx={{ color: '#d32f2f' }} />}
          label="Delete"
          onClick={() => handleDelete(params.row)}
        />,
      ],
    },
  ];

  // Event handlers
  const handleEdit = (row: TemplateData) => {
    console.log('Edit template:', row);
    setOpenModifyTemplate(true);
    setShowTemplate(true);
    setSectionList(sectionData);
  };

  const handleView = (row: TemplateData) => {
    console.log('View template:', row);
  };

  const handleDelete = (row: TemplateData) => {
    console.log('Delete template:', row);
  };

  const editItem = (idx: number, key: string, value: any) => {
    setSectionList(prev =>
      prev.map((item, index) =>
        index === idx ? { ...item, [key]: value } : item
      )
    );
  };

  const deleteItem = (indexToRemove: number) => {
    setSectionList(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const onCreateTemplate = async () => {
    const isValid = await trigger();
    if (isValid) {
      const data = getValues();
      console.log("Create Template Data", data);
      setOpenModifyTemplate(true);
      setShowTemplate(true);
      setOpenCreateTemplate(false);
      setTemplateType("none");
      setSectionList(sectionData);
    }
  };

  const options = ['ALL', 'EHR', 'No EHR'];

  // Template Library render
  const renderTemplateLibrary = () => (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600, my: 2 }}>
          Template Library
        </Typography>
      </Box>

      <Box mb={2} display="flex" alignItems="center" justifyContent="center" gap={2}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Specialty</InputLabel>
          <Select
            label="Specialty"
            sx={{ 
              color: bravoColors.text.primary, 
              backgroundColor: 'white'
            }}
          >
            <MenuItem value="all">ALL</MenuItem>
            <MenuItem value="gp">General Practitioner</MenuItem>
            <MenuItem value="psych">Psychologist</MenuItem>
            <MenuItem value="family">Family Medicine Specialist</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Note Type</InputLabel>
          <Select
            label="Note Type"
            sx={{ 
              color: bravoColors.text.primary, 
              backgroundColor: 'white'
            }}
          >
            <MenuItem value="all">ALL</MenuItem>
            <MenuItem value="ehr">EHR</MenuItem>
            <MenuItem value="no-ehr">No EHR</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 3,
          alignItems: "stretch",
          p: 1,
          maxHeight: "65vh",
          overflowY: "auto",
        }}
      >
        {data.map((item) => (
          <Card
            key={item.id}
            onClick={() => setShowTemplatePreview(true)}
            sx={{
              width: 250,
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              transition: "all 0.2s ease-in-out",
              cursor: "pointer",
              "&:hover": {
                boxShadow: `0 4px 14px ${bravoColors.secondary}33`,
                border: `1px solid ${bravoColors.secondary}`,
              },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              backgroundColor: "#fff",
            }}
          >
            <CardContent
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                width: "100%",
                p: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: bravoColors.text.primary,
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.title}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  mt: 1,
                }}
              >
                <Chip
                  label={`Specialty: ${item.specality}`}
                  size="small"
                  sx={{ 
                    fontSize: 11, 
                    backgroundColor: bravoColors.secondary,
                    color: 'white'
                  }}
                />
                <Chip
                  label={`Note Type: ${item.type}`}
                  size="small"
                  sx={{ 
                    fontSize: 11, 
                    backgroundColor: bravoColors.secondary,
                    color: 'white'
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );

  // Main render based on screen state
  const renderContent = () => {
    if (openModifyTemplate && showTemplate) {
      return (
        <Box sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton 
              onClick={() => {
                setOpenModifyTemplate(false);
                setShowTemplate(false);
              }}
              sx={{ mr: 2, color: bravoColors.primaryFlat }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              Verify Template Changes
            </Typography>
          </Box>
          
          <Typography sx={{ fontSize: 14, color: "#808080", width: '70%', mb: 4 }}>
            Based on its analysis, the AI has generated documentation improvements tailored to your template. 
            Please review and approve the suggested edits below.
          </Typography>

          <DragDropList onFinalApi={() => {}} />
        </Box>
      );
    }

    if (templateScreen === "templateListPage") {
      return renderTemplateLibrary();
    }

    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
          Template Builder
        </Typography>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="body1" color="text.secondary">
            Create and manage your document templates
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => setTemplateScreen("templateListPage")}
              sx={{ borderRadius: 2 }}
            >
              Template Library
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateTemplate(true)}
              sx={{ borderRadius: 2 }}
            >
              Create Template
            </Button>
          </Box>
        </Box>

        <Card sx={{ borderRadius: 2 }}>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            autoHeight
            slots={{
              noRowsOverlay: NoDataOverlay,
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderColor: bravoColors.highlight.border,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: bravoColors.background.light,
                color: bravoColors.text.primary,
                fontWeight: 600,
              },
            }}
          />
        </Card>

        {/* Create Template Dialog */}
        <Dialog
          open={openCreateTemplate}
          onClose={() => setOpenCreateTemplate(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle>
            <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              Create New Template
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
              {createTemplateItems.map((item) => (
                <Box key={item.type} sx={{ flexBasis: 'calc(33.333% - 16px)', minWidth: 250 }}>
                  <Card
                    elevation={2}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0px 8px 16px rgba(0,0,0,0.15)",
                        border: `2px solid ${bravoColors.secondary}`,
                      },
                      border: `1px solid ${bravoColors.highlight.border}`,
                      borderRadius: 2,
                    }}
                    onClick={() => setTemplateMethod(item)}
                  >
                    <CardContent>
                      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={2}>
                        {item.icon}
                        <Typography variant="h6" sx={{ color: bravoColors.text.primary, fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.Description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>

            {Object.keys(templateMethod).length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="h6" sx={{ mb: 2, color: bravoColors.primaryFlat }}>
                  Template Details
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flexBasis: 'calc(50% - 8px)', minWidth: 250 }}>
                    <Controller
                      name="template_name"
                      control={control}
                      rules={{ required: 'Template name is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Template Name"
                          error={!!errors.template_name}
                          helperText={errors.template_name?.message as string}
                          size="small"
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ flexBasis: 'calc(50% - 8px)', minWidth: 250 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Consultation Type</InputLabel>
                      <Select
                        value={selectedConsType}
                        onChange={(e) => setSelectedConsType(e.target.value)}
                        label="Consultation Type"
                      >
                        <MenuItem value="initial">Initial Consultation</MenuItem>
                        <MenuItem value="followup">Follow-up</MenuItem>
                        <MenuItem value="routine">Routine Check</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Description"
                          multiline
                          rows={3}
                          size="small"
                        />
                      )}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpenCreateTemplate(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={onCreateTemplate}
              variant="contained"
              disabled={Object.keys(templateMethod).length === 0}
            >
              Create Template
            </Button>
          </DialogActions>
        </Dialog>

        {/* Template Preview Dialog */}
        <Dialog
          open={showTemplatePreview}
          onClose={() => setShowTemplatePreview(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle>
            <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              Template Preview
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box p={2} sx={{ border: '2px dashed #808080', borderRadius: 2 }}>
              <Typography sx={{ fontSize: 18, color: "black", fontWeight: 600, mb: 2 }}>
                Template Preview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {templatePreview.map((item, idx) => (
                <Box key={idx} p={2}>
                  <Typography sx={{ fontSize: 18, color: "black", fontWeight: 700 }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontSize: 16, color: "black", mb: 1 }}>
                    {item.content}
                  </Typography>
                  {item.items && item.items.length > 0 && item.items.map((data, index) => (
                    <Stack key={index} direction="row" alignItems="flex-start">
                      <CircleIcon sx={{ fontSize: 8, color: 'black', mt: 1 }} />
                      <Typography sx={{ fontSize: 16, color: 'black', pl: 1 }}>
                        {data.content}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setShowTemplatePreview(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setShowTemplatePreview(false);
                setOpenAddSection(true);
              }}
              variant="contained"
            >
              Add to Library
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Section Dialog */}
        <Dialog
          open={openAddSection}
          onClose={() => setOpenAddSection(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle>
            <Typography variant="h5" sx={{ color: bravoColors.primaryFlat, fontWeight: 600 }}>
              Add Template to
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box p={2}>
              <Autocomplete
                multiple
                options={options}
                value={selectedOptions}
                onChange={(event, newValue) => setSelectedOptions(newValue)}
                sx={{ width: '100%' }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option}
                      label={option}
                      {...getTagProps({ index })}
                      sx={{
                        backgroundColor: bravoColors.primaryFlat,
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Select"
                    placeholder="Search or select"
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpenAddSection(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setOpenAddSection(false)}
              variant="contained"
            >
              Import All
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  return renderContent();
};

export default TemplateBuilder;
