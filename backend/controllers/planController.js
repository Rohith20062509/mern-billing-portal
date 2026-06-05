const Plan = require('../models/Plan');

// @desc    Get all active subscription plans
// @route   GET /api/plans
// @access  Public
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ active: true });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a subscription plan
// @route   POST /api/plans
// @access  Private/Admin
const createPlan = async (req, res) => {
  try {
    const { name, price, billingCycle, features } = req.body;

    if (!name || price === undefined || !features) {
      return res.status(400).json({ message: 'Please provide name, price, and features' });
    }

    // Check if plan name already exists
    const planExists = await Plan.findOne({ name });
    if (planExists) {
      return res.status(400).json({ message: 'Plan name already exists' });
    }

    const plan = await Plan.create({
      name,
      price,
      billingCycle: billingCycle || 'monthly',
      features: Array.isArray(features) ? features : features.split(',').map(f => f.trim()),
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a subscription plan
// @route   PUT /api/plans/:id
// @access  Private/Admin
const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const { name, price, billingCycle, features, active } = req.body;

    if (name) plan.name = name;
    if (price !== undefined) plan.price = price;
    if (billingCycle) plan.billingCycle = billingCycle;
    if (features) {
      plan.features = Array.isArray(features) ? features : features.split(',').map(f => f.trim());
    }
    if (active !== undefined) plan.active = active;

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete/Deactivate a plan
// @route   DELETE /api/plans/:id
// @access  Private/Admin
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Instead of hard deleting, we soft-delete by deactivating it
    plan.active = false;
    await plan.save();

    res.json({ message: 'Plan deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
};
