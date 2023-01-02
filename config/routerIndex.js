const { Router } = require('express');
const passport = require('passport');
const adminRoute = require('../routes/admin.route');

module.exports = () => {
    const router = Router();
    adminRoute(router);
    return router;
};