const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_image: {
    type: String,
    default: "https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png",
  },
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  phone_no: { type: String, required: true},
  password: { type: String, required: true },
  userType: { type: String, default: "customer" },
  restPasswordToken: { type: String, default:null},
});


const User = mongoose.model('user',userSchema);

module.exports={User}
