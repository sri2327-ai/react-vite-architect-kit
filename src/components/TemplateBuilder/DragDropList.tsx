
import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  IconButton,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  ContentCopy as ContentCopyIcon,
  Edit as EditIcon,
  Circle as CircleIcon,
  ChangeCircle as ChangeCircleIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  ListAlt as ListAltIcon,
  ViewHeadline as ViewHeadlineIcon,
  Title as TitleIcon,
  Assignment as AssignmentIcon,
  FormatListBulleted as FormatListBulletedIcon,
  TextSnippet as TextSnippetIcon,
  Checklist as ChecklistIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

interface DragDropListProps {
  onFinalApi?: (data?: any) => void;
}

interface FieldItem {
  id: string;
  name: string;
  type: string;
  content: string;
  items?: Array<{
    content: string;
    name?: string;
  }>;
}

// 🔹 FieldCard - Reorderable Card
function FieldCard({ id, item }: { id: string; item: FieldItem }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id });

  const [openHelpMe, setHelpMe] = useState(false);
  const [selectedHelpMe, setSelectedHelpMe] = useState<any>({});
  const [selectedCustomBlock, setSelectedCustomBlock] = useState<any>({});
  const [selectedFieldObj, setSelectedFieldObj] = useState<any>({});
  const [openDrawer, setOpenDrawer] = useState(false);

  const instructText = (item: FieldItem) => {
    switch (item.type) {
      case 'bulleted_list':
        return "A.I. will create a bulleted list based on the instructions provided";
      case 'section_header':
        return "A.I. will include the following section headers in the note";
      case 'paragraph':
        return "A.I. will write a descriptive block of text following the guidelines below.";
      case 'static_text':
        return "A.I. will insert the exact text below into the note.";
      case 'exam_list':
        return "A.I. will craft an examination list in a structured format, as instructed.";
      default:
        return "";
    }
  };

  const helpmeItems = [
    {
      type: 1,
      title: selectedFieldObj && selectedFieldObj.type === 'paragraph' ? "Change to list" : "Change to Narrative",
      icon: <ChangeCircleIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
    },
    {
      type: 2,
      title: 'Increase Detail',
      icon: <ZoomInIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />
    },
    {
      type: 3,
      title: 'Decrease Detail',
      icon: <ZoomOutIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
    },
    {
      type: 4,
      title: 'Format Specific',
      icon: <ContentCopyIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
    },
    {
      type: 5,
      title: 'Other',
      icon: <ListAltIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
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

  return (
    <>
      <Box
        ref={setNodeRef}
        {...attributes}
        sx={{
          width: "100%",
          mb: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            width: "90%",
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
                  {instructText(item)}
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
                onClick={() => { setOpenDrawer(true); setSelectedFieldObj(item) }}
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
                onClick={() => setHelpMe(true)}
              >
                Help Me
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Help Me Dialog */}
      <Dialog
        open={openHelpMe}
        onClose={() => setHelpMe(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Modify AI-Generated Section</DialogTitle>
        <DialogContent>
          <Stack flexDirection="column" justifyContent="center" gap={1}>
            {helpmeItems.map((item) => (
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
                  border: selectedHelpMe.title === item.title ? "2px solid #408DA9" : "none",
                }}
                onClick={() => setSelectedHelpMe(item)}
              >
                <Box display="flex" alignItems="center" justifyContent="flex-start" flexDirection="row" p={1}>
                  <Box pl={1}>
                    {item.icon}
                  </Box>
                  <Box display="flex" flexDirection="column" ml={1} mb={1}>
                    <Typography sx={{ color: "#343434", fontSize: 18, fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}

            {selectedHelpMe.type && selectedHelpMe.type !== 1 && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: "#343434", fontSize: 14, fontWeight: 600, pt: 1 }}
                >
                  {selectedHelpMe.type === 2 ? "How many paragraphs do you prefer?" :
                    selectedHelpMe.type === 3 ? "Please give an example of how you'd like this to be formatted:" :
                      "What do you want changed?"}
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={2}
                  margin="normal"
                  autoFocus
                />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpMe(false)} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={() => setHelpMe(false)} variant="contained" color="primary">
            Modify
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const DragDropList: React.FC<DragDropListProps> = ({ onFinalApi }) => {
  const templatePreview = [
    {
      "content": "Give the correct information",
      "id": "bc84c72d-0e84-ce58-4e80-ee6914987f83",
      "name": "Give the correct information",
      "type": "static_text"
    },
    {
      "content": "Summarize the primary reason for the patient's visit",
      "id": "0cd520ea-0b4f-0dd4-d56f-998c4ba4d410",
      "name": "Chief Complaint",
      "type": "paragraph",
    },
    {
      "content": "Begin by introducing the patient",
      "id": "8035bdcb-56bd-1e79-17aa-5b954b0accc7",
      "name": "Subjective Note",
      "type": "paragraph"
    },
  ];

  const [fields, setFields] = useState<FieldItem[]>(templatePreview);

  const handleDragEnd = (event: DragEndEvent) => {
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
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
};

export default DragDropList;
