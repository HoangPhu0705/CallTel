const mongoose = require('mongoose');
async  function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/MobileStoreManager');
        console.log("Connect Successful ")
    } catch (error) {
        console.log(error)
    }
}
module.exports = {connect}