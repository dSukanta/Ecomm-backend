const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    title:{type:String, required:true},
    addedby:{type:mongoose.Types.ObjectId,ref:'user',required:true},
});


const Category = mongoose.model('category',categorySchema);

module.exports={Category}
