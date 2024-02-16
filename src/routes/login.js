const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/AuthController');
const testController = require('../app/controllers/TestController');
const AdminController = require('../app/controllers/AdminController');
const middleware = require('../app/middleware/auth');

router.get('/',AuthController.default);
router.get('/test',testController.index);

router.route('/login')
.get( AuthController.index)
.post(AuthController.login);


router.route('/create-password')
.get( AdminController.createPasswordPage)
.post(AdminController.createPassword);

router.get('/login/:token',AdminController.firstLogin);
router.get('/logout',AuthController.logout);


module.exports = router;