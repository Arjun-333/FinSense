const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  period: {
    type: String,
    enum: ['month'], // Simplified for now
    default: 'month',
  }
}, {
  timestamps: true,
});

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
