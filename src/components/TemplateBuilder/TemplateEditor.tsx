
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  // Add additional fields for different section types
  examItems?: Array<{
    id: string;
    title: string;
    instructions: string;
    normalText: string;
  }>;
  checklistItems?: Array<{
    id: string;
    buttonName: string;
    text: string;
  }>;
  notDiscussedBehavior?: string;
  normalLimitsBehavior?: string;
  hideEmptyItems?: boolean;
  instructions?: string;
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

  // Track if we've already processed this template creation session
  const hasProcessedRef = useRef(false);
  const isNavigatingRef = useRef(false);

  // Handle navigation when a template is created - only process once per template creation session
  useEffect(() => {
    // Only process if we have valid template data that should redirect AND we haven't processed it yet
    if (!createdTemplateData || 
        !createdTemplateData.redirectToEditor || 
        hasProcessedRef.current ||
        isNavigatingRef.current) {
      return;
    }

    console.log('Processing template creation for the first time:', createdTemplateData);
    
    // Mark as processed immediately to prevent re-processing
    hasProcessedRef.current = true;
    isNavigatingRef.current = true;
    
    // Convert created template data to template items based on method
    const newItems: TemplateItem[] = [];
    
    // Method 1: Smart Copy from Previous - Parse existing notes
    if (createdTemplateData.method === 'Smart Copy from Previous' && createdTemplateData.content) {
      const sections = createdTemplateData.content.split('\n\n').filter(section => section.trim());
      sections.forEach((section, index) => {
        const lines = section.split('\n');
        const name = lines[0].replace(':', '').trim() || `Section ${index + 1}`;
        const content = lines.slice(1).join('\n').trim() || 'AI will generate content based on the instructions below.';
        
        newItems.push({
          id: `${Date.now()}-${index}`,
          name: name,
          type: 'paragraph',
          content: content,
          description: 'A.I. will write content following the guidelines below.'
        });
      });
    }
    // Method 2: AI-Assisted Creation - Use generated content
    else if (createdTemplateData.method === 'AI-Assisted Creation' && createdTemplateData.content) {
      const sections = createdTemplateData.content.split('\n\n').filter(section => section.trim());
      sections.forEach((section, index) => {
        const lines = section.split('\n');
        const name = lines[0].replace(':', '').trim() || `AI Section ${index + 1}`;
        const content = lines.slice(1).join('\n').trim() || 'AI will generate content based on your specifications.';
        
        newItems.push({
          id: `${Date.now()}-${index}`,
          name: name,
          type: 'paragraph',
          content: content,
          description: 'A.I. will write content following the guidelines below.'
        });
      });
    }
    // Method 3: Custom Template Builder - Start with basic structure
    else if (createdTemplateData.method === 'Custom Template Builder') {
      newItems.push({
        id: Date.now().toString(),
        name: 'Chief Complaint',
        type: 'paragraph',
        content: 'Document the primary reason for the patient visit',
        description: 'A.I. will write a descriptive block of text following the guidelines below.'
      });
    }
    // Method 4: Import Existing Template - Parse imported content
    else if (createdTemplateData.method === 'Import Existing Template' && createdTemplateData.content) {
      const sections = createdTemplateData.content.split('\n\n').filter(section => section.trim());
      sections.forEach((section, index) => {
        const lines = section.split('\n');
        const name = lines[0].replace(':', '').trim() || `Imported Section ${index + 1}`;
        const content = lines.slice(1).join('\n').trim() || 'Content from imported template.';
        
        newItems.push({
          id: `${Date.now()}-${index}`,
          name: name,
          type: 'paragraph',
          content: content,
          description: 'A.I. will write content following the guidelines below.'
        });
      });
    }
    // Method 5: Browse Template Library - Use library template structure
    else if (createdTemplateData.method === 'Browse Template Library') {
      if (createdTemplateData.templateType === 'SOAP') {
        newItems.push(
          {
            id: `${Date.now()}-1`,
            name: 'Subjective',
            type: 'paragraph',
            content: 'Patient-reported symptoms and history',
            description: 'A.I. will write content following the guidelines below.'
          },
          {
            id: `${Date.now()}-2`,
            name: 'Objective',
            type: 'paragraph',
            content: 'Physical examination findings and vital signs',
            description: 'A.I. will write content following the guidelines below.'
          },
          {
            id: `${Date.now()}-3`,
            name: 'Assessment',
            type: 'paragraph',
            content: 'Clinical impression and diagnosis',
            description: 'A.I. will write content following the guidelines below.'
          },
          {
            id: `${Date.now()}-4`,
            name: 'Plan',
            type: 'bulleted_list',
            content: 'Treatment plan and follow-up instructions',
            description: 'A.I. will create a bulleted list based on the instructions provided',
            items: [
              { content: 'Diagnostic tests ordered' },
              { content: 'Medications prescribed' },
              { content: 'Follow-up appointments' }
            ]
          }
        );
      } else if (createdTemplateData.templateType === 'DPD') {
        newItems.push(
          {
            id: `${Date.now()}-1`,
            name: 'Data',
            type: 'paragraph',
            content: 'Objective clinical data and findings',
            description: 'A.I. will write content following the guidelines below.'
          },
          {
            id: `${Date.now()}-2`,
            name: 'Problem',
            type: 'paragraph',
            content: 'Identified clinical problems',
            description: 'A.I. will write content following the guidelines below.'
          },
          {
            id: `${Date.now()}-3`,
            name: 'Decision',
            type: 'bulleted_list',
            content: 'Clinical decisions and actions taken',
            description: 'A.I. will create a bulleted list based on the instructions provided',
            items: [
              { content: 'Treatment decisions' },
              { content: 'Referrals made' },
              { content: 'Monitoring plan' }
            ]
          }
        );
      }
    }
    
    // If no sections were created, provide a default starting point
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
    
    // Navigate to editor only if navigation function is provided
    if (onNavigateToEditor) {
      console.log('Navigating to editor once');
      onNavigateToEditor();
    }
    
    // Clear the navigation flag after a short delay to allow navigation to complete
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);
  }, [createdTemplateData, onNavigateToEditor]);

  // Reset processing flag when createdTemplateData becomes null/undefined or loses redirect flag
  useEffect(() => {
    if (!createdTemplateData || !createdTemplateData.redirectToEditor) {
      hasProcessedRef.current = false;
      isNavigatingRef.current = false;
      console.log('Reset processing flags - template data cleared or no redirect needed');
    }
  }, [createdTemplateData]);

  const handleSave = useCallback((items: TemplateItem[]) => {
    setCurrentItems(items);
    if (onSave) {
      onSave(items);
    }
    console.log('Template saved:', items);
  }, [onSave]);

  const handleAddSectionToTemplate = useCallback((sectionWithPosition: any) => {
    // If it's a function, store it for later use
    if (typeof sectionWithPosition === 'function') {
      return;
    }

    // Extract position and section data
    const { position, ...section } = sectionWithPosition;
    
    const newItem: TemplateItem = {
      id: section.id || Date.now().toString(),
      name: section.name || section.label || 'New Section',
      type: section.type || 'paragraph',
      content: section.content || section.description || 'AI will generate content based on the instructions below.',
      description: section.description || 'A.I. will write content following the guidelines below.',
      // Include additional configuration data
      ...(section.examItems && { examItems: section.examItems }),
      ...(section.checklistItems && { checklistItems: section.checklistItems }),
      ...(section.notDiscussedBehavior && { notDiscussedBehavior: section.notDiscussedBehavior }),
      ...(section.normalLimitsBehavior && { normalLimitsBehavior: section.normalLimitsBehavior }),
      ...(section.hideEmptyItems !== undefined && { hideEmptyItems: section.hideEmptyItems }),
      ...(section.instructions && { instructions: section.instructions })
    };
    
    // Insert at the specified position
    const updatedItems = [...currentItems];
    if (position !== undefined && position >= 0 && position <= updatedItems.length) {
      updatedItems.splice(position, 0, newItem);
    } else {
      updatedItems.push(newItem);
    }
    
    setCurrentItems(updatedItems);
    
    if (onSave) {
      onSave(updatedItems);
    }

    console.log('Section added to template at position', position, ':', newItem);
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
