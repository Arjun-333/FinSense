const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const { protect } = require('../middleware/authMiddleware');

// Get all goals
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create goal
router.post('/', protect, async (req, res) => {
  const { name, targetAmount, savedAmount, color, icon, deadline } = req.body;
  try {
    const goal = await Goal.create({
      user: req.user._id,
      name,
      targetAmount,
      savedAmount: savedAmount || 0,
      color,
      icon,
      deadline
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update goal (add savings)
router.put('/:id', protect, async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { savedAmount } = req.body;
        if (savedAmount !== undefined) goal.savedAmount = savedAmount;
        
        // Also allow updating other fields
        if (req.body.name) goal.name = req.body.name;
        if (req.body.targetAmount) goal.targetAmount = req.body.targetAmount;

        const updatedGoal = await goal.save();
        res.json(updatedGoal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete goal
router.delete('/:id', protect, async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        await goal.deleteOne();
        res.json({ message: 'Goal removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
