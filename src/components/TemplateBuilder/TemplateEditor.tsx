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

  // Enhanced refs to prevent unwanted navigation during screen resize
  const hasProcessedRef = useRef(false);
  const isNavigatingRef = useRef(false);
  const lastProcessedDataRef = useRef<string>('');
  const processingLockRef = useRef(false);
  const navigationSessionIdRef = useRef<string>('');

  // Handle navigation when a template is created - enhanced to prevent duplicate processing
  useEffect(() => {
    // Enhanced validation to prevent processing during screen resizes
    if (!createdTemplateData || 
        !createdTemplateData.redirectToEditor || 
        hasProcessedRef.current ||
        isNavigatingRef.current ||
        processingLockRef.current) {
      return;
    }

    // Create a unique session identifier for this template creation
    const templateSessionId = `${createdTemplateData.method}-${createdTemplateData.name}-${Date.now()}`;
    
    // Check if we've already processed this exact session
    if (navigationSessionIdRef.current === templateSessionId) {
      return;
    }

    // Create a unique identifier for this template data
    const templateDataString = JSON.stringify({
      method: createdTemplateData.method,
      name: createdTemplateData.name,
      content: createdTemplateData.content,
      redirectToEditor: createdTemplateData.redirectToEditor
    });
    
    // Enhanced duplicate check
    if (lastProcessedDataRef.current === templateDataString) {
      return;
    }

    console.log('Processing template creation for session:', templateSessionId);
    
    // Lock processing immediately to prevent concurrent execution
    processingLockRef.current = true;
    hasProcessedRef.current = true;
    isNavigatingRef.current = true;
    lastProcessedDataRef.current = templateDataString;
    navigationSessionIdRef.current = templateSessionId;
    
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
    
    // Navigate to editor only if navigation function is provided and we haven't navigated yet
    if (onNavigateToEditor && !isNavigatingRef.current) {
      console.log('Navigating to editor for session:', templateSessionId);
      onNavigateToEditor();
    }
    
    // Enhanced cleanup with longer delay to ensure navigation completes
    setTimeout(() => {
      isNavigatingRef.current = false;
      processingLockRef.current = false;
      console.log('Navigation cleanup completed for session:', templateSessionId);
    }, 500);
  }, [createdTemplateData, onNavigateToEditor]);

  // Enhanced reset logic to handle all edge cases
  useEffect(() => {
    if (!createdTemplateData || !createdTemplateData.redirectToEditor) {
      // Reset all flags when template data is cleared
      hasProcessedRef.current = false;
      isNavigatingRef.current = false;
      processingLockRef.current = false;
      lastProcessedDataRef.current = '';
      navigationSessionIdRef.current = '';
      console.log('All navigation flags reset - template data cleared or no redirect needed');
    }
  }, [createdTemplateData]);

  // Additional effect to handle window resize events and prevent unwanted navigation
  useEffect(() => {
    const handleResize = () => {
      // During resize, temporarily lock navigation to prevent unwanted redirects
      if (hasProcessedRef.current) {
        processingLockRef.current = true;
        console.log('Screen resize detected - locking navigation');
        
        // Unlock after resize is complete
        setTimeout(() => {
          processingLockRef.current = false;
          console.log('Screen resize complete - unlocking navigation');
        }, 300);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSave = useCallback((items: TemplateItem[]) => {
    setCurrentItems(items);
    if (onSave) {
      onSave(items);
    }
    console.log('Template saved:', items);
  }, [onSave]);

  const handleAddSectionToTemplate = useCallback((sectionWithPosition: any) => {
    console.log('TemplateEditor: handleAddSectionToTemplate called with:', sectionWithPosition);
    
    // If it's a function, store it for later use
    if (typeof sectionWithPosition === 'function') {
      return;
    }

    // Handle different input formats
    let position: number;
    let section: any;

    if (typeof sectionWithPosition === 'number') {
      // If only position is provided, this is likely from the placement dialog
      position = sectionWithPosition;
      section = {
        id: Date.now().toString(),
        name: 'New Section',
        type: 'paragraph',
        content: 'AI will generate content based on the instructions below.',
        description: 'A.I. will write content following the guidelines below.'
      };
      console.log('TemplateEditor: Position-only placement detected, creating default section');
    } else {
      // Extract position and section data
      const { position: pos, ...sectionData } = sectionWithPosition;
      position = pos;
      section = sectionData;
    }
    
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
      console.log('TemplateEditor: Section inserted at position', position);
    } else {
      updatedItems.push(newItem);
      console.log('TemplateEditor: Section added at end');
    }
    
    setCurrentItems(updatedItems);
    
    if (onSave) {
      onSave(updatedItems);
    }

    console.log('TemplateEditor: Section added to template at position', position, ':', newItem);
    console.log('TemplateEditor: Updated items list:', updatedItems);
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
