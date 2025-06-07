
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
      maxWidth={false}
      disableGutters
      sx={{ 
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        px: { xs: 0, sm: 1, md: 2 },
        py: { xs: 0, sm: 1, md: 2 }
      }}
    >
      <Box sx={{ 
        flex: 1,
        height: '100%',
        overflow: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        borderRadius: { xs: 0, sm: 2 },
        backgroundColor: 'background.default'
      }}>
        {currentTab === 'my-templates' && <MyTemplatesTab />}
        {currentTab === 'template-library' && <TemplateLibraryTab />}
      </Box>
    </Container>
  );
};

export default TemplateBuilder;
