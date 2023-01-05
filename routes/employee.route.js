const controller = require('../controllers/employee.controller');
const { authEmployee } = require("../middlewares/auth")

module.exports = (router) => {
    router.post('/employee/login', controller.login);
    router.get('/employee/get', authEmployee, controller.getEmployee);
}