const express= require('express');
const { ValidRegister, validateChangePassword } = require('../middlewares/validation');
const { hashPassword, comparePassword, createToken, verifyToken } = require('../utils/helper');
const { User } = require('../models/userModel');
const { Authorization } = require('../middlewares/Authorization');


const userRoute= express.Router();

userRoute.get('/', (req, res)=>{
    res.status(200).json({error: false, status:200,message:'this is User Section.No GET method found for this .'})
});

userRoute.get('/me', Authorization('customer'), async(req, res)=>{
    const token = req?.headers?.authorization?.split(' ')[1] ;
    if(token){
        const {result} = await verifyToken(token);
        const ExistUser= await User.findOne({email:result?.user},{__v:0});
        if(ExistUser){
            res.status(200).json({error: false, status:200,message:`User fetched successfully.`, data:ExistUser })
        }else{
            res.status(200).json({error: true, status:404,message:`No user found for your request.`})
        }
    }else{
        res.status(401).json({error: true, status:404,message:`You are unauthorized`})
    }
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

userRoute.put('/update-profile',Authorization('customer'), async(req, res)=>{

    const token = req?.headers?.authorization?.split(' ')[1] || "";

    if(token){
        const {name,phone_no}= req.body;
        const {result} = await verifyToken(token);
        const ExistUser= await User.findOne({email:result?.user});
        if(!name){
            return res.status(400).json({error: true, status:400,message:`Name is required to update`})
        };
        if(!phone_no){
            return res.status(400).json({error: true, status:400,message:`Phone number is required to update`})
        };
        if(!ExistUser){
           return res.status(401).json({error: true, status:401,message:`Authentication failed.`})
        };
        if(ExistUser){
            const changed= await User.findOneAndUpdate({email:result?.user},{name,phone_no},{new:true});
            if(changed){
                res.status(200).json({error: false, status:200,message:`User updated successfully.`})
            }else{
                res.status(500).json({error: true, status:500,message:`Something went wrong. Try after some time`})
            }
        }else{
            res.status(404).json({error: true, status:404,message:`no user found.`})
        }
    };
});

// userRoute.put('/updateAvatar',Authorization('customer'), async (req, res) => {
//     console.log(req.file)
//     try {
//       if (!req.file) {
//         return res.status(400).json({error: true, status:400,message:`No file uploaded`});
//       };
//       const compressedImage = await sharp(req.file.buffer).resize({ width: 800 }).jpeg({ quality: 80 }).toBuffer();
//       if(!compressedImage){
//           res.status(500).json({error: true, status:500,message:'Unable to compress image'});
//       }else{
//         const saved = await User.findOneAndUpdate({email:result?.user},{user_image:compressedImage || req.file},{new:true});
//         if(saved){
//             res.status(200).json({ message: 'Image uploaded and processed successfully.' });
//         }else{
//             res.status(500).json({error: true, status:500,message:'Unable save file to db'});
//         }
//       }
//     } catch (error) {
//         res.status(500).json({error: true, status:500,message:'Something went wrong. Try after some time'});
//     }
//   });






module.exports= {userRoute}