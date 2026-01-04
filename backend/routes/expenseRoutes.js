const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .populate('category', 'name color icon type')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
router.post('/', protect, async (req, res) => {
  const {
    amount,
    category, // Category ID
    date,
    paymentMethod,
    transactionId,
    payee,
    notes,
    isRecurring
  } = req.body;

  try {
    const expense = new Expense({
      user: req.user._id,
      amount,
      category,
      date,
      paymentMethod,
      transactionId,
      payee,
      notes,
      isRecurring
    });

    const createdExpense = await expense.save();
    // Populate category info for immediate frontend update
    const populated = await createdExpense.populate('category', 'name color icon type');
    
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

    if (expense) {
      await expense.deleteOne(); // or findByIdAndDelete
      res.json({ message: 'Expense removed' });
    } else {
      res.status(404).json({ message: 'Expense not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
