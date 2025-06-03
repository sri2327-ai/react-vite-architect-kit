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
  Autocomplete
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import Header from "../../reuseable-components/Header";
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useZusGetMyDoctor, useZusGetMyNotes, useZusDocDetail } from '../../store.js';
import { fetchDataPy } from "../util/fetchDataPy.ts";
import { toast } from 'react-toastify';
import NoteDialog from "../../reuseable-components/CustomDialog/CustomNotesForm.jsx";
import generateCustomID from '../../reuseable-components/generateCustomID.js'
import { theme } from "../../mui-theme.jsx";
import CircularProgress from '@mui/material/CircularProgress';
import { useTabStore, useLoaderStore, useAddsectionClick } from "../../store.js";
import { useFetchData } from "../../reuseable-components/Api/Instruction.js";
import SaveIcon from '@mui/icons-material/Save';
import CustomLoadingOverlay from "../../CustomLoadingOverlay.js";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useForm, Controller } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { blue } from "@mui/material/colors";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomDialog from "../../reuseable-components/DialogCustom/DialogCustom.jsx";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import * as yup from 'yup';
import { Description } from "@mui/icons-material";
import FormWizard from "../../reuseable-components/FormWizard.jsx";
import AILoader from "../../reuseable-components/AILoader.jsx";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DescriptionIcon from '@mui/icons-material/Description';
import { wizardTabStore } from "../../store.js";
import CircleIcon from '@mui/icons-material/Circle';
import DragDropList from "../../reuseable-components/DragDropList.jsx";
import CustomDrawer from "../../reuseable-components/CustomDrawer.jsx";
import AnimatedTabs from "../../reuseable-components/AnimatedTabs.jsx";

