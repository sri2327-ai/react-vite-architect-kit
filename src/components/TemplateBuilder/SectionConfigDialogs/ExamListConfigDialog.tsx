
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  X,
  ArrowLeft,
  Plus,
  Trash2,
  Info,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';

interface ExamItem {
  id: string;
  subsectionTitle: string;
  reportInstructions: string;
  normalText: string;
}

interface WithinNormalLimitsSettings {
  whenNotDiscussed: 'blank' | 'default' | 'alert';
  whenNormal: 'summarize' | 'specified' | 'highlight';
  hideEmpty: boolean;
}

interface ExamListConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: (config: { 
    title: string; 
    items: ExamItem[];
    withinNormalLimits: WithinNormalLimitsSettings;
  }) => void;
  onBack: () => void;
}

const ExamListConfigDialog: React.FC<ExamListConfigDialogProps> = ({
  open,
  onClose,
  onContinue,
  onBack
}) => {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<ExamItem[]>([
    { id: '1', subsectionTitle: '', reportInstructions: '', normalText: '' }
  ]);
  const [withinNormalLimits, setWithinNormalLimits] = useState<WithinNormalLimitsSettings>({
    whenNotDiscussed: 'blank',
    whenNormal: 'summarize',
    hideEmpty: false
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    if (!value.trim()) {
      newErrors[field] = 'This field is required';
    } else {
      delete newErrors[field];
    }
    setErrors(newErrors);
  };

  const addItem = () => {
    const newItem: ExamItem = {
      id: Date.now().toString(),
      subsectionTitle: '',
      reportInstructions: '',
      normalText: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof ExamItem, value: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
    validateField(`${id}-${field}`, value);
  };

  const handleWithinNormalLimitsChange = (field: keyof WithinNormalLimitsSettings, value: any) => {
    setWithinNormalLimits(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    items.forEach(item => {
      if (!item.subsectionTitle.trim()) {
        newErrors[`${item.id}-subsectionTitle`] = 'Subsection title is required';
      }
      if (!item.reportInstructions.trim()) {
        newErrors[`${item.id}-reportInstructions`] = 'Instructions are required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onContinue({ title, items, withinNormalLimits });
  };

  const Tooltip = ({ content, children }: { content: string; children: React.ReactNode }) => (
    <div className="group relative inline-block">
      {children}
      <div className="invisible group-hover:visible absolute z-50 w-64 p-2 mt-1 text-sm bg-gray-900 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {content}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent className="p-0 max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full bg-white rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Edit Exam List</h2>
                  <p className="text-sm text-gray-600">Structured AI-generated content</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Quick Guide */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-900">How Exam Lists Work</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Each subsection gets its own AI instruction</li>
                    <li>• Define what aspects of the exam to report on</li>
                    <li>• Set default text for normal findings</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Section Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  validateField('title', e.target.value);
                }}
                placeholder="Enter section title..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.title}</span>
                </p>
              )}
            </div>

            {/* Exam Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Exam Sections</h3>
                <Tooltip content="Define what specific aspects of the exam the AI should report on">
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                </Tooltip>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          {index + 1}
                        </span>
                        <h4 className="font-medium text-gray-900">
                          {item.subsectionTitle || `Section ${index + 1}`}
                        </h4>
                      </div>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subsection Title *
                        </label>
                        <input
                          type="text"
                          value={item.subsectionTitle}
                          onChange={(e) => updateItem(item.id, 'subsectionTitle', e.target.value)}
                          placeholder="e.g., Heart, Lungs, Abdomen..."
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            errors[`${item.id}-subsectionTitle`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {errors[`${item.id}-subsectionTitle`] && (
                          <p className="text-sm text-red-600 mt-1 flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors[`${item.id}-subsectionTitle`]}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          AI Instructions *
                        </label>
                        <textarea
                          value={item.reportInstructions}
                          onChange={(e) => updateItem(item.id, 'reportInstructions', e.target.value)}
                          placeholder="Tell the AI what to focus on for this section..."
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                            errors[`${item.id}-reportInstructions`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {errors[`${item.id}-reportInstructions`] && (
                          <p className="text-sm text-red-600 mt-1 flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors[`${item.id}-reportInstructions`]}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Normal Findings Text (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.normalText}
                          onChange={(e) => updateItem(item.id, 'normalText', e.target.value)}
                          placeholder="Text to use when findings are within normal limits..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addItem}
                className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Another Section
              </button>
            </div>

            {/* Advanced Settings */}
            <div className="border border-gray-200 rounded-xl">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">Advanced Settings</h3>
                {showAdvanced ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {showAdvanced && (
                <div className="px-4 pb-4 space-y-6 border-t border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">When an item is not discussed:</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'blank', label: 'Leave it blank', desc: 'Section won\'t appear in output' },
                        { value: 'default', label: 'Default to "Within Normal Limits"', desc: 'Use standard normal text' },
                        { value: 'alert', label: 'Alert provider', desc: 'Add reminder note for missing sections' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                          <input
                            type="radio"
                            name="whenNotDiscussed"
                            value={option.value}
                            checked={withinNormalLimits.whenNotDiscussed === option.value}
                            onChange={(e) => handleWithinNormalLimitsChange('whenNotDiscussed', e.target.value)}
                            className="mt-0.5 text-blue-600"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">When findings are normal:</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'summarize', label: 'Summarize discussion', desc: 'AI generates summary of normal findings' },
                        { value: 'specified', label: 'Use specified text', desc: 'Use the text you defined above' },
                        { value: 'highlight', label: 'Highlight abnormal only', desc: 'Focus on what\'s not normal' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                          <input
                            type="radio"
                            name="whenNormal"
                            value={option.value}
                            checked={withinNormalLimits.whenNormal === option.value}
                            onChange={(e) => handleWithinNormalLimitsChange('whenNormal', e.target.value)}
                            className="mt-0.5 text-blue-600"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={withinNormalLimits.hideEmpty}
                      onChange={(e) => handleWithinNormalLimitsChange('hideEmpty', e.target.checked)}
                      className="text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Hide empty sections</div>
                      <div className="text-sm text-gray-600">Don't show sections with no content</div>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Back
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {Object.keys(errors).length > 0 ? (
                  <span className="text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>Please fix errors above</span>
                  </span>
                ) : (
                  <span className="text-green-600 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Ready to continue</span>
                  </span>
                )}
              </span>
              <button
                onClick={handleContinue}
                disabled={Object.keys(errors).length > 0 || !title || items.some(item => !item.subsectionTitle || !item.reportInstructions)}
                className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                Continue to Placement
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamListConfigDialog;
