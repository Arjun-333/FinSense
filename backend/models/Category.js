const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    default: 'expense',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // If null, it's a global category
  },
  color: {
    type: String, // Hex code or generic color name
    default: '#6366F1', // Indigo
  },
  icon: {
    type: String, // Icon key from Lucide
    default: 'Tag',
  }
}, {
  timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
