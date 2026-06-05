const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const Payment = require('../models/Payment');

// @desc    Subscribe to a plan (Mock checkout)
// @route   POST /api/subscriptions
// @access  Private
const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: 'Plan ID is required' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Cancel any existing active subscriptions
    await Subscription.updateMany(
      { userId: req.user._id, status: 'active' },
      { status: 'expired' }
    );

    // Calculate billing end date
    const startDate = new Date();
    const endDate = new Date();
    if (plan.billingCycle === 'yearly') {
      endDate.setFullYear(startDate.getFullYear() + 1);
    } else {
      endDate.setMonth(startDate.getMonth() + 1);
    }

    // Create Subscription
    const subscription = await Subscription.create({
      userId: req.user._id,
      planId: plan._id,
      status: 'active',
      startDate,
      endDate,
    });

    // Create Payment record
    const payment = await Payment.create({
      userId: req.user._id,
      subscriptionId: subscription._id,
      planId: plan._id,
      amount: plan.price,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'Card (Mock)',
    });

    res.status(201).json({
      message: 'Subscribed successfully',
      subscription,
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel active subscription
// @route   POST /api/subscriptions/cancel
// @access  Private
const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: 'active',
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found to cancel' });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    res.json({
      message: 'Subscription cancelled successfully',
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user active subscription
// @route   GET /api/subscriptions/active
// @access  Private
const getActiveSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: 'active',
    }).populate('planId');

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user billing history (payments)
// @route   GET /api/subscriptions/history
// @access  Private
const getBillingHistory = async (req, res) => {
  try {
    const history = await Payment.find({ userId: req.user._id })
      .populate('planId')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  subscribeToPlan,
  cancelSubscription,
  getActiveSubscription,
  getBillingHistory,
};
