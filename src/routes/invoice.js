const express = require('express');
const InvoiceController = require('../app/controllers/InvoiceController');
const router = express.Router();




router.get('/', InvoiceController.getAllInvoices);
router.post('/', InvoiceController.createInvoice);
router.get('/staff/:staffId', InvoiceController.getInvoicesByStaff);
router.get('/customer/:customerId', InvoiceController.getInvoicesByCustomer);
router.get('/date', InvoiceController.getInvoicesByDate);
router.get('/last-week', InvoiceController.getInvoicesInLastWeek);
router.get('/date-range', InvoiceController.getInvoicesInDateRange);
router.get('/yesterday', InvoiceController.getInvoicesFromYesterday);
router.get('/today', InvoiceController.getInvoiceToday);
router.put('/:invoiceId', InvoiceController.updateInvoice);
router.get('/:invoiceId', InvoiceController.getInvoiceById);


module.exports = router;