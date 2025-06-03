
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  useMediaQuery,
  ThemeProvider,
  CssBaseline,
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
  useTheme,
  Modal,
  Typography,
  Stack,
  DialogTitle,
  DialogContent,
  Divider,
  Autocomplete,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useForm, Controller } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { blue } from "@mui/material/colors";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import * as yup from 'yup';
import { Description } from "@mui/icons-material";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DescriptionIcon from '@mui/icons-material/Description';
import CircleIcon from '@mui/icons-material/Circle';
import CustomDrawer from "../../reuseable-components/CustomDrawer.jsx";
import AnimatedTabs from "../../reuseable-components/AnimatedTabs.jsx";
import CustomDialog from "../../reuseable-components/DialogCustom/DialogCustom.jsx";
import AILoader from "../../reuseable-components/AILoader.jsx";
import DragDropList from "../../reuseable-components/DragDropList.jsx";
import FormWizard from "../../reuseable-components/FormWizard.jsx";

const TemplateLibrary = () => {
  const [drop1, setDrop1] = useState(10);
  const [drop2, setDrop2] = useState(10);
  const [showTemplatePreview, setshowTemplatePreview] = useState(false);
  const [openAddSection, setOpenAddSection] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [templateMethod, setTemplateMethod] = useState(null);
  const [showknowImprovr, setShowknowImprovr] = useState(false);
  const [openCreateTemplate, setopenCreateTemplate] = useState(false);
  const [openAddType, setOpenAddType] = useState(false);
  const [openModifyTemplate, setOpenModifyTemplate] = useState(false);
  const [openAddExType, setOpenAddExType] = useState(false);
  const [templateType, setTemplateType] = useState("none");
  const [templateScreen, setTemplateScreen] = useState("conTypePage");
  const [selectedconsType, setSelectedconsType] = useState("");
  const [showTemplate, setShowTemplate] = useState(false);
  const [tempArr, settempArr] = useState([
    { name: "template 01", id: 1 },
    { name: "template 02", id: 2 },
    { name: "template 03", id: 3 },
    { name: "template 04", id: 4 },
    { name: "template 05", id: 5 },
  ]);
  const [deletenotespopup, setDeletenotespopup] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [textFields, setTextFields] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [wizardActions, setWizardActions] = useState(null);
  const nextButtonRef = useRef(null);

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

  const {
    register: registertemplate,
    control: addtemplatecontrol,
    handleSubmit: handleaddtemplate,
    formState: { errors: addtemplateErrors },
    trigger: triggeraddtemplate,
    getValues: getaddtemplate
  } = useForm();

  const handleChange1 = (event) => {
    setDrop1(event.target.value);
  };

  const handleChange2 = (event) => {
    setDrop2(event.target.value);
  };

  const editItem = (idx, key, value) => {
    setSectionList(prev => {
      const newList = [...prev];
      newList[idx] = { ...newList[idx], [key]: value };
      return newList;
    });
  };

  const deleteItem = (idx) => {
    setSectionList(prev => {
      const newList = [...prev];
      newList.splice(idx, 1);
      return newList;
    });
  };

  const data = [
    { id: 1, title: "CLINICAL INTERVIEW1", specality: "cardiologist", type: "SOAP", feilds: [] },
    { id: 2, title: "CLINICAL INTERVIEW2", specality: "pyscologist", type: "SOAP", feilds: [] },
    { id: 3, title: "CLINICAL INTERVIEW3", specality: "cardiologist", type: "DPD", feilds: [] },
    { id: 4, title: "Dermatology Intake", specality: "Dermatology", type: "SOAP", feilds: [] },
    { id: 5, title: "Neurology Followup", specality: "pyscologist", type: "SOAP", feilds: [] },
    { id: 6, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", feilds: [] },
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
    }
  ];

  const Step2 = () => (
    <Box>
      <Typography sx={{ color: '#1d4556', fontWeight: '600', fontSize: 24 }}>Verify Template Changes</Typography>
      <Typography sx={{ fontSize: 12, color: "#808080", width: '60%' }}>Based on its analysis, the AI has generated documentation improvements tailored to your template. Please review and approve the suggested edits below.</Typography>
      <Stack flexDirection={"column"} justifyContent={"center"} gap={2} mt={5}>
        {sectionList && sectionList.length > 0 &&
          sectionList.map((item, idx) => (
            <Card
              elevation={5}
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
                border: "2px solid #408DA9",
                "&:hover": {
                  boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
                  border: "2px solid #408DA9",
                },
              }}
              onClick={() => { setTemplateMethod(item); }}
            >
              <Box display="flex" flexDirection={"column"} p={2} >
                <Box display="flex" flexDirection={"column"} ml={1} mb={1} gap={1}>
                  <Typography sx={{ color: "#343434", fontSize: 18, fontWeight: 600 }}>{item.name}</Typography>
                  <Chip icon={item.type == 'bulleted_list' ? <FormatListBulletedIcon /> : <DescriptionIcon />} label={item.type} size="small" color="success" variant="outlined" sx={{ width: 150 }} />
                  {!item.is_editing && <Typography sx={{ color: "#808080", fontSize: 14, fontWeight: 400 }}>Description: {item.description}</Typography>}
                </Box>
                {item.is_editing ? (
                  <>
                    <Box>
                      <TextField fullWidth variant="outlined" margin="normal" autoFocus value={item.temp_description}
                        onChange={(event) => {
                          editItem(idx, "temp_description", event.target.value);
                        }} />
                    </Box>
                    <Box display="flex" flexDirection={"row"} gap={2}>
                      <Button onClick={() => { editItem(idx, "description", item.temp_description); editItem(idx, "is_editing", false) }} variant="contained" sx={{
                        borderRadius: "5px", padding: "5px 10px",
                        color: "#F4FCFF",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }} startIcon={<SaveIcon />} color="primary">
                        Save
                      </Button>
                      <Button onClick={() => { editItem(idx, "is_editing", false) }} variant="contained" sx={{
                        borderRadius: "5px", padding: "5px 10px",
                        color: "#F4FCFF",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }} startIcon={<DoDisturbIcon />} color="primary">
                        Cancel
                      </Button>
                    </Box>
                  </>
                ) :
                  item.is_editing_template ? (
                    <>
                      <Box >
                        <TextField fullWidth variant="outlined" margin="normal" multiline
                          rows={6} autoFocus value={item.temp_template}
                          onChange={(event) => {
                            editItem(idx, "temp_template", event.target.value);
                          }} />
                      </Box>
                      <Box display="flex" flexDirection={"row"} gap={2}>
                        <Button onClick={() => { editItem(idx, "paste_template", item.temp_template); editItem(idx, "is_editing_template", false); }} variant="contained" sx={{
                          borderRadius: "5px", padding: "5px 10px",
                          color: "#F4FCFF",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                        }} startIcon={<SaveIcon />} color="primary">
                          Save template
                        </Button>
                        <Button onClick={() => { editItem(idx, "is_editing_template", false); editItem(idx, "temp_template", "") }} variant="contained" sx={{
                          borderRadius: "5px", padding: "5px 10px",
                          color: "#F4FCFF",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                        }} startIcon={<DoDisturbIcon />} color="primary">
                          Cancel
                        </Button>
                      </Box>
                    </>
                  ) :
                    <Box display="flex" flexDirection={"row"} gap={2}>
                      <Button onClick={() => { editItem(idx, "temp_description", item.description); editItem(idx, "is_editing", true) }} variant="contained" sx={{
                        borderRadius: "5px",
                        padding: "5px 10px",
                        color: "#F4FCFF",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }} startIcon={<EditIcon />} color="primary">
                        Modify Instruction
                      </Button>
                      <Button onClick={() => { editItem(idx, "temp_template", item.paste_template); editItem(idx, "is_editing_template", true) }} variant="contained" sx={{
                        borderRadius: "5px", padding: "5px 10px",
                        color: "#F4FCFF",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }} startIcon={<CopyAllIcon />} color="primary">
                        Paste Template
                      </Button>
                      <Button onClick={() => { deleteItem(idx) }} variant="contained" sx={{
                        borderRadius: "5px", padding: "5px 10px",
                        color: "#F4FCFF",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }} startIcon={<DeleteIcon />} color="primary">
                        Delete
                      </Button>
                    </Box>
                }
              </Box>
            </Card>
          ))
        }
      </Stack>
    </Box>
  );

  const Step3 = () => (
    <Box>
      <Typography sx={{ fontSize: 12, color: "#808080", width: '60%', pb: 2 }}>Template has been modified. Please review the changes below</Typography>
      <Box p={2} sx={{ border: '2px dashed #808080', p: 1 }}>
        <Typography sx={{ fontSize: 18, color: "black", width: '60%', p: 2, fontWeight: 600 }}>Template Preview</Typography>
        <Divider></Divider>
        {templatePreview && templatePreview.map((item, idx) => {
          return (
            <Box p={2} key={idx}>
              <Typography sx={{ fontSize: 18, color: "black", fontWeight: 700 }}>{item.name}</Typography>
              <Typography sx={{ fontSize: 16, color: "black" }}>{item.content}</Typography>
              {item.items && item.items.length > 0 && item.items.map((data, index) => (
                <Stack key={index} flexDirection={"row"} alignItems={"flex-start"}>
                  <CircleIcon sx={{ fontSize: 8, color: 'black', mt: 1 }} />
                  <Typography sx={{ fontSize: 16, color: 'black', pl: 1 }}>{data.content}</Typography>
                </Stack>
              ))}
            </Box>
          )
        })}
      </Box>
    </Box>
  );

  const steps = [
    { label: 'Template Analysis', component: <AILoader /> },
    { label: 'Review', component: <Step2 /> },
    { label: 'Customize', component: <AILoader loadingMessages={[
        "AI modifying content...",
        "Please Wait...",
        "Applying AI optimizations...",
        "Finalizing template Preview...",
      ]} /> },
    { label: 'Finalize', component: <Step3 /> }
  ];

  return (
    <>
      <Box m="20px">
        <>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Typography sx={{ color: "#1d4556", fontSize: 24, fontWeight: 600, my: 2 }}>Template Library</Typography>
          </Box>
          {(
            <>
              <Box mb={2} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small-label">Specialty</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={drop1}
                    label="Specialty"
                    onChange={handleChange1}
                    style={{ color: '#000', backgroundColor: '#fff' }}
                    MenuProps={{ PaperProps: { style: { backgroundColor: '#fff', color: '#000', }, }, }}
                  >
                    <MenuItem value={10}>ALL</MenuItem>
                    <MenuItem value={20}>General Practitioner</MenuItem>
                    <MenuItem value={30}>Psychologist</MenuItem>
                    <MenuItem value={40}>Family Medicine Specialist</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small-label">Select</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={drop2}
                    label="Note Type"
                    onChange={handleChange2}
                    style={{ color: '#000', backgroundColor: '#fff' }}
                    MenuProps={{ PaperProps: { style: { backgroundColor: '#fff', color: '#000', }, }, }}
                  >
                    <MenuItem value={10}>ALL</MenuItem>
                    <MenuItem value={20}>EHR</MenuItem>
                    <MenuItem value={30}>No EHR</MenuItem>
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
                    onClick={() => setshowTemplatePreview(true)}
                    sx={{
                      width: 250,
                      borderRadius: 3,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.2s ease-in-out",
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: "0 4px 14px rgba(64, 141, 169, 0.3)",
                        border: "1px solid #408DA9",
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
                          color: "#222",
                          lineHeight: 1.4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "100%",
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
                          sx={{ fontSize: 11, backgroundColor: "#408DA9" }}
                        />
                        <Chip
                          label={`Note Type: ${item.type}`}
                          color="primary"
                          size="small"
                          sx={{ fontSize: 11, backgroundColor: "#408DA9" }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </>)
          }
        </>
      </Box>

      <CustomDrawer
        open={showTemplatePreview}
        onClose={() => { setshowTemplatePreview(false); }}
        actionButton={true}
        actions={
          <>
            <Button onClick={() => { setshowTemplatePreview(false) }} variant="contained" sx={{
              borderRadius: "5px", padding: "5px 10px",
              color: "#F4FCFF",
              fontSize: "0.9rem",
              fontWeight: 600,
            }} color="primary" >
              Cancel
            </Button>
            <Button onClick={() => { setshowTemplatePreview(false); setOpenAddSection(true) }} variant="contained" sx={{
              borderRadius: "5px", padding: "5px 10px",
              color: "#F4FCFF",
              fontSize: "0.9rem",
              fontWeight: 600,
            }} color="primary" >
              Add to Library
            </Button>
          </>
        }
        title={"Template Preview"}
        showHowitwork={false}
      >
        <Box p={2}>
          <AnimatedTabs
            tabs={[
              {
                title: 'Template Preview',
                content: <Box>
                  <Box p={2} sx={{ border: '2px dashed #808080', p: 1 }}>
                    <Typography sx={{ fontSize: 18, color: "black", width: '60%', p: 2, fontWeight: 600 }}>Template Preview</Typography>
                    <Divider></Divider>
                    {templatePreview && templatePreview.map((item, idx) => {
                      return (
                        <Box p={2} key={idx}>
                          <Typography sx={{ fontSize: 18, color: "black", fontWeight: 700 }}>{item.name}</Typography>
                          <Typography sx={{ fontSize: 16, color: "black" }}>{item.content}</Typography>
                          {item.items && item.items.length > 0 && item.items.map((data, index) => (
                            <Stack key={index} flexDirection={"row"} alignItems={"flex-start"}>
                              <CircleIcon sx={{ fontSize: 8, color: 'black', mt: 1 }} />
                              <Typography sx={{ fontSize: 16, color: 'black', pl: 1 }}>{data.content}</Typography>
                            </Stack>
                          ))}
                        </Box>
                      )
                    })}
                  </Box>
                </Box>,
              },
              {
                title: 'Example Note',
                content: <Typography sx={{
                  fontSize: 16,
                  color: "black",
                  flexWrap: "wrap",
                  wordWrap: "break-word",
                  overflow: "hidden",
                  whiteSpace: 'pre-line'
                }}>
                  {"Subjective:\n- Patient's Description: [Details of the patient's experience, symptoms, and concerns (only include if applicable)]\n- Emotional State: [Patient's emotional condition and stress levels (only include if applicable)]\n- Lifestyle Factors: [Diet, exercise, sleep patterns (only include if applicable)]\n- Treatment History: [Previous acupuncture treatments and outcomes (only include if applicable)]\n\nObjective:\n- Physical Examination: [Findings from physical assessment, including pulse diagnosis and tongue observation (only include if applicable)]\n- Vital Signs: [BP, HR, Temp, and any other relevant measures (only include if applicable)]\n\nAssessment:\n- Diagnosis: [TCM diagnosis and differentiation (only include if explicitly mentioned)]\n- Problem List: [Identified issues to be addressed (only include if applicable)]\n\nPlan:\n- [Treatment Plan: Acupuncture points used, technique, and rationale (only include if applicable)]\n- [Lifestyle Recommendations: Dietary advice, exercise, stress management techniques (only include if applicable)]\n- [Follow-Up: Scheduling of next appointment and goals for next session (only include if applicable)] convert to json string or string has key"}
                </Typography>
              }
            ]}
          />
        </Box>
      </CustomDrawer>

      <CustomDialog
        isOpen={openAddSection}
        onClose={() => { setOpenAddSection(false) }}
        title={'Add Template to'}
        actions={<>
          <Button onClick={() => { }} variant="contained">
            Cancel
          </Button>
          <Button onClick={() => { setOpenAddSection(false) }} type="submit" variant="contained" color="primary" >
            {'Import all'}
          </Button>
        </>}
        maxWidthdialog="sm"
        maxHeightdialog="40vh"
      >
        <Box p={2}>
          <Autocomplete
            multiple
            options={[]}
            value={selectedOptions}
            onChange={(event, newValue) => setSelectedOptions(newValue)}
            sx={{
              width: 400,
              '& .MuiInputBase-root': {
                backgroundColor: '#f0f7ff',
                color: '#1976d2',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
              '& .MuiInputLabel-root': {
                color: '#1976d2',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#1565c0',
              },
              '& .MuiAutocomplete-listbox': {
                backgroundColor: '#f3f3f3',
                borderRadius: 4,
                boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
              },
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={option}
                  label={option}
                  {...getTagProps({ index })}
                  sx={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
              ))
            }
            renderOption={(props, option, { selected }) => (
              <Box
                component="li"
                {...props}
                sx={{
                  color: selected ? '#1565c0' : '#333',
                  fontWeight: selected ? 600 : 400,
                  backgroundColor: selected ? '#e3f2fd' : 'white',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  },
                }}
              >
                {option}
              </Box>
            )}
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
      </CustomDialog>
    </>
  );
};

export default TemplateLibrary;
