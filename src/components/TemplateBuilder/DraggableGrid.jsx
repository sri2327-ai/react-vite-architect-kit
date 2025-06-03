
import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  IconButton,
  Stack,
  Button,
  TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import CircleIcon from '@mui/icons-material/Circle';
import CustomDialog from "../../reuseable-components/DialogCustom/DialogCustom";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CustomDrawer from "../../reuseable-components/CustomDrawer";
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import TitleIcon from '@mui/icons-material/Title';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { ArrowBack } from "@mui/icons-material";
import { useAddsectionClick } from "../../store";

// 🔹 FieldCard - Reorderable Card
function FieldCard({ id, item }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id });

  const instruct_text = (item) => {
    return (
        item.type == 'bulleted_list' 
        ?
        "A.I. will create a bulleted list based on the instructions provided" 
        :
        item.type == 'section_header'
        ?
        "A.I. will include the following section headers in the note"
        :
        item.type == 'paragraph'
        ?
        "A.I. will write a descriptive block of text following the guidelines below."
        :
        item.type == 'static_text' 
        ?
        "A.I. will insert the exact text below into the note."
        :
        item.type == 'exam_list' 
        ?
        "A.I. will craft an examination list in a structured format, as instructed."
        :
        ""
    )
  }
   const [openHelpMe, setHelpMe] = useState(false);
   const [selectedHelpMe, setselectedHelpMe] = useState({});
   const [selectedCustomBlock, setSelectedCustomBlock] = useState({});
   const [selectedfieldObj, setSelectedfieldObj] = useState({})
   const [selectedFeildObj, setselectedFeildObj] = useState({});
   const [openDrawer, setOpenDrawer] = useState(false);
   const { addsectiontemp, setaddsection } = useAddsectionClick();
   
   useEffect(() => {
   if(addsectiontemp){
    setOpenDrawer(true)
   }
}, [addsectiontemp]);

   const helpmeItems = [
       {
         type: 1,
         title: selectedFeildObj && selectedFeildObj.type == 'paragraph' ? "Change to list" : "Change to Narrative",
         icon:  <ChangeCircleIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
       },
       {
           type: 2,
           title: 'Increase Detail',
           icon:    <ZoomInIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />
       },
       {
           type: 2,
           title: 'Decrease Detail',
           icon:  <ZoomOutIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
       },
       {
           type: 3,
           title: 'Format Specific',
           icon:  <ContentCopyIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
       },
       {
           type: 4,
           title: 'Other',
           icon:  <ListAltIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
         },
       
     ];

     const customBlocks = [
        {
          type: 1,
          title: "Paragraph",
          des: "Add a paragraph for general note-taking or documentation.",
          icon: <ViewHeadlineIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
        },
        {
          type: 2,
          title: "Section Header",
          des: "Insert a section header to organize and separate content.",
          icon: <TitleIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
        },
        {
          type: 3,
          title: "Exam List",
          des: "Use this for structured lists of exam observations or findings.",
          icon: <AssignmentIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
        },
        {
          type: 4,
          title: "Bulleted List",
          des: "A list of bullet points to itemize information clearly.",
          icon: <FormatListBulletedIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
        },
        {
          type: 5,
          title: "Static Text",
          des: "Non-editable text block—ideal for fixed instructions or disclaimers.",
          icon: <TextSnippetIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
        },
        {
          type: 6,
          title: "Checklist",
          des: "Create a checklist with interactive checkboxes for tasks or steps.",
          icon: <ChecklistIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
        },
      ];

      const onclickAddsectionCustomBlock = (item) => {
         if(item.type == 1){
          setselectedFeildObj({
            "content": "",
            "id": "8035bdcb-56bd-1e79-17aa-5b954b0accc7",
            "name": "",
            "type": "paragraph"
        })
         }
      }

  return (
    <>
   <Box sx={{ mb: 2, width: "100%" }} ref={setNodeRef} {...attributes}>
  <Box
    sx={{
      bgcolor: "white",
      borderRadius: 2,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      width: "100%",
      userSelect: "none",
      transform: CSS.Transform.toString(transform),
      transition,
      p: 2,
    }}
  >
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton {...listeners} sx={{ cursor: "grab" }}>
          <DragIndicatorIcon />
        </IconButton>
        <Box>
          <Typography
            variant="h6"
            sx={{ color: "#343434", fontSize: 18, fontWeight: 600 }}
          >
            {item.name} - {item.type}
          </Typography>
          <Typography sx={{ color: "#808080", fontSize: 14 }}>
            {instruct_text(item)}
          </Typography>
        </Box>
      </Stack>

      <Box>
        <IconButton color="error">
          <DeleteIcon />
        </IconButton>
        <IconButton color="primary">
          <ContentCopyIcon />
        </IconButton>
      </Box>
    </Box>

    <Divider />

    <Box mt={2} p={1}>
      <Typography sx={{ fontSize: 14, color: '#343434' }}>
        {item.content}
      </Typography>

      {item.items && item.type !== "bulleted_list" && item.items.length > 0 &&
        item.items.map((data, index) => (
          <Stack key={index} direction="row" alignItems="flex-start">
            <CircleIcon sx={{ fontSize: 8, color: '#343434', mt: 0.7 }} />
            <Typography sx={{ fontSize: 14, color: '#343434', pl: 1 }}>
              {data.name}: {data.content}
            </Typography>
          </Stack>
        ))}

      <Box mt={1} display="flex" gap={2}>
        <Button
          variant="contained"
          sx={{
            borderRadius: "5px",
            padding: "5px 10px",
            color: "#F4FCFF",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
          startIcon={<EditIcon />}
          color="primary"
          onClick={() => {setOpenDrawer(true); setselectedFeildObj(item)}}
        >
          Edit Instruction for A.I
        </Button>

        <Button
          variant="contained"
          sx={{
            borderRadius: "5px",
            padding: "5px 10px",
            color: "#F4FCFF",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
          color="primary"
          onClick={() => {
            setHelpMe(true);
          }}
        >
          Help Me
        </Button>
      </Box>
    </Box>
  </Box>
</Box>

       <CustomDialog
                            isOpen={openHelpMe}
                            onClose={() => { setHelpMe(false);  }}
                            title={'Modify AI-Generated Section'}
                            actions={
                               
                            <>
                          <Button onClick={() => {setHelpMe(false) }} variant="contained"  color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={() => {setHelpMe(false) }} type="submit" variant="contained" color="primary" >
                                   Modify
                                </Button>
                             
                                
                            </>}
                        >
                        <Stack flexDirection={"column"} justifyContent={"center"} gap={1}>
                        {
                          
                            helpmeItems &&
                            helpmeItems.map((item) => (
                                <Card
                                key={item.type}
                                elevation={5}
                                sx={{
                                    bgcolor: "white",
                                    borderRadius: 2,
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                        transform: "scale(1.02)",
                                        boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
                                    },
                                    border: selectedHelpMe.title == item.title && "2px solid #408DA9",
                                }}
                                onClick={() => { setselectedHelpMe(item);  }}
                            >
                                        <Box display="flex" alignItems={"center"}  justifyContent={"flex-start"} flexDirection={"row"} p={1}>
                                            <Box pl={1}>
                                            {item.icon}
                                            </Box>
                                            <Box display="flex"   flexDirection={"column"} ml={1} mb={1}>
                                            <Typography sx={{ color: "#343434", fontSize: 18, fontWeight: 600 }}>{item.title}</Typography>
                                            <Typography sx={{ color: "#808080", fontSize: 14, fontWeight: 400 }}>{item.Description}</Typography>
                                            </Box>
                                        </Box>
                            </Card>
                            ))
                        }
                           
                         {
                           selectedHelpMe.type &&  selectedHelpMe.type != 1 &&
                            <Box>
                                <Typography
            variant="h6"
            sx={{ color: "#343434", fontSize: 14, fontWeight: 600, pt:1 }}
          > {selectedHelpMe.type == 2 ? "How many paragraphs do you prefer?" :  selectedHelpMe.type == 3 ? "Please give an example of how you'd like this to be formatted:" : "What do you want changed?" }   </Typography>
                          
                               <TextField fullWidth  variant="outlined" multiline rows={2} margin="normal" autoFocus  
                           onChange={(event) => {
                             }} />
                             </Box>
                         } 
                          
                        </Stack>
                        </CustomDialog>
                        <CustomDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        actionButton={ selectedFeildObj.type ? true : false}
        actions={
          <>
          <Button onClick={() => { setselectedFeildObj({}) }} variant="contained" sx={{
              borderRadius: "5px", padding: "5px 10px",
              color: "#F4FCFF",
              fontSize: "0.9rem",
              fontWeight: 600,
            }} startIcon={(<><ArrowBack/></>)}  color="primary" >
              Back
            </Button>
            <Button onClick={() => { }} variant="contained" sx={{
              borderRadius: "5px", padding: "5px 10px",
              color: "#F4FCFF",
              fontSize: "0.9rem",
              fontWeight: 600,
            }} color="primary">
              Update
            </Button>
          </>
        }
        title="Add section"
      >
          <Box p={4}>
        {
          selectedFeildObj.type == "paragraph"  ?
          (
            <>
      <Box p={2}>
                                <Typography
            variant="h6"
            sx={{ color: "#343434", fontSize: 16, fontWeight: 600, pt:1 }}
          > Title</Typography>
                          
                               <TextField fullWidth  variant="outlined" margin="normal"    value={selectedFeildObj.name} 
                           onChange={(event) => {
                             setselectedFeildObj(prev => ({
                              ...prev,
                              name: event.target.value
                            }));
                             }} />
                             </Box>
                             <Box p={2}>
                                <Typography
            variant="h6"
            sx={{ color: "#343434", fontSize: 16, fontWeight: 600, pt:1 }}
          > What do you want the A.I. to generate in this section?</Typography>
                          
                               <TextField fullWidth  variant="outlined" multiline rows={6} margin="normal"  value={selectedFeildObj.content} 
                           onChange={(event) => {
                             setselectedFeildObj(prev => ({
                              ...prev,
                              content: event.target.value
                            }));
                             }} />
                             </Box>
            </>
          ) : 
        <Stack flexDirection={"column"} justifyContent={"center"} gap={1} >
          <Stack flexDirection={"row"} sx={{ border: '1px dashed #408DA9', p: 2, borderRadius: 10 }}>
            <Typography sx={{ color: "#343434", fontSize: 18, fontWeight: 600 }}>Can't find the section you need?</Typography>
            <Typography sx={{ color: "#808080", fontSize: 18, fontWeight: 400, cursor: "pointer", color: "primary.main", pl: 1 }} onClick={() => console.log("Clicked!")}>Click here to Create your own!</Typography>
          </Stack>
          <Typography sx={{ color: "#343434", fontSize: 18, fontWeight: 600 }}>Custom Block</Typography>
          {
            customBlocks &&
            customBlocks.map((item) => (
              <Card
                key={item.type}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  "&:hover": {
                    border: "2px solid #408DA9",
                  },

                }}
                onClick={() => { setSelectedCustomBlock(item); onclickAddsectionCustomBlock(item) }}
              >
                <Box display="flex" alignItems={"center"} justifyContent={"flex-start"} flexDirection={"row"} p={1}>
                  <Box pl={1}>
                    {item.icon}
                  </Box>
                  <Box display="flex" flexDirection={"column"} ml={1} mb={1}>
                    <Typography sx={{ color: "#343434", fontSize: 18, fontWeight: 600 }}>{item.title}</Typography>
                    <Typography sx={{ color: "#808080", fontSize: 14, fontWeight: 400 }}>{item.des}</Typography>
                  </Box>
                </Box>
              </Card>
            ))
          }
        </Stack>
        }
         </Box>
      </CustomDrawer>
    </>
  );
}

