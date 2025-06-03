
export interface EditorTemplateField {
  id: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'DROPDOWN' | 'CHECKBOX' | 'TEXTAREA' | 'RADIO' | 'FILE_UPLOAD';
  label: string;
  placeholder?: string;
  required: boolean;
  visible: boolean;
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

export interface EditorTemplateSection {
  id: string;
  title: string;
  description?: string;
  visible: boolean;
  fields: EditorTemplateField[];
}

export interface EditorTemplate {
  id: string;
  name: string;
  description?: string;
  sections: EditorTemplateSection[];
  createdAt: string;
  updatedAt: string;
}
