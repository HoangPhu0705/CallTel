const express = require('express');
const router = express.Router();
const StaffController = require('../app/controllers/StaffController');
const CustomerController = require('../app/controllers/CustomerController');



router.get('/',StaffController.default);
router.get('/home', StaffController.index);
router.get('/products', StaffController.products);
router.get('/profile', StaffController.viewProfile);
router.post('/update-staff-profile-image', StaffController.updateProfileImage);
router.get('/tranaction',StaffController.tranaction);
router.get('/preview',StaffController.previewInvoice);
router.get('/edit/:id',StaffController.editGet);
router.post('/change-password', StaffController.changePassword);
router.post('/add',StaffController.addProductData);
router.post('/edit/:id',StaffController.editPost);
router.get('/remove/:id',StaffController.removeProduct);
router.post('/invoice',StaffController.createInvoice);
router.get('/invoice/:id',StaffController.invoice);
router.get('/tranaction/:id',StaffController.invoiceUpdate);
router.post('/invoice/:id',StaffController.invoiceEdit);
router.get('/customers', CustomerController.getCustomer);
router.get('/customers/:id',CustomerController.getCustomerInvoice);

module.exports = router;