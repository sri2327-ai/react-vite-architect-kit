import React, { useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TablePagination, IconButton, Link, Tooltip, Alert, Card, CardContent, useTheme, useMediaQuery, Collapse, Button, Container } from '@mui/material';
import { Receipt as ReceiptIcon, Download as DownloadIcon, OpenInNew as OpenInNewIcon, Payment as PaymentIcon, Schedule as ScheduleIcon, CheckCircle as CheckCircleIcon, Error as ErrorIcon, Warning as WarningIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, CreditCard as CreditCardIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
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
interface BillingHistoryProps {
  sidebarCollapsed?: boolean;
}
const BillingHistory: React.FC<BillingHistoryProps> = ({
  sidebarCollapsed = false
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // Adaptive layout decisions
  const useCardView = isMobile || isTablet;
  const useCompactSummary = isMobile;

  // Mock invoice data
  const invoices: Invoice[] = [{
    id: '1',
    date: '2024-01-01',
    invoiceNumber: 'INV-2024-001',
    zohoInvoiceUrl: 'https://books.zoho.com/app/60009969114#/invoices/123456789',
    status: 'paid',
    dueDate: '2024-01-15',
    amount: 99.99,
    description: 'Monthly Subscription - Pro Plan'
  }, {
    id: '2',
    date: '2024-02-01',
    invoiceNumber: 'INV-2024-002',
    zohoInvoiceUrl: 'https://books.zoho.com/app/60009969114#/invoices/123456790',
    status: 'paid',
    dueDate: '2024-02-15',
    amount: 99.99,
    description: 'Monthly Subscription - Pro Plan'
  }, {
    id: '3',
    date: '2024-03-01',
    invoiceNumber: 'INV-2024-003',
    zohoInvoiceUrl: 'https://books.zoho.com/app/60009969114#/invoices/123456791',
    status: 'pending',
    dueDate: '2024-03-15',
    amount: 99.99,
    description: 'Monthly Subscription - Pro Plan'
  }, {
    id: '4',
    date: '2024-04-01',
    invoiceNumber: 'INV-2024-004',
    zohoInvoiceUrl: 'https://books.zoho.com/app/60009969114#/invoices/123456792',
    status: 'overdue',
    dueDate: '2024-04-15',
    amount: 99.99,
    description: 'Monthly Subscription - Pro Plan'
  }, {
    id: '5',
    date: '2024-05-01',
    invoiceNumber: 'INV-2024-005',
    zohoInvoiceUrl: 'https://books.zoho.com/app/60009969114#/invoices/123456793',
    status: 'failed',
    dueDate: '2024-05-15',
    amount: 99.99,
    description: 'Monthly Subscription - Pro Plan'
  }];
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const getStatusChip = (status: Invoice['status']) => {
    const statusConfig = {
      paid: {
        label: 'Paid',
        color: 'success' as const,
        icon: <CheckCircleIcon fontSize="small" />
      },
      pending: {
        label: 'Pending',
        color: 'warning' as const,
        icon: <ScheduleIcon fontSize="small" />
      },
      overdue: {
        label: 'Overdue',
        color: 'error' as const,
        icon: <WarningIcon fontSize="small" />
      },
      failed: {
        label: 'Failed',
        color: 'error' as const,
        icon: <ErrorIcon fontSize="small" />
      }
    };
    const config = statusConfig[status];
    return <Chip label={config.label} color={config.color} size="small" icon={config.icon} variant="filled" sx={{
      fontWeight: 600,
      fontSize: {
        xs: '0.7rem',
        sm: '0.75rem'
      },
      height: {
        xs: 24,
        sm: 28
      }
    }} />;
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
  const summaryStats = [{
    title: 'Total Paid',
    value: '$199.98',
    subtitle: '2 invoices paid',
    icon: <PaymentIcon />,
    color: 'success.main'
  }, {
    title: 'Pending',
    value: '$99.99',
    subtitle: '1 invoice pending',
    icon: <ScheduleIcon />,
    color: 'warning.main'
  }, {
    title: 'Overdue',
    value: '$99.99',
    subtitle: '1 invoice overdue',
    icon: <WarningIcon />,
    color: 'error.main'
  }, {
    title: 'Total Invoices',
    value: invoices.length.toString(),
    subtitle: 'All time',
    icon: <ReceiptIcon />,
    color: 'primary.main'
  }];
  const MobileInvoiceCard = ({
    invoice
  }: {
    invoice: Invoice;
  }) => {
    const isExpanded = expandedCard === invoice.id;
    return <Card sx={{
      mb: 2,
      borderRadius: 2
    }}>
        <CardContent sx={{
        p: {
          xs: 1.5,
          sm: 2
        }
      }}>
          <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1
        }}>
            <Box sx={{
            minWidth: 0,
            flex: 1
          }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{
              fontSize: {
                xs: '0.9rem',
                sm: '1rem'
              },
              wordBreak: 'break-word'
            }}>
                {invoice.invoiceNumber}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{
              fontSize: {
                xs: '0.7rem',
                sm: '0.75rem'
              }
            }}>
                {formatDate(invoice.date)}
              </Typography>
            </Box>
            <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexShrink: 0
          }}>
              <Typography variant="h6" fontWeight={600} color="primary.main" sx={{
              fontSize: {
                xs: '1rem',
                sm: '1.25rem'
              }
            }}>
                {formatAmount(invoice.amount)}
              </Typography>
              <Button size="small" onClick={() => setExpandedCard(isExpanded ? null : invoice.id)} sx={{
              minWidth: 'auto',
              p: 0.5
            }}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Button>
            </Box>
          </Box>
          
          <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
          flexWrap: 'wrap',
          gap: 1
        }}>
            {getStatusChip(invoice.status)}
            <Typography variant="caption" color="text.secondary" sx={{
            fontSize: {
              xs: '0.7rem',
              sm: '0.75rem'
            }
          }}>
              Due: {formatDate(invoice.dueDate)}
            </Typography>
          </Box>
          
          <Collapse in={isExpanded}>
            <Box sx={{
            mt: 2,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
              <Typography variant="body2" color="text.secondary" sx={{
              mb: 2,
              fontSize: {
                xs: '0.8rem',
                sm: '0.875rem'
              }
            }}>
                {invoice.description}
              </Typography>
              <Box sx={{
              display: 'flex',
              gap: 1,
              flexDirection: {
                xs: 'column',
                sm: 'row'
              }
            }}>
                <Button size="small" variant="outlined" startIcon={<OpenInNewIcon />} component={Link} href={invoice.zohoInvoiceUrl} target="_blank" rel="noopener noreferrer" sx={{
                flex: 1,
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem'
                }
              }}>
                  View
                </Button>
                <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={() => console.log('Download PDF for', invoice.invoiceNumber)} sx={{
                flex: 1,
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem'
                }
              }}>
                  Download
                </Button>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>;
  };
  return <Box sx={{
    width: '100%',
    maxWidth: '100%',
    minHeight: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  }}>
      <Container maxWidth="xl" sx={{
      flex: 1,
      overflow: 'auto',
      p: {
        xs: 1,
        sm: 2,
        md: 3
      }
    }}>
        

        {/* Summary Cards - Responsive Grid */}
        <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        },
        gap: {
          xs: 1.5,
          sm: 2,
          md: 3
        },
        mb: {
          xs: 3,
          md: 4
        }
      }}>
          {summaryStats.map((stat, index) => <Card key={index} sx={{
          height: '100%',
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4
          }
        }}>
              <CardContent sx={{
            p: {
              xs: 1.5,
              sm: 2,
              md: 2.5
            },
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
                <Box sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
              gap: {
                xs: 0.5,
                sm: 1
              }
            }}>
                  <Box sx={{
                color: stat.color,
                flexShrink: 0,
                '& svg': {
                  fontSize: {
                    xs: '1.2rem',
                    sm: '1.5rem'
                  }
                }
              }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{
                fontSize: {
                  xs: '0.7rem',
                  sm: '0.8rem',
                  md: '0.9rem'
                },
                lineHeight: 1.2,
                wordBreak: 'break-word'
              }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{
              color: stat.color,
              fontWeight: 700,
              fontSize: {
                xs: '1.1rem',
                sm: '1.4rem',
                md: '1.8rem'
              },
              mb: 0.5
            }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{
              fontSize: {
                xs: '0.65rem',
                sm: '0.7rem',
                md: '0.75rem'
              },
              lineHeight: 1.2
            }}>
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>)}
        </Box>

        {/* Invoice History */}
        <Paper elevation={2} sx={{
        borderRadius: 2,
        overflow: 'hidden',
        width: '100%',
        minWidth: 0
      }}>
          <Box sx={{
          p: {
            xs: 2,
            sm: 2.5,
            md: 3
          },
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
            <Typography variant="h6" sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: {
              xs: '1rem',
              sm: '1.1rem',
              md: '1.25rem'
            }
          }}>
              <CreditCardIcon color="primary" />
              Payment History
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{
            mt: 0.5,
            fontSize: {
              xs: '0.8rem',
              sm: '0.875rem'
            }
          }}>
              View and manage your subscription payments
            </Typography>
          </Box>

          {useCardView ?
        // Card View for mobile and tablet
        <Box sx={{
          p: {
            xs: 1.5,
            sm: 2
          }
        }}>
              {paginatedInvoices.map(invoice => <MobileInvoiceCard key={invoice.id} invoice={invoice} />)}
            </Box> :
        // Desktop Table View
        <Box sx={{
          width: '100%',
          overflow: 'hidden'
        }}>
              <TableContainer sx={{
            maxHeight: '60vh',
            width: '100%'
          }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{
                    fontWeight: 600,
                    minWidth: 100
                  }}>Date</TableCell>
                      <TableCell sx={{
                    fontWeight: 600,
                    minWidth: 120
                  }}>Invoice</TableCell>
                      <TableCell sx={{
                    fontWeight: 600,
                    minWidth: 80
                  }}>Status</TableCell>
                      <TableCell sx={{
                    fontWeight: 600,
                    minWidth: 100
                  }}>Due Date</TableCell>
                      <TableCell align="right" sx={{
                    fontWeight: 600,
                    minWidth: 80
                  }}>Amount</TableCell>
                      <TableCell align="center" sx={{
                    fontWeight: 600,
                    minWidth: 100
                  }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedInvoices.map(invoice => <TableRow key={invoice.id} hover>
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
                          <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 1
                    }}>
                            <Tooltip title="View in Zoho">
                              <IconButton size="small" component={Link} href={invoice.zohoInvoiceUrl} target="_blank" rel="noopener noreferrer" color="primary">
                                <OpenInNewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download PDF">
                              <IconButton size="small" color="primary" onClick={() => console.log('Download PDF for', invoice.invoiceNumber)}>
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>}

          <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={invoices.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} sx={{
          backgroundColor: '#FFFFFF',
          color: '#000000',
          borderTop: '1px solid #e0e0e0',
          '& .MuiTablePagination-toolbar': {
            px: {
              xs: 1,
              sm: 1.5,
              md: 2
            },
            backgroundColor: '#FFFFFF',
            flexWrap: 'wrap',
            minHeight: {
              xs: 'auto',
              md: 52
            }
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
              md: '1rem'
            },
            color: '#000000',
            margin: {
              xs: '4px 0',
              md: 0
            }
          },
          '& .MuiTablePagination-select': {
            color: '#000000',
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem'
            },
            backgroundColor: '#FFFFFF'
          },
          '& .MuiTablePagination-actions': {
            color: '#000000',
            ml: {
              xs: 0,
              md: 1
            }
          },
          '& .MuiIconButton-root': {
            color: '#000000',
            padding: {
              xs: '4px',
              md: '8px'
            },
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          },
          '& .MuiSelect-root': {
            color: '#000000',
            backgroundColor: '#FFFFFF'
          },
          '& .MuiSelect-icon': {
            color: '#000000'
          }
        }} />
        </Paper>

        {/* Alert for Overdue/Failed Invoices */}
        {invoices.some(invoice => invoice.status === 'overdue' || invoice.status === 'failed') && <Alert severity="warning" sx={{
        mt: 3,
        borderRadius: 2,
        '& .MuiAlert-message': {
          fontSize: {
            xs: '0.8rem',
            sm: '0.875rem',
            md: '1rem'
          }
        }
      }}>
            <Typography variant="body2" sx={{
          fontWeight: 600,
          mb: 1,
          fontSize: {
            xs: '0.8rem',
            sm: '0.875rem'
          }
        }}>
              Action Required
            </Typography>
            <Typography variant="body2" sx={{
          fontSize: {
            xs: '0.8rem',
            sm: '0.875rem'
          }
        }}>
              You have overdue or failed payments. Please update your payment method to continue using S10.AI services without interruption.
            </Typography>
          </Alert>}
      </Container>
    </Box>;
};
export default BillingHistory;