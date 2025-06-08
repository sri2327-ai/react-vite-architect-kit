
import { Tour } from '@/contexts/TourContext';

export const welcomeTour: Tour = {
  id: 'welcome-tour',
  name: 'Welcome to S10.AI',
  description: 'Get familiar with the main features of your AI clinical assistant',
  autoStart: false,
  showProgress: true,
  allowSkip: true,
  steps: [
    {
      id: 'welcome-start',
      title: 'Welcome to S10.AI! 🎉',
      content: 'Let\'s take a quick tour to help you get started with your AI clinical assistant. This will only take a few minutes.',
      target: 'body',
      placement: 'bottom'
    },
    {
      id: 'navigation-overview',
      title: 'Navigation Menu',
      content: 'Use this navigation menu to access different sections of the application. You can build templates, create workflows, and manage your profile.',
      target: '[data-tour-id="sidebar-navigation"]',
      placement: 'right',
      spotlightClicks: true
    },
    {
      id: 'template-builder',
      title: 'Template Builder',
      content: 'Create and customize clinical note templates here. You can build templates from scratch or use our library of pre-built templates.',
      target: '[data-tour-id="template-builder"]',
      placement: 'right',
      spotlightClicks: true
    },
    {
      id: 'workflow-builder',
      title: 'Workflow Builder',
      content: 'Design automated workflows to streamline your clinical documentation process and integrate with your EHR system.',
      target: '[data-tour-id="workflow-builder"]',
      placement: 'right',
      spotlightClicks: true
    },
    {
      id: 'profile-settings',
      title: 'Profile & Settings',
      content: 'Manage your account settings, security preferences, and data retention policies from your profile page.',
      target: '[data-tour-id="profile"]',
      placement: 'right',
      spotlightClicks: true
    },
    {
      id: 'help-center',
      title: 'Need Help?',
      content: 'You can always restart this tour or access help documentation from the help icon in the navigation.',
      target: '[data-tour-id="help-button"]',
      placement: 'left',
      spotlightClicks: true
    },
    {
      id: 'quick-start-guide',
      title: 'Quick Start Guide 🚀',
      content: 'You\'re all set! Here are some quick links to help you get started with S10.AI and make the most of your clinical documentation workflow.',
      target: 'body',
      placement: 'bottom'
    }
  ]
};

export const templateBuilderTour: Tour = {
  id: 'template-builder-tour',
  name: 'Template Builder Complete Guide',
  description: 'Learn how to create and manage clinical note templates step by step',
  autoStart: false,
  showProgress: true,
  allowSkip: true,
  steps: [
    {
      id: 'template-overview',
      title: 'Template Builder Overview',
      content: 'Welcome to the Template Builder! Here you can create, edit, and manage your clinical note templates. Let me navigate you to this section first.',
      target: 'body',
      placement: 'bottom'
    },
    {
      id: 'workflow-steps',
      title: 'Workflow Navigation',
      content: 'This shows your current progress in the template workflow. You can navigate between visit type selection and template management.',
      target: '[data-tour-id="workflow-steps"]',
      placement: 'bottom',
      spotlightClicks: true
    },
    {
      id: 'visit-type-selection',
      title: 'Select Visit Type',
      content: 'Click "Next" and I\'ll automatically select a visit type for you to proceed to the template management screen.',
      target: '[data-tour-id="visit-type-selection"]',
      placement: 'top',
      spotlightClicks: true
    },
    {
      id: 'template-management-screen',
      title: 'Template Management Screen',
      content: 'Great! Now you\'re in the template management view. This screen shows all templates for your selected visit type and provides tools to create, edit, and organize them.',
      target: 'body',
      placement: 'bottom'
    },
    {
      id: 'template-workflow-nav',
      title: 'Updated Workflow Steps',
      content: 'Notice how the workflow navigation has updated to show you\'re now in the Templates step. You can use the back button or click on Visit Type to return to the previous screen.',
      target: '[data-tour-id="workflow-steps"]',
      placement: 'bottom',
      spotlightClicks: true
    },
    {
      id: 'create-template-action',
      title: 'Create New Template',
      content: 'Click the "Create Template" button to start building a new clinical note template. You\'ll have multiple creation options to choose from.',
      target: '[data-tour-id="create-template-button"]',
      placement: 'bottom',
      spotlightClicks: true
    },
    {
      id: 'template-filters',
      title: 'Filter Templates',
      content: 'Use the specialty filter to find specific templates quickly. You can filter by specialty to narrow down your template list when you have multiple templates.',
      target: '[data-tour-id="template-filters"]',
      placement: 'bottom',
      spotlightClicks: true
    },
    {
      id: 'template-list',
      title: 'Template Table',
      content: 'This table shows all templates for the selected visit type. Each template displays its name, specialty, and last modified date.',
      target: '[data-tour-id="template-list"]',
      placement: 'top',
      spotlightClicks: true
    },
    {
      id: 'template-actions-info',
      title: 'Template Actions',
      content: 'Each template has action buttons: View (eye icon) to preview, Edit (pencil icon) to modify, and Copy (duplicate icon) to create a copy.',
      target: '[data-tour-id="template-list"]',
      placement: 'left',
      spotlightClicks: true
    },
    {
      id: 'edit-template',
      title: 'Edit Template',
      content: 'Now let\'s explore template editing. Click the Edit button (pencil icon) on any template to open the template editor.',
      target: '[data-tour-id="template-list"]',
      placement: 'top',
      spotlightClicks: true
    },
    {
      id: 'template-editor-overview',
      title: 'Template Editor',
      content: 'Welcome to the template editor! This is where you can customize your clinical note template by adding sections, modifying content, and arranging the layout.',
      target: 'body',
      placement: 'bottom'
    },
    {
      id: 'add-section-button',
      title: 'Add Template Sections',
      content: 'Click the "Add Section" button to add new sections to your template. You can choose from various section types like paragraphs, checklists, and exam findings.',
      target: '[data-tour-id="add-section-button"]',
      placement: 'bottom',
      spotlightClicks: true
    }
  ]
};

