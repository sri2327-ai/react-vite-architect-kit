
import React, { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import TemplateLibraryTab from './TemplateLibraryTab';
import MyTemplatesTab from './MyTemplatesTab';

interface TemplateBuilderProps {
  activeTab?: string;
}

const TemplateBuilder: React.FC<TemplateBuilderProps> = ({ activeTab = 'my-templates' }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', p: 0 }}>
      <Box sx={{ height: '100%', overflow: 'auto' }}>
        {currentTab === 'my-templates' && <MyTemplatesTab />}
        {currentTab === 'template-library' && <TemplateLibraryTab />}
      </Box>
    </Container>
  );
};

export default TemplateBuilder;
