
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Link,
  Tooltip,
  Grid2 as Grid,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  ExternalLink as ExternalLinkIcon,
  Payment as PaymentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'failed';
  zohoUrl: string;
  description: string;
}

const Billing: React.FC = () => {
  // Mock invoice data
  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV-2024-001',
      date: '2024-01-01',
      dueDate: '2024-01-15',
      amount: 79.99,
      status: 'paid',
      zohoUrl: 'https://zoho.com/invoice/INV-2024-001',
      description: 'Monthly Premium Subscription'
    },
    {
      id: 'INV-2024-002',
      date: '2024-02-01',
      dueDate: '2024-02-15',
      amount: 79.99,
      status: 'paid',
      zohoUrl: 'https://zoho.com/invoice/INV-2024-002',
      description: 'Monthly Premium Subscription'
    },
    {
      id: 'INV-2024-003',
      date: '2024-03-01',
      dueDate: '2024-03-15',
      amount: 79.99,
      status: 'pending',
      zohoUrl: 'https://zoho.com/invoice/INV-2024-003',
      description: 'Monthly Premium Subscription'
    },
    {
      id: 'INV-2024-004',
      date: '2024-04-01',
      dueDate: '2024-04-15',
      amount: 79.99,
      status: 'overdue',
      zohoUrl: 'https://zoho.com/invoice/INV-2024-004',
      description: 'Monthly Premium Subscription'
    }
  ]);

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircleIcon color="success" />;
      case 'pending':
        return <ScheduleIcon color="warning" />;
      case 'overdue':
        return <WarningIcon color="error" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      default:
        return <ScheduleIcon />;
    }
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalPaid = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const outstandingAmount = invoices
    .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Billing & Invoices
      </Typography>

      {/* Billing Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PaymentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Total Paid
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatCurrency(totalPaid)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lifetime payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" color="warning.main">
                  Outstanding
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatCurrency(outstandingAmount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ReceiptIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" color="success.main">
                  Total Invoices
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {invoices.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Next Payment
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatCurrency(79.99)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                May 1, 2024
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Outstanding Invoices Alert */}
      {outstandingAmount > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            You have {formatCurrency(outstandingAmount)} in outstanding payments.
          </Typography>
          <Typography variant="body2">
            Please review and pay any overdue invoices to avoid service interruption.
          </Typography>
        </Alert>
      )}

      {/* Invoice History Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}>
            <ReceiptIcon color="primary" />
            Invoice History
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Invoice ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow 
                  key={invoice.id}
                  sx={{ 
                    '&:hover': { backgroundColor: 'grey.50' },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(invoice.date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {invoice.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {invoice.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(invoice.status)}
                      label={invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      color={getStatusColor(invoice.status) as any}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      color={
                        invoice.status === 'overdue' 
                          ? 'error.main' 
                          : 'text.primary'
                      }
                    >
                      {formatDate(invoice.dueDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatCurrency(invoice.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Invoice in Zoho">
                        <IconButton
                          size="small"
                          component={Link}
                          href={invoice.zohoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                        >
                          <ExternalLinkIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download PDF">
                        <IconButton
                          size="small"
                          onClick={() => {
                            // Handle PDF download
                            console.log('Downloading invoice:', invoice.id);
                          }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {invoices.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <ReceiptIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No invoices found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your invoice history will appear here once you start your subscription.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Payment Information */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          All payments are processed securely through Stripe. For detailed invoice management, 
          click the external link to view in Zoho Books.
        </Typography>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Need help?</strong> Contact our billing support team for any payment-related questions.
          </Typography>
        </Alert>
      </Paper>
    </Box>
  );
};

export default Billing;
