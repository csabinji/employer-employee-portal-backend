const moment = require('moment');
const { JWT_EXPIRATION, JWT_SECRET } = require('../config/env');
const jwt = require('jsonwebtoken');

module.exports = async (user) => {
    const payload = {
        exp: moment().add(JWT_EXPIRATION, 'days').unix(),
        iat: moment().unix(),
        sub: user['_id'],
    };
    let token = jwt.sign(payload, JWT_SECRET);
    return {
        name: user['name'],
        email: user['email'],
        token,
        tokenType: 'Bearer',
    }
}
