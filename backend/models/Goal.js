const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  savedAmount: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: '#10B981',
  },
  icon: {
    type: String,
    default: 'Target',
  },
  deadline: {
    type: Date,
  }
}, {
  timestamps: true,
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
