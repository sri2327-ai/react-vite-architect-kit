
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
  name: 'Template Builder Guide',
  description: 'Learn how to create and manage clinical note templates',
  autoStart: false,
  showProgress: true,
  allowSkip: true,
  steps: [
    {
      id: 'template-overview',
      title: 'Template Builder Overview',
      content: 'Here you can create, edit, and manage your clinical note templates. Templates help you document patient encounters quickly and consistently.',
      target: '[data-tour-id="template-builder-header"]',
      placement: 'bottom'
    },
    {
      id: 'my-templates',
      title: 'My Templates',
      content: 'View and manage all your custom templates here. You can edit existing templates or create new ones.',
      target: '[data-tour-id="my-templates-tab"]',
      placement: 'bottom'
    },
    {
      id: 'template-library',
      title: 'Template Library',
      content: 'Browse our collection of pre-built templates created by medical professionals. You can import and customize these for your practice.',
      target: '[data-tour-id="template-library-tab"]',
      placement: 'bottom'
    },
    {
      id: 'create-template',
      title: 'Create New Template',
      content: 'Click here to start building a new template. You can add various sections like patient history, examination findings, and treatment plans.',
      target: '[data-tour-id="create-template-button"]',
      placement: 'left'
    }
  ]
};

export const workflowBuilderTour: Tour = {
  id: 'workflow-builder-tour',
  name: 'Workflow Builder Guide',
  description: 'Learn how to create automated clinical workflows',
  autoStart: false,
  showProgress: true,
  allowSkip: true,
  steps: [
    {
      id: 'workflow-overview',
      title: 'Workflow Builder Overview',
      content: 'Create automated workflows to streamline your documentation process and integrate with your EHR system.',
      target: '[data-tour-id="workflow-builder-header"]',
      placement: 'bottom'
    },
    {
      id: 'my-workflows',
      title: 'My Workflows',
      content: 'Manage your custom workflows here. Workflows help automate repetitive tasks and ensure consistency in your documentation.',
      target: '[data-tour-id="my-workflows-tab"]',
      placement: 'bottom'
    },
    {
      id: 'workflow-library',
      title: 'Workflow Library',
      content: 'Explore pre-built workflows for common clinical scenarios. You can import and customize these for your specific needs.',
      target: '[data-tour-id="workflow-library-tab"]',
      placement: 'bottom'
    }
  ]
};

export const allTours = [welcomeTour, templateBuilderTour, workflowBuilderTour];
