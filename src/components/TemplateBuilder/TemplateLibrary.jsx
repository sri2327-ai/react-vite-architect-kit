
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  useMediaQuery,
  Card,
  CardContent,
  Grid2 as Grid,
  Menu,
  TextField,
  Dialog,
  Chip,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Button,
  useTheme,
  Modal,
  Typography,
  Stack,
  DialogTitle,
  DialogContent,
  Divider,
  Autocomplete,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
  DriveFileRenameOutlineOutlined as DriveFileRenameOutlineOutlinedIcon,
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
  FormatListBulleted as FormatListBulletedIcon,
  Description as DescriptionIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { templateService } from '../../services/templateService';

const NoDataOverlay = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      color: 'gray',
      fontSize: '16px',
      fontFamily: 'Poppins, sans-serif',
    }}
  >
    No data to display
  </Box>
);

const style = {
  borderRadius: '8px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  boxShadow: 24,
  p: 4,
  fontFamily: 'Poppins, sans-serif',
};

const TemplateLibrary = () => {
  const [open, setOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [bugData, setBugData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const theme = useTheme();
  const [deletenotespopup, setDeletenotespopup] = useState(false);
  const [notesListWithIds, setNotesListWithIds] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editnotePopup, setEditnotePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);
  const [payload, setPayload] = useState(null);
  const [isYesClicked, setIsYesClicked] = useState(false);
  const isMobile = useMediaQuery("(max-width:950px)");
  const [openCreateTemplate, setopenCreateTemplate] = useState(false);
  const [openAddType, setOpenAddType] = useState(false);
  const [openModifyTemplate, setOpenModifyTemplate] = useState(false);
  const [openAddExType, setOpenAddExType] = useState(false);
  const [openAddSection, setOpenAddSection] = useState(false);
  const [showknowImprovr, setShowknowImprovr] = useState(false);
  const [templateType, setTemplateType] = useState("none");
  const [templateScreen, setTemplateScreen] = useState("conTypePage");
  const [selectedconsType, setSelectedconsType] = useState("");
  const [showTemplate, setShowTemplate] = useState(false);
  const [showTemplatePreview, setshowTemplatePreview] = useState(false);
  const [tempArr, settempArr] = useState([
    { name: "template 01", id: 1 },
    { name: "template 02", id: 2 },
    { name: "template 03", id: 3 },
    { name: "template 04", id: 4 },
    { name: "template 05", id: 5 },
    { name: "template 06", id: 6 },
    { name: "template 07", id: 7 },
    { name: "template 08", id: 8 },
    { name: "template 09", id: 9 }
  ]);

  const { control, reset, getValues, setError, clearErrors, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      notes: '',
      special: ''
    },
  });

  const {
    register: registerLogin,
    control: addtypecontrol,
    handleSubmit: handleAddtypeSubmit,
    formState: { errors: addtypeErrors },
    trigger: triggerAddType,
    getValues: getAddTypeValues
  } = useForm();

  const onAddtypeSubmit = (data) => {
    console.log('Login:', data);
  };

  const onAddTypeClick = async () => {
    const isValid = await triggerAddType();
    if (isValid) {
      console.log("Add Type Form Data", getAddTypeValues());
      try {
        const data = getAddTypeValues();
        const payload = {
          doc_name: "Test Doctor",
          doc_id: "test_id",
          location_present: true
        };
        const finalpayload = { ...payload, ...data };
        // Simulate API call
        console.log("Final payload:", finalpayload);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    } else {
      console.warn("Add Type Form Invalid");
    }
  };

  const sectiondata = [
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
    },
    {
      "name": "FAMILY HEALTH HISTORY",
      "action": "add",
      "type": "bulleted_list",
      "is_editing": false,
      "is_editing_template": false,
      "paste_template": "",
      "description": "Summary of known family health history, focusing on immediate family members and relevant hereditary conditions."
    }
  ];

  const {
    register: registertemplate,
    control: addtemplatecontrol,
    handleSubmit: handleaddtemplate,
    formState: { errors: addtemplateErrors },
    trigger: triggeraddtemplate,
    getValues: getaddtemplate
  } = useForm();

  const [wizardActions, setWizardActions] = useState(null);
  const nextButtonRef = useRef(null);

  const onaddtemplate = async () => {
    const isValid = await triggeraddtemplate();
    if (isValid) {
      try {
        const data = getaddtemplate();
        const payload = {
          doc_name: "Test Doctor",
          doc_id: "test_id",
          template_type: templateMethod?.title,
          consult_type: selectedconsType,
        };
        const finalpayload = { ...payload, ...data };
        setOpenModifyTemplate(true);
        setShowTemplate(true);
        setopenCreateTemplate(false);
        setTemplateType("none");
        setSectionList(sectiondata);
        console.log("Template created:", finalpayload);
      } catch (error) {
        console.error('Error creating template:', error);
      }
    } else {
      console.warn("Add Type Form Invalid");
    }
  };

  const data = [
    { id: 1, title: "CLINICAL INTERVIEW1", specality: "cardiologist", type: "SOAP", feilds: [] },
    { id: 2, title: "CLINICAL INTERVIEW2", specality: "pyscologist", type: "SOAP", feilds: [] },
    { id: 3, title: "CLINICAL INTERVIEW3", specality: "cardiologist", type: "DPD", feilds: [] },
    { id: 4, title: "Dermatology Intake", specality: "Dermatology", type: "SOAP", feilds: [] },
    { id: 5, title: "Neurology Followup", specality: "pyscologist", type: "SOAP", feilds: [] },
    { id: 6, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", feilds: [] }
  ];

  const columns = [
    { field: "sno", headerName: "S.NO", width: 80 },
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
      width: 200,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" size="small" />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit-action"
          icon={<EditIcon sx={{ color: '#1d4556' }} />}
          label="Edit"
          onClick={() => handleNotesEdit(params.row)}
        />,
        <GridActionsCellItem
          key="view-action"
          icon={<VisibilityIcon sx={{ color: '#1d4556' }} />}
          label="View"
          onClick={() => handleTemplatePreview(params.row)}
        />,
        <GridActionsCellItem
          key="delete-action"
          icon={<DeleteIcon sx={{ color: '#1d4556' }} />}
          label="Delete"
          onClick={() => handleNotesDelete(params.row)}
        />,
      ],
    },
  ];

  const handleNotesDelete = (note) => {
    setSelectedNote(note);
    setDeletenotespopup(true);
    console.log('Template to delete:', note);
  };

  const handleNotesEdit = (note) => {
    setSelectedNote(note);
    setEditnotePopup(true);
  };

  const handleTemplatePreview = (template) => {
    setSelectedNote(template);
    setshowTemplatePreview(true);
  };

  const handleEditNotesClose = () => {
    setEditnotePopup(false);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const [textFields, setTextFields] = useState([]);

  const handleAddClick = () => {
    const nextSectionNumber = (textFields.length / 2) + 2;
    setTextFields(prevFields => [
      ...prevFields,
      { id: `section${nextSectionNumber}Title`, label: `Section ${nextSectionNumber} Title` },
      { id: `section${nextSectionNumber}Instruction`, label: `Section ${nextSectionNumber} Instruction` }
    ]);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openmenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const options = ['ALL', 'EHR', 'No EHR'];

  const handleClose = () => {
    setAnchorEl(null);
  };

  const createTemplateItems = [
    {
      type: 1,
      title: 'Copy Previous Notes',
      Description: "Reuse the last note you copied.",
      icon: <CopyAllIcon sx={{ width: 60, height: 60, color: "#1d4556" }} />,
    },
    {
      type: 2,
      title: 'Generate Template',
      Description: "AI-assisted template creation with summary.",
      icon: <AutoFixHighIcon sx={{ width: 60, height: 60, color: "#1d4556" }} />
    },
    {
      type: 3,
      title: 'Start from Scratch',
      Description: "Begin with a blank slate.",
      icon: <EditNoteIcon sx={{ width: 60, height: 60, color: "#1d4556" }} />,
    },
    {
      type: 4,
      title: 'Use Existing Template',
      Description: "Copy-paste existing template.",
      icon: <ContentCopyIcon sx={{ width: 60, height: 60, color: "#1d4556" }} />,
    },
    {
      type: 5,
      title: 'Template Library',
      Description: "Access and manage all your templates.",
      icon: <LibraryBooksIcon sx={{ width: 60, height: 60, color: "#1d4556" }} />,
    },
  ];

  const [templateMethod, setTemplateMethod] = useState({});
  const [sectionList, setSectionList] = useState([]);
  const [tempTextEdit, setTempTextEdit] = useState('');

  const addItem = () => {
    const newItem = { id: Date.now(), name: 'New Section' };
    setSectionList(prev => [...prev, newItem]);
  };

  const editItem = (idx, key, value) => {
    setSectionList(prev =>
      prev.map((item, index) =>
        index === idx ? { ...item, [key]: value } : item
      )
    );
  };

  const deleteItem = (indexToRemove) => {
    setSectionList(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const [drop1, setdrop1] = useState('');
  const [drop2, setdrop2] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange1 = (event) => {
    setdrop1(event.target.value);
  };

  const handleChange2 = (event) => {
    setdrop2(event.target.value);
  };

  // Add data with IDs for DataGrid
  useEffect(() => {
    const updatedData = data.map((item, index) => ({
      ...item,
      sno: index + 1,
    }));
    setNotesListWithIds(updatedData);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#1d4556', fontWeight: 600 }}>
          Template Library
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setopenCreateTemplate(true)}
          sx={{
            backgroundColor: '#1d4556',
            '&:hover': { backgroundColor: '#143d4f' }
          }}
        >
          Create Template
        </Button>
      </Box>

      {/* Filter Section */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Specialty</InputLabel>
          <Select value={drop1} label="Specialty" onChange={handleChange1}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="cardiologist">Cardiologist</MenuItem>
            <MenuItem value="pyscologist">Psychologist</MenuItem>
            <MenuItem value="Dermatology">Dermatology</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select value={drop2} label="Type" onChange={handleChange2}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="SOAP">SOAP</MenuItem>
            <MenuItem value="DPD">DPD</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Templates Grid */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={notesListWithIds}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          slots={{
            noRowsOverlay: NoDataOverlay,
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              fontSize: '0.875rem',
              fontFamily: 'Poppins, sans-serif',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontSize: '0.9rem',
              fontWeight: 600,
            },
          }}
        />
      </Box>

      {/* Create Template Dialog */}
      <Dialog
        open={openCreateTemplate}
        onClose={() => setopenCreateTemplate(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#1d4556', fontWeight: 600 }}>
          Choose Template Creation Method
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {createTemplateItems.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.type}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    '&:hover': {
                      boxShadow: '0px 8px 16px rgba(0,0,0,0.2)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => {
                    setTemplateMethod(item);
                    setopenCreateTemplate(false);
                    setOpenModifyTemplate(true);
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, color: '#1d4556', fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.Description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setopenCreateTemplate(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog
        open={showTemplatePreview}
        onClose={() => setshowTemplatePreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Template Preview: {selectedNote?.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Specialty:</strong> {selectedNote?.specality}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Type:</strong> {selectedNote?.type}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>Template Sections</Typography>
            {sectiondata.map((section, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {section.name}
                </Typography>
                <Chip 
                  label={section.type} 
                  size="small" 
                  color="primary" 
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {section.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setshowTemplatePreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deletenotespopup} onClose={() => setDeletenotespopup(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this template? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletenotespopup(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              console.log('Deleting template:', selectedNote);
              setDeletenotespopup(false);
            }} 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Modification Dialog */}
      <Dialog
        open={openModifyTemplate}
        onClose={() => setOpenModifyTemplate(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ color: '#1d4556', fontWeight: 600 }}>
          Modify Template: {templateMethod?.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Template Sections
            </Typography>
            <Stack spacing={2}>
              {sectionList.map((item, idx) => (
                <Card
                  key={idx}
                  elevation={3}
                  sx={{
                    border: "2px solid #408DA9",
                    '&:hover': {
                      boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography sx={{ color: "#343434", fontSize: 18, fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Chip
                          icon={item.type === 'bulleted_list' ? <FormatListBulletedIcon /> : <DescriptionIcon />}
                          label={item.type}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                      
                      {!item.is_editing && (
                        <Typography sx={{ color: "#808080", fontSize: 14, fontWeight: 400 }}>
                          Description: {item.description}
                        </Typography>
                      )}

                      {item.is_editing ? (
                        <Box>
                          <TextField
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            autoFocus
                            value={item.temp_description || ''}
                            onChange={(event) => {
                              editItem(idx, "temp_description", event.target.value);
                            }}
                          />
                          <Box display="flex" gap={2} sx={{ mt: 1 }}>
                            <Button
                              onClick={() => {
                                editItem(idx, "description", item.temp_description);
                                editItem(idx, "is_editing", false);
                              }}
                              variant="contained"
                              startIcon={<SaveIcon />}
                              color="primary"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={() => {
                                editItem(idx, "is_editing", false);
                              }}
                              variant="outlined"
                              startIcon={<DoDisturbIcon />}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box display="flex" gap={2}>
                          <Button
                            onClick={() => {
                              editItem(idx, "temp_description", item.description);
                              editItem(idx, "is_editing", true);
                            }}
                            variant="contained"
                            startIcon={<EditIcon />}
                            color="primary"
                            size="small"
                          >
                            Modify
                          </Button>
                          <Button
                            onClick={() => deleteItem(idx)}
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            color="error"
                            size="small"
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
            
            <Button
              onClick={addItem}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
              fullWidth
            >
              Add New Section
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModifyTemplate(false)}>Cancel</Button>
          <Button
            onClick={() => {
              console.log('Saving template with sections:', sectionList);
              setOpenModifyTemplate(false);
            }}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateLibrary;
