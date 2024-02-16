const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
const Customer = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: String,
        required: true,
        unique : true,
    },
    address: {
        type: String,
        required: true,
    },
    transactionHistories : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Invoice'
        }
    ],
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Customer', Customer)
