const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    product:{type:mongoose.Types.ObjectId,ref:'product', required:true},
    user:{type:mongoose.Types.ObjectId,ref:'user',required:true},
    quantity:{type:String,required:true,default:"1"},
});


const Cart = mongoose.model('cart',cartSchema);

module.exports={Cart}
