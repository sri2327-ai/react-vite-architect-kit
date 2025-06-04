
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

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

interface BillingStats {
  totalPaid: string;
  totalPending: string;
  totalOverdue: string;
  totalInvoices: number;
}

export const useBillingData = (useApi: boolean = false) => {
  const [invoices, setInvoices] = useState<Invoice[]>([
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
    }
  ]);
  const [stats, setStats] = useState<BillingStats>({
    totalPaid: '$199.98',
    totalPending: '$99.99',
    totalOverdue: '$99.99',
    totalInvoices: 3
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (useApi) {
      fetchBillingData();
    }
  }, [useApi]);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [invoicesData, statsData] = await Promise.all([
        apiService.get<Invoice[]>('/billing/invoices'),
        apiService.get<BillingStats>('/billing/stats')
      ]);
      setInvoices(invoicesData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch billing data');
      console.error('Billing fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    invoices,
    stats,
    loading,
    error,
    refetch: fetchBillingData
  };
};
