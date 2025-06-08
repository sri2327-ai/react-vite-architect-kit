
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
      target: '[data-tour-id="dashboard-header"]',
      placement: 'bottom'
    },
    {
      id: 'navigation-overview',
      title: 'Navigation Menu',
      content: 'Use this navigation menu to access different sections of the application. You can build templates, create workflows, and manage your profile.',
      target: '[data-tour-id="sidebar-navigation"]',
      placement: 'right'
    },
    {
      id: 'template-builder',
      title: 'Template Builder',
      content: 'Create and customize clinical note templates here. You can build templates from scratch or use our library of pre-built templates.',
      target: '[data-tour-id="nav-templates"]',
      placement: 'right'
    },
    {
      id: 'workflow-builder',
      title: 'Workflow Builder',
      content: 'Design automated workflows to streamline your clinical documentation process and integrate with your EHR system.',
      target: '[data-tour-id="nav-workflows"]',
      placement: 'right'
    },
    {
      id: 'profile-settings',
      title: 'Profile & Settings',
      content: 'Manage your account settings, security preferences, and data retention policies from your profile page.',
      target: '[data-tour-id="nav-profile"]',
      placement: 'right'
    },
    {
      id: 'help-center',
      title: 'Need Help?',
      content: 'You can always restart this tour or access help documentation from the help icon in the navigation.',
      target: '[data-tour-id="help-button"]',
      placement: 'left'
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
      title: 'Step 1: Template Builder Overview',
      content: 'Welcome to the Template Builder! Here you can create, edit, and manage your clinical note templates. This is your central hub for template management.',
      target: '[data-tour-id="template-overview"]',
      placement: 'bottom'
    },
    {
      id: 'workflow-steps',
      title: 'Step 2: Workflow Navigation',
      content: 'This shows your current progress in the template workflow. You can navigate between visit type selection and template management.',
      target: '[data-tour-id="workflow-steps"]',
      placement: 'bottom'
    },
    {
      id: 'visit-type-selection',
      title: 'Step 3: Select Visit Type',
      content: 'First, select a visit type to work with. Each visit type can have its own set of templates. Click on any visit type card to continue - the tour will automatically advance when you navigate.',
      target: '[data-tour-id="visit-type-selection"]',
      placement: 'top',
      spotlightClicks: true
    },
    {
      id: 'template-management-screen',
      title: 'Step 4: Template Management Screen',
      content: 'Great! Now you\'re in the template management view. This screen shows all templates for your selected visit type and provides tools to create, edit, and organize them.',
      target: 'body',
      placement: 'bottom'
    },
    {
      id: 'template-workflow-nav',
      title: 'Step 5: Updated Workflow Steps',
      content: 'Notice how the workflow navigation has updated to show you\'re now in the Templates step. You can use the back button or click on Visit Type to return to the previous screen.',
      target: '[data-tour-id="workflow-steps"]',
      placement: 'bottom'
    },
    {
      id: 'create-template-action',
      title: 'Step 6: Create New Template',
      content: 'Click the "Create Template" button to start building a new clinical note template. You\'ll have multiple creation options to choose from.',
      target: '[data-testid="create-template-button"]',
      placement: 'bottom'
    },
    {
      id: 'template-filters',
      title: 'Step 7: Filter Templates',
      content: 'Use the specialty filter to find specific templates quickly. You can filter by specialty to narrow down your template list when you have multiple templates.',
      target: '[data-tour-id="template-filters"]',
      placement: 'bottom'
    },
    {
      id: 'template-list',
      title: 'Step 8: Template Table',
      content: 'This table shows all templates for the selected visit type. Each template displays its name, specialty, and last modified date.',
      target: '[data-tour-id="template-list"]',
      placement: 'top'
    },
    {
      id: 'template-actions-info',
      title: 'Step 9: Template Actions',
      content: 'Each template has action buttons: View (eye icon) to preview, Edit (pencil icon) to modify, and Copy (duplicate icon) to create a copy.',
      target: '[data-tour-id="template-list"]',
      placement: 'left'
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
      title: 'Step 1: Workflow Builder Overview',
      content: 'Welcome to the Workflow Builder! Here you can create automated workflows that integrate with your EHR system to streamline your clinical documentation process.',
      target: '[data-tour-id="workflow-overview"]',
      placement: 'bottom'
    },
    {
      id: 'workflow-tabs',
      title: 'Step 2: Workflow Sections',
      content: 'The workflow builder has two main sections: "My Workflows" where you manage your custom workflows, and "Workflow Library" where you can browse and import pre-built workflows.',
      target: '[data-tour-id="workflow-tabs"]',
      placement: 'bottom'
    },
    {
      id: 'my-workflows-view',
      title: 'Step 3: My Workflows View',
      content: 'In the My Workflows section, you can see all your created workflows. Each workflow shows its status, EHR system, and configuration details.',
      target: '[data-tour-id="my-workflows-view"]',
      placement: 'top'
    },
    {
      id: 'create-workflow-button',
      title: 'Step 4: Create New Workflow',
      content: 'Click "Create Workflow" to start building a new automated workflow. You can configure triggers, actions, and EHR integrations.',
      target: '[data-testid="create-workflow"]',
      placement: 'bottom'
    },
    {
      id: 'workflow-status',
      title: 'Step 5: Workflow Status',
      content: 'Each workflow has a status indicator showing whether it\'s active or inactive. You can toggle workflows on/off using the switch controls.',
      target: '[data-tour-id="workflow-status"]',
      placement: 'left'
    },
    {
      id: 'workflow-actions',
      title: 'Step 6: Workflow Actions',
      content: 'Use the action buttons to configure EHR settings, set up triggers, map templates to visit types, and configure provider-specific settings.',
      target: '[data-tour-id="workflow-actions"]',
      placement: 'top'
    },
    {
      id: 'ehr-configuration',
      title: 'Step 7: EHR Integration',
      content: 'Configure your Electronic Health Records system integration. Select your EHR provider and set up connection parameters for seamless data flow.',
      target: '[data-tour-id="ehr-config"]',
      placement: 'bottom'
    },
    {
      id: 'template-mapping',
      title: 'Step 8: Template Mapping',
      content: 'Map your templates to different visit types and providers. This ensures the right template is automatically selected for each patient encounter.',
      target: '[data-tour-id="template-mapping"]',
      placement: 'top'
    },
    {
      id: 'workflow-library-switch',
      title: 'Step 9: Switch to Library',
      content: 'Now let\'s explore the Workflow Library. Click on the "Workflow Library" tab to see pre-built workflows you can import and customize.',
      target: '[data-tour-id="workflow-tabs"]',
      placement: 'bottom'
    },
    {
      id: 'workflow-library',
      title: 'Step 10: Browse Library',
      content: 'The Workflow Library contains pre-built workflows for different EHR systems and specialties. You can import and customize these workflows to accelerate your setup.',
      target: '[data-tour-id="workflow-library"]',
      placement: 'bottom'
    },
    {
      id: 'import-workflow',
      title: 'Step 11: Import Workflows',
      content: 'Found a workflow you like? Click "Import Workflow" to add it to your collection. You can then customize it to fit your specific practice needs.',
      target: '[data-testid="import-workflow"]',
      placement: 'bottom'
    }
  ]
};

export const allTours = [welcomeTour, templateBuilderTour, workflowBuilderTour];