export default function FieldsList() {
    const templatePreview = [
        {
            "content": "Give the correct information",
            "id": "bc84c72d-0e84-ce58-4e80-ee6914987f83",
            "name": "Give the correct information",
            "type": "static_text"
        },
        {
            "id": "d82c1f2a-57df-6cd6-79ef-24eb4059933c",
            "itemNotDiscussedBehavior": "default_to_wnl",
            "itemWithinNormalLimitsBehavior": "use_specified_wnl_text",
            "items": [
                {
                    "content": "Document any past treat ment",
                    "findingsAreWithingNormalLimits": false,
                    "name": "past diganosis",
                    "wasDiscussed": false,
                    "withinNormalLimitsText": "no significant  history"
                }
            ],
            "name": "new test",
            "promptVersion": "exam_list_2.0",
            "required": true,
            "type": "exam_list"
        },
        {
            "content": "Summarize the primary reason for the patient's visit, including a detailed description of the patient's main concern or issue.",
            "defaultText": "",
            "emrMapping": {},
            "id": "0cd520ea-0b4f-0dd4-d56f-998c4ba4d410",
            "itemNotDiscussedBehavior": "default_to_wnl",
            "itemWithinNormalLimitsBehavior": "use_specified_wnl_text",
            "items": [],
            "name": "Chief Complaint",
            "promptVersion": "exam_list_2.0",
            "type": "paragraph",
            "useDefaultText": false
        }
    ]
  const [fields, setFields] = useState(templatePreview);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      setFields(arrayMove(fields, oldIndex, newIndex));
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
        <SortableContext items={fields} strategy={rectSortingStrategy}>
          <Box sx={{
            maxHeight: "65vh",
            overflowY: "auto",
            overflowX: "hidden", 
            width: "100%",
            paddingRight: 1,
          }}>
            {fields.map((item) => (
              <FieldCard key={item.id} id={item.id} item={item} />
            ))}
          </Box>
        </SortableContext>
      </DndContext>
    </Box>
  );
}
