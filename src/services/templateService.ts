
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

class TemplateService {
  private libraryTemplates: any[] = [];
  private templateMappings: { [key: string]: TemplateTypeMapping } = {};

  registerLibraryTemplates(templates: any[]) {
    this.libraryTemplates = templates;
    
    // Create mappings for each template
    templates.forEach(template => {
      this.templateMappings[template.title] = {
        templateType: template.title,
        ehrFields: template.sections?.map((s: any) => s.name) || [],
        workflowSteps: template.sections?.map((section: any, index: number) => ({
          id: `step-${index}`,
          name: section.name,
          type: index === 0 ? 'trigger' : 'action',
          isEditable: true,
          templateFieldId: section.name
        })) || []
      };
    });
  }

  getTemplateTypes(): string[] {
    return this.libraryTemplates.map(template => template.title);
  }

  getEhrFieldMappings(templateType: string): TemplateTypeMapping | null {
    return this.templateMappings[templateType] || null;
  }
}

export const templateService = new TemplateService();
