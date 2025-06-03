
export interface TemplateSection {
  id: string;
  name: string;
  type: string;
  description?: string;
}

export interface Template {
  id: string;
  title: string;
  specialty: string;
  type: string;
  sections: TemplateSection[];
}

export interface VisitType {
  id: string;
  name: string;
  template: Template;
}

class TemplateBuilderService {
  private visitTypes: VisitType[] = [];

  // Mock data - in real app this would come from Template Builder
  initializeMockData() {
    this.visitTypes = [
      {
        id: 'vt-1',
        name: 'Office Visit',
        template: {
          id: 'template-1',
          title: 'Standard Office Visit Template',
          specialty: 'General Medicine',
          type: 'SOAP',
          sections: [
            { id: 'sec-1', name: 'Chief Complaint', type: 'paragraph', description: 'Primary reason for visit' },
            { id: 'sec-2', name: 'History of Present Illness', type: 'paragraph', description: 'Current condition details' },
            { id: 'sec-3', name: 'Review of Systems', type: 'bulleted_list', description: 'System review' },
            { id: 'sec-4', name: 'Physical Examination', type: 'paragraph', description: 'Physical exam findings' },
            { id: 'sec-5', name: 'Assessment', type: 'paragraph', description: 'Clinical assessment' },
            { id: 'sec-6', name: 'Plan', type: 'paragraph', description: 'Treatment plan' }
          ]
        }
      },
      {
        id: 'vt-2',
        name: 'Follow-up',
        template: {
          id: 'template-2',
          title: 'Follow-up Visit Template',
          specialty: 'General Medicine',
          type: 'SOAP',
          sections: [
            { id: 'sec-1', name: 'Chief Complaint', type: 'paragraph', description: 'Follow-up concern' },
            { id: 'sec-2', name: 'Interval History', type: 'paragraph', description: 'Changes since last visit' },
            { id: 'sec-3', name: 'Physical Examination', type: 'paragraph', description: 'Focused exam' },
            { id: 'sec-4', name: 'Assessment', type: 'paragraph', description: 'Current status' },
            { id: 'sec-5', name: 'Plan', type: 'paragraph', description: 'Ongoing plan' }
          ]
        }
      },
      {
        id: 'vt-3',
        name: 'Annual Physical',
        template: {
          id: 'template-3',
          title: 'Annual Physical Exam Template',
          specialty: 'General Medicine',
          type: 'Comprehensive',
          sections: [
            { id: 'sec-1', name: 'Chief Complaint', type: 'paragraph', description: 'Annual exam' },
            { id: 'sec-2', name: 'Past Medical History', type: 'bulleted_list', description: 'Medical history review' },
            { id: 'sec-3', name: 'Social History', type: 'paragraph', description: 'Lifestyle factors' },
            { id: 'sec-4', name: 'Family History', type: 'paragraph', description: 'Family medical history' },
            { id: 'sec-5', name: 'Review of Systems', type: 'bulleted_list', description: 'Comprehensive ROS' },
            { id: 'sec-6', name: 'Physical Examination', type: 'paragraph', description: 'Complete physical exam' },
            { id: 'sec-7', name: 'Assessment', type: 'paragraph', description: 'Overall health assessment' },
            { id: 'sec-8', name: 'Plan', type: 'paragraph', description: 'Preventive care plan' }
          ]
        }
      }
    ];
  }

  getVisitTypes(): VisitType[] {
    if (this.visitTypes.length === 0) {
      this.initializeMockData();
    }
    return this.visitTypes;
  }

  getVisitTypeById(id: string): VisitType | undefined {
    return this.getVisitTypes().find(vt => vt.id === id);
  }

  getVisitTypeByName(name: string): VisitType | undefined {
    return this.getVisitTypes().find(vt => vt.name === name);
  }

  getTemplateSections(visitTypeId: string): TemplateSection[] {
    const visitType = this.getVisitTypeById(visitTypeId);
    return visitType?.template.sections || [];
  }

  getAllVisitTypeNames(): string[] {
    return this.getVisitTypes().map(vt => vt.name);
  }
}

export const templateBuilderService = new TemplateBuilderService();
