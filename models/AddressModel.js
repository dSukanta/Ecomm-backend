const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true},
  phone_no: { type: String, required: true},
  city:{type:String,require:true},
  locality:{type:String},
  district:{type:String, required:true},
  state:{type:String, require:true},
  pincode:{type:String, required:true},
  user: {type: mongoose.Types.ObjectId, ref: 'user'}
});


const Address = mongoose.model('address',addressSchema);

module.exports={Address}
