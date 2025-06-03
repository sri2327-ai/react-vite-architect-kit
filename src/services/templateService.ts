
export interface WorkflowStep {
  id: string;
  name: string;
  type: 'trigger' | 'action' | 'condition';
  isEditable: boolean;
  templateFieldId?: string;
}

export interface TemplateTypeMapping {
  templateType: string;
  ehrFields: string[];
  workflowSteps: WorkflowStep[];
}

export interface LibraryTemplate {
  title: string;
  sections: Array<{ name: string; type?: string; description?: string }>;
  specialty?: string;
  noteType?: string;
}

class TemplateService {
  private libraryTemplates: LibraryTemplate[] = [];
  private templateMappings: { [key: string]: TemplateTypeMapping } = {};

  constructor() {
    // Initialize with default template mappings
    this.initializeDefaultMappings();
  }

  private initializeDefaultMappings() {
    // Default SOAP Note mapping
    this.templateMappings['SOAP Note'] = {
      templateType: 'SOAP Note',
      ehrFields: ['Chief Complaint', 'History of Present Illness', 'Physical Examination', 'Assessment', 'Plan'],
      workflowSteps: [
        { id: 'step-1', name: 'Chief Complaint', type: 'trigger', isEditable: true, templateFieldId: 'chief_complaint' },
        { id: 'step-2', name: 'History Assessment', type: 'action', isEditable: true, templateFieldId: 'history' },
        { id: 'step-3', name: 'Physical Exam', type: 'action', isEditable: true, templateFieldId: 'examination' },
        { id: 'step-4', name: 'Clinical Assessment', type: 'action', isEditable: true, templateFieldId: 'assessment' },
        { id: 'step-5', name: 'Treatment Plan', type: 'action', isEditable: true, templateFieldId: 'plan' }
      ]
    };

    // Progress Note mapping
    this.templateMappings['Progress Note'] = {
      templateType: 'Progress Note',
      ehrFields: ['Subjective', 'Objective', 'Assessment', 'Plan', 'Follow-up'],
      workflowSteps: [
        { id: 'step-1', name: 'Subjective Assessment', type: 'trigger', isEditable: true, templateFieldId: 'subjective' },
        { id: 'step-2', name: 'Objective Findings', type: 'action', isEditable: true, templateFieldId: 'objective' },
        { id: 'step-3', name: 'Clinical Assessment', type: 'action', isEditable: true, templateFieldId: 'assessment' },
        { id: 'step-4', name: 'Treatment Plan', type: 'action', isEditable: true, templateFieldId: 'plan' }
      ]
    };

    // Consultation Note mapping
    this.templateMappings['Consultation Note'] = {
      templateType: 'Consultation Note',
      ehrFields: ['Reason for Consultation', 'History', 'Examination', 'Impression', 'Recommendations'],
      workflowSteps: [
        { id: 'step-1', name: 'Consultation Request', type: 'trigger', isEditable: true, templateFieldId: 'reason' },
        { id: 'step-2', name: 'History Review', type: 'action', isEditable: true, templateFieldId: 'history' },
        { id: 'step-3', name: 'Specialist Examination', type: 'action', isEditable: true, templateFieldId: 'examination' },
        { id: 'step-4', name: 'Clinical Impression', type: 'action', isEditable: true, templateFieldId: 'impression' },
        { id: 'step-5', name: 'Recommendations', type: 'action', isEditable: true, templateFieldId: 'recommendations' }
      ]
    };
  }

  registerLibraryTemplates(templates: LibraryTemplate[]) {
    this.libraryTemplates = templates;
    
    // Create mappings for each template
    templates.forEach(template => {
      if (!this.templateMappings[template.title]) {
        this.templateMappings[template.title] = {
          templateType: template.title,
          ehrFields: template.sections?.map((s: any) => s.name) || [],
          workflowSteps: template.sections?.map((section: any, index: number) => ({
            id: `step-${index + 1}`,
            name: section.name,
            type: index === 0 ? 'trigger' : 'action',
            isEditable: true,
            templateFieldId: section.name.toLowerCase().replace(/\s+/g, '_')
          })) || []
        };
      }
    });
  }

  getTemplateTypes(): string[] {
    return Object.keys(this.templateMappings);
  }

  getLibraryTemplates(): LibraryTemplate[] {
    return this.libraryTemplates;
  }

  getEhrFieldMappings(templateType: string): TemplateTypeMapping | null {
    return this.templateMappings[templateType] || null;
  }

  getAllWorkflowSteps(): WorkflowStep[] {
    const allSteps: WorkflowStep[] = [];
    Object.values(this.templateMappings).forEach(mapping => {
      allSteps.push(...mapping.workflowSteps);
    });
    return allSteps;
  }

  getWorkflowStepsByTemplateType(templateType: string): WorkflowStep[] {
    const mapping = this.getEhrFieldMappings(templateType);
    return mapping?.workflowSteps || [];
  }

  addCustomTemplateMapping(templateType: string, ehrFields: string[], workflowSteps?: WorkflowStep[]) {
    const defaultWorkflowSteps = ehrFields.map((field, index) => ({
      id: `step-${index + 1}`,
      name: field,
      type: index === 0 ? 'trigger' as const : 'action' as const,
      isEditable: true,
      templateFieldId: field.toLowerCase().replace(/\s+/g, '_')
    }));

    this.templateMappings[templateType] = {
      templateType,
      ehrFields,
      workflowSteps: workflowSteps || defaultWorkflowSteps
    };
  }

  updateWorkflowStep(templateType: string, stepId: string, updates: Partial<WorkflowStep>) {
    const mapping = this.templateMappings[templateType];
    if (mapping) {
      const stepIndex = mapping.workflowSteps.findIndex(step => step.id === stepId);
      if (stepIndex !== -1) {
        mapping.workflowSteps[stepIndex] = { ...mapping.workflowSteps[stepIndex], ...updates };
      }
    }
  }

  generateTemplateContent(templateType: string, customFields?: { [key: string]: string }): string {
    const mapping = this.getEhrFieldMappings(templateType);
    if (!mapping) return '';

    return mapping.ehrFields.map(field => {
      const customValue = customFields?.[field.toLowerCase().replace(/\s+/g, '_')];
      return `${field}:\n${customValue || '[To be filled]'}\n`;
    }).join('\n');
  }

  validateTemplateStructure(templateContent: string, templateType: string): { isValid: boolean; missingFields: string[] } {
    const mapping = this.getEhrFieldMappings(templateType);
    if (!mapping) return { isValid: false, missingFields: [] };

    const missingFields = mapping.ehrFields.filter(field => 
      !templateContent.toLowerCase().includes(field.toLowerCase())
    );

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }
}

export const templateService = new TemplateService();
