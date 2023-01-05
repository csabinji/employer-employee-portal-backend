const { Router } = require('express');
const adminRoute = require('../routes/admin.route');
const employerRoute = require('../routes/employer.route');

module.exports = () => {
    const router = Router();
    adminRoute(router);
    employerRoute(router);
    return router;
};