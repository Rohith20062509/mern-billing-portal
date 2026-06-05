const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');

// @desc    Get Admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Users (excluding admins)
    const totalUsers = await User.countDocuments({ role: 'user' });

    // 2. Active Subscriptions
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

    // 3. Revenue Summary (Sum of all completed payments)
    const revenueResult = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // 4. Recent Payments (latest 5)
    const recentPayments = await Payment.find()
      .populate('userId', 'name email')
      .populate('planId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      activeSubscriptions,
      totalRevenue,
      recentPayments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payment records
// @route   GET /api/admin/payments
// @access  Private/Admin
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .populate('planId', 'name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllPayments,
};
