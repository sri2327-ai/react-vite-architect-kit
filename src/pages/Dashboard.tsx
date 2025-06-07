
import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Alert
} from '@mui/material';
import { 
  Description, 
  AccountTree, 
  TrendingUp, 
  Group,
  Help
} from '@mui/icons-material';
import { Layout } from '@/components/common';
import { useGuide } from '@/contexts/GuideContext';

const Dashboard: React.FC = () => {
  const { startGuide } = useGuide();

  const handleStartGuide = (mode: 'ehr' | 'standalone') => {
    startGuide(mode);
  };

  const stats = [
    { title: 'Templates Created', value: '0', icon: <Description />, color: 'primary' },
    { title: 'Workflows Active', value: '0', icon: <AccountTree />, color: 'secondary' },
    { title: 'Notes Generated', value: '0', icon: <TrendingUp />, color: 'success' },
    { title: 'Team Members', value: '1', icon: <Group />, color: 'info' }
  ];

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Welcome to S10.AI Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your clinical documentation platform is ready to use
          </Typography>
        </Box>

        {/* Guide Trigger for Testing */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Need help getting started?
              </Typography>
              <Typography variant="body2">
                Launch the interactive implementation guide to walk through the platform
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleStartGuide('standalone')}
                startIcon={<Help />}
              >
                Standalone Guide
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleStartGuide('ehr')}
                startIcon={<Help />}
              >
                EHR Guide
              </Button>
            </Box>
          </Box>
        </Alert>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ color: `${stat.color}.main`, mr: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Description />}
                  sx={{ py: 1.5 }}
                >
                  Create Template
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<AccountTree />}
                  sx={{ py: 1.5 }}
                >
                  Import Workflow
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Help />}
                  onClick={() => handleStartGuide('ehr')}
                  sx={{ py: 1.5 }}
                >
                  View Guide
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default Dashboard;
