const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Always attach the default user for single-user mode
    // We import the util here or just query directly. 
    // Since this is middleware, querying directly is cleaner if we assume user exists.
    // However, let's use the one we ensured in server startup.
    
    // Find the default user directly
    const user = await User.findOne({ email: 'default@finsense.local' }).select('-password');

    if (user) {
        req.user = user;
        next();
    } else {
        // Fallback or Error if initialization failed
        res.status(500).json({ message: 'System Error: Default User not initialized' });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(500).json({ message: 'Server Error during Auth Override' });
  }
};

module.exports = { protect };
