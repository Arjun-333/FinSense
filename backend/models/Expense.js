const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
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
  date: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'NetBanking', 'Other'],
    default: 'UPI',
  },
  transactionId: {
    type: String, // Specifically for UPI/Bank Ref
    required: false,
  },
  payee: {
    type: String, // Store name, Person name
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    default: 'expense',
    required: true
  },
  isRecurring: {
    type: Boolean, // Future recurring support
    default: false,
  },
  recurringFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: function() { return this.isRecurring; }
  }
}, {
  timestamps: true,
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
