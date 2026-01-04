const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/authMiddleware');

const DEFAULT_CATEGORIES = [
  { name: 'Food', type: 'expense', color: '#EF4444', icon: 'Utensils' },
  { name: 'Travel', type: 'expense', color: '#F59E0B', icon: 'Car' },
  { name: 'Entertainment', type: 'expense', color: '#8B5CF6', icon: 'Film' },
  { name: 'Bills', type: 'expense', color: '#3B82F6', icon: 'Receipt' },
  { name: 'Shopping', type: 'expense', color: '#EC4899', icon: 'ShoppingBag' },
  { name: 'Health', type: 'expense', color: '#10B981', icon: 'Activity' },
  { name: 'Salary', type: 'income', color: '#22C55E', icon: 'Banknote' },
  { name: 'Investment', type: 'income', color: '#6366F1', icon: 'TrendingUp' },
];

// @desc    Get all categories (defaults + user custom)
// @route   GET /api/categories
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Find defaults (no user) OR user specific
    const categories = await Category.find({
      $or: [{ user: null }, { user: req.user._id }],
    });
    
    // If no defaults exist in DB, seed them
    const defaultCount = await Category.countDocuments({ user: null });
    if (defaultCount === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      // refetch
      const seeded = await Category.find({
        $or: [{ user: null }, { user: req.user._id }],
      });
      return res.json(seeded);
    }

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create custom category
// @route   POST /api/categories
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, type, color, icon } = req.body;
  try {
    const category = new Category({
      user: req.user._id,
      name,
      type,
      color,
      icon
    });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete custom category
// @route   DELETE /api/categories/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Only allow deleting user-created categories, not defaults (user: null)
        if (!category.user || category.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Cannot delete default categories' });
        }

        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
