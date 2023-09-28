const { User } = require("../models/userModel");
const { verifyToken, comparePassword } = require("../utils/helper");


const ValidRegister= async(req,res,next)=>{
    const { name,email,phone_no,password,confirmPassword}= req.body;
    const isValidPhone = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(phone_no);
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
    var isValidName = /^[a-zA-Z ]{2,30}$/.test(name);
    const uniqueEmail= await User.findOne({email});

    if(!name){
        res.status(400).json({error:true, status:400, message:'Name is required'});
        return;
    };
    if(!email){
        res.status(400).json({error:true, status:400, message:'Email is required'});
        return;
    };
    if(!phone_no){
        res.status(400).json({error:true, status:400, message:'Phone no is required'});
        return;
    };
    if(!password){
        res.status(400).json({error:true, status:400, message:'Password is required'});
        return;
    };
    if(!confirmPassword){
        res.status(400).json({error:true, status:400, message:'Confirm password is required'});
        return;
    };
    if(password !== confirmPassword){
        res.status(400).json({error:true, status:400, message:'Password and confirm password must be same'});
        return;
    };
    if(!isValidName){
        res.status(400).json({error:true, status:400, message:'Name is invalid'});
        return;
    };
    if(!isValidPhone){
        res.status(400).json({error:true, status:400, message:'Phone number is invalid'});
        return;
    };
    if(!isValidEmail){
        res.status(400).json({error:true, status:400, message:'Email is invalid'});
        return;
    };
    if(uniqueEmail){
        res.status(409).json({error:true, status:409, message:'User Already Exist'});
        return;
    }
    next();
};


const validateChangePassword =async(req,res,next)=>{
    const token = req?.headers?.authorization?.split(' ')[1] ;
    const {oldPassword,newPassword,confirmNewPassword}= req.body;
    const {result} = await verifyToken(token);
    const ExistUser= await User.findOne({email:result?.user});
    const dbPass= ExistUser?.password;
    const checkLogin= comparePassword(oldPassword,dbPass);
    if(!token){
        res.status(401).json({error:true, status:401, message:'You are not authorized. Login to change your password.'});
        return;
    };
    if(!oldPassword){
        res.status(400).json({error:true, status:401, message:'Old password is required.'});
        return;
    };
    if(!newPassword){
        res.status(400).json({error:true, status:401, message:'New password is required.'});
        return;
    };
    if(!confirmNewPassword){
        res.status(400).json({error:true, status:401, message:'Confirm password is required.'});
        return;
    };
    if(newPassword !== confirmNewPassword){
        res.status(400).json({error:true, status:401, message:'New password and confirm password must be same.'});
        return;
    };
    if(!checkLogin.decrypt){
        res.status(404).json({error:true, status:404, message:'invalid Old password'});
        return;
    }
    next(); 
    
}


module.exports={ValidRegister, validateChangePassword}