
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
      target: '.MuiContainer-root',
      placement: 'bottom'
    },
    {
      id: 'visit-type-selection',
      title: 'Step 2: Select Visit Type',
      content: 'First, select a visit type to work with. Each visit type can have its own set of templates. Click on any visit type card to continue.',
      target: '.MuiCard-root',
      placement: 'top'
    },
    {
      id: 'create-visit-type',
      title: 'Step 3: Create New Visit Type',
      content: 'You can create new visit types by clicking the "Create Visit Type" button. This allows you to organize templates by different appointment types.',
      target: '.MuiButton-contained',
      placement: 'bottom'
    },
    {
      id: 'template-list',
      title: 'Step 4: View Templates',
      content: 'After selecting a visit type, you\'ll see all templates associated with that visit type. Each template shows its name, specialty, and last modified date.',
      target: '.MuiDataGrid-root',
      placement: 'top'
    },
    {
      id: 'create-template-button',
      title: 'Step 5: Create New Template',
      content: 'Click "Create Template" to start building a new clinical note template. You\'ll have multiple creation options to choose from.',
      target: '.MuiButton-root:has-text("Create Template"), .MuiButton-contained:first-of-type',
      placement: 'bottom'
    },
    {
      id: 'template-filters',
      title: 'Step 6: Filter Templates',
      content: 'Use the specialty filter to find specific templates quickly. You can filter by specialty to narrow down your template list.',
      target: '.MuiTextField-root',
      placement: 'bottom'
    },
    {
      id: 'template-actions',
      title: 'Step 7: Template Actions',
      content: 'Each template in the table has action buttons: View (eye icon) to preview, Edit (pencil icon) to modify, and Copy (duplicate icon) to create a copy.',
      target: '.MuiDataGrid-cell--withRenderer',
      placement: 'left'
    },
    {
      id: 'template-editor',
      title: 'Step 8: Template Editor',
      content: 'When editing a template, you\'ll see the drag-and-drop editor where you can add sections, configure fields, and customize your template layout.',
      target: '.MuiBox-root',
      placement: 'top'
    },
    {
      id: 'back-navigation',
      title: 'Step 9: Navigation',
      content: 'Use the back button to return to the visit type selection or previous screens. The header shows your current location in the builder.',
      target: '.MuiIconButton-root:first-of-type',
      placement: 'bottom'
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
      target: '.MuiContainer-root',
      placement: 'bottom'
    },
    {
      id: 'workflow-tabs',
      title: 'Step 2: Workflow Sections',
      content: 'The workflow builder has two main sections: "My Workflows" where you manage your custom workflows, and "Workflow Library" where you can browse and import pre-built workflows.',
      target: '.MuiTabs-root',
      placement: 'bottom'
    },
    {
      id: 'my-workflows-view',
      title: 'Step 3: My Workflows View',
      content: 'In the My Workflows section, you can see all your created workflows. Each workflow shows its status, EHR system, and configuration details.',
      target: '.MuiCard-root',
      placement: 'top'
    },
    {
      id: 'create-workflow',
      title: 'Step 4: Create New Workflow',
      content: 'Click "Create Workflow" to start building a new automated workflow. You can configure triggers, actions, and EHR integrations.',
      target: '.MuiButton-contained',
      placement: 'bottom'
    },
    {
      id: 'workflow-status',
      title: 'Step 5: Workflow Status',
      content: 'Each workflow has a status indicator showing whether it\'s active or inactive. You can toggle workflows on/off using the switch controls.',
      target: '.MuiSwitch-root',
      placement: 'left'
    },
    {
      id: 'workflow-actions',
      title: 'Step 6: Workflow Actions',
      content: 'Use the action buttons to configure EHR settings, set up triggers, map templates to visit types, and configure provider-specific settings.',
      target: '.MuiButton-root',
      placement: 'top'
    },
    {
      id: 'ehr-configuration',
      title: 'Step 7: EHR Integration',
      content: 'Configure your Electronic Health Records system integration. Select your EHR provider and set up connection parameters for seamless data flow.',
      target: '.MuiButton-outlined',
      placement: 'bottom'
    },
    {
      id: 'template-mapping',
      title: 'Step 8: Template Mapping',
      content: 'Map your templates to different visit types and providers. This ensures the right template is automatically selected for each patient encounter.',
      target: '.MuiButton-text',
      placement: 'top'
    },
    {
      id: 'workflow-library',
      title: 'Step 9: Browse Library',
      content: 'Switch to the Workflow Library to explore pre-built workflows for different EHR systems and specialties. Import and customize these workflows to accelerate your setup.',
      target: '.MuiTab-root:last-child',
      placement: 'bottom'
    },
    {
      id: 'import-workflow',
      title: 'Step 10: Import Workflows',
      content: 'Found a workflow you like? Click "Import Workflow" to add it to your collection. You can then customize it to fit your specific practice needs.',
      target: '.MuiButton-contained:contains("Import")',
      placement: 'bottom'
    },
    {
      id: 'workflow-testing',
      title: 'Step 11: Test Workflow',
      content: 'Before activating a workflow, use the test feature to ensure it works correctly with sample data. This helps prevent issues in live environments.',
      target: '.MuiButton-outlined:contains("Test")',
      placement: 'bottom'
    }
  ]
};

export const allTours = [welcomeTour, templateBuilderTour, workflowBuilderTour];
