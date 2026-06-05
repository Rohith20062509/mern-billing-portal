import React, { useState, useEffect } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { Download, FileText, Search } from 'lucide-react';
import { printInvoice } from '../utils/invoicePrinter';

const History = () => {
  const { user, isAdmin } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError('');
        
        let response;
        if (isAdmin) {
          response = await api.get('/admin/payments');
        } else {
          response = await api.get('/subscriptions/history');
        }
        setPayments(response.data);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Could not retrieve payment records. Confirm database connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isAdmin]);

  const handlePrint = (payment) => {
    // If admin is viewing, pass the user object of that specific payment
    const invoiceUser = isAdmin ? payment.userId : user;
    printInvoice(payment, invoiceUser);
  };

  // Filter payments based on search (Admin can search by customer email/name or invoice no)
  const filteredPayments = payments.filter((payment) => {
    const term = searchTerm.toLowerCase();
    const invoiceMatch = payment.invoiceNumber?.toLowerCase().includes(term);
    const planMatch = payment.planId?.name?.toLowerCase().includes(term);
    
    if (isAdmin) {
      const nameMatch = payment.userId?.name?.toLowerCase().includes(term);
      const emailMatch = payment.userId?.email?.toLowerCase().includes(term);
      return invoiceMatch || planMatch || nameMatch || emailMatch;
    }
    
    return invoiceMatch || planMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-indigo-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Title & Search bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {isAdmin ? 'System Billing Log' : 'Your Payment History'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {isAdmin ? 'Audit and track all invoice receipts.' : 'Download previous invoices for tax records.'}
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder={isAdmin ? "Search name, email, invoice..." : "Search invoice, plan..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-gray-400 text-xs font-semibold border-b border-white/5">
                <th className="px-6 py-3.5">Invoice ID</th>
                {isAdmin && <th className="px-6 py-3.5">Customer</th>}
                <th className="px-6 py-3.5">Plan Name</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Date Paid</th>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-white/[0.01] transition-colors text-gray-300">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-400">
                      {payment.invoiceNumber}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{payment.userId?.name || 'Deleted User'}</div>
                        <div className="text-[11px] text-gray-500">{payment.userId?.email || 'N/A'}</div>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className="font-medium text-white">{payment.planId?.name || 'Custom Plan'}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(payment.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handlePrint(payment)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 text-xs font-semibold transition-all cursor-pointer"
                        title="Print PDF Invoice"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="text-center py-12 text-gray-500 text-sm">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
