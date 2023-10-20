const { User } = require("../models/userModel");
const { verifyToken } = require("../utils/helper");


const Authorization = (roles)=>{
    
    return async (req,res,next)=>{
        let user;
        if(req.body.email){
            user= req?.body?.email || "";
        }else if(req.headers.authorization){
            const token = req?.headers?.authorization?.split(' ')[1] ;
            const {result} = await verifyToken(token);
            user= result?.user || "";
        };
        if(user){
            const Exist= await User.findOne({email:user});
            if(Exist){
                if(Array.isArray(roles)){
                    if(roles.includes(Exist.userType)){
                        next()
                    }else{
                        res.status(401).json({error: true, status:401,message:`You are unauthorized.Only ${roles} can access.`})
                    }
                }else{
                    if(roles===Exist.userType){
                        next()
                    }else{
                        res.status(401).json({error: true, status:401,message:`You are unauthorized.Only ${roles} can access.`})
                    }
                }
            }else{
                res.status(404).json({error: true, status:404,message:`User not found`})
            }
        }else{
            res.status(404).json({error: true, status:404,message:`email/user not found or you are not allowed without exact token.`})
        }
    }
}


module.exports={Authorization}