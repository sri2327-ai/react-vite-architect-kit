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
  DialogActions,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio
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
  ArrowBack as ArrowBackIcon,
  SwapVert as SwapVertIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { toast } from 'sonner';

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
    findingsAreWithingNormalLimits?: boolean;
    wasDiscussed?: boolean;
    withinNormalLimitsText?: string;
  }>;
  paste_template?: string;
  itemNotDiscussedBehavior?: string;
  itemWithinNormalLimitsBehavior?: string;
  required?: boolean;
  promptVersion?: string;
}

// 🔹 FieldCard - Reorderable Card
function FieldCard({ id, item, onEdit, onDelete, onCopy, onMove, onHelpMe }: { 
  id: string; 
  item: FieldItem;
  onEdit: (item: FieldItem) => void;
  onDelete: (id: string) => void;
  onCopy: (item: FieldItem) => void;
  onMove: (id: string) => void;
  onHelpMe: (item: FieldItem) => void;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id });

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
      case 'checklist':
        return "A.I. will create an interactive checklist with the specified items.";
      default:
        return "";
    }
  };

  return (
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
            <IconButton color="error" onClick={() => onDelete(item.id)}>
              <DeleteIcon />
            </IconButton>
            <IconButton color="primary" onClick={() => onCopy(item)}>
              <ContentCopyIcon />
            </IconButton>
            <IconButton color="primary" onClick={() => onMove(item.id)}>
              <SwapVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider />

        <Box mt={2} p={1}>
          <Typography sx={{ 
            fontSize: 14, 
            color: '#343434',
            flexWrap: "wrap",
            wordWrap: "break-word",
            overflow: "hidden",
            whiteSpace: "normal",
          }}>
            {item.content}
          </Typography>

          {item.paste_template && item.paste_template !== "" && (
            <>
              <Typography
                variant="h6"
                sx={{ color: "#343434", fontSize: 18, fontWeight: 600, mt: 2 }}
              >
                Template :-
              </Typography>
              <Typography sx={{ 
                fontSize: 14,
                color: "#343434",
                flexWrap: "wrap",
                wordWrap: "break-word",
                overflow: "hidden",
                whiteSpace: 'pre-line'
              }}>
                {item.paste_template}
              </Typography>
            </>
          )}

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
              onClick={() => onEdit(item)}
            >
              {(item.type === "bulleted_list" || item.type === "paragraph" || item.type === "exam_list") 
                ? "Edit Instruction for A.I" 
                : "Edit"}
            </Button>

            {(item.type === "bulleted_list" || item.type === "paragraph" || item.type === "exam_list") && (
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
                onClick={() => onHelpMe(item)}
              >
                Help Me
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
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
  const [openHelpMe, setOpenHelpMe] = useState(false);
  const [selectedHelpMe, setSelectedHelpMe] = useState<any>({});
  const [selectedFieldObj, setSelectedFieldObj] = useState<any>({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editingField, setEditingField] = useState<FieldItem | null>(null);
  const [accordionItems, setAccordionItems] = useState<any[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
      key: "paragraph"
    },
    {
      type: 2,
      title: "Section Header",
      des: "Insert a section header to organize and separate content.",
      icon: <TitleIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
      key: "section_header"
    },
    {
      type: 3,
      title: "Exam List",
      des: "Use this for structured lists of exam observations or findings.",
      icon: <AssignmentIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
      key: "exam_list"
    },
    {
      type: 4,
      title: "Bulleted List",
      des: "A list of bullet points to itemize information clearly.",
      icon: <FormatListBulletedIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
      key: "bulleted_list"
    },
    {
      type: 5,
      title: "Static Text",
      des: "Non-editable text block—ideal for fixed instructions or disclaimers.",
      icon: <TextSnippetIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
      key: "static_text"
    },
    {
      type: 6,
      title: "Checklist",
      des: "Create a checklist with interactive checkboxes for tasks or steps.",
      icon: <ChecklistIcon sx={{ width: 30, height: 30, color: "#1d4556" }} />,
      key: "checklist"
    },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      const newFields = arrayMove(fields, oldIndex, newIndex);
      setFields(newFields);
      onFinalApi?.(newFields);
    }
  };

  const handleEdit = (item: FieldItem) => {
    setEditingField(item);
    setSelectedFieldObj(item);
    if (item.items) {
      setAccordionItems(item.items);
    }
    setOpenDrawer(true);
  };

  const handleDelete = (id: string) => {
    const newFields = fields.filter(field => field.id !== id);
    setFields(newFields);
    onFinalApi?.(newFields);
    toast.success('Section deleted successfully');
  };

  const handleCopy = (item: FieldItem) => {
    const stringToCopy = JSON.stringify(item, null, 2);
    navigator.clipboard.writeText(stringToCopy)
      .then(() => {
        toast.success('Copied to clipboard!');
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const handleMove = (id: string) => {
    // Implement move functionality
    toast.info('Move functionality - select destination');
  };

  const handleHelpMe = (item: FieldItem) => {
    setSelectedFieldObj(item);
    setOpenHelpMe(true);
  };

  const handleSaveEdit = () => {
    if (editingField) {
      const updatedFields = fields.map(field => 
        field.id === editingField.id ? selectedFieldObj : field
      );
      setFields(updatedFields);
      onFinalApi?.(updatedFields);
      setOpenDrawer(false);
      setEditingField(null);
      setSelectedFieldObj({});
      toast.success('Section updated successfully');
    }
  };

  const handleAddAccordionItem = () => {
    const newItem = selectedFieldObj.type === "exam_list" ? {
      content: "",
      findingsAreWithingNormalLimits: false,
      name: `Item ${accordionItems.length + 1}`,
      wasDiscussed: false,
      withinNormalLimitsText: ""
    } : {
      content: "",
      name: `Item ${accordionItems.length + 1}`,
    };
    
    setAccordionItems(prev => [...prev, newItem]);
  };

  const handleEditAccordionItem = (idx: number, key: string, value: any) => {
    setAccordionItems(prev =>
      prev.map((item, index) =>
        index === idx ? { ...item, [key]: value } : item
      )
    );
  };

  const handleDeleteAccordionItem = (indexToRemove: number) => {
    setAccordionItems(prev =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleChange = (index: number) => (_: any, isExpanded: boolean) => {
    setExpandedIndex(isExpanded ? index : null);
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
              <FieldCard 
                key={item.id} 
                id={item.id} 
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCopy={handleCopy}
                onMove={handleMove}
                onHelpMe={handleHelpMe}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      {/* Help Me Dialog */}
      <Dialog
        open={openHelpMe}
        onClose={() => setOpenHelpMe(false)}
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
          <Button onClick={() => setOpenHelpMe(false)} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={() => setOpenHelpMe(false)} variant="contained" color="primary">
            Modify
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Drawer */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{ 
          '& .MuiDrawer-paper': { 
            width: '50%',
            minWidth: 400,
            p: 3
          } 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            Edit Section
          </Typography>
          <IconButton onClick={() => setOpenDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {selectedFieldObj && (
          <Box>
            <TextField
              fullWidth
              label="Section Name"
              value={selectedFieldObj.name || ''}
              onChange={(e) => setSelectedFieldObj(prev => ({ ...prev, name: e.target.value }))}
              margin="normal"
              size="small"
            />

            {(selectedFieldObj.type === 'paragraph' || selectedFieldObj.type === 'static_text' || selectedFieldObj.type === 'bulleted_list') && (
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={4}
                value={selectedFieldObj.content || ''}
                onChange={(e) => setSelectedFieldObj(prev => ({ ...prev, content: e.target.value }))}
                margin="normal"
                size="small"
              />
            )}

            {(selectedFieldObj.type === 'exam_list' || selectedFieldObj.type === 'checklist') && (
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Items</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddAccordionItem}
                    variant="outlined"
                    size="small"
                  >
                    Add Item
                  </Button>
                </Box>

                {accordionItems.map((item, idx) => (
                  <Accordion
                    key={idx}
                    expanded={expandedIndex === idx}
                    onChange={handleChange(idx)}
                    sx={{ mb: 1 }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                        <Typography>{item.name || `Item ${idx + 1}`}</Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAccordionItem(idx);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={2}>
                        <TextField
                          fullWidth
                          label="Name"
                          value={item.name || ''}
                          onChange={(e) => handleEditAccordionItem(idx, 'name', e.target.value)}
                          size="small"
                        />
                        <TextField
                          fullWidth
                          label="Content"
                          multiline
                          rows={3}
                          value={item.content || ''}
                          onChange={(e) => handleEditAccordionItem(idx, 'content', e.target.value)}
                          size="small"
                        />
                        
                        {selectedFieldObj.type === 'exam_list' && (
                          <>
                            <TextField
                              fullWidth
                              label="Within Normal Limits Text"
                              value={item.withinNormalLimitsText || ''}
                              onChange={(e) => handleEditAccordionItem(idx, 'withinNormalLimitsText', e.target.value)}
                              size="small"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={item.findingsAreWithingNormalLimits || false}
                                  onChange={(e) => handleEditAccordionItem(idx, 'findingsAreWithingNormalLimits', e.target.checked)}
                                />
                              }
                              label="Findings are within normal limits"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={item.wasDiscussed || false}
                                  onChange={(e) => handleEditAccordionItem(idx, 'wasDiscussed', e.target.checked)}
                                />
                              }
                              label="Was discussed"
                            />
                          </>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveEdit}
                fullWidth
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenDrawer(false)}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default DragDropList;
