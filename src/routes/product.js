const express = require('express');
const router = express.Router();
const ProductController = require('../app/controllers/ProductController');

router.get('/search',ProductController.searchByName);
router.get('/:id',ProductController.getProductById);


module.exports = router;