
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
  TablePagination,
  IconButton,
  Link,
  Tooltip,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  OpenInNew as OpenInNewIcon,
  Payment as PaymentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

interface Invoice {
  id: string;
  date: string;
  invoiceNumber: string;
  zohoInvoiceUrl: string;
  status: 'paid' | 'pending' | 'overdue' | 'failed';
  dueDate: string;
  amount: number;
  description: string;
}

const BillingHistory: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock invoice data
  const invoices: Invoice[] = [
    {
      id: '1',
      date: '2024-01-01',
      invoiceNumber: 'INV-2024-001',
      zohoInvoiceUrl: 'https://books.zoho.com/app/60009969114#/invoices/123456789',
      status: 'paid',
      dueDate: '2024-01-15',
      amount: 99.99,
      description: 'Monthly Subscription - Pro Plan'
    },
    {
      id: '2',
      date: '2024-02-01',
      invoiceNumber: 'INV-2024-002',
      zohoInvoiceUrl: 'https://books.zoho.com/app/60009969114#/invoices/123456790',
      status: 'paid',
      dueDate: '2024-02-15',
      amount: 99.99,
      description: 'Monthly Subscription - Pro Plan'
    },
    {
      id: '3',
      date: '2024-03-01',
      invoiceNumber: 'INV-2024-003',
      zohoInvoiceUrl: 'https://books.zoho.com/app/60009969114#/invoices/123456791',
      status: 'pending',
      dueDate: '2024-03-15',
      amount: 99.99,
      description: 'Monthly Subscription - Pro Plan'
    },
    {
      id: '4',
      date: '2024-04-01',
      invoiceNumber: 'INV-2024-004',
      zohoInvoiceUrl: 'https://books.zoho.com/app/60009969114#/invoices/123456792',
      status: 'overdue',
      dueDate: '2024-04-15',
      amount: 99.99,
      description: 'Monthly Subscription - Pro Plan'
    },
    {
      id: '5',
      date: '2024-05-01',
      invoiceNumber: 'INV-2024-005',
      zohoInvoiceUrl: 'https://books.zoho.com/app/60009969114#/invoices/123456793',
      status: 'failed',
      dueDate: '2024-05-15',
      amount: 99.99,
      description: 'Monthly Subscription - Pro Plan'
    }
  ];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status: Invoice['status']) => {
    const statusConfig = {
      paid: { label: 'Paid', color: 'success' as const, icon: <CheckCircleIcon fontSize="small" /> },
      pending: { label: 'Pending', color: 'warning' as const, icon: <ScheduleIcon fontSize="small" /> },
      overdue: { label: 'Overdue', color: 'error' as const, icon: <WarningIcon fontSize="small" /> },
      failed: { label: 'Failed', color: 'error' as const, icon: <ErrorIcon fontSize="small" /> }
    };

    const config = statusConfig[status];
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
        variant="filled"
      />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const paginatedInvoices = invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Billing History
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PaymentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Total Paid
              </Typography>
            </Box>
            <Typography variant="h4" color="success.main" fontWeight={700}>
              $199.98
            </Typography>
            <Typography variant="body2" color="text.secondary">
              2 invoices paid
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ScheduleIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Pending
              </Typography>
            </Box>
            <Typography variant="h4" color="warning.main" fontWeight={700}>
              $99.99
            </Typography>
            <Typography variant="body2" color="text.secondary">
              1 invoice pending
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WarningIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Overdue
              </Typography>
            </Box>
            <Typography variant="h4" color="error.main" fontWeight={700}>
              $99.99
            </Typography>
            <Typography variant="body2" color="text.secondary">
              1 invoice overdue
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ReceiptIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Total Invoices
              </Typography>
            </Box>
            <Typography variant="h4" color="primary.main" fontWeight={700}>
              {invoices.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All time
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ mt: 4 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon color="primary" />
            Invoice History
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Invoice</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(invoice.date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {invoice.invoiceNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {invoice.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(invoice.status)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(invoice.dueDate)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      {formatAmount(invoice.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="View in Zoho">
                        <IconButton
                          size="small"
                          component={Link}
                          href={invoice.zohoInvoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download PDF">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => console.log('Download PDF for', invoice.invoiceNumber)}
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

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={invoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {invoices.some(invoice => invoice.status === 'overdue' || invoice.status === 'failed') && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          You have overdue or failed invoices. Please update your payment method or contact support.
        </Alert>
      )}
    </Box>
  );
};

export default BillingHistory;
