const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    
});


const Cart = mongoose.model('cart',cartSchema);

module.exports={Cart}
