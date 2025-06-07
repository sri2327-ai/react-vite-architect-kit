
import React from 'react';
import { PageHeader } from '@/components/common/Layout';

interface TemplateBuilderHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

const TemplateBuilderHeader: React.FC<TemplateBuilderHeaderProps> = (props) => {
  return <PageHeader {...props} />;
};

export default TemplateBuilderHeader;
