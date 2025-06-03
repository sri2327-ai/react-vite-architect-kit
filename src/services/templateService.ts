
import { Template, TemplateSection, TemplateField } from '../components/TemplateBuilder/types';

export interface TemplateTypeMapping {
  templateType: string;
  ehrFields: string[];
  workflowSteps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'trigger' | 'action' | 'condition';
  templateFieldId?: string;
  ehrFieldMapping?: string;
  isEditable: boolean;
}

class TemplateService {
  private templates: Template[] = [];

  // Get all available template types for workflow mapping
  getTemplateTypes(): string[] {
    return [...new Set(this.templates.map(t => t.name))];
  }

  // Get template by type/name
  getTemplateByType(templateType: string): Template | null {
    return this.templates.find(t => t.name === templateType) || null;
  }

  // Get EHR field mappings for a template
  getEhrFieldMappings(templateType: string): TemplateTypeMapping | null {
    const template = this.getTemplateByType(templateType);
    if (!template) return null;

    const ehrFields = this.extractEhrFields(template);
    const workflowSteps = this.generateWorkflowSteps(template);

    return {
      templateType,
      ehrFields,
      workflowSteps
    };
  }

  // Register templates from Template Builder
  registerTemplates(templates: Template[]): void {
    this.templates = templates;
  }

  private extractEhrFields(template: Template): string[] {
    const fields: string[] = [];
    
    template.sections.forEach(section => {
      section.fields?.forEach(field => {
        // Map field types to common EHR fields
        switch (field.type) {
          case 'TEXT':
            if (field.label.toLowerCase().includes('complaint')) {
              fields.push('Chief Complaint');
            } else if (field.label.toLowerCase().includes('history')) {
              fields.push('History of Present Illness');
            }
            break;
          case 'TEXTAREA':
            if (field.label.toLowerCase().includes('exam')) {
              fields.push('Physical Examination');
            } else if (field.label.toLowerCase().includes('assessment')) {
              fields.push('Assessment');
            } else if (field.label.toLowerCase().includes('plan')) {
              fields.push('Plan');
            }
            break;
          default:
            fields.push(field.label);
        }
      });
    });

    return [...new Set(fields)];
  }

  private generateWorkflowSteps(template: Template): WorkflowStep[] {
    const steps: WorkflowStep[] = [];

    // Add navigation steps
    steps.push({
      id: 'access-ehr',
      name: 'Access EHR System',
      type: 'trigger',
      isEditable: false
    });

    steps.push({
      id: 'open-patient',
      name: 'Open Patient Record',
      type: 'action',
      isEditable: false
    });

    // Generate steps from template sections
    template.sections.forEach(section => {
      steps.push({
        id: `section-${section.id}`,
        name: section.title,
        type: 'action',
        isEditable: true
      });

      section.fields?.forEach(field => {
        steps.push({
          id: `field-${field.id}`,
          name: `Enter ${field.label}`,
          type: 'action',
          templateFieldId: field.id,
          isEditable: true
        });
      });
    });

    steps.push({
      id: 'save-record',
      name: 'Save Patient Record',
      type: 'action',
      isEditable: false
    });

    return steps;
  }
}

export const templateService = new TemplateService();
