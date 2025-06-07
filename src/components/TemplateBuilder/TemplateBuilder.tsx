
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
    <Container 
      maxWidth="xl" 
      sx={{ 
        height: '100vh', 
        p: { xs: 0, sm: 1, md: 2 },
        width: '100%',
        maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '100%' }
      }}
    >
      <Box sx={{ 
        height: '100%', 
        overflow: 'auto',
        width: '100%'
      }}>
        {currentTab === 'my-templates' && <MyTemplatesTab />}
        {currentTab === 'template-library' && <TemplateLibraryTab />}
      </Box>
    </Container>
  );
};

export default TemplateBuilder;
