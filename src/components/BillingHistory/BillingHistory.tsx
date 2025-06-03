
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
  CardContent,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  Collapse,
  Button
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  OpenInNew as OpenInNewIcon,
  Payment as PaymentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CreditCard as CreditCardIcon,
  TrendingUp as TrendingUpIcon
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
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

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
        sx={{ fontWeight: 600 }}
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

  const summaryStats = [
    {
      title: 'Total Paid',
      value: '$199.98',
      subtitle: '2 invoices paid',
      icon: <PaymentIcon />,
      color: 'success.main'
    },
    {
      title: 'Pending',
      value: '$99.99',
      subtitle: '1 invoice pending',
      icon: <ScheduleIcon />,
      color: 'warning.main'
    },
    {
      title: 'Overdue',
      value: '$99.99',
      subtitle: '1 invoice overdue',
      icon: <WarningIcon />,
      color: 'error.main'
    },
    {
      title: 'Total Invoices',
      value: invoices.length.toString(),
      subtitle: 'All time',
      icon: <ReceiptIcon />,
      color: 'primary.main'
    }
  ];

  const MobileInvoiceCard = ({ invoice }: { invoice: Invoice }) => {
    const isExpanded = expandedCard === invoice.id;
    
    return (
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {invoice.invoiceNumber}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(invoice.date)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight={600} color="primary.main">
                {formatAmount(invoice.amount)}
              </Typography>
              <Button
                size="small"
                onClick={() => setExpandedCard(isExpanded ? null : invoice.id)}
                sx={{ minWidth: 'auto', p: 0.5 }}
              >
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            {getStatusChip(invoice.status)}
            <Typography variant="caption" color="text.secondary">
              Due: {formatDate(invoice.dueDate)}
            </Typography>
          </Box>
          
          <Collapse in={isExpanded}>
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {invoice.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<OpenInNewIcon />}
                  component={Link}
                  href={invoice.zohoInvoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ flex: 1 }}
                >
                  View
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => console.log('Download PDF for', invoice.invoiceNumber)}
                  sx={{ flex: 1 }}
                >
                  Download
                </Button>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1, md: 3 } }}>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        gutterBottom 
        sx={{ 
          fontWeight: 600, 
          mb: { xs: 2, md: 3 },
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        Billing & Subscription
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={{ xs: 1.5, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {summaryStats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}>
              <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: stat.color, mr: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography 
                    variant={isMobile ? "caption" : "h6"} 
                    fontWeight={600}
                    sx={{ fontSize: { xs: '0.75rem', md: '1.1rem' } }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
                <Typography 
                  variant={isMobile ? "h6" : "h4"} 
                  sx={{ 
                    color: stat.color, 
                    fontWeight: 700,
                    fontSize: { xs: '1.1rem', md: '2rem' }
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}
                >
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Invoice History */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontSize: { xs: '1.1rem', md: '1.25rem' }
          }}>
            <CreditCardIcon color="primary" />
            Payment History
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            View and manage your subscription payments
          </Typography>
        </Box>

        {isMobile ? (
          // Mobile Card View
          <Box sx={{ p: 2 }}>
            {paginatedInvoices.map((invoice) => (
              <MobileInvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </Box>
        ) : (
          // Desktop Table View
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Invoice</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
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
        )}

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={invoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '& .MuiTablePagination-toolbar': {
              px: { xs: 1, md: 2 }
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: { xs: '0.875rem', md: '1rem' }
            }
          }}
        />
      </Paper>

      {/* Alert for Overdue/Failed Invoices */}
      {invoices.some(invoice => invoice.status === 'overdue' || invoice.status === 'failed') && (
        <Alert 
          severity="warning" 
          sx={{ 
            mt: 3,
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: { xs: '0.875rem', md: '1rem' }
            }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Action Required
          </Typography>
          <Typography variant="body2">
            You have overdue or failed payments. Please update your payment method to continue using S10.AI services without interruption.
          </Typography>
        </Alert>
      )}
    </Container>
  );
};

export default BillingHistory;
