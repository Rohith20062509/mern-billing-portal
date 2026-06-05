import React, { useState, useEffect } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { Check, Plus, Trash2, ShieldAlert, Sparkles, Layers } from 'lucide-react';

const Plans = () => {
  const { user, isAdmin } = useAuth();
  const [plans, setPlans] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Admin Create Plan form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [features, setFeatures] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const plansRes = await api.get('/plans');
      setPlans(plansRes.data);

      if (!isAdmin) {
        const subRes = await api.get('/subscriptions/active');
        setActiveSub(subRes.data);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Could not retrieve plans. Ensure your backend and MongoDB are active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  // Handle subscribe action (User only)
  const handleSubscribe = async (planId) => {
    try {
      setError('');
      setSuccess('');
      const response = await api.post('/subscriptions', { planId });
      setSuccess(`Successfully subscribed to the ${response.data.subscription.status === 'active' ? 'new' : ''} plan!`);
      fetchData(); // reload data
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.response?.data?.message || 'Failed to complete subscription purchase.');
    }
  };

  // Handle plan deactivation (Admin only)
  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to deactivate this subscription plan?')) return;
    try {
      setError('');
      await api.delete(`/plans/${planId}`);
      setSuccess('Plan deactivated successfully!');
      fetchData();
    } catch (err) {
      setError('Failed to deactivate plan.');
    }
  };

  // Handle create plan (Admin only)
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!name || !price || !features) {
      return setError('Please fill in all plan details');
    }

    try {
      setError('');
      setSuccess('');
      
      await api.post('/plans', {
        name,
        price: parseFloat(price),
        billingCycle,
        features: features.split(',').map(f => f.trim()),
      });

      setSuccess('Plan created successfully!');
      setName('');
      setPrice('');
      setFeatures('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create plan.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-indigo-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {success}
        </div>
      )}

      {/* PLAN OPTIONS SHOWCASE */}
      <div>
        <div className="text-center max-w-md mx-auto mb-8">
          <h3 className="text-xl font-bold text-white">Subscription Offerings</h3>
          <p className="text-xs text-gray-400 mt-1">Choose the tier that best matches your workflow scale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = activeSub?.planId?._id === plan._id;
            return (
              <div 
                key={plan._id} 
                className={`glass-panel p-6 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden duration-300 ${
                  isCurrentPlan 
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30' 
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* Popular Badge effect */}
                {plan.name === 'Pro' && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-[10px] font-black tracking-widest text-white uppercase px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Preferred
                  </div>
                )}

                <div>
                  <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                  <div className="flex items-baseline gap-1 mt-4 mb-5">
                    <span className="text-4xl font-extrabold text-white">${plan.price}</span>
                    <span className="text-xs text-gray-400 font-medium">/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>

                  <ul className="space-y-3 border-t border-white/5 pt-5 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {isAdmin ? (
                    <button
                      onClick={() => handleDeletePlan(plan._id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" /> Deactivate Plan
                    </button>
                  ) : isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider cursor-default"
                    >
                      Your Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan._id)}
                      className="w-full btn-glow py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      Subscribe Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADMIN CONSOLE: PLAN CREATOR FORM */}
      {isAdmin && (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 max-w-xl mx-auto">
          <div className="flex items-center gap-2 mb-6 text-purple-400">
            <Layers className="h-5 w-5" />
            <h3 className="font-bold text-white">Create New Subscription Plan</h3>
          </div>

          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g. Starter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Price (USD)</label>
                <input
                  type="number"
                  placeholder="e.g. 19"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Billing Cycle</label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
                className="w-full bg-[#111625] border border-white/10 focus:border-indigo-500/50 rounded-xl py-2.5 px-4 text-xs text-white outline-none cursor-pointer"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Features (Comma separated)</label>
              <textarea
                placeholder="e.g. 10 Active Projects, 24/7 Email Support, Export reports"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl py-2.5 px-4 text-xs text-white outline-none min-h-[80px]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Create Plan
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Plans;
