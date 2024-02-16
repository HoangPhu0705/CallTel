const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');
const CustomerController = require('../app/controllers/CustomerController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB file size limit
    }
});


router.get('/', adminController.default);
router.get('/home', adminController.register);
router.get('/add', adminController.addProduct);
router.get('/employees', adminController.viewStaff);
router.get('/employees/:id', adminController.viewStaffDetails);
router.get('/profile', adminController.viewProfile);
router.get('/invoice', adminController.register);
router.post('/update-profile-image', adminController.updateProfileImage);
router.get('/products', adminController.products);
router.post('/change-password', adminController.changePassword);
router.post('/lock/:id', adminController.lockAccount);
router.post('/resetpass/:id', adminController.resetPasword);
router.post('/registerStaff', adminController.createStaff);
router.post('/add', adminController.addProductData);
router.get('/remove/:id', adminController.removeProduct);
router.get('/edit/:id', adminController.editGet);
router.post('/edit/:id', adminController.editPost);
router.get('/invoice/:id', CustomerController.invoice);
router.get('/customers', CustomerController.adminGetCustomer);
router.get('/customers/:id', CustomerController.adminGetCustomerInvoice);

// router.post('/edit/:id',adminController.editPost);
module.exports = router;