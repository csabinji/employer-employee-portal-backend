const controller = require('../controllers/employer.controller');
const { authEmployer } = require("../middlewares/auth")

module.exports = (router) => {
    router.post('/employer/login', controller.login);
    router.post('/employee/add', authEmployer, controller.addEmployee);
    router.get('/employee/list', authEmployer, controller.listEmployee);
    router.put('/employee/update/:id', authEmployer, controller.updateEmployeeInfo);
}