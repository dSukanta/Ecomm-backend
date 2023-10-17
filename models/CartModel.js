const mongoose = require("mongoose");
const { User } = require("./userModel");
const { Product } = require("./productSchema");

const cartSchema = new mongoose.Schema({
    product:{type:mongoose.Types.ObjectId,ref:Product.modelName, required:true},
    user:{type:mongoose.Types.ObjectId,ref:User.modelName,required:true},
    quantity:{type:String,required:true,default:"1"},
});


const Cart = mongoose.model('cart',cartSchema);

module.exports={Cart}