const TemplateLibrary = () => {
  const [drop1, setDrop1] = useState(10);
  const [drop2, setDrop2] = useState(10);
  const [showTemplatePreview, setshowTemplatePreview] = useState(false);
  const [openAddSection, setOpenAddSection] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [templateMethod, setTemplateMethod] = useState(null);
  const [showknowImprovr, setShowknowImprovr] = useState(false);

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
    { id: 7, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", feilds: [] },
    { id: 8, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", feilds: [] },
    { id: 9, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", feilds: [] },
    { id: 10, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", feilds: [] },
    { id: 11, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", feilds: [] },
    { id: 12, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", feilds: [] },
    { id: 13, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", feilds: [] },
    { id: 14, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", feilds: [] },
    { id: 15, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", feilds: [] },
    { id: 16, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", feilds: [] },
    { id: 17, title: "Dermatology Intake1", specality: "cardiologist", type: "DPD", feilds: [] },
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
      "content": "Summarize the known family health history, focusing on immediate family members and highlighting relevant hereditary conditions.",
      "id": "22faa4a9-1436-5882-7fcb-87a986aed3c6",
      "items": [
        {
          "content": "Include a bullet for each immediate family member (parents, siblings, children) and mention their known health conditions."
        },
        {
          "content": "For each individual mentioned, specify hereditary conditions that may be relevant to the patient's health."
        },
        {
          "content": "If applicable, include information about the age of onset for any hereditary diseases."
        }
      ],
      "name": "Family Health History",
      "type": "bulleted_list"
    },
    {
      "content": "Record a list of significant past medical events or procedures relevant to the patient's current health.",
      "id": "e40cb25c-ad63-74cc-73d9-54c0f314fa6f",
      "items": [
        {
          "content": "Include a bullet for each significant past medical event or procedure. Provide the event or procedure name, date, and any relevant notes on its impact on the patient's current health."
        }
      ],
      "name": "Major Events",
      "type": "bulleted_list"
    },
    {
      "content": "List of current known medical problems affecting the patient.",
      "id": "e5c2efe1-b847-75a4-2462-95ae3ea52aba",
      "items": [
        {
          "content": "Create a bullet for each ongoing medical problem the patient is currently experiencing. Include the problem name and any relevant details such as severity, duration, and current management strategies."
        }
      ],
      "name": "Ongoing Medical Problems",
      "type": "bulleted_list"
    },
    {
      "content": "Record of preventive measures or history such as vaccinations or routine screenings.",
      "id": "84b2f7d2-e0b8-40f4-7b3d-061a6a1221d8",
      "items": [
        {
          "content": "Create a bullet item for each vaccination the patient has received, including the date it was administered and if applicable, any booster shots."
        },
        {
          "content": "List any routine screenings the patient has undergone, specifying the type of screening (e.g., mammogram, colonoscopy) and the date it was last performed."
        },
        {
          "content": "Include other preventive measures taken by the patient, such as regular health check-ups, dietary adjustments, and any preventive medications they are on."
        }
      ],
      "name": "Preventive Care",
      "type": "bulleted_list"
    },
    {
      "content": "Include lifestyle factors such as alcohol, tobacco, and recreational drug use, along with marital status, children, and occupation.",
      "id": "87a65e46-bdbd-73c8-255d-80c278135056",
      "items": [
        {
          "content": "Create a bullet for alcohol use including frequency and amount."
        },
        {
          "content": "Create a bullet for tobacco use including type, frequency, and duration."
        },
        {
          "content": "Create a bullet for any recreational drug use including type and frequency."
        },
        {
          "content": "Create a bullet for marital status."
        },
        {
          "content": "Create a bullet for number and ages of children."
        },
        {
          "content": "Create a bullet for current occupation including job title and duration of employment."
        }
      ],
      "name": "Social History",
      "type": "bulleted_list"
    },
    {
      "content": "Create a bullet for each body system reviewed. Include relevant positives and negatives as reported by the patient.",
      "id": "42d00036-eb64-9f47-cc11-2eff2d62a96d",
      "items": [
        {
          "content": "General: {Report on fatigue, fever, chills, or weight changes. Include relevant positives and negatives.}"
        },
        {
          "content": "Skin: {Report on rashes, changes in moles, or dryness. Include relevant positives and negatives.}"
        },
        {
          "content": "Head/Eyes/Ears/Nose/Throat (HEENT): {Report on headaches, vision changes, ear pain, nasal congestion, sore throat. Include relevant positives and negatives.}"
        },
        {
          "content": "Respiratory: {Report on cough, difficulty breathing, or wheezing. Include relevant positives and negatives.}"
        },
        {
          "content": "Cardiovascular: {Report on chest pain, palpitations, or edema. Include relevant positives and negatives.}"
        },
        {
          "content": "Gastrointestinal: {Report on nausea, vomiting, diarrhea, constipation, or abdominal pain. Include relevant positives and negatives.}"
        },
        {
          "content": "Genitourinary: {Report on urinary frequency, urgency, or changes in urine. Include relevant positives and negatives.}"
        },
        {
          "content": "Musculoskeletal: {Report on joint pain, muscle aches, or stiffness. Include relevant positives and negatives.}"
        },
        {
          "content": "Neurological: {Report on dizziness, numbness, tingling, or weakness. Include relevant positives and negatives.}"
        },
        {
          "content": "Psychiatric: {Report on anxiety, depression, or mood changes. Include relevant positives and negatives.}"
        },
        {
          "content": "Endocrine: {Report on changes in thirst, appetite, or energy levels. Include relevant positives and negatives.}"
        },
        {
          "content": "Hematologic/Lymphatic: {Report on easy bruising, bleeding, or lymph node enlargement. Include relevant positives and negatives.}"
        },
        {
          "content": "Allergic/Immunologic: {Report on allergies, recurrent infections, or immune system concerns. Include relevant positives and negatives.}"
        }
      ],
      "name": "Review of Systems",
      "type": "bulleted_list"
    },
    {
      "id": "b9dae99a-77ce-2595-ab8d-d93f880073da",
      "items": [
        {
          "content": "Recap the patient's general appearance, including observations like alertness, apparent distress, and nutritional status.",
          "name": "General Appearance",
          "withinNormalLimitsText": "Patient appears well-nourished, alert, and in no apparent distress."
        },
        {
          "content": "Recap the examination of the skin, noting any rashes, lesions, or abnormalities.",
          "name": "Skin",
          "withinNormalLimitsText": "Skin is warm, dry, and intact with no rashes or lesions."
        },
        {
          "content": "Recap head examination, noting any deformities or abnormalities.",
          "name": "Head",
          "withinNormalLimitsText": "Head is normocephalic and atraumatic."
        },
        {
          "content": "Recap eye examination including pupil reaction, conjunctivae, and sclera.",
          "name": "Eyes",
          "withinNormalLimitsText": "Pupils equal, round, reactive to light and accommodation; conjunctivae clear and sclera white."
        },
        {
          "content": "Recap ear examination, noting any discharge or abnormalities.",
          "name": "Ears",
          "withinNormalLimitsText": "Ear canals clear and tympanic membranes intact with no discharge."
        },
        {
          "content": "Recap the examination of the nose and sinuses.",
          "name": "Nose",
          "withinNormalLimitsText": "Nasal passages clear with no discharge; sinuses non-tender."
        },
        {
          "content": "Recap the examination of the mouth and throat.",
          "name": "Mouth/Throat",
          "withinNormalLimitsText": "Oral mucosa moist and pink; no lesions or tonsillar enlargement."
        },
        {
          "content": "Recap of neck exam, noting thyroid and cervical lymph nodes status.",
          "name": "Neck",
          "withinNormalLimitsText": "Neck supple with no lymphadenopathy; thyroid not enlarged."
        },
        {
          "content": "Recap examination of cardiovascular system including heart sounds and peripheral pulses.",
          "name": "Cardiovascular",
          "withinNormalLimitsText": "Regular rate and rhythm; normal S1 and S2; no murmurs, rubs, or gallops; peripheral pulses 2+. "
        },
        {
          "content": "Recap examination of the respiratory system including auscultatory findings.",
          "name": "Respiratory",
          "withinNormalLimitsText": "Clear to auscultation bilaterally with no wheezes, rales, or rhonchi."
        },
        {
          "content": "Recap examination of the abdomen, noting any masses, or tenderness.",
          "name": "Abdomen",
          "withinNormalLimitsText": "Abdomen soft, non-tender, non-distended with normoactive bowel sounds and no masses."
        },
        {
          "content": "Recap examination of musculoskeletal system noting range of motion and any deformities.",
          "name": "Musculoskeletal",
          "withinNormalLimitsText": "Full range of motion in all extremities, no deformities or joint swelling."
        },
        {
          "content": "Recap examination of the neurological system, noting any deficits or abnormal findings.",
          "name": "Neurological",
          "withinNormalLimitsText": "Alert and oriented x3, cranial nerves II-XII intact, motor and sensory functions intact."
        },
        {
          "content": "Recap examination of peripheral and central lymph nodes.",
          "name": "Lymphatic",
          "withinNormalLimitsText": "No cervical, axillary, or inguinal lymphadenopathy."
        },
        {
          "content": "Recap of genitourinary system examination, noting any findings in external genitalia or bladder.",
          "name": "Genitourinary",
          "withinNormalLimitsText": "No suprapubic tenderness; external genitalia normal."
        }
      ],
      "name": "Physical Exam",
      "promptVersion": "exam_list_2.0",
      "required": true,
      "shouldAutomaticallyGenerateWNLText": false,
      "shouldUseWNLTextIfItemNotDiscussed": false,
      "type": "exam_list"
    },
    {
      "content": "Create a bullet point for each diagnosis identified during this visit. Include the diagnosis name followed by its ICD-10 code if applicable. Ensure accurate representation of each condition based on the clinical findings and patient assessment.",
      "id": "b82bb8f0-d8b8-4afe-ea9f-f01d47223cda",
      "items": [
        {
          "content": "Diagnosis Name: {Diagnosis}, ICD-10: {ICD-10 Code}"
        }
      ],
      "name": "Diagnosis",
      "type": "bulleted_list"
    },
    {
      "content": "Create a detailed plan of management for each diagnosis the patient has. For each diagnosis, include any tests to be ordered, follow-ups required, and treatments initiated or considered.",
      "id": "fce99b6b-1a72-9cc5-9cc9-bfe6fed4f355",
      "items": [
        {
          "content": "For each diagnosis, include specifics such as additional tests to be scheduled, frequency of follow-up appointments, and any treatments that have been initiated or are under consideration, including their dosage and duration where applicable. Use structured formatting: {Diagnosis}: - Tests Ordered: {Test Details} - Follow-up: {Follow-up Details} - Treatment: {Treatment Details}."
        }
      ],
      "name": "Plan",
      "type": "bulleted_list"
    }
  ];

  const Step2 = () => (
    <Box>
      <Typography sx={{ color: '#1d4556', fontWeight: '600', fontSize: 24 }}>Verify Template Changes</Typography>
      <Typography sx={{ fontSize: 12, color: "#808080", width: '60%' }}>Based on its analysis, the AI has generated documentation improvements tailored to your template. Please review and approve the suggested edits below.</Typography>
      <Stack flexDirection={"column"} justifyContent={"center"} gap={2} mt={5}>
        {
          sectionList && sectionList.length > 0 &&
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
                {
                  item.is_editing ? (<>
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
                  </>) :
                    item.is_editing_template ? (<>
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
                    </>) :
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
        {
          templatePreview && templatePreview.map((item, idx) => {
            return (
              <Box p={2} key={idx}>
                <Typography sx={{ fontSize: 18, color: "black", fontWeight: 700 }}>{item.name}</Typography>
                <Typography sx={{ fontSize: 16, color: "black" }}>{item.content}</Typography>

                {
                  item.items && item.items.length > 0 && item.items.map((data, index) => (
                    <Stack key={index} flexDirection={"row"} alignItems={"flex-start"}>
                      <CircleIcon sx={{ fontSize: 8, color: 'black', mt: 1 }} />
                      <Typography sx={{ fontSize: 16, color: 'black', pl: 1 }}>{data.content}</Typography>
                    </Stack>
                  ))
                }
              </Box>
            )
          })
        }
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
          {
            (<>
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

                    {
                      templatePreview && templatePreview.map((item, idx) => {
                        return (
                          <Box p={2} key={idx}>
                            <Typography sx={{ fontSize: 18, color: "black", fontWeight: 700 }}>{item.name}</Typography>
                            <Typography sx={{ fontSize: 16, color: "black" }}>{item.content}</Typography>

                            {
                              item.items && item.items.length > 0 && item.items.map((data, index) => (
                                <Stack key={index} flexDirection={"row"} alignItems={"flex-start"}>
                                  <CircleIcon sx={{ fontSize: 8, color: 'black', mt: 1 }} />
                                  <Typography sx={{ fontSize: 16, color: 'black', pl: 1 }}>{data.content}</Typography>
                                </Stack>
                              ))
                            }

                          </Box>
                        )
                      })
                    }
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
        </>
        }
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
