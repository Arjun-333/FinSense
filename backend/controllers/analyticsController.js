const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// @desc    Get spending trends (last 7 days)
// @route   GET /api/analytics/trends
// @access  Private
const getTrends = async (req, res) => {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);

    const trends = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
          expense: { $sum: { $cond: [{ $ne: ["$type", "income"] }, "$amount", 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing dates
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(end.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = trends.find(t => t._id === dateStr);
      
      data.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        income: found ? found.income : 0,
        expense: found ? found.expense : 0,
        balance: found ? (found.income - found.expense) : 0,
        amount: found ? found.expense : 0 // Backward compat default
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get AI Insights
// @route   GET /api/analytics/insights
// @access  Private
const getInsights = async (req, res) => {
  try {
     // Simple rule-based "AI"
     const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 }).limit(20).populate('category');
     
     const hints = [];
     
     // 1. High Spending Alert
     const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
     if (total > 5000) {
        hints.push({ type: 'warning', message: `High spending alert! You've spent ₹${total} recently. 💸`, id: 1 });
     }

     // 2. Category specific
     const foodSpend = expenses.filter(e => e.category && e.category.name === 'Food').reduce((acc, curr) => acc + curr.amount, 0);
     if (foodSpend > 1000) {
         hints.push({ type: 'info', message: "Consider cooking at home to save on Food! 🍔", id: 2});
     }

     if (hints.length === 0) {
        hints.push({ type: 'positive', message: "Your spending seems controlled. Keep it up! 🌟", id: 3});
     }

     res.json(hints);

  } catch (error) {
     res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getTrends, getInsights };