export const workflowBuilderTour: Tour = {
  id: 'workflow-builder-tour',
  name: 'Workflow Builder Complete Guide',
  description: 'Learn how to create automated clinical workflows step by step',
  autoStart: false,
  showProgress: true,
  allowSkip: true,
  steps: [
    {
      id: 'workflow-overview',
      title: 'Workflow Builder Overview',
      content: 'Welcome to the Workflow Builder! Here you can create automated workflows that integrate with your EHR system. Let me navigate you to this section first.',
      target: 'body',
      placement: 'bottom'
    },
    {
      id: 'workflow-tabs',
      title: 'Workflow Sections',
      content: 'The workflow builder has two main sections: "My Workflows" where you manage your custom workflows, and "Workflow Library" where you can browse and import pre-built workflows.',
      target: '[data-tour-id="workflow-tabs"]',
      placement: 'bottom',
      spotlightClicks: true
    },
    {
      id: 'my-workflows-view',
      title: 'My Workflows View',
      content: 'In the My Workflows section, you can see all your created workflows. Each workflow shows its status, EHR system, and configuration details.',
      target: '[data-tour-id="my-workflows-view"]',
      placement: 'top',
      spotlightClicks: true
    },
    {
      id: 'create-workflow-button',
      title: 'Create New Workflow',
      content: 'Click "Create Workflow" to start building a new automated workflow. You can configure triggers, actions, and EHR integrations.',
      target: '[data-tour-id="create-workflow"]',
      placement: 'bottom',
      spotlightClicks: true
    },
    {
      id: 'workflow-status',
      title: 'Workflow Status',
      content: 'Each workflow has a status indicator showing whether it\'s active or inactive. You can toggle workflows on/off using the switch controls.',
      target: '[data-tour-id="workflow-status"]',
      placement: 'left',
      spotlightClicks: true
    },
    {
      id: 'workflow-actions',
      title: 'Workflow Actions',
      content: 'Use the action buttons to configure EHR settings, set up triggers, map templates to visit types, and configure provider-specific settings.',
      target: '[data-tour-id="workflow-actions"]',
      placement: 'top',
      spotlightClicks: true
    },
    {
      id: 'ehr-configuration',
      title: 'EHR Integration',
      content: 'Configure your Electronic Health Records system integration. Select your EHR provider and set up connection parameters for seamless data flow.',
      target: '[data-tour-id="ehr-config"]',
      placement: 'bottom',
      spotlightClicks: true
    },
    {
      id: 'template-mapping',
      title: 'Template Mapping',
      content: 'Map your templates to different visit types and providers. This ensures the right template is automatically selected for each patient encounter.',
      target: '[data-tour-id="template-mapping"]',
      placement: 'top',
      spotlightClicks: true
    },
    {
      id: 'workflow-library-switch',
      title: 'Switch to Library',
      content: 'Now let\'s explore the Workflow Library. Click on the "Workflow Library" tab to see pre-built workflows you can import and customize.',
      target: '[data-tour-id="workflow-tabs"]',
      placement: 'bottom',
      spotlightClicks: true
    },
    {
      id: 'workflow-library',
      title: 'Browse Library',
      content: 'The Workflow Library contains pre-built workflows for different EHR systems and specialties. You can import and customize these workflows to accelerate your setup.',
      target: '[data-tour-id="workflow-library"]',
      placement: 'bottom',
      spotlightClicks: true
    },
    {
      id: 'import-workflow',
      title: 'Import Workflows',
      content: 'Found a workflow you like? Click "Import Workflow" to add it to your collection. You can then customize it to fit your specific practice needs.',
      target: '[data-tour-id="import-workflow"]',
      placement: 'bottom',
      spotlightClicks: true
    }
  ]
};

export const allTours = [welcomeTour, templateBuilderTour, workflowBuilderTour];
