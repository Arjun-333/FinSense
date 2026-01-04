const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).populate('category');
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Set/Update budget for a category
// @route   POST /api/budgets
// @access  Private
router.post('/', protect, async (req, res) => {
  const { category, amount } = req.body;

  try {
    // Check if budget exists for this category
    let budget = await Budget.findOne({ user: req.user._id, category });

    if (budget) {
      budget.amount = amount;
      await budget.save();
      res.json(budget);
    } else {
      budget = new Budget({
        user: req.user._id,
        category,
        amount,
      });
      await budget.save();
      res.status(201).json(budget);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
