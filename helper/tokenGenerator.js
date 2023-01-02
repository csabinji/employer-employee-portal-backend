const moment = require('moment');
const crypto = require('crypto');
const { ACCESS_TOKEN_LIFETIME } = require('../config/env');
const { AccessToken } = require('../models');

module.exports = async (user) => {
    const { accessToken } = await getUniqueToken();
    const currentDate = moment();
    const accessTokenLifeTime = moment(currentDate).add(
        ACCESS_TOKEN_LIFETIME,
        'd'
    );

    const aToken = new AccessToken({
        token: accessToken,
        user_id: user._id,
        expires_at: accessTokenLifeTime,
    });
    await aToken.save();

    return {
        user,
        token: aToken.token,
        expires_at: accessToken.expires_at,
        token_type: 'Bearer',
    };
};

/**
 */
const getUniqueToken = async () => {
    const accessToken = crypto.randomBytes(32).toString(`hex`);

    const aToken = await AccessToken.findOne({ token: accessToken });
    if (!aToken) {
        return {
            accessToken,
        };
    } else {
        getUniqueToken();
    }
};

