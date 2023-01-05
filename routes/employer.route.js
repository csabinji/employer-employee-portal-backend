const controller = require('../controllers/employer.controller');
const { authEmployer } = require("../middlewares/auth")

module.exports = (router) => {
    router.post('/employer/login', controller.login);
    router.post('/add/employee', authEmployer, controller.addEmployee)
}