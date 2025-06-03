
export interface TemplateField {
  id: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'DROPDOWN' | 'CHECKBOX' | 'TEXTAREA' | 'RADIO' | 'FILE_UPLOAD';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  description?: string;
  defaultValue?: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  content: string;
  type: 'text' | 'list' | 'checkbox' | 'dropdown';
  fields?: TemplateField[];
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  sections: TemplateSection[];
  createdAt: string;
  updatedAt: string;
}

// Editor-specific types that extend the base types
export interface EditorTemplateField extends TemplateField {
  visible: boolean;
}

export interface EditorTemplateSection extends Omit<TemplateSection, 'fields'> {
  visible: boolean;
  fields: EditorTemplateField[];
}

export interface EditorTemplate extends Omit<Template, 'sections'> {
  sections: EditorTemplateSection[];
}
