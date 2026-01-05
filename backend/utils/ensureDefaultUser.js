const User = require('../models/User');

const ensureDefaultUser = async () => {
    try {
        let user = await User.findOne({ email: 'default@finsense.local' });
        if (!user) {
            user = await User.create({
                name: 'User',
                email: 'default@finsense.local',
                password: 'password_not_needed_123' 
            });
            console.log('Default User Created');
        }
        return user;
    } catch (error) {
        console.error('Error ensuring default user:', error);
        return null;
    }
};

module.exports = ensureDefaultUser;
