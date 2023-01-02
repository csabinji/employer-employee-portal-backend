const passport = require('passport');
const { User, AccessToken } = require('../models');
const BearerStrategy = require('passport-http-bearer').Strategy;

passport.use(
    new BearerStrategy(async (token, done) => {
        const accessToken = await AccessToken.findOne({ token }).lean().exec()

        if (!accessToken) {
            return done(null, false);
        }
        const user = await User.findById(accessToken[`user_id`]).lean().select({ full_name: 1, email: 1 }).lean().exec()
        accessToken['full_name'] = user['full_name'];
        accessToken['email'] = user['email'];
        return done(null, accessToken, { scope: 'read' });
    })
);

module.exports = passport;
