const responseHelper = require('../helper/responseHelper');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { Admin } = require('../models');

const auth = async (req, res, next, model) => {
    // Get the JWT from the request header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return responseHelper(false, 'UNAUTHORIZED', 401, '', {}, res);
    }
    try {
        // Verify the JWT
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find the user with the specified ID and exclude the password field
        const user = await model.findOne({ _id: decoded.sub }).select('-password');

        if (!user) return responseHelper(false, 'UNAUTHORIZED', 401, '', {}, res);
        
        next();
    } catch (error) {
        return responseHelper(false, 'UNAUTHORIZED', 401, '', {}, res);
    }
};

module.exports = {
    authAdmin: (req, res, next) => auth(req, res, next, Admin),
    authEmployer: (req, res, next) => auth(req, res, next, Employer),
    authEmployee: (req, res, next) => auth(req, res, next, Employee)
};