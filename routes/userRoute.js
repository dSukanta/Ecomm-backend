const express= require('express');
const { ValidRegister, validateChangePassword } = require('../middlewares/validation');
const { hashPassword, comparePassword, createToken, verifyToken } = require('../utils/helper');
const { User } = require('../models/userModel');
const { Authorization } = require('../middlewares/Authorization');


const userRoute= express.Router();

userRoute.get('/', (req, res)=>{
    res.status(200).send('No GET method found for this route')
});

userRoute.post('/signup', ValidRegister, async(req, res)=>{

    const { name,email,phone_no,password}= req.body;
    const {encrypt} = await hashPassword(password);
    if(encrypt){
        const newUser= new User({name,email,phone_no,password: encrypt});
        await newUser.save();
        res.status(200).json({error: false, status:200,message:`User created successfully.`})
    }else{
        res.status(403).json({error: true, status:403,message:`Something went wrong. Please try again later.`})
    }
});

userRoute.post('/signin',Authorization('customer'), async(req, res)=>{

    const { email,password}= req.body;
    const FoundUser= await User.findOne({email});
    if(FoundUser){
        const dbPass= FoundUser.password;
        const {decrypt}= await comparePassword(password, dbPass);
        if(decrypt){
            const {token}= createToken(email);
            res.status(200).json({error: false, status:200,message:`Login successfully.`,token})
        }else{
            res.status(401).json({error: true, status:401,message:`Login Failed. Invalid Credentials`})
        }
    }else{
        res.status(404).json({error: true, status:404,message:`No user Found.`})
    }
});

userRoute.put('/change-password',validateChangePassword, async(req, res)=>{

    const token = req?.headers?.authorization?.split(' ')[1] ;
    const {oldPassword,newPassword,confirmNewPassword}= req.body;
    const {result} = await verifyToken(token);
    const ExistUser= await User.findOne({email:result?.user});
    const {encrypt} = await hashPassword(newPassword);

    if(ExistUser && encrypt){
        const changed= await User.findOneAndUpdate({email:result?.user},{password:encrypt});
        if(changed){
            res.status(200).json({error: false, status:200,message:`Password changed successfully.`})
        }else{
            res.status(500).json({error: true, status:500,message:`Something went wrong. Try after some time`})
        }
    }
});




module.exports= {userRoute}