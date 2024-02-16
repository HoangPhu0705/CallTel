const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductInInvoiceSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true
    },
    total:{
        type: Number,
        required: true
    }
});

const InvoiceSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    staff: {
        type: Schema.Types.ObjectId,
        ref: 'Staff'
    },
    products: [ProductInInvoiceSchema], // Array of products with quantities
    totalAmount: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    dueTo:{
        type: Date,
        default: function() {
            return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); 
        }
    }
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;
