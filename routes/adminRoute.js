const express= require('express');
const { Authorization } = require('../middlewares/Authorization');
const { User } = require('../models/userModel');
const { comparePassword, createToken } = require('../utils/helper');
const mongoose  = require('mongoose');


const admin= express.Router();

admin.get(`/`,(req, res) =>{
    res.status(200).json({error: true, status:200,message:`this is admin route`})
});

admin.get('/myusers',Authorization('admin'), async(req, res) =>{
    const users= await User.find({},{__v:0});
    res.status(200).json({error: false, status:200,message:`Successfully fetch users`,data:users})
});

admin.get('/myusers/:userid',Authorization('admin'), async(req,res) =>{
    const {userid} = req.params;
    const idType= mongoose.Types.ObjectId;
    isValidId= idType.isValid(userid);
    if(isValidId){
        const user= await User.findOne({_id: userid},{__v:0});
        res.status(200).json({error: false, status:200,message:`Successfully fetch users`,data:user})
    }else{
        res.status(400).json({error: true, status:400,message:`Invalid user id`})
    }
});

admin.post('/auth/signin',Authorization('admin'), async(req, res)=>{

    const { email,password}= req.body;
    console.log(email,password);
    if(!email){
        return  res.status(404).json({error: true, status:404,message:`Email is required.`})
    };
    if(!password){
        return  res.status(404).json({error: true, status:404,message:`Password is required.`})
    };

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




module.exports = {admin}
