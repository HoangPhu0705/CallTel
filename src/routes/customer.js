const express = require('express');
const router = express.Router();
const CustomerController = require('../app/controllers/CustomerController');

router.get('/search',CustomerController.getByPhoneNumber);



module.exports = router;