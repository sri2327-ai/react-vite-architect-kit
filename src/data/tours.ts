
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
      id: 'template-access',
      title: 'Step 1: Accessing Template Builder',
      content: 'Click on "Template Builder" in the navigation menu to access the template creation tools. This is your starting point for creating custom clinical note templates.',
      target: '[data-tour-id="nav-templates"]',
      placement: 'right'
    },
    {
      id: 'template-overview',
      title: 'Step 2: Template Builder Overview',
      content: 'Welcome to the Template Builder! Here you can see your existing templates and create new ones. The interface is divided into "My Templates" and "Template Library" sections.',
      target: '[data-tour-id="template-builder-header"]',
      placement: 'bottom'
    },
    {
      id: 'my-templates-tab',
      title: 'Step 3: My Templates Section',
      content: 'This is where all your custom templates are stored. You can view, edit, duplicate, and delete your templates from here.',
      target: '[data-tour-id="my-templates-tab"]',
      placement: 'bottom'
    },
    {
      id: 'create-template-button',
      title: 'Step 4: Creating a New Template',
      content: 'Click this "Create Template" button to start building a new clinical note template. You\'ll have multiple creation options to choose from.',
      target: '[data-tour-id="create-template-button"]',
      placement: 'bottom'
    },
    {
      id: 'template-creation-methods',
      title: 'Step 5: Template Creation Methods',
      content: 'You can create templates using: Smart Copy (from previous notes), AI-Assisted Creation, Custom Builder, Import Existing, or Browse Template Library.',
      target: '[data-tour-id="template-creation-dialog"]',
      placement: 'top'
    },
    {
      id: 'template-editor',
      title: 'Step 6: Template Editor Interface',
      content: 'This is the template editor where you build your template sections. You can drag and drop sections to reorder them and configure each section individually.',
      target: '[data-tour-id="template-editor"]',
      placement: 'top'
    },
    {
      id: 'section-types',
      title: 'Step 7: Available Section Types',
      content: 'You can add different types of sections: Paragraphs (for narrative text), Bulleted Lists, Section Headers, Static Text, Exam Lists, and Checklists.',
      target: '[data-tour-id="add-section-button"]',
      placement: 'left'
    },
    {
      id: 'section-configuration',
      title: 'Step 8: Configuring Sections',
      content: 'Each section can be customized with specific instructions for the AI, including what content to generate and how to format it.',
      target: '[data-tour-id="section-config"]',
      placement: 'left'
    },
    {
      id: 'template-preview',
      title: 'Step 9: Preview Your Template',
      content: 'Use the preview function to see how your template will look when generating clinical notes. This helps ensure everything is formatted correctly.',
      target: '[data-tour-id="template-preview"]',
      placement: 'bottom'
    },
    {
      id: 'save-template',
      title: 'Step 10: Save Your Template',
      content: 'Don\'t forget to save your template! You can also set visit types and configure when this template should be used automatically.',
      target: '[data-tour-id="save-template"]',
      placement: 'bottom'
    },
    {
      id: 'template-library',
      title: 'Step 11: Browse Template Library',
      content: 'Explore pre-built templates in the Template Library. You can import and customize these templates to speed up your workflow.',
      target: '[data-tour-id="template-library-tab"]',
      placement: 'bottom'
    },
    {
      id: 'template-filters',
      title: 'Step 12: Filter and Search',
      content: 'Use filters to find specific types of templates by specialty, visit type, or template format (SOAP, DPD, etc.).',
      target: '[data-tour-id="template-filters"]',
      placement: 'top'
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
      id: 'workflow-access',
      title: 'Step 1: Accessing Workflow Builder',
      content: 'Click on "Workflow Builder" in the navigation menu to access workflow creation tools. Workflows help automate your documentation process.',
      target: '[data-tour-id="nav-workflows"]',
      placement: 'right'
    },
    {
      id: 'workflow-overview',
      title: 'Step 2: Workflow Builder Overview',
      content: 'Welcome to the Workflow Builder! Here you can create automated workflows that integrate with your EHR system to streamline documentation.',
      target: '[data-tour-id="workflow-builder-header"]',
      placement: 'bottom'
    },
    {
      id: 'my-workflows-section',
      title: 'Step 3: My Workflows Section',
      content: 'This is where all your custom workflows are stored. You can view, edit, activate, and manage your automated workflows from here.',
      target: '[data-tour-id="my-workflows-tab"]',
      placement: 'bottom'
    },
    {
      id: 'workflow-library',
      title: 'Step 4: Workflow Library',
      content: 'Browse pre-built workflows for different EHR systems and specialties. You can import and customize these workflows for your practice.',
      target: '[data-tour-id="workflow-library-tab"]',
      placement: 'bottom'
    },
    {
      id: 'create-workflow',
      title: 'Step 5: Creating a New Workflow',
      content: 'Start creating a new workflow by selecting your EHR system and defining the automation rules for your clinical documentation process.',
      target: '[data-tour-id="create-workflow-button"]',
      placement: 'bottom'
    },
    {
      id: 'ehr-integration',
      title: 'Step 6: EHR System Integration',
      content: 'Select your Electronic Health Records system (Epic, Cerner, Allscripts, etc.) to ensure proper integration and data flow.',
      target: '[data-tour-id="ehr-selection"]',
      placement: 'top'
    },
    {
      id: 'workflow-blocks',
      title: 'Step 7: Workflow Building Blocks',
      content: 'Add workflow blocks to define triggers, conditions, and actions. These blocks determine when and how your automation runs.',
      target: '[data-tour-id="workflow-blocks"]',
      placement: 'left'
    },
    {
      id: 'trigger-configuration',
      title: 'Step 8: Setting Up Triggers',
      content: 'Configure triggers that start your workflow - such as patient check-in, appointment start, or specific visit types.',
      target: '[data-tour-id="workflow-triggers"]',
      placement: 'left'
    },
    {
      id: 'template-mapping',
      title: 'Step 9: Template Mapping',
      content: 'Map your templates to different visit types and providers. This ensures the right template is used for each patient encounter.',
      target: '[data-tour-id="template-mapping"]',
      placement: 'top'
    },
    {
      id: 'provider-settings',
      title: 'Step 10: Provider Configuration',
      content: 'Configure provider-specific settings, including default templates, scheduling preferences, and documentation requirements.',
      target: '[data-tour-id="provider-config"]',
      placement: 'top'
    },
    {
      id: 'workflow-testing',
      title: 'Step 11: Test Your Workflow',
      content: 'Use the testing feature to simulate your workflow with sample data. This helps ensure everything works correctly before going live.',
      target: '[data-tour-id="workflow-test"]',
      placement: 'bottom'
    },
    {
      id: 'workflow-activation',
      title: 'Step 12: Activate Your Workflow',
      content: 'Once tested, activate your workflow to start automating your clinical documentation. You can monitor and adjust as needed.',
      target: '[data-tour-id="workflow-activate"]',
      placement: 'bottom'
    },
    {
      id: 'workflow-monitoring',
      title: 'Step 13: Monitor Performance',
      content: 'Keep track of your workflow\'s performance with analytics and logs. You can see success rates and identify areas for improvement.',
      target: '[data-tour-id="workflow-monitor"]',
      placement: 'top'
    }
  ]
};

export const allTours = [welcomeTour, templateBuilderTour, workflowBuilderTour];
