
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

export interface LibraryTemplate {
  id: number;
  title: string;
  specality: string;
  type: string;
  sections: any[];
  description?: string;
}

class TemplateService {
  private templates: Template[] = [];
  private libraryTemplates: LibraryTemplate[] = [];

  // Register templates from Template Builder
  registerTemplates(templates: Template[]): void {
    this.templates = templates;
  }

  // Register templates from Template Library
  registerLibraryTemplates(libraryTemplates: LibraryTemplate[]): void {
    this.libraryTemplates = libraryTemplates;
    // Convert library templates to Template format and merge
    const convertedTemplates = this.convertLibraryTemplates(libraryTemplates);
    this.templates = [...this.templates, ...convertedTemplates];
  }

  // Convert library templates to Template format
  private convertLibraryTemplates(libraryTemplates: LibraryTemplate[]): Template[] {
    return libraryTemplates.map(libTemplate => ({
      id: `lib-${libTemplate.id}`,
      name: libTemplate.title,
      description: libTemplate.description || `${libTemplate.specality} template of type ${libTemplate.type}`,
      sections: this.convertLibrarySections(libTemplate.sections || []),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  // Convert library sections to Template sections
  private convertLibrarySections(librarySections: any[]): TemplateSection[] {
    return librarySections.map((section, index) => ({
      id: `section-${index + 1}`,
      title: section.name,
      description: section.description,
      content: section.description,
      type: section.type === 'paragraph' ? 'text' : 'list',
      fields: this.generateFieldsFromSection(section, index)
    }));
  }

  // Generate fields from library section
  private generateFieldsFromSection(section: any, sectionIndex: number): TemplateField[] {
    const fieldType = section.type === 'bulleted_list' ? 'TEXTAREA' : 'TEXT';
    return [{
      id: `field-${sectionIndex + 1}`,
      type: fieldType,
      label: section.name,
      placeholder: `Enter ${section.name.toLowerCase()}`,
      required: true,
      validation: { maxLength: fieldType === 'TEXTAREA' ? 1000 : 500 },
      description: section.description
    }];
  }

  // Get all available template types for workflow mapping
  getTemplateTypes(): string[] {
    const builderTypes = [...new Set(this.templates.map(t => t.name))];
    const libraryTypes = [...new Set(this.libraryTemplates.map(t => `${t.title} (${t.specality})`))];
    return [...builderTypes, ...libraryTypes];
  }

  // Get template by type/name
  getTemplateByType(templateType: string): Template | null {
    // First check builder templates
    let template = this.templates.find(t => t.name === templateType);
    
    // If not found, check library templates
    if (!template) {
      const libraryTemplate = this.libraryTemplates.find(t => 
        `${t.title} (${t.specality})` === templateType
      );
      if (libraryTemplate) {
        template = this.convertLibraryTemplates([libraryTemplate])[0];
      }
    }
    
    return template || null;
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

  // Get all library templates
  getLibraryTemplates(): LibraryTemplate[] {
    return this.libraryTemplates;
  }

  // Get library templates by specialty
  getLibraryTemplatesBySpecialty(specialty: string): LibraryTemplate[] {
    return this.libraryTemplates.filter(t => 
      t.specality.toLowerCase() === specialty.toLowerCase()
    );
  }

  // Get library templates by type
  getLibraryTemplatesByType(type: string): LibraryTemplate[] {
    return this.libraryTemplates.filter(t => 
      t.type.toLowerCase() === type.toLowerCase()
    );
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

    // Add common EHR fields based on template content
    const templateContent = template.sections.map(s => s.title.toLowerCase()).join(' ');
    
    if (templateContent.includes('chief complaint')) fields.push('Chief Complaint');
    if (templateContent.includes('history') || templateContent.includes('hpi')) fields.push('History of Present Illness');
    if (templateContent.includes('allerg')) fields.push('Allergies');
    if (templateContent.includes('family')) fields.push('Family History');
    if (templateContent.includes('social')) fields.push('Social History');
    if (templateContent.includes('review') || templateContent.includes('systems')) fields.push('Review of Systems');
    if (templateContent.includes('exam') || templateContent.includes('physical')) fields.push('Physical Examination');
    if (templateContent.includes('assess') || templateContent.includes('diagnosis')) fields.push('Assessment');
    if (templateContent.includes('plan') || templateContent.includes('treatment')) fields.push('Plan');

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
        name: `Navigate to ${section.title} Section`,
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
