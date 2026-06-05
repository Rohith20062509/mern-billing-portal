const express = require('express');
const router = express.Router();
const {
  subscribeToPlan,
  cancelSubscription,
  getActiveSubscription,
  getBillingHistory,
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All subscription routes require authentication

router.post('/', subscribeToPlan);
router.post('/cancel', cancelSubscription);
router.get('/active', getActiveSubscription);
router.get('/history', getBillingHistory);

module.exports = router;
