import React, { useState, useEffect } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [userPayments, setUserPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        if (isAdmin) {
          // Fetch Admin metrics
          const response = await api.get('/admin/stats');
          setStats(response.data);
        } else {
          // Fetch User subscription details & payment history
          const [subRes, historyRes] = await Promise.all([
            api.get('/subscriptions/active'),
            api.get('/subscriptions/history')
          ]);
          setActiveSub(subRes.data);
          setUserPayments(historyRes.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard metrics. Check server connection or MongoDB database.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-indigo-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Helper: calculate days remaining on subscription
  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const diffTime = new Date(endDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // ADMIN DASHBOARD
  if (isAdmin) {
    return (
      <div className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Users</p>
                <h3 className="text-3xl font-extrabold text-white mt-2 group-hover:text-indigo-400 transition-colors">
                  {stats?.totalUsers ?? 0}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[11px] text-gray-400">
              <span className="text-emerald-400 font-bold">100%</span>
              <span>registered clients</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Subscriptions</p>
                <h3 className="text-3xl font-extrabold text-white mt-2 group-hover:text-purple-400 transition-colors">
                  {stats?.activeSubscriptions ?? 0}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Activity className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[11px] text-gray-400">
              <span className="text-emerald-400 font-bold">Active</span>
              <span>recurring billings</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                <h3 className="text-3xl font-extrabold text-white mt-2 group-hover:text-emerald-400 transition-colors">
                  ${stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[11px] text-gray-400">
              <span className="text-emerald-400 font-bold">USD</span>
              <span>historical totals</span>
            </div>
          </div>
        </div>

        {/* Recent Payments Table */}
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Transactions</h3>
            <Link to="/history" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors">
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-gray-400 text-xs font-semibold border-b border-white/5">
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Plan</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Invoice</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {stats?.recentPayments?.length > 0 ? (
                  stats.recentPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-white/[0.02] transition-colors text-gray-300">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{payment.userId?.name || 'Deleted User'}</div>
                        <div className="text-[11px] text-gray-500">{payment.userId?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-white">{payment.planId?.name || 'Custom'}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">{payment.invoiceNumber}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // USER DASHBOARD
  const totalSpent = userPayments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Plan</p>
              <h3 className="text-2xl font-extrabold text-white mt-2">
                {activeSub ? activeSub.planId?.name : 'Free Tier'}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {activeSub ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="h-3 w-3" /> Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                <AlertCircle className="h-3 w-3" /> Not Subscribed
              </span>
            )}
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Days Remaining</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">
                {activeSub ? getDaysRemaining(activeSub.endDate) : 0}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-4 leading-none">
            {activeSub 
              ? `Renews on ${new Date(activeSub.endDate).toLocaleDateString()}` 
              : 'Subscribe to a plan to start'}
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Billing</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">
                ${totalSpent.toFixed(2)}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-[11px] text-gray-400">
            <span>Across</span>
            <span className="text-white font-semibold">{userPayments.length} invoices</span>
          </div>
        </div>
      </div>

      {/* Subscription Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Subscription Summary</h3>
            {activeSub ? (
              <div className="space-y-4 mt-4 text-gray-300">
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-lg">{activeSub.planId?.name} Plan</h4>
                    <span className="text-xs text-indigo-400 font-medium">Billed ${activeSub.planId?.price}/{activeSub.planId?.billingCycle}</span>
                  </div>
                  <span className="text-2xl font-black text-white">${activeSub.planId?.price}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="block text-gray-400 font-medium mb-1">Start Date</span>
                    <strong className="text-white text-sm">{new Date(activeSub.startDate).toLocaleDateString(undefined, {dateStyle: 'medium'})}</strong>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="block text-gray-400 font-medium mb-1">Expiration/Renewal Date</span>
                    <strong className="text-white text-sm">{new Date(activeSub.endDate).toLocaleDateString(undefined, {dateStyle: 'medium'})}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400">
                <p className="mb-4 text-sm">You are not currently subscribed to any plan.</p>
                <Link 
                  to="/plans" 
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all cursor-pointer"
                >
                  Explore Premium Plans
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Feature List of active plan */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Plan Features</h3>
          {activeSub ? (
            <ul className="space-y-2.5">
              {activeSub.planId?.features?.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                  <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-xs text-gray-500">
              No active features. Subscribing unlocks standard access.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
