const controller = require('../controllers/admin.controller');
const { authAdmin } = require('../middlewares/auth');

module.exports = (router) => {
    router.post('/admin/register', controller.addAdmin);
    router.post('/admin/login', controller.adminLogin);
    router.post('/add/employer', authAdmin, controller.addEmployer);
};

