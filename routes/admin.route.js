const controller = require('../controllers/admin.controller');

module.exports = (router) => {
    router.post('/admin/register', controller.addAdmin);
};

