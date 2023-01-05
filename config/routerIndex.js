const { Router } = require('express');
const adminRoute = require('../routes/admin.route');
const employerRoute = require('../routes/employer.route');
const employeeRoute = require('../routes/employee.route');

module.exports = () => {
    const router = Router();
    adminRoute(router);
    employerRoute(router);
    employeeRoute(router);
    return router;
};