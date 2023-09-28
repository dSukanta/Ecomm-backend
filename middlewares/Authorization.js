const { User } = require("../models/userModel");
const { verifyToken } = require("../utils/helper");


const Authorization = (roles)=>{
    
    return async (req,res,next)=>{
        const user= req.body;

        const Exist= await User.findOne({email:user?.email});

        if(Array.isArray(roles)){
            if(roles.includes(Exist.userType)){
                next()
            }else{
                res.status(401).send("You are not Authorized.For more details contact us")
            }
        }else{
            if(roles===Exist.userType){
                next()
            }else{
                res.status(401).send("You are not Authorized.For more details contact us")
            }
        }
    }
}


module.exports={Authorization}