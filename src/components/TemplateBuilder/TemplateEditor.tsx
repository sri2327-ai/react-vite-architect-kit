
import React from 'react';
import DraggableTemplateEditor from './DraggableTemplateEditor';

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
  // Convert to the format expected by DraggableTemplateEditor
  const convertedItems = initialItems.length > 0 ? initialItems : [
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
  ];

  return (
    <DraggableTemplateEditor 
      initialItems={convertedItems}
      onSave={onSave}
    />
  );
};

export default TemplateEditor;
