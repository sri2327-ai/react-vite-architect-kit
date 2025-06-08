
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
      id: 'template-tabs',
      title: 'Step 2: Template Sections',
      content: 'Use these tabs to navigate between "My Templates" (your custom templates) and "Template Library" (pre-built templates you can import).',
      target: '.MuiTabs-root',
      placement: 'bottom'
    },
    {
      id: 'create-template-button',
      title: 'Step 3: Creating a New Template',
      content: 'Click this "Create Template" button to start building a new clinical note template. You\'ll have multiple creation options to choose from.',
      target: 'button:contains("Create Template")',
      placement: 'bottom'
    },
    {
      id: 'template-cards',
      title: 'Step 4: Template Management',
      content: 'Your existing templates are displayed as cards. Each card shows template details and provides options to edit, duplicate, or delete templates.',
      target: '.MuiGrid-item:first-child',
      placement: 'top'
    },
    {
      id: 'template-filters',
      title: 'Step 5: Filter and Search',
      content: 'Use these filters to find specific templates by specialty, visit type, or template format. The search bar helps you quickly locate templates by name.',
      target: '.MuiTextField-root:first-child',
      placement: 'bottom'
    },
    {
      id: 'template-actions',
      title: 'Step 6: Template Actions',
      content: 'Each template card has action buttons: Edit (pencil icon) to modify the template, Duplicate (copy icon) to create a copy, and Delete (trash icon) to remove it.',
      target: '.MuiIconButton-root',
      placement: 'left'
    },
    {
      id: 'visit-type-config',
      title: 'Step 7: Visit Type Configuration',
      content: 'Configure which visit types should automatically use each template. This helps streamline your workflow by auto-selecting the right template.',
      target: 'button:contains("Configure Visit Types")',
      placement: 'top'
    },
    {
      id: 'template-library',
      title: 'Step 8: Browse Template Library',
      content: 'Switch to the Template Library tab to explore pre-built templates. You can import and customize these templates to speed up your workflow.',
      target: '.MuiTab-root:last-child',
      placement: 'bottom'
    },
    {
      id: 'import-template',
      title: 'Step 9: Import Templates',
      content: 'Found a template you like? Click "Import Template" to add it to your collection. You can then customize it to fit your specific needs.',
      target: 'button:contains("Import Template")',
      placement: 'bottom'
    },
    {
      id: 'template-preview',
      title: 'Step 10: Preview Templates',
      content: 'Use the preview feature to see how templates will look when generating clinical notes. This helps ensure formatting meets your requirements.',
      target: 'button:contains("Preview")',
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
      target: '.MuiContainer-root',
      placement: 'bottom'
    },
    {
      id: 'workflow-tabs',
      title: 'Step 2: Workflow Sections',
      content: 'Navigate between "My Workflows" (your custom workflows), "Workflow Library" (pre-built workflows), and "Analytics" (performance tracking).',
      target: '.MuiTabs-root',
      placement: 'bottom'
    },
    {
      id: 'create-workflow',
      title: 'Step 3: Creating a New Workflow',
      content: 'Start creating automated workflows by clicking this "Create Workflow" button. You can build custom automation rules for your practice.',
      target: 'button:contains("Create Workflow")',
      placement: 'bottom'
    },
    {
      id: 'workflow-cards',
      title: 'Step 4: Workflow Management',
      content: 'Your workflows are displayed as cards showing their status (Active/Inactive), last run time, and success rates. Use the toggle to activate/deactivate workflows.',
      target: '.MuiCard-root:first-child',
      placement: 'top'
    },
    {
      id: 'ehr-integration',
      title: 'Step 5: EHR Integration',
      content: 'Configure your Electronic Health Records system integration. Select your EHR provider (Epic, Cerner, etc.) to ensure proper data flow.',
      target: 'button:contains("Configure EHR")',
      placement: 'bottom'
    },
    {
      id: 'workflow-triggers',
      title: 'Step 6: Set Up Triggers',
      content: 'Define what events should start your workflow - patient check-in, appointment start, specific visit types, or custom triggers.',
      target: 'button:contains("Add Trigger")',
      placement: 'left'
    },
    {
      id: 'template-mapping',
      title: 'Step 7: Template Mapping',
      content: 'Map your templates to different visit types and providers. This ensures the right template is automatically selected for each patient encounter.',
      target: 'button:contains("Map Templates")',
      placement: 'top'
    },
    {
      id: 'provider-settings',
      title: 'Step 8: Provider Configuration',
      content: 'Configure provider-specific settings including default templates, scheduling preferences, and documentation requirements for each clinician.',
      target: 'button:contains("Provider Settings")',
      placement: 'top'
    },
    {
      id: 'workflow-testing',
      title: 'Step 9: Test Your Workflow',
      content: 'Use the testing feature to simulate your workflow with sample data. This helps ensure everything works correctly before going live.',
      target: 'button:contains("Test Workflow")',
      placement: 'bottom'
    },
    {
      id: 'workflow-analytics',
      title: 'Step 10: Monitor Performance',
      content: 'Track your workflow\'s performance with detailed analytics. View success rates, processing times, and identify areas for improvement.',
      target: '.MuiTab-root:contains("Analytics")',
      placement: 'bottom'
    },
    {
      id: 'workflow-library',
      title: 'Step 11: Explore Workflow Library',
      content: 'Browse pre-built workflows for different EHR systems and specialties. Import and customize these workflows to accelerate your setup.',
      target: '.MuiTab-root:contains("Workflow Library")',
      placement: 'bottom'
    },
    {
      id: 'workflow-activation',
      title: 'Step 12: Activate Your Workflow',
      content: 'Once tested and configured, activate your workflow using this toggle. Your automation will start running according to your defined triggers.',
      target: '.MuiSwitch-root',
      placement: 'left'
    }
  ]
};

export const allTours = [welcomeTour, templateBuilderTour, workflowBuilderTour];
