
import React, { useState, useCallback, useEffect } from 'react';
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
  onAddSection?: (section: any) => void;
  onNavigateToEditor?: () => void;
  createdTemplateData?: any;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  initialItems = [], 
  onSave,
  onAddSection,
  onNavigateToEditor,
  createdTemplateData
}) => {
  const [currentItems, setCurrentItems] = useState<TemplateItem[]>(
    initialItems.length > 0 ? initialItems : [
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
    ]
  );

  // Handle navigation when a template is created
  useEffect(() => {
    if (createdTemplateData && createdTemplateData.redirectToEditor) {
      // Convert created template data to template items
      const newItems: TemplateItem[] = [];
      
      if (createdTemplateData.content) {
        // Parse content and create template items
        const sections = createdTemplateData.content.split('\n\n').filter(section => section.trim());
        sections.forEach((section, index) => {
          const lines = section.split('\n');
          const name = lines[0].replace(':', '').trim();
          const content = lines.slice(1).join('\n').trim() || 'AI will generate content based on the instructions below.';
          
          newItems.push({
            id: `${Date.now()}-${index}`,
            name: name || `Section ${index + 1}`,
            type: 'paragraph',
            content: content,
            description: 'A.I. will write content following the guidelines below.'
          });
        });
      }
      
      // If no sections were parsed, create a default structure
      if (newItems.length === 0) {
        newItems.push({
          id: Date.now().toString(),
          name: createdTemplateData.name || 'New Template Section',
          type: 'paragraph',
          content: 'AI will generate content based on the instructions below.',
          description: 'A.I. will write content following the guidelines below.'
        });
      }
      
      setCurrentItems(newItems);
      
      // Navigate to editor if callback provided
      if (onNavigateToEditor) {
        onNavigateToEditor();
      }
    }
  }, [createdTemplateData, onNavigateToEditor]);

  const handleSave = useCallback((items: TemplateItem[]) => {
    setCurrentItems(items);
    if (onSave) {
      onSave(items);
    }
    console.log('Template saved:', items);
  }, [onSave]);

  const handleAddSectionToTemplate = useCallback((section: any) => {
    const newItem: TemplateItem = {
      id: Date.now().toString(),
      name: section.name || section.label || 'New Section',
      type: section.type || 'paragraph',
      content: section.content || section.description || 'AI will generate content based on the instructions below.',
      description: 'A.I. will write content following the guidelines below.'
    };
    
    const updatedItems = [...currentItems, newItem];
    setCurrentItems(updatedItems);
    
    if (onSave) {
      onSave(updatedItems);
    }

    console.log('Section added to template:', newItem);
  }, [currentItems, onSave]);

  // Expose the addSection function to parent components
  React.useEffect(() => {
    if (onAddSection) {
      onAddSection(handleAddSectionToTemplate);
    }
  }, [onAddSection, handleAddSectionToTemplate]);

  return (
    <DraggableTemplateEditor 
      initialItems={currentItems}
      onSave={handleSave}
    />
  );
};

export default TemplateEditor;
