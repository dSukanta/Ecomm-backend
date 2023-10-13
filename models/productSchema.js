const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    image:{type:Array,required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:String,required:true},
    category:{type:String,required:true},
    stocks:{type:String,required:true},
    color:{type:String,required:false},
    sizes:{type:String,required:false},
    discount:{type:String,required:false},
    rating:{type:String,required:false},
    ratingCount:{type:String,required:false},
    addedBy:{type:mongoose.Types.ObjectId,ref:'User'},
});


const Product = mongoose.model('cart',productSchema);

module.exports={Product}